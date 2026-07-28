import { PrismaClient } from "../src/generated/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || "file:./dev.db",
});

export const prisma = 
  globalForPrisma.prisma || 
  new PrismaClient({ 
    adapter, 
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

  type T = keyof PrismaClient;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;