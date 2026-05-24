import { PrismaClient } from '../app/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { withAccelerate } from '@prisma/extension-accelerate'

function createPrismaClient(): PrismaClient {
  const url = process.env.DATABASE_URL!
  if (url.startsWith('prisma+postgres://')) {
    return new PrismaClient({ accelerateUrl: url }).$extends(
      withAccelerate()
    ) as unknown as PrismaClient
  }
  const safeUrl = url.replace(/sslmode=(prefer|require|verify-ca)(\b|&|$)/, 'sslmode=verify-full$2')
  return new PrismaClient({ adapter: new PrismaPg({ connectionString: safeUrl }) })
}

type PrismaClientSingleton = ReturnType<typeof createPrismaClient>

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
