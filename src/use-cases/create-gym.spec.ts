import { expect, describe, it, beforeEach } from 'vitest'
import { CreateGymUseCase } from './create-gym'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

let GymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

describe('CreateGym Use Case', () => {
  beforeEach(() => {
    GymsRepository = new InMemoryGymsRepository()
    sut = new CreateGymUseCase(GymsRepository)
  })

  it('should be able to create gym', async () => {
    const { gym } = await sut.execute({
      title: 'Javascript Gym',
      description: null,
      phone: null,
      latitude: -27.2892852,
      longitude: -49.6481891,
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
