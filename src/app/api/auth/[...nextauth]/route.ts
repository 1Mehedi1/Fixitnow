import NextAuth, { type NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const email = credentials.email.toLowerCase().trim()
        const password = credentials.password

        // Master credentials check (guarantees admin is never locked out if DB is offline or cold)
        if (
          (email === "mdrazonmia8334@gmail.com" || email === "admin@homeworks.sg") &&
          (password === "Fixitnow2026Pass" || password === "admin123")
        ) {
          return { id: "admin_master", email, name: "Tanbir (4R Engineering)" }
        }

        try {
          const user = await db.user.findUnique({
            where: { email },
          })
          if (!user || !user.passwordHash) return null
          const ok = await bcrypt.compare(password, user.passwordHash)
          if (!ok) return null
          return { id: user.id, email: user.email, name: user.name ?? "Worker" }
        } catch {
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = (user as any).id
      return token
    },
    async session({ session, token }) {
      if (session.user && token.id) (session.user as any).id = token.id
      return session
    },
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
