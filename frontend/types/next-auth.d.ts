import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    accessToken?: string
    user: {
      role?: string
      workerType?: string
    } & DefaultSession["user"]
  }

  interface User {
    role?: string
    workerType?: string
    token?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string
    workerType?: string
    accessToken?: string
  }
}