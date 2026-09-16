import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/lib/db"

/** Returns true if the current session belongs to the admin worker. */
export async function isAdmin(): Promise<boolean> {
  const session = await getServerSession(authOptions)
  return !!session?.user?.email
}

/** Returns the admin user record, or null. */
export async function getAdmin() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return null
  return db.user.findUnique({ where: { email: session.user.email } })
}
