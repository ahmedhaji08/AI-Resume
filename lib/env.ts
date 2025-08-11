import "server-only"

export const env = {
  // Database
  DATABASE_URL: process.env.DATABASE_URL,

  // Sessions
  SESSION_SECRET: process.env.SESSION_SECRET, // random 32+ char secret

  // AI providers
  XAI_API_KEY: process.env.XAI_API_KEY,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,

  // Stripe
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_PRICE_ID: process.env.STRIPE_PRICE_ID,
  STRIPE_PRICE_ID_PRO: process.env.STRIPE_PRICE_ID_PRO,
  STRIPE_PRICE_ID_TEAM: process.env.STRIPE_PRICE_ID_TEAM,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
}

export function hasAI() {
  return Boolean(env.XAI_API_KEY || env.OPENAI_API_KEY)
}
export function aiProvider(): "xai" | "openai" | null {
  if (env.XAI_API_KEY) return "xai"
  if (env.OPENAI_API_KEY) return "openai"
  return null
}
export function hasStripe() {
  return Boolean(env.STRIPE_SECRET_KEY)
}

export function isDatabaseConfigured() {
  return Boolean(env.DATABASE_URL)
}

export function hasSession() {
  return Boolean(env.SESSION_SECRET)
}
