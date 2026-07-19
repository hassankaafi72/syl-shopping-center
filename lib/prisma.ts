import { PrismaClient } from './generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

let prisma: PrismaClient;

if (typeof window === 'undefined') {
  if (globalForPrisma.prisma) {
    prisma = globalForPrisma.prisma;
  } else {
    const connectionString = process.env.DATABASE_URL;
    
    // Optimize pg Pool for Supabase connection pooling (pgbouncer)
    const pool = new pg.Pool({
      connectionString,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });
    
    const adapter = new PrismaPg(pool);
    prisma = new PrismaClient({ adapter });
    
    if (process.env.NODE_ENV !== 'production') {
      globalForPrisma.prisma = prisma;
    }
  }
} else {
  prisma = null as any;
}

export { prisma };
