import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;

// If global instance exists but lacks new model delegates (e.g. chatCache after schema updates), re-instantiate
function getPrismaClient() {
  if (globalForPrisma.prisma && globalForPrisma.prisma.chatCache) {
    return globalForPrisma.prisma;
  }
  const client = new PrismaClient({
    log: ['query'],
  });
  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = client;
  }
  return client;
}

export const prisma = getPrismaClient();

