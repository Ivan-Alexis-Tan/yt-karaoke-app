"use client";

// Next.js
import { use } from "react"

// Helper functions, api fetch functions, etc
import { banVideo } from "@/src/api/ban"

// Types
import { Session } from "next-auth"
import type { MainPlayerProps } from "./MainPlayer"

// Components
import BanRequestForm from "@/src/components/BanRequestForm"
import PopupWindow from "@/src/components/PopupWindow"

type BanNotifPopupProps = {
    currentUserPromise: MainPlayerProps["currentUser"]
    popupWindowStates: {closePopup: (popupWindowId: string) => void}
    closePopupFn: (windowId: string) => void
    showNotifFn: (notifId: string) => void
    videoId: string
    session: Session
}

export default function BanNotifPopup({ 
    currentUserPromise, 
    popupWindowStates, 
    closePopupFn, 
    showNotifFn, 
    session, 
    videoId 
}: BanNotifPopupProps) {
    const currentUser = currentUserPromise instanceof Promise
        ? use(currentUserPromise)
        : currentUserPromise

    if (currentUser?.role === "admin") return (
        <PopupWindow windowId="banPopup" 
            popupWindowStates={popupWindowStates}
            headerText="Confirm to ban this song"
            confirmFn={() => {
                closePopupFn("banPopup")
                showNotifFn("banSuccess")
                banVideo(videoId, session)
            }}
            confirmBtnMode="warning"
        />
    )
    else return (
        <BanRequestForm
            video_details={{ video_id: videoId}} 
            session={session as Session} 
            submitBtnFn={() => {
                closePopupFn("banPopup")
                showNotifFn("requestSuccess")
            }} 
            cancelBtnFn={() => closePopupFn("banPopup")}
        />
    )
}