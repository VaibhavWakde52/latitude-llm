import { Commit, DocumentVersion } from '$core/browser'
import { NotFoundError, Result } from '$core/lib'
import { commits, documentVersions, projects } from '$core/schema'
import { and, eq, getTableColumns, isNotNull, lte, max } from 'drizzle-orm'

import Repository from '../repository'

function mergeDocuments(
  ...documentsArr: DocumentVersion[][]
): DocumentVersion[] {
  return documentsArr.reduce((acc, documents) => {
    return acc
      .filter((d) => {
        return !documents.find((d2) => d2.documentUuid === d.documentUuid)
      })
      .concat(documents)
  }, [])
}

export type GetDocumentAtCommitProps = {
  commit: Commit
  documentUuid: string
}

export class DocumentVersionsRepository extends Repository {
  get scope() {
    return this.db
      .select(getTableColumns(documentVersions))
      .from(documentVersions)
      .innerJoin(projects, eq(projects.workspaceId, this.workspaceId))
      .innerJoin(commits, eq(commits.projectId, projects.id))
      .where(eq(documentVersions.commitId, commits.id))
      .as('documentVersionsScope')
  }

  async getDocumentById(documentId: number) {
    const res = await this.db
      .select()
      .from(this.scope)
      .where(eq(this.scope.id, documentId))

    // NOTE: I hate this
    const document = res[0]
    if (!document) return Result.error(new NotFoundError('Document not found'))

    return Result.ok(document)
  }

  async getDocumentByUuid({
    commit,
    documentUuid,
  }: {
    commit: Commit
    documentUuid: string
  }) {
    const document = await this.db
      .select()
      .from(this.scope)
      .where(
        and(
          eq(this.scope.commitId, commit.id),
          eq(this.scope.documentUuid, documentUuid),
        ),
      )
      .limit(1)
      .then((docs) => docs[0])

    if (!document) return Result.error(new NotFoundError('Document not found'))

    return Result.ok(document)
  }

  async getDocumentByPath({ commit, path }: { commit: Commit; path: string }) {
    try {
      const result = await this.getDocumentsAtCommit(commit)
      const documents = result.unwrap()
      const document = documents.find((doc) => doc.path === path)
      if (!document) {
        return Result.error(
          new NotFoundError(
            `No document with path ${path} at commit ${commit.uuid}`,
          ),
        )
      }

      return Result.ok(document!)
    } catch (err) {
      return Result.error(err as Error)
    }
  }

  /**
   * NOTE: By default we don't include deleted documents
   */
  async getDocumentsAtCommit(commit: Commit) {
    const result = await this.getAllDocumentsAtCommit({ commit })

    if (result.error) return result

    return Result.ok(result.value.filter((d) => d.deletedAt === null))
  }

  async getDocumentAtCommit({
    commit,
    documentUuid,
  }: GetDocumentAtCommitProps) {
    const documentInCommit = await this.db
      .select()
      .from(this.scope)
      .where(
        and(
          eq(this.scope.commitId, commit.id),
          eq(this.scope.documentUuid, documentUuid),
        ),
      )
      .limit(1)
      .then((docs) => docs[0])

    if (documentInCommit !== undefined) return Result.ok(documentInCommit)

    const documentsAtCommit = await this.getDocumentsAtCommit(commit)
    if (documentsAtCommit.error) return Result.error(documentsAtCommit.error)

    const document = documentsAtCommit.value.find(
      (d) => d.documentUuid === documentUuid,
    )

    if (!document) return Result.error(new NotFoundError('Document not found'))

    return Result.ok(document)
  }

  async listCommitChanges(commit: Commit) {
    const changedDocuments = await this.db
      .select()
      .from(this.scope)
      .where(eq(this.scope.commitId, commit.id))

    return Result.ok(changedDocuments)
  }

  private async getAllDocumentsAtCommit({ commit }: { commit: Commit }) {
    const documentsFromMergedCommits =
      await this.fetchDocumentsFromMergedCommits({
        projectId: commit.projectId,
        maxMergedAt: commit.mergedAt,
      })

    if (commit.mergedAt !== null) {
      // Referenced commit is merged. No additional documents to return.
      return Result.ok(documentsFromMergedCommits)
    }

    const documentsFromDraft = await this.db
      .select(getTableColumns(documentVersions))
      .from(documentVersions)
      .innerJoin(commits, eq(commits.id, documentVersions.commitId))
      .where(eq(commits.id, commit.id))

    const totalDocuments = mergeDocuments(
      documentsFromMergedCommits,
      documentsFromDraft,
    )

    return Result.ok(totalDocuments)
  }

  private async fetchDocumentsFromMergedCommits({
    projectId,
    maxMergedAt,
  }: {
    projectId: number
    maxMergedAt: Date | null
  }): Promise<DocumentVersion[]> {
    const filterByMaxMergedAt = () => {
      const mergedAtNotNull = isNotNull(commits.mergedAt)
      if (maxMergedAt === null) return mergedAtNotNull
      return and(mergedAtNotNull, lte(commits.mergedAt, maxMergedAt))
    }

    const lastVersionOfEachDocument = this.db
      .$with('lastVersionOfDocuments')
      .as(
        this.db
          .select({
            documentUuid: documentVersions.documentUuid,
            mergedAt: max(commits.mergedAt).as('maxMergedAt'),
          })
          // FIXME: This is not using the scope
          .from(documentVersions)
          .innerJoin(commits, eq(commits.id, documentVersions.commitId))
          .where(and(filterByMaxMergedAt(), eq(commits.projectId, projectId)))
          .groupBy(documentVersions.documentUuid),
      )

    const documentsFromMergedCommits = await this.db
      .with(lastVersionOfEachDocument)
      .select(getTableColumns(documentVersions))
      // FIXME: This is not using the scope
      .from(documentVersions)
      .innerJoin(
        commits,
        and(
          eq(commits.id, documentVersions.commitId),
          isNotNull(commits.mergedAt),
        ),
      )
      .innerJoin(
        lastVersionOfEachDocument,
        and(
          eq(
            documentVersions.documentUuid,
            lastVersionOfEachDocument.documentUuid,
          ),
          eq(commits.mergedAt, lastVersionOfEachDocument.mergedAt),
        ),
      )

    return documentsFromMergedCommits
  }
}
