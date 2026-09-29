"use server";

import { signIn } from "@/auth";
import { signOut } from "next-auth/react";


export async function signInWithGoogle() {
    await signIn("google", { redirectTo: "/" })
}

export async function signInWithGithub() {
    await signIn("github", { redirectTo: "/" })
}

export async function logout() {
    await signOut({ redirectTo: "/login" })
}