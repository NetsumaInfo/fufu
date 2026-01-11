import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

/**
 * Prisma Client Singleton with PostgreSQL Adapter
 * Required for Prisma 7.x
 */

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

const createPrismaClient = () => {
    if (!process.env.DATABASE_URL) {
        console.warn('DATABASE_URL not configured. Prisma will not work until configured.')
        return null as unknown as PrismaClient
    }

    // Create PostgreSQL connection pool
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
    })

    // Create Prisma PostgreSQL adapter
    const adapter = new PrismaPg(pool)

    return new PrismaClient({
        adapter,
        log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
