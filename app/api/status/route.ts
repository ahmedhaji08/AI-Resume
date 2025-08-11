import { hasAI, aiProvider, hasStripe, isDatabaseConfigured, hasSession } from "@/lib/env"
import { isDatabaseConnected } from "@/lib/prisma"

export async function GET() {
  try {
    const ai = hasAI()
    const provider = aiProvider()
    const payments = hasStripe()
    const database = isDatabaseConfigured()
    const session = hasSession()
    const dbConnected = database ? await isDatabaseConnected() : false

    return Response.json({
      ai: { configured: ai, mode: provider || "none" },
      stripe: { configured: payments },
      session: { configured: session },
      database: { configured: database, connected: dbConnected },
      demo: !ai || !payments || !session || !database || !dbConnected,
      // Legacy fields for backward compatibility
      hasAI: ai,
      provider,
      hasStripe: payments,
    })
  } catch (e) {
    return new Response(JSON.stringify({ error: "status check failed" }), { status: 500 })
  }
}
