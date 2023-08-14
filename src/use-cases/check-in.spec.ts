import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { CheckInUseCase } from './check-in'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { MaxNumberOfCheckInsError } from './errors/max-numbers-of-check-ins-error'
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
      title: 'Javascript Gym',
      description: '',
      phone: '',
      latitude: -27.2892852,
      longitude: -49.6481891,
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'userId',
      userLatitude: -27.2892852,
      userLongitude: -49.6481891,
    })
    expect(checkIn.id).toEqual(expect.any(String))
  })

  // estado red = erro no teste(inicial no tdd) - estado green - refactory

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2023, 0, 20, 0, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'userId',
      userLatitude: -27.2892852,
      userLongitude: -49.6481891,
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'userId',
        userLatitude: -27.2892852,
        userLongitude: -49.6481891,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should be able to check in twice day, but in different days', async () => {
    vi.setSystemTime(new Date(2023, 0, 31, 0, 0, 0))
    await sut.execute({
      gymId: 'gym-01',
      userId: 'userId',
      userLatitude: -27.2892852,
      userLongitude: -49.6481891,
    })

    vi.setSystemTime(new Date(2023, 0, 30, 0, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'userId',
      userLatitude: -27.2892852,
      userLongitude: -49.6481891,
    })
    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on distant gym', async () => {
    gymsRepository.items.push({
      id: 'gym-02',
      title: 'Tyoescript Gym',
      description: '',
      phone: '',
      latitude: new Decimal(-27.2892852),
      longitude: new Decimal(-49.4889672),
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-02',
        userId: 'userId',
        userLatitude: -27.2892852,
        userLongitude: -49.6481891,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
