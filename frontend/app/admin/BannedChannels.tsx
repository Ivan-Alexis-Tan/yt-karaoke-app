"use client";

// Next.js
import { Session } from "next-auth"
import { useEffect, useState } from "react";

// Utils and helper functions
import { getBannedChannels } from "@/src/api/ban"

// Components
import DeleteIcon from "@/src/svgs/DeleteIcon"

export default function BannedChannels({ currentUser, className }: { currentUser: Session, className?: string }) {
    const [page, setPage] = useState<number>(1)
    const [bannedChannels, setBannedChannels] = useState<BannedChannelsResponse>([])

    // Updates BannedChannels on change of Page
    useEffect(() => {
        const fetchBannedChannels = async () => {
            const bannedChannelsData = await getBannedChannels(page, currentUser)
            setBannedChannels(bannedChannelsData)
        }

        fetchBannedChannels()
    }, [page])

    return (
        <div className={className ?? ""}>
            <h3 className="text-xl font-bold mb-3">Banned Channels</h3>
            
            {/* Banned Channels Data Table */}
            <div className="mb-5 max-h-100 overflow-auto">
                <table className="data-table">
                    <thead className="[&_th]:sticky [&_th]:top-0 [&_th]:bg-black">
                        <tr>
                            <th></th>
                            <th>Date</th>
                            <th>Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bannedChannels.map(channel => (
                            <tr key={channel.channel_id}>
                                <td>
                                    <button
                                        className="w-full flex justify-center items-center hover:text-(--red-clr)"
                                    >
                                        <DeleteIcon className="w-7 h-7" />
                                    </button>
                                </td>
                                <td>{new Date(channel.date).toDateString().split(" ").slice(1).join(" ")}</td>
                                <td>{channel.channel_title}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {/* View More Button */}
            <div>
                <button onClick={_ => setPage(p => p + 1)}
                    className="block mx-auto my-3 px-3 hover:bg-green-400 hover:text-black border rounded-full"
                >
                    View more
                </button>
            </div>
        </div>
    )
}