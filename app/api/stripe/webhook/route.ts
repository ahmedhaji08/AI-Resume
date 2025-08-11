import { NextResponse } from "next/server"
import { env } from "@/lib/env"
import { getPrisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature")
  const secret = env.STRIPE_WEBHOOK_SECRET
  const body = await req.text()

  if (!env.STRIPE_SECRET_KEY) return NextResponse.json({ ok: false, error: "Stripe not configured" }, { status: 400 })

  const { default: Stripe } = await import("stripe")
  const stripe = new Stripe(env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" })

  let event: any
  try {
    if (!secret || !sig) throw new Error("Missing webhook secret/signature")
    event = stripe.webhooks.constructEvent(body, sig, secret)
  } catch (err: any) {
    console.error("Webhook signature verification failed", err?.message)
    return new NextResponse("Bad signature", { status: 400 })
  }

  try {
    const prisma = await getPrisma()

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as any
      const amount = session.amount_total ? session.amount_total / 100 : 0
      const currency = (session.currency || "inr").toUpperCase()
      const status = session.payment_status || "succeeded"
      const txId = session.payment_intent || session.id
      const userIdMeta = session.metadata?.userId ? Number(session.metadata.userId) : undefined

      if (txId) {
        await prisma.payment.upsert({
          where: { transactionId: String(txId) },
          create: {
            userId: userIdMeta || 0,
            amount: amount,
            currency,
            paymentStatus: status,
            paymentMethod: session.payment_method_types?.[0] || null,
            transactionId: String(txId),
          },
          update: {
            paymentStatus: status,
          },
        })
      }
    }

    return NextResponse.json({ received: true })
  } catch (e: any) {
    console.error("Webhook handler error", e?.message)
    return new NextResponse("Webhook error", { status: 500 })
  }
}

export const dynamic = "force-dynamic"
