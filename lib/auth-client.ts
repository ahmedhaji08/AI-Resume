"use client"

export type AuthUser = { id: string; name: string; email: string; passwordHash: string; isAdmin?: boolean }

export async function hashPassword(password: string): Promise<string> {
  const enc = new TextEncoder()
  const buf = await crypto.subtle.digest("SHA-256", enc.encode(password))
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

export async function signUp(opts: { name: string; email: string; password: string; isAdmin?: boolean }) {
  const users = JSON.parse(localStorage.getItem("auth_users") || "[]") as AuthUser[]
  const exists = users.some((u) => u.email.toLowerCase() === opts.email.toLowerCase())
  if (exists) throw new Error("Email already exists")
  const user: AuthUser = {
    id: crypto.randomUUID(),
    name: opts.name,
    email: opts.email,
    passwordHash: await hashPassword(opts.password),
    isAdmin: Boolean(opts.isAdmin),
  }
  localStorage.setItem("auth_users", JSON.stringify([...users, user]))
  localStorage.setItem("auth_session", JSON.stringify({ userId: user.id }))
  return user
}

export async function signIn(email: string, password: string) {
  const users = JSON.parse(localStorage.getItem("auth_users") || "[]") as AuthUser[]
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase())
  if (!user) throw new Error("Invalid credentials")
  const hash = await hashPassword(password)
  if (hash !== user.passwordHash) throw new Error("Invalid credentials")
  localStorage.setItem("auth_session", JSON.stringify({ userId: user.id }))
  return user
}

export function signOut() {
  localStorage.removeItem("auth_session")
}

export function getCurrentUser(): AuthUser | null {
  try {
    const session = JSON.parse(localStorage.getItem("auth_session") || "null") as { userId: string } | null
    if (!session?.userId) return null
    const users = JSON.parse(localStorage.getItem("auth_users") || "[]") as AuthUser[]
    return users.find((u) => u.id === session.userId) || null
  } catch {
    return null
  }
}
