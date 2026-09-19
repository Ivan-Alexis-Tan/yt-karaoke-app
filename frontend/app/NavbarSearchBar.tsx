"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react"
import Link from "next/link";

import { SearchMode } from "@/src/types/states";

import { capsWord } from "@/src/utils/helpers";

import SearchIcon from "@/src/svgs/SearchIcon";

type NavbarSearchBarProps = {
    className?: string
}

export default function NavbarSearchBar({ className }: NavbarSearchBarProps) {
    const [search, setSearch] = useState("")
    const [searchMode, setSearchMode] = useState<SearchMode>("local")
    
    const router = useRouter()
    const path = usePathname()

    useEffect(() => setSearchMode("local"), [path])
    
    return (
        <div className={`${className ?? ""} min-w-10 max-w-80 sm:max-w-130 flex-1 max gap-1 sm:gap-3 flex border rounded-2xl`}>
            <input type="text" 
                title="Search a song"
                placeholder="Search"
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyUp={e => e.key === "Enter" && router.push(`/search/${searchMode}?query=${search}`)}
                className="pl-5 min-w-5 flex-1 rounded-l-2xl"
            />

            <button className="my-2 px-1 bg-foreground text-background hover:bg-(--red-clr) hover:text-white transition-colors"
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
    )
}