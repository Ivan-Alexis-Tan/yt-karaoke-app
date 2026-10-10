"use client";

// Utils and Helper functions
import { signInWithGithub, signInWithGoogle } from "@/src/api/auth";

// Components
import GithubLogo from "@/src/svgs/GithubLogo";
import GoogleLogo from "@/src/svgs/GoogleLogo";

export default function SignUpComponent() {
    return (
        <div className="p-3 flex flex-col gap-12 justify-center items-center *:border *:rounded-2xl [&>button]:w-full [&>button]:max-w-100">
            <button onClick={signInWithGoogle}
                className="p-2 gap-3 flex flex-col justify-center items-center hover:bg-(--gry-700)"
            >
                <GoogleLogo className="w-7 h-7" />
                with Google
            </button>
            <button onClick={signInWithGithub}
                className="p-2 gap-3 flex flex-col justify-center items-center hover:bg-(--gry-700)"
            >
                <GithubLogo className="w-7 h-7" />
                with Github
            </button>
        </div>
    )
}