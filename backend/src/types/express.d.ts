import type { UserRole } from '@prisma/client';
import type { Server } from 'socket.io';

declare global {
  namespace Express {
    interface Application {
      io?: Server;
    }
    interface Request {
      user?: {
        id: string;
        email: string;
        role: UserRole;
      };
      correlationId?: string;
    }
  }
}

export {};

