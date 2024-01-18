import { FastifyReply, FastifyRequest } from 'fastify'
import { makeGetUserMetricsUseCase } from '@/use-cases/factories/make-get-user-metrics-user-case'

export async function metrics(req: FastifyRequest, reply: FastifyReply) {
  const userId = req.user.sub

  const historyUseCase = makeGetUserMetricsUseCase()

  const { checkInsCount } = await historyUseCase.execute({
    userId,
  })

  return reply.status(200).send({ checkInsCount })
}
