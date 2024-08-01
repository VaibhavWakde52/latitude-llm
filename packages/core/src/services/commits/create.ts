import {
  commits,
  Database,
  database,
  Result,
  Transaction,
} from '@latitude-data/core'
import { Commit, Project, SafeUser } from '$core/browser'

export async function createCommit({
  project,
  user,
  data: { title, description, mergedAt },
  db = database,
}: {
  project: Project
  user: SafeUser
  data: {
    title?: string
    description?: string
    mergedAt?: Date
  }
  db?: Database
}) {
  return Transaction.call<Commit>(async (tx) => {
    const result = await tx
      .insert(commits)
      .values({
        projectId: project.id,
        userId: user.id,
        title,
        description,
        mergedAt,
      })
      .returning()
    const createdCommit = result[0]

    return Result.ok(createdCommit!)
  }, db)
}
