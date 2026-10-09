"use client";

import { signOut } from "next-auth/react";

import PopupWindow, { usePopupWindow } from "./PopupWindow";

export function LogoutComponent() {
    const { showPopup, openPopup, popupWindowStates } = usePopupWindow({
        logoutWindow: false
    })
    
    return (
        <>
            {showPopup.logoutWindow
                && <PopupWindow
                    windowId="logoutWindow"
                    popupWindowStates={popupWindowStates}
                    headerText="Confirm Logout"
                    confirmFn={() => signOut({ redirectTo: "/login" })}
                    confirmBtnText="Logout"
                    confirmBtnMode="warning"
                    className="[&_button]:p-3"
                />
            }

            <button className="logout-btn" onClick={_ => openPopup("logoutWindow")}>
                Logout
            </button>
        </>
    )
}