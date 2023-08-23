import 'dotenv/config'

import { randomUUID } from 'node:crypto'
import { Environment } from 'vitest'
import { execSync } from 'node:child_process'
import { PrismaClient } from '@prisma/client'

// "postgresql://docker:docker@localhost:5432/apisolid?schema=public"

const prisma = new PrismaClient()

function generateDatabaseURL(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL enviroment variable')
  }

  const url = new URL(process.env.DATABASE_URL)

  url.searchParams.set('schema', schema)

  return url.toString()
}
export default <Environment>{
  name: 'prisma',
  async setup() {
    const schema = randomUUID()
    const dataBaseURL = generateDatabaseURL(schema)

    process.env.DATABASE_URL = dataBaseURL
    execSync('npx prisma migrate deploy') // o deploy apenas executa cada um dos arquivos sem verificação
    return {
      async teardown() {
        await prisma.$executeRawUnsafe(
          `DROP SCHEMA IF EXISTS "${schema}" CASCADE`,
        )
        await prisma.$disconnect()
      },
    }
  },
}
