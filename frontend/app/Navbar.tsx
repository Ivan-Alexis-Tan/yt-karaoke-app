"use client"

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import SearchIcon from "@/src/svgs/SearchIcon";
import { capsWord } from "@/src/utils/helpers";

export default function Navbar({ className }: { className?: string }) {
    const [search, setSearch] = useState("")
    const [searchMode, setSearchMode] = useState<SearchMode>("local")

    const router = useRouter()
    const path = usePathname()

    useEffect(() => setSearchMode("local"), [path])

    return (
        <nav className={`${className ?? ""} flex justify-between items-center`}>
            <Link href={"/"}
                className="text-(--red-clr) hover:text-foreground"
            >
                <h2 className="text-2xl font-bold">YT Karaoke App</h2>
            </Link>

            <div className="w-[40%] gap-3 flex border rounded-2xl">
                <input type="text" 
                    title="Search a song"
                    placeholder="Search"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    onKeyUp={e => e.key === "Enter" && router.push(`/search/${searchMode}?query=${search}`)}
                    className="pl-5 flex-1 rounded-l-2xl"
                />

                <button className="my-2 px-1 bg-foreground text-background hover:bg-(--red-clr) hover:text-white"
                    onClick={_ => setSearchMode(p => p === "local" ? "online" : "local")}
                    title={`Is set to ${searchMode} search`}
                >
                    {capsWord(searchMode)}
                </button>

                <Link href={`/search/${searchMode}?query=${search}`}
                    className="pl-3 w-20 rounded-r-2xl text-foreground hover:bg-(--light-gray-clr) bg-(--gray-clr)"
                >
                    <SearchIcon className="w-10 h-10" />
                </Link>
            </div>

            <div>
                <p>Something here</p>
            </div>
        </nav>
    )
}