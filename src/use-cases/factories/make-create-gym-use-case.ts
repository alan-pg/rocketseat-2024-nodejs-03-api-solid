import { PrismaGymsREpository } from '@/repositories/prisma/prisma-gyms-repository'
import { CreateGymUseCase } from '../create-gym'

export function makeCreateGymUseCase() {
  const prismaGymsRepository = new PrismaGymsREpository()
  const useCase = new CreateGymUseCase(prismaGymsRepository)

  return useCase
}
