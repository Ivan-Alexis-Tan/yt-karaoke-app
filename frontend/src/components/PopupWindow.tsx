import { useState } from "react"

// Popup Window useHook =======================================================
type PopupWindowIds = Record<string, boolean>

export function usePopupWindow(popupWindowIds: PopupWindowIds) {
    const [showPopup, setShowPopup] = useState(popupWindowIds)

    // Show or close window switch
    function openPopup(popupWindowId: keyof PopupWindowIds) {
        setShowPopup(p => ({...p, [popupWindowId]: true}))
    }

    function closePopup(popupWindowId: keyof PopupWindowIds) {
        setShowPopup(p => ({...p, [popupWindowId]: false}))
    }
    
    return {
        showPopup,
        openPopup,
        popupWindowStates: {
            closePopup,
        }
    }
}

// Popup Window Component =======================================================
type PopupWindowProps = {
    windowId: keyof PopupWindowIds
    popupWindowStates: {
        closePopup: (popupWindowId: keyof PopupWindowIds) => void
    }
    headerText: string
    confirmFn: () => any
    cancelFn?: () => any
    subHeaderText?: string
    confirmBtnText?: string
    confirmBtnMode?: "confirm" | "warning"
    cancelBtnText?: string
    className?: string
}

export default function PopupWindow({ 
    windowId, 
    popupWindowStates, 
    headerText,
    confirmFn,
    cancelFn = () => {},
    subHeaderText,
    confirmBtnText = "Confirm",
    confirmBtnMode = "confirm",
    cancelBtnText = "Cancel",
    className
}: PopupWindowProps
) {
    const { closePopup } = popupWindowStates
    return (
        <div className={`${className ?? ""} fixed top-0 left-0 w-full h-full z-(--z-popup-window) flex justify-center items-center bg-(--lucent-blk-clr)`}>
            <div className="w-100 h-80 px-3 flex flex-col justify-evenly items-center bg-(--light-gray-clr) text-white rounded-2xl">
                <h3 className="text-xl font-bold">{headerText}</h3>
                {subHeaderText && <p className="text-center">{subHeaderText}</p>}

                <div className="popup-btns w-full flex justify-evenly *:p-2 *:border *:border-foreground *:rounded-2xl">
                    <button onClick={() => {
                        confirmFn()
                        closePopup(windowId)
                    }}
                        className={`${confirmBtnMode === "warning" ? "hover:bg-(--red-clr) hover:border-(--red-clr)" : "hover:bg-green-400 hover:border-green-400 hover:text-(--lucent-blk-clr)"} `}
                    >
                        {confirmBtnText}
                    </button>
                    
                    <button onClick={_ => {
                        cancelFn()
                        closePopup(windowId)
                    }}
                        className="hover:bg-white hover:text-black"
                    >
                        {cancelBtnText}
                    </button>
                </div>
            </div>
        </div>
    )
}