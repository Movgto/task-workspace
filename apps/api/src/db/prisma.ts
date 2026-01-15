import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";
import 'dotenv/config'
import { env } from 'prisma/config'

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const DATABASE_URL = env('DATABASE_URL');

const adapter = new PrismaPg({ connectionString: DATABASE_URL })

export const prisma = globalForPrisma.prisma || new PrismaClient({
    adapter
});

if (process.env.MODE !== "production") globalForPrisma.prisma = prisma;