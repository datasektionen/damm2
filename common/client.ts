import { PrismaClient } from "@prisma/client";
import configuration from "./configuration";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

// Augment globalThis
declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

if (configuration.NODE_ENV === "development") {
  globalThis.prisma = prisma;
}

export default prisma;
