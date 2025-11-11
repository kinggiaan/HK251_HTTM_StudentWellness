import { Prisma, PrismaClient } from '@prisma/client';

import { isProduction, isTest } from './env';
import logger from './logger';

const prisma = new PrismaClient({
  log: isProduction
    ? ['error']
    : isTest
      ? ['error', 'warn']
      : ['query', 'error', 'warn']
});

process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

prisma.$on('error', (event: Prisma.LogEvent) => {
  logger.error({ message: event.message }, 'Prisma error');
});

export default prisma;

