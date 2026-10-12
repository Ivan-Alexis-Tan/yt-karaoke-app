"use client";
// Next.js
import Image from "next/image";
import { useEffect, useState } from "react";

// useHooks, and other helper functions
import { getBanRequests } from "@/src/api/banRequest";
import { capsWord, formatMinutesSeconds } from "@/src/utils/helpers";
import { BAN_REQUEST_STATUS } from "@/src/utils/constants";
import DropdownWindow, { useDropdown } from "@/src/components/DropDownWindow";

// Components
import ThumbsDownIcon from "@/src/svgs/ThumbsDownIcon";
import ThumbsUpIcon from "@/src/svgs/ThumbsUpIcon";
import TriangleArrowRightIcon from "@/src/svgs/TriangleArrowRightIcon";
import ClockIcon from "@/src/svgs/ClockIcon";

type BanRequestFilters = {
    date: "recent" | "earlier"
    status: BanRequestStatus
}

const filterDefault: BanRequestFilters = {
    date: "recent",
    status: "pending",
}

export default function BanRequests() {
    const { dropdownState, switchDropdown, useDropdownStates } = useDropdown({
        dateDropdown: false,
        statusDropdown: false,
    })
    const [limit, setLimit] = useState<number>(1)
    const [filters, setFilters] = useState<BanRequestFilters>(filterDefault)
    const [banRequests, setBanRequests] = useState<BanRequestsResponse>([])

    useEffect(() => {
        const fetchBanRequest = async () => {
            const result = await getBanRequests(limit);
            setBanRequests(result)
        };

        fetchBanRequest()
    }, [limit])

    function ChangeFilter(key: keyof BanRequestFilters) {
        setFilters(p => ({ ...p, [key]: !p[key]}) )
    }

    return (
        <div>
            {/* Ban Request Headers  */}
            <div className="ban-req-headers mb-5 flex flex-wrap items-center">
                <h3 className="text-xl font-bold">Ban Requests</h3>

                {/* Filter Buttons */}
                <div className="gap-3 flex justify-between items-center">

                    {/* Ban Request Date Filter Button */}
                    <div className="relative">
                        <button onClick={_ => switchDropdown("dateDropdown")}
                            className="pr-3 flex items-center rounded-full border hover:bg-foreground hover:text-background"
                        >
                            <TriangleArrowRightIcon className="w-7 h-7" />
                            {filters.date}
                        </button>

                        {dropdownState.dateDropdown
                            && <DropdownWindow
                                dropdownId="dateDropdown" 
                                useDropdownStates={useDropdownStates}
                                buttonOptions={["recent", "earlier"]}
                            />
                        }
                    </div>

                    {/* Ban Request Status Filter Button */}
                    <div className="relative">
                        <button onClick={_ => switchDropdown("statusDropdown")}
                            className="pr-3 flex items-center rounded-full border hover:bg-foreground hover:text-background"
                        >
                            <TriangleArrowRightIcon className="w-7 h-7" />
                            {filters.status}
                        </button>

                        {dropdownState.statusDropdown
                            && <DropdownWindow
                                dropdownId="statusDropdown" 
                                useDropdownStates={useDropdownStates}
                                buttonOptions={BAN_REQUEST_STATUS}
                            />
                        }
                    </div>
                </div>
            </div>

            {/* Ban Request Cards */}
            <div className="mx-5 *:mb-5">
                {banRequests.map(request => (
                    <div key={request.id} className="border">
                        
                        {/* Request Header */}
                        <div className="flex justify-between">

                            {/* Ban Request Detail */}
                            <div className="gap-3 flex items-center">
                                <div className="gap-1 flex items-center">
                                    {request.status === "pending"
                                        && <ClockIcon className="w-7 h-7" />
                                    }
                                    <p>{capsWord(request.status)}</p>
                                </div>

                                <Image src={request.requested_user.picture}
                                    width={640} height={480} alt="requested-user-image"
                                    className="w-7 h-7 rounded-full"
                                    title={request.requested_user.name}
                                />
                            </div>

                            {/* Approve or Reject Request */}
                            <div className="gap-3 flex">
                                <button>
                                    <ThumbsUpIcon className="w-7 h-7" title="Approve" />
                                </button>
                                
                                <button>
                                    <ThumbsDownIcon className="w-7 h-7" title="Reject" />
                                </button>
                            </div>
                        </div>

                        {/* Ban Request Video */}
                        <div className="mx-auto gap-3 max-w-200 p-2 grid items-center sm:grid-cols-2">
                            <div className="mx-auto relative max-w-70">
                                <Image className="w-full rounded-2xl" 
                                    src={request.video.thumbnail_url} alt="video thumbnail" 
                                    width={640} height={480} 
                                />

                                <div className="px-0.5 absolute top-3 right-3 bg-(--lucent-blk-clr)">
                                    {new Date(request.date).toDateString().split(" ").slice(1).join(" ")}
                                </div>

                                <div className="px-0.5 absolute bottom-3 right-3 bg-(--lucent-blk-clr)">
                                    {formatMinutesSeconds(request.video.duration_sec as number)}
                                </div>
                            </div>

                            <div className="m-1.5 gap-1 flex flex-col justify-center text-white *:text-ellipsis *:overflow-hidden">
                                <h3 className="text-xl font-bold">{request.video.video_title}</h3>
                                <p>{request.video.channel.channel_title}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}