// Next.js
import Image from "next/image"
import Link from "next/link"
import { Suspense } from "react"
import { Session } from "next-auth"

//  and Helper functions
import { auth } from "@/auth"
import { getCurrentUser } from "@/src/api/auth"

// Components
import BannedVideos from "./BannedVideos"
import BannedChannels from "./BannedChannels"

export default async function AdminPage() {
    const session = await auth()
    const currentUser = session ? await getCurrentUser(session) : null

    // Error page when no current user
    if (!currentUser || currentUser.role !== "admin") return (
        <div>
            <h1 className="mb-3 text-3xl font-bold text-center">401 Unauthorized</h1>
            <p className="text-center">Not enough credentials to access the page</p>
        </div>
    );

    return (
        <div className="mx-5 *:mb-5">
            
            {/* Admin Page Header Section */}
            <div className="gap-6 flex justify-between items-center">
                <h1 className="text-3xl font-bold">Admin</h1>
                
                <div className="gap-3 flex items-center">
                    <Link href={"/profile"}
                        className="whitespace-nowrap text-ellipsis overflow-hidden"
                    >
                        {currentUser.name}
                    </Link>

                    <Image src={currentUser.picture}
                        width={50} height={50} alt="admin-profile-picture"
                        className="rounded-full"
                    />
                </div>
            </div>
            
            {/* Banned Videos Section */}
            <Suspense fallback={<h1>Loading...</h1>}>
                <BannedVideos currentUser={currentUser} className="p-1 border rounded" />
            </Suspense>

            {/* Banned Channels Section */}
            <Suspense>
                <BannedChannels currentUser={session as Session} className="p-1 border rounded" />
            </Suspense>
        </div>
    )
}

