// Next.js
import Image from "next/image"
import Link from "next/link"
import { Session } from "next-auth"

// Utils and helper functions
import { getCurrentUser } from "@/src/api/auth"

// Components
import GithubLogo from "@/src/svgs/GithubLogo"
import GoogleLogo from "@/src/svgs/GoogleLogo"

export default async function CurrentUserProfile({ session }: { session: Session }) {
    const currentUser: CurrentUserResponse = await getCurrentUser(session)
    const date = new Date(currentUser.created_at).toDateString()

    const brandLogo = {
        google: GoogleLogo,
        github: GithubLogo,
    }
    const ProviderLogo = brandLogo[currentUser.provider as keyof (typeof brandLogo)]

    return (
        <div className="mx-auto max-w-250 p-2 gap-3 sm:gap-10 relative flex flex-col sm:flex-row items-center border rounded-2xl">
            {/* Profile Picture and provider logo */}
            <div className="relative">
                <Image src={currentUser.picture as string} 
                    width={150} height={150}
                    alt={`${currentUser.name}'s profile picture`}
                    className="rounded-full"
                />

                <div className="w-8 h-8 absolute bottom-0 right-2 flex align-top justify-center items-center bg-black rounded-full">
                    <ProviderLogo className="w-7 h-7" title={`${currentUser.provider} provider`} />
                </div>
            </div>

            {/* Basic profile info */}
            <div className="flex-1">
                <h1 className="text-3xl font-bold">{currentUser.name}</h1>
                <p className="text-center sm:text-start sm:mb-5 italic">{currentUser.email}</p>
                <p className="text-center sm:text-start">Since: {date}</p>
            </div>

            {/* Admin Page Link */}
            {currentUser.role === "admin"
                && <Link href={"/admin"} className="admin-link p-1 border rounded-xl bg-green-400 hover:bg-green-300 text-black">
                    Admin Page
                </Link>
            }
        </div>
    )
}