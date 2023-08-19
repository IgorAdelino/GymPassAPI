import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { UsersRepository } from '../users-repository'

export class PrismaUsersRepository implements UsersRepository {
  async findByEmail(email: string) {
    const User = await prisma.user.findUnique({
      where: {
        email,
      },
    })
    return User
  }

  async findById(id: string) {
    const User = await prisma.user.findUnique({
      where: {
        id,
      },
    })
    return User
  }

  async create(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({
      data,
    })

    return user
  }
}
