// Utils and helper functions
import { auth } from "@/auth";

// Components
import SignUpComponent from "./SignUp";
import LogoutFirstPopup from "./LogoutFirstWindow";

export default async function SignUpPage() {
    const session = await auth()
    
    return (
        <div className="mx-5">
            <h2 className="text-2xl font-bold">Sign In</h2>

            <SignUpComponent />

            {session
                && <LogoutFirstPopup session={session} />
            }
        </div>
    )
}