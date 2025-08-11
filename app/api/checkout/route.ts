import type { NextRequest } from "next/server"
import { env } from "@/lib/env"
import { verifyJWT } from "@/lib/jwt"

export async function POST(req: NextRequest) {
  try {
    const { plan, amountCents, mode } = await req.json()
    const secret = env.STRIPE_SECRET_KEY
    const url = new URL(req.url)
    const origin = req.headers.get("origin") || url.origin

    const priceIdDefault = env.STRIPE_PRICE_ID
    const priceIdPro = env.STRIPE_PRICE_ID_PRO
    const priceIdTeam = env.STRIPE_PRICE_ID_TEAM

    const success_url = `${origin}/?checkout=success&plan=${encodeURIComponent(plan || "pro")}`
    const cancel_url = `${origin}/?checkout=cancel`

    // identify user for metadata
    const cookie = (req.headers.get("cookie") || "")
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith("session="))
    const token = cookie?.split("=")[1]
    const { ok, payload } = await verifyJWT(token)
    const userId = ok ? String(payload.uid) : undefined

    if (!secret) {
      // demo fallback, do not create DB records here; webhook will handle in live
      return Response.json({ url: `/?checkout=success&plan=${encodeURIComponent(plan || "pro")}&demo=1`, demo: true })
    }

    if (secret.startsWith("rk_")) {
      return new Response(
        JSON.stringify({
          error:
            "Invalid Stripe key type. Please use a Secret Key (sk_test_* or sk_live_*) instead of a Restricted Key (rk_*). Restricted keys don't have permission to create checkout sessions.",
        }),
        { status: 400 },
      )
    }

    const { default: Stripe } = await import("stripe")
    const stripe = new Stripe(secret, { apiVersion: "2025-07-30.basil" })
    let selectedPriceId: string | undefined = priceIdDefault
    if ((plan || "pro") === "pro" && priceIdPro) selectedPriceId = priceIdPro
    if (plan === "team" && priceIdTeam) selectedPriceId = priceIdTeam
    const checkoutMode = mode === "subscription" ? "subscription" : "payment"

    let session
    if (selectedPriceId) {
      session = await stripe.checkout.sessions.create({
        mode: checkoutMode,
        line_items: [{ price: selectedPriceId, quantity: 1 }],
        success_url,
        cancel_url,
        metadata: { userId: userId ?? "" },
      })
    } else {
      const cents = Number(amountCents) || ((plan || "pro") === "pro" ? 390000 : 990000)
      session = await stripe.checkout.sessions.create({
        mode: checkoutMode,
        line_items: [
          {
            price_data: {
              currency: "inr",
              product_data: { name: `ElevateCV ${String(plan || "Pro").toUpperCase()}` },
              unit_amount: cents,
              recurring: checkoutMode === "subscription" ? { interval: "month" } : undefined,
            },
            quantity: 1,
          },
        ],
        success_url,
        cancel_url,
        metadata: { userId: userId ?? "" },
      })
    }

    return Response.json({ url: session.url })
  } catch (e: any) {
    console.error(e)
    if (e.type === "StripePermissionError") {
      return new Response(
        JSON.stringify({
          error:
            "Stripe key permissions error. Please use a Secret Key (sk_test_* or sk_live_*) with full permissions instead of a Restricted Key.",
        }),
        { status: 403 },
      )
    }
    return new Response(JSON.stringify({ error: "Checkout failed", details: e.message }), { status: 500 })
  }
}
