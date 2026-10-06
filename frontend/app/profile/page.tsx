// Next.js
import { Suspense } from "react";
import Link from "next/link";

// Utils and helper functions
import { auth } from "@/auth";

// Component
import CurrentUserProfile from "./CurrentUserProfile";
import CurrentUserSkeleton from "@/src/components/skeletons/CurrentUserSkeleton";

export default async function ProfilePage() {
    const session = await auth()

    if (!session) return (
        <div className="flex flex-col items-center">
            <h2 className="mb-5 text-2xl font-bold text-center">No user logged in</h2>
            <Link href={"/login"}
                className="p-2 hover:bg-(--gray-clr) rounded-full"
            >
                Go to Sign In Page
            </Link>
        </div>
    )

    if (!session?.backendToken) return <div>
        <h2 className="text-2xl font-bold">Not authenticated</h2>
    </div>

    return (
        <div className="profile-container mx-5">
            <Suspense fallback={<CurrentUserSkeleton />}>
                <CurrentUserProfile session={session} />
            </Suspense>
        </div>
    )
}

