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
    const res = await fetch(`${BASE_URL}/users`, {
        headers: {
            Authorization: `Bearer ${session.backendToken}`
        },
    });

    if (!res.ok) {
        const body = await res.text()
        throw new Error(`getCurrentUser failed: ${res.status} ${body.slice(0, 300)}`)
    } 

    return await res.json()
}