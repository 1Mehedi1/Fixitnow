import { PrismaClient } from '@prisma/client'

// Resolve Postgres database URL (supports Vercel Postgres / Neon / custom connection strings)
const effectiveDbUrl =
  (process.env.DATABASE_URL && (process.env.DATABASE_URL.startsWith("postgresql://") || process.env.DATABASE_URL.startsWith("postgres://")))
    ? process.env.DATABASE_URL
    : (process.env.POSTGRES_PRISMA_URL && (process.env.POSTGRES_PRISMA_URL.startsWith("postgresql://") || process.env.POSTGRES_PRISMA_URL.startsWith("postgres://")))
      ? process.env.POSTGRES_PRISMA_URL
      : (process.env.POSTGRES_URL && (process.env.POSTGRES_URL.startsWith("postgresql://") || process.env.POSTGRES_URL.startsWith("postgres://")))
        ? process.env.POSTGRES_URL
        : process.env.DATABASE_URL

if (effectiveDbUrl && process.env.DATABASE_URL !== effectiveDbUrl) {
  process.env.DATABASE_URL = effectiveDbUrl
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'production' ? ['error'] : ['error', 'warn'],
    ...(effectiveDbUrl && (effectiveDbUrl.startsWith("postgresql://") || effectiveDbUrl.startsWith("postgres://"))
      ? { datasourceUrl: effectiveDbUrl }
      : {}),
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db