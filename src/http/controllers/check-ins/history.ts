import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeFetchUserCheckInsHistoryUseCase } from '@/use-cases/factories/make-fetch-user-check-ins-history-use-case'

export async function history(req: FastifyRequest, reply: FastifyReply) {
  const checkInQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  })

  const userId = req.user.sub

  const { page } = checkInQuerySchema.parse(req.query)

  const historyUseCase = makeFetchUserCheckInsHistoryUseCase()

  const { checkIns } = await historyUseCase.execute({
    page,
    userId,
  })

  return reply.status(200).send({ checkIns })
}
