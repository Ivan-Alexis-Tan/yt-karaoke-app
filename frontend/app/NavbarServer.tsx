"use server";

import { auth } from "@/auth";
import Navbar from "./Navbar";
import { getCurrentUser } from "@/src/api/auth";

export default async function NavbarServer({ className }: { className?: string }) {
    const session = await auth()
    const currentUser = session ? await getCurrentUser(session) : null

    return <Navbar className={className ?? ""} currentUser={currentUser} />
}