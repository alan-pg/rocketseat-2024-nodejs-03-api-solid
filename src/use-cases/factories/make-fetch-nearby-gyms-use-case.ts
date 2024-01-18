import { PrismaGymsREpository } from '@/repositories/prisma/prisma-gyms-repository'
import { FetchNearbyGymsUseCase } from '../fetch-nearby-gyms'

export function makeFetchNearbyGymsUseCase() {
  const prismaGymsRepository = new PrismaGymsREpository()
  const useCase = new FetchNearbyGymsUseCase(prismaGymsRepository)

  return useCase
}
