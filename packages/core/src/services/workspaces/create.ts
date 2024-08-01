import {
  database,
  memberships,
  Result,
  Transaction,
  workspaces,
} from '@latitude-data/core'
import { SafeUser, Workspace } from '$core/browser'
import { createProject } from '$core/services/projects'

import { createApiKey } from '../apiKeys/create'

export async function createWorkspace(
  {
    name,
    user,
  }: {
    name: string
    user: SafeUser
  },
  db = database,
) {
  return Transaction.call<Workspace>(async (tx) => {
    const insertedWorkspaces = await tx
      .insert(workspaces)
      .values({ name, creatorId: user.id })
      .returning()

    const workspace = insertedWorkspaces[0]!
    await tx
      .insert(memberships)
      .values({ workspaceId: workspace.id, userId: user.id })
    await createProject({ workspace, user }, tx)
    await createApiKey({ workspace }, tx)

    return Result.ok(workspace)
  }, db)
}
