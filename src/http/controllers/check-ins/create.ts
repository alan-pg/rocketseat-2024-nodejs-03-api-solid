import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeCheckInUseCase } from '@/use-cases/factories/make-check-in-use-case'

export async function create(req: FastifyRequest, reply: FastifyReply) {
  const createCheckInsParamsSchema = z.object({
    gymId: z.string().uuid(),
  })

  const createCheckInsBodySchema = z.object({
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })

  const userId = req.user.sub

  const { gymId } = createCheckInsParamsSchema.parse(req.params)

  const { latitude, longitude } = createCheckInsBodySchema.parse(req.body)

  const checkInUseCase = makeCheckInUseCase()

  await checkInUseCase.execute({
    userId,
    gymId,
    userLatitude: latitude,
    userLongitude: longitude,
  })

  return reply.status(201).send()
}
