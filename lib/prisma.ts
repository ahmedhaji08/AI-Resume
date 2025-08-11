import "server-only"
import { isDatabaseConfigured } from "./env"

declare global {
  // eslint-disable-next-line no-var
  var __prisma__: any | undefined
}

export async function getPrisma() {
  if (!isDatabaseConfigured()) {
    throw new Error("DATABASE_URL not configured. Please add it to your environment variables.")
  }

  if (global.__prisma__) return global.__prisma__

  try {
    const { PrismaClient } = await import("@prisma/client")
    const prisma = new PrismaClient({
      log: ["warn", "error"],
      errorFormat: "minimal",
    })
    global.__prisma__ = prisma
    return prisma as InstanceType<typeof PrismaClient>
  } catch (error: any) {
    if (error.message?.includes("DATABASE_URL")) {
      throw new Error("DATABASE_URL not found or invalid. Please check your environment variables.")
    }
    throw error
  }
}

export async function isDatabaseConnected(): Promise<boolean> {
  if (!isDatabaseConfigured()) return false
  try {
    const prisma = await getPrisma()
    await prisma.$queryRaw`SELECT 1`
    return true
  } catch {
    return false
  }
}
