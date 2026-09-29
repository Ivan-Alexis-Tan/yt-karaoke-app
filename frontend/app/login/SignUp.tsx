"use client";

import { signInWithGithub, signInWithGoogle } from "@/src/api/auth";

export default function SignUpComponent() {
    return (
        <div className="flex flex-col gap-12 justify-center items-center *:border [&>button]:w-100">
            <button onClick={signInWithGoogle}>Sign in with Google</button>
            <button onClick={signInWithGithub}>Sign in with Github</button>
        </div>
    )
}