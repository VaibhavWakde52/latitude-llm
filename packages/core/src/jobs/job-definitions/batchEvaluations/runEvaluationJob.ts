import { Job } from 'bullmq'

import { RunErrorCodes } from '../../../constants'
import { Result } from '../../../lib'
import { queues } from '../../../queues'
import {
  DocumentLogsWithErrorsRepository,
  EvaluationsRepository,
} from '../../../repositories'
import { isChainError } from '../../../services/chains/ChainStreamConsumer'
import { runEvaluation } from '../../../services/evaluations/run'
import { WebsocketClient } from '../../../websockets/workers'
import { ProgressTracker } from '../../utils/progressTracker'

/**
 * We only throw an error in an evaluation run in 2 situations
 *
 *  1. Is a ChainError of type `unknown`. This is the catch in `runChain` not knowing what happened.
 *  2. is not a `ChainError` so it means something exploded.
 */
function throwIfUnknownError(
  error: unknown | undefined,
): asserts error is Error {
  const isAllGood =
    !error || (isChainError(error) && error.errorCode !== RunErrorCodes.Unknown)

  if (isAllGood) return

  throw error
}

async function fetchData({
  workspaceId,
  evaluationId,
  documentLogUuid,
}: {
  workspaceId: number
  evaluationId: number
  documentLogUuid: string
}) {
  const documentLogsScope = new DocumentLogsWithErrorsRepository(workspaceId)
  const evaluationsScope = new EvaluationsRepository(workspaceId)
  const docLogResult = await documentLogsScope.findByUuid(documentLogUuid)

  if (docLogResult.error) return docLogResult

  const result = await evaluationsScope.find(evaluationId)
  if (result.error) return result

  return Result.ok({
    documentLog: docLogResult.value,
    evaluation: result.value,
  })
}

export type RunEvaluationJobData = {
  workspaceId: number
  documentUuid: string
  documentLogUuid: string
  evaluationId: number
  batchId: string
}

async function isSuccessful(run: Awaited<ReturnType<typeof runEvaluation>>) {
  if (run.error) return { ok: false, error: run.error }

  const response = await run.value.response
  if (response.error) return { ok: false, error: response.error }

  return { ok: true, error: undefined }
}

export async function runEvaluationJob(job: Job<RunEvaluationJobData>) {
  const { workspaceId, batchId, documentUuid, documentLogUuid, evaluationId } =
    job.data
  const websockets = await WebsocketClient.getSocket()
  const progressTracker = new ProgressTracker(await queues(), batchId)
  const { documentLog, evaluation } = await fetchData({
    workspaceId,
    evaluationId,
    documentLogUuid,
  }).then((r) => r.unwrap())

  const run = await runEvaluation({
    documentLog,
    evaluation,
    documentUuid,
  })

  const { ok, error } = await isSuccessful(run)

  if (ok) {
    await progressTracker.incrementCompleted()
  } else {
    await progressTracker.incrementErrors()
  }

  const progress = await progressTracker.getProgress()

  websockets.emit('evaluationStatus', {
    workspaceId,
    data: {
      batchId,
      evaluationId,
      documentUuid,
      ...progress,
    },
  })

  throwIfUnknownError(error)
}
