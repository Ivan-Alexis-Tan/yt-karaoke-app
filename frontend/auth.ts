import { SignJWT } from "jose";
import NextAuth from "next-auth";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";

const BACKEND_AUTH_SECRET = new TextEncoder().encode(
    process.env.BACKEND_AUTH_SECRET!
);

export const { auth, handlers, signIn, signOut } = NextAuth({
    providers: [Google, Github],
    
    callbacks: {
        async jwt({ token, account }) {
            if (account) {
                const backendToken = await new SignJWT({
                    sub: token.sub,
                    email: token.email,
                    name: token.name,
                    picture: token.picture,
                })
                .setProtectedHeader({ alg: "HS256" })
                .setIssuedAt()
                .setExpirationTime("1h")
                .sign(BACKEND_AUTH_SECRET);

                token.backendToken = backendToken;
            }

            return token
        },

        async session({ session, token }) {
            session.backendToken = token.backendToken as string;
            return session
        },
    },
});