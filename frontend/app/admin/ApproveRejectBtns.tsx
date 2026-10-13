"use client";

// Next.js
import { Session } from "next-auth";

// Api fetchers, custom useHooks, other helper functions
import { approveBanRequest, rejectBanRequest } from "@/src/api/banRequest";
import PopupWindow, { usePopupWindow } from "@/src/components/PopupWindow";

// Component
import ThumbsDownIcon from "@/src/svgs/ThumbsDownIcon";
import ThumbsUpIcon from "@/src/svgs/ThumbsUpIcon";

type ApproveRejectBtnProps = {
    banRequest: BanRequestType
    session: Session
}

export default function ApproveRejectBtns({ banRequest, session }: ApproveRejectBtnProps) {
    const { showPopup, openPopup, popupWindowStates } = usePopupWindow({
        approveWindow: false,
        rejectWindow: false,
    })
    
    return (
        <div className="gap-3 flex">
            <button onClick={_ => openPopup("approveWindow")}
                className="hover:text-green-400"
            >
                <ThumbsUpIcon className="w-7 h-7" title="Approve" />
            </button>
            
            <button onClick={_ => openPopup("rejectWindow")} 
                className="hover:text-(--red-clr)"
            >
                <ThumbsDownIcon className="w-7 h-7" title="Reject" />
            </button>

            {showPopup.approveWindow
                && <PopupWindow 
                    windowId="approveWindow"
                    popupWindowStates={popupWindowStates}
                    headerText={`Approve Ban Request`}
                    subHeaderText={`Ban "${banRequest.video.video_title}"?`}
                    confirmFn={() => approveBanRequest(banRequest.id, session)}
                    confirmBtnText="Ban"
                    confirmBtnMode="warning"
                />
            }

            {showPopup.rejectWindow
                && <PopupWindow 
                    windowId="rejectWindow"
                    popupWindowStates={popupWindowStates}
                    headerText={`Reject Ban Request`}
                    subHeaderText={`Reject banning "${banRequest.video.video_title}"?`}
                    confirmFn={() => rejectBanRequest(banRequest.id, session)}
                    confirmBtnText="Reject"
                    confirmBtnMode="warning"
                />
            }
        </div>
    )
}