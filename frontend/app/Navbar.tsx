"use client"

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import SearchIcon from "@/src/svgs/SearchIcon";
import { capsWord } from "@/src/utils/helpers";
import YoutubeIcon from "@/src/svgs/YoutubeIcon";
import KaraokeMicIcon from "@/src/svgs/KaraokeMicIcon";
import MenuIcon from "@/src/svgs/MenuIcon";

export default function Navbar({ className }: { className?: string }) {
    const [search, setSearch] = useState("")
    const [searchMode, setSearchMode] = useState<SearchMode>("local")

    const router = useRouter()
    const path = usePathname()

    useEffect(() => setSearchMode("local"), [path])

    return (
        <nav className={`${className ?? ""}`}>
            <div className="gap-3 sm:gap-6 flex justify-between items-center">
                <Link href={"/"}
                    className="text-(--red-clr) min-w-11 min-h-11 hover:text-foreground"
                    title="Youtube Karaoke App"
                >
                    <h2 className="flex flex-col md:flex-row gap-1 justify-center items-center text-2xl font-bold">
                        <div className="-mb-4 md:mb-0 w-10.5 h-10.5 relative">
                            <YoutubeIcon className="w-10 h-10" />
                            <KaraokeMicIcon className="w-6 h-6 absolute bottom-1 right-0" />
                        </div>
                        <p className="hidden sm:block">Karaoke App</p>
                    </h2>
                </Link>

                <div className="min-w-10 max-w-80 sm:max-w-130 flex-1 max gap-1 sm:gap-3 flex border rounded-2xl">
                    <input type="text" 
                        title="Search a song"
                        placeholder="Search"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        onKeyUp={e => e.key === "Enter" && router.push(`/search/${searchMode}?query=${search}`)}
                        className="pl-5 min-w-5 flex-1 rounded-l-2xl"
                    />

                    <button className="my-2 px-1 bg-foreground text-background hover:bg-(--red-clr) hover:text-white"
                        onClick={_ => setSearchMode(p => p === "local" ? "online" : "local")}
                        title={`Is set to ${searchMode} search`}
                    >
                        {capsWord(searchMode)}
                    </button>

                    <Link href={`/search/${searchMode}?query=${search}`}
                        className="w-[10%] max-w-20 min-w-7 flex justify-center items-center rounded-r-2xl text-foreground hover:bg-(--light-gray-clr) bg-(--gray-clr)"
                    >
                        <SearchIcon className="w-7 h-7" />
                    </Link>
                </div>

                <div>
                    <MenuIcon className="w-10 h-10 sm:hidden" />
                    <p className="hidden sm:block">Something here</p>
                </div>
            </div>
        </nav>
    )
}