"use client";

import { useEffect, useState } from "react"
import CloseIcon from "../svgs/CloseIcon"

type NotifState = Record<string, boolean>

export function useNotify(notifIds: NotifState) {
    const [notifStates, setNotifState] = useState<NotifState>(notifIds)

    function showNotif(notifId: keyof NotifState) {
        setNotifState(p => ({...p, [notifId]: true}))
    }

    function closeNotif(notifId: keyof NotifState) {
        setNotifState(p => ({...p, [notifId]: false}))
    }

    return {
        notifStates,
        showNotif,
        closeNotif,
        notifPopupTools: { closeNotif, notifStates }
    }
}

type NotifPopupProps = {
    notifId: keyof NotifState
    message: string
    notifPopupTools: {
        closeNotif: (notifId: keyof NotifState) => void
        notifStates: NotifState
    }
}

export default function NotifPopup({ notifId, message, notifPopupTools }: NotifPopupProps) {
    const { notifStates, closeNotif } = notifPopupTools

    useEffect(() => {
        if (!notifStates[notifId]) return

        setTimeout(() => {
            closeNotif(notifId)
        }, 5000);
    }, [notifStates[notifId]])

    return (
        <div className="max-w-80 p-1 fixed bottom-3 left-0 z-(--z-popup-window) 
            flex justify-between items-center 
            border-y border-r border-foreground rounded-r-2xl text-background bg-green-400"
        >
            <p>{message}</p>

            <button className="hover:[&_svg]:text-foreground"
                onClick={_ => closeNotif(notifId)}
            >
                <CloseIcon className="w-7 h-7" />
            </button>
        </div>
    )
}