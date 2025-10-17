import NextAuth from "next-auth"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import Resend from "next-auth/providers/resend"
import { MongoClient } from "mongodb"
import { sendVerificationRequest } from "./email-templates"

const client = new MongoClient(process.env.MONGODB_URI!)
const clientPromise = Promise.resolve(client)

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: MongoDBAdapter(clientPromise),
    providers: [
        Resend({
            apiKey: process.env.RESEND_API_KEY,
            from: process.env.EMAIL_FROM,
            sendVerificationRequest,
        }),
    ],
    pages: {
        signIn: "/signin",
        verifyRequest: "/verify-request",
    },
    callbacks: {
        async session({ session, user }) {
            // Add user id to session
            if (session.user && user) {
                session.user.id = user.id
            }
            return session
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
            }
            return token
        },
    },
    session: {
        strategy: "database",
    },
    debug: process.env.NODE_ENV === "development",
})