import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'
import { MaxDistanceError } from './errors/max-distance-error'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Check-in Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    vi.useFakeTimers()

    await gymsRepository.create({
      id: 'gym-01',
      title: 'js gym',
      description: '',
      phone: '',
      latitude: -22.928115088513415,
      longitude: -43.566335971046946,
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-id',
      userLatitude: -22.928115088513415,
      userLongitude: -43.566335971046946,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2013, 0, 1, 12, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-id',
      userLatitude: -22.928115088513415,
      userLongitude: -43.566335971046946,
    })

    expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-id',
        userLatitude: -22.928115088513415,
        userLongitude: -43.566335971046946,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should be able to check in twice but in the different days', async () => {
    vi.setSystemTime(new Date(2013, 0, 1, 12, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-id',
      userLatitude: -22.928115088513415,
      userLongitude: -43.566335971046946,
    })

    vi.setSystemTime(new Date(2013, 0, 2, 12, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-id',
      userLatitude: -22.928115088513415,
      userLongitude: -43.566335971046946,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should be not able to check in on distance dym', async () => {
    gymsRepository.items.push({
      id: 'gym-02',
      title: 'js gym',
      description: '',
      phone: '',
      latitude: new Decimal(-22.928115088513415),
      longitude: new Decimal(-43.57404115381054),
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-02',
        userId: 'user-id',
        userLatitude: -22.90317905057677,
        userLongitude: -43.566335971046946,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
