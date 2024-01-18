import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'
import { GetUserMetricsUseCase } from '../get-user-metrics'

export function makeGetUserMetricsUseCase() {
  const prismaInsRepository = new PrismaCheckInsRepository()
  const useCase = new GetUserMetricsUseCase(prismaInsRepository)

  return useCase
}
