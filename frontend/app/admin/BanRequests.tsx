"use client";
// Next.js
import { useEffect, useState } from "react";
import { Session } from "next-auth";
import { useRouter, useSearchParams } from "next/navigation";

// useHooks, and other helper functions
import { getBanRequestCounts, getBanRequests } from "@/src/api/banRequest";
import { BAN_REQUEST_STATUS } from "@/src/utils/constants";
import DropdownWindow, { useDropdown } from "@/src/components/DropdownWindow";

// Components
import TriangleArrowRightIcon from "@/src/svgs/TriangleArrowRightIcon";
import BanRequestCards from "./BanRequestCards";

type BanRequestFilters = {
    date_order: DateOrderSearchParam
    req_status: ReqStatusSearchParam
}

const filterDefault: BanRequestFilters = {
    date_order: "recent",
    req_status: "pending",
}

const countsDefault: BanRequestCounts = {
    pending: 0,
    rejected: 0,
    approved: 0,
    all: 0
}

export default function BanRequests({ session }: { session: Session }) {
    const searchParams = useSearchParams();
    const router = useRouter();

    const { dropdownState, switchDropdown, useDropdownStates } = useDropdown({
        dateDropdown: false,
        statusDropdown: false,
    })
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [filters, setFilters] = useState<BanRequestFilters>(filterDefault)
    const [banRequests, setBanRequests] = useState<BanRequestsResponse>([])
    const [counts, setCounts] = useState<BanRequestCounts>(countsDefault)

    useEffect(() => {
        const currentSearchParams: BanRequestFilters = {
            date_order: (searchParams.get("date_order") as BanRequestFilters["date_order"]) ?? "recent",
            req_status: (searchParams.get("req_status")) as BanRequestFilters["req_status"] ?? "all",
        }

        const fetchBanRequest = async () => {
            const counts = await getBanRequestCounts()
            const result = await getBanRequests(
                currentPage,
                currentSearchParams.date_order,
                currentSearchParams.req_status
            );

            setCounts(counts)
            setBanRequests(result)
        };

        setFilters(currentSearchParams)
        fetchBanRequest()
    }, [currentPage, searchParams])

    function setQueryParams(key: "date_order" | "req_status", val: string) {
        const params = new URLSearchParams(searchParams.toString())
        params.set(key, val)
        router.push(`?${params.toString()}`)
    }

    const currentCount = counts[filters.req_status]
    const totalPages = Math.ceil(currentCount / 5)

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
                            {filters.date_order}
                        </button>

                        {dropdownState.dateDropdown
                            && <DropdownWindow
                                dropdownId="dateDropdown" 
                                useDropdownStates={useDropdownStates}
                                buttonOptions={["recent", "old"]}
                                onClickFn={(option) => setQueryParams("date_order", option)}
                            />
                        }
                    </div>

                    {/* Ban Request Status Filter Button */}
                    <div className="relative">
                        <button onClick={_ => switchDropdown("statusDropdown")}
                            className="pr-3 flex items-center rounded-full border hover:bg-foreground hover:text-background"
                        >
                            <TriangleArrowRightIcon className="w-7 h-7" />
                            {filters.req_status}
                        </button>

                        {dropdownState.statusDropdown
                            && <DropdownWindow
                                dropdownId="statusDropdown" 
                                useDropdownStates={useDropdownStates}
                                buttonOptions={["all", ...BAN_REQUEST_STATUS]}
                                onClickFn={(option) => setQueryParams("req_status", option)}
                            />
                        }

                        <div className="px-0.75 h-4 absolute -top-2 right-0 flex justify-center items-center text-background bg-green-400 rounded-full">
                            <p>{currentCount}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Ban Request Cards */}
            <BanRequestCards 
                banRequests={banRequests}
                session={session}
                req_status={filters.req_status}
                className="max-h-200 mb-3 px-2 grid md:grid-cols-2 overflow-auto"
            />

            {/* View More Button */}
            {(currentPage < totalPages)
                && <button onClick={_ => setCurrentPage(p => Math.min(p + 1, totalPages))}
                    className="mx-auto w-30 block hover:bg-foreground hover:text-background border rounded-full"
                >
                    View More
                </button>
            }
        </div>
    )
}