"use client";

// Next.js
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect } from "react";

// useHooks, utils, and helper functions
import PopupWindow, { usePopupWindow } from "@/src/components/PopupWindow";

export default function LogoutFirstPopup({ session }: { session: Session }) {
    const { openPopup, popupWindowStates } = usePopupWindow({ "logoutFirst": false })
    
    useEffect(() => {
        openPopup("logoutFirst")
    }, [])
    
    return (
        <PopupWindow 
            windowId="logoutFirst"
            popupWindowStates={popupWindowStates}
            headerText="Already Logged In"
            subHeaderText={`Logout ${session.user?.name} first to sign-in an account.`}
            confirmFn={() => signOut({ redirectTo: "/login" })}
            confirmBtnText="Logout"
            confirmBtnMode="warning"
            cancelBtnText="Back to home"
            cancelFn={() => redirect("/")}
        />
    )
}