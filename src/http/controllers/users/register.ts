import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeRegisterUseCase } from '@/use-cases/factories/make-register-use-case'
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error'

export async function register(req: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, name, password } = registerBodySchema.parse(req.body)
  try {
    const registerUseCase = makeRegisterUseCase()

    await registerUseCase.execute({ email, name, password })
    return reply.status(201).send()
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: error.message })
    }
    throw error
  }
}
