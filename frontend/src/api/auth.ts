"use server";

import { signIn } from "@/auth";
import { signOut } from "next-auth/react";
import { BASE_URL } from "../core/core";
import { Session } from "next-auth";


export async function signInWithGoogle() {
    await signIn("google", { redirectTo: "/" })
}

export async function signInWithGithub() {
    await signIn("github", { redirectTo: "/" })
}

export async function logout() {
    await signOut({ redirectTo: "/login" })
}

export async function getCurrentUser(session: Session) {
    const fetched = await fetch(`${BASE_URL}/users`, {
        headers: {
            Authorization: `Bearer ${session.backendToken}`
        },
    })

    return await fetched.json()
}