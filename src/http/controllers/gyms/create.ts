import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeCreateGymUseCase } from '@/use-cases/factories/make-create-gym-use-case'

export async function create(req: FastifyRequest, reply: FastifyReply) {
  console.log('create gym')
  const createGymBodySchema = z.object({
    title: z.string(),
    description: z.string().nullable(),
    phone: z.string().nullable(),
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })

  const { description, latitude, longitude, phone, title } =
    createGymBodySchema.parse(req.body)

  const createGymUseCase = makeCreateGymUseCase()

  await createGymUseCase.execute({
    latitude,
    longitude,
    title,
    description,
    phone,
  })
  return reply.status(201).send()
}
