import "server-only"
import { env } from "./env"

const encoder = new TextEncoder()

function base64url(bytes: Uint8Array): string {
  const str = btoa(String.fromCharCode(...bytes))
  return str.replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "")
}
function base64urlJSON(obj: any): string {
  const json = JSON.stringify(obj)
  return base64url(encoder.encode(json))
}

export async function signJWT(payload: Record<string, any>, expSeconds = 60 * 60 * 24 * 7) {
  if (!env.SESSION_SECRET) throw new Error("SESSION_SECRET is not set")
  const header = { alg: "HS256", typ: "JWT" }
  const now = Math.floor(Date.now() / 1000)
  const body = { ...payload, iat: now, exp: now + expSeconds }
  const unsigned = `${base64urlJSON(header)}.${base64urlJSON(body)}`
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(env.SESSION_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  )
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(unsigned))
  const sigB64 = base64url(new Uint8Array(sig))
  return `${unsigned}.${sigB64}`
}

export async function verifyJWT(token?: string): Promise<{ ok: boolean; payload?: any }> {
  try {
    if (!token) return { ok: false }
    if (!env.SESSION_SECRET) return { ok: false }
    const [h, p, s] = token.split(".")
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(env.SESSION_SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign", "verify"],
    )
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      Uint8Array.from(atob(s.replaceAll("-", "+").replaceAll("_", "/")), (c) => c.charCodeAt(0)),
      encoder.encode(`${h}.${p}`),
    )
    if (!valid) return { ok: false }
    const payload = JSON.parse(atob(p.replaceAll("-", "+").replaceAll("_", "/")))
    const now = Math.floor(Date.now() / 1000)
    if (payload.exp && payload.exp < now) return { ok: false }
    return { ok: true, payload }
  } catch {
    return { ok: false }
  }
}
