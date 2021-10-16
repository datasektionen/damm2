import { PrismaClient } from '@prisma/client';
import configuration from './configuration';

// Prevent multiple instances when hot reloading
// https://www.prisma.io/docs/guides/performance-and-optimization/connection-management#prevent-hot-reloading-from-creating-new-instances-of-prismaclient


// add prisma to the NodeJS global type
interface CustomNodeJsGlobal extends NodeJS.Global {
    prisma: PrismaClient;
  }
  
  // Prevent multiple instances of Prisma Client in development
  declare const global: CustomNodeJsGlobal;
  
  const prisma = global.prisma || new PrismaClient();
  
  if (configuration.NODE_ENV === "development") global.prisma = prisma;
  
  export default prisma;