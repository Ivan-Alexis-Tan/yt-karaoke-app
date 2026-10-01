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
        async jwt({ token, account, profile }) {
            if (account) {
                token.provider = account.provider
                const providerUserId = account.provider === "google"
                    ? profile?.sub
                    : profile?.id

                token.uid = providerUserId
            }

            return token
        },

        async session({ session, token }) {
            session.backendToken = await new SignJWT({
                provider: token.provider,
                email: token.email,
                name: token.name,
                picture: token.picture,
            })
            .setProtectedHeader({ alg: "HS256" })
            .setSubject(`${token.uid}`)
            .setIssuedAt()
            .setIssuer("yt-karaoke-tvan-front")
            .setAudience("yt-karaoke-tvan-back")
            .setExpirationTime("1h")
            .sign(BACKEND_AUTH_SECRET);

            return session
        },
    },
});