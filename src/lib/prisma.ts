import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const createPrisma = () =>
  new PrismaClient({
    adapter,
  });

declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma ?? createPrisma();

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export default prisma;
