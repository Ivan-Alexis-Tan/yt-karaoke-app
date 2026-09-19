"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { searchVideosLocal, searchVideosOnline } from "@/src/api/videosApi";
import { SearchMode } from "@/src/types/states";
import { capsWord } from "@/src/utils/helpers";

import useCurrentVideo, { searchKeySelector, updateSearchKeySelector, updateVideoListSelector, videoListSelector } from "@/src/utils/useCurrentVideo";

import KaraokeVideoCard from "@/src/components/KaraokeVideoCard";
import Spinner from "@/src/components/Spinner";
import SearchIcon from "@/src/svgs/SearchIcon";

type VideoSearchProps = {
    className?: string
}

export default function VideoSearch({ className }: VideoSearchProps) {
    const [search, setSearch] = useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [searchMode, setSearchMode] = useState<SearchMode>("local")

    const videoList = useCurrentVideo(videoListSelector)
    const searchKey = useCurrentVideo(searchKeySelector)
    const updateVideoList = useCurrentVideo(updateVideoListSelector)
    const updateSearchKey = useCurrentVideo(updateSearchKeySelector)

    useEffect(() => {
        if (!search || searchMode === "online") return
        setIsLoading(true)
        updateSearchKey(search)

        async function fetchVideos() {
            const fetched = await searchVideosLocal(search)
            
            if (isLoading) {
                updateVideoList(fetched)
                setIsLoading(false)
            };
        }

        fetchVideos()
    }, [search])

    async function fetchOnline() {
        setIsLoading(true)
        const fetched = await searchVideosOnline(search)
        
        updateVideoList(fetched)
        updateSearchKey(search)
        setSearchMode("local")
        setIsLoading(false)
    }

    return (
        <div className={`${className ?? ""} flex flex-col lg:overflow-auto`}>
            <SearchBar className="mb-3"
                search={search} 
                setSearchFn={setSearch} 
                searchMode={searchMode} 
                setSearchModeFn={setSearchMode}
                searchOnlineFn={fetchOnline}
                searchKey={searchKey}
            />

            {isLoading
                ? <CenterText text={<Spinner />} />
                : (
                    search === "" && videoList.length === 0
                        ? <CenterText text={`Search song ${searchMode === "local" ? "on local" : searchMode}`} />
                        : (
                            videoList.length >= 1
                                ? <div className="mr-5">
                                    <p>{capsWord(searchMode)} search results:</p>
                                    {videoList.map(vid => (
                                        <KaraokeVideoCard key={vid.video_id}
                                            video_id={vid.video_id}
                                            video_title={vid.video_title}
                                            channel_id={vid.channel_id}
                                            channel_title={vid.channel_title}
                                            thumbnail_url={vid.thumbnail_url}
                                            thumbnail_height={vid.thumbnail_height}
                                            thumbnail_width={vid.thumbnail_width}
                                            duration_sec={vid.duration_sec as number}
                                        />
                                    ))}
                                </div>
                                : (
                                    searchMode === "local"
                                        ? <CenterText text={`"${search}" not found`} />
                                        : <CenterText text={`Pressing "Enter" to start searching`} />
                                )
                        )
                )
            }
        </div>
    )
} 

const CenterText = ({ text }: { text: React.ReactNode }) => {
        return (
        <div className="h-full flex justify-center items-center">
            <h3 className="text-2xl">{text}</h3>
        </div>
    )
}

type SearchBarProp = {
    search: string
    setSearchFn: Dispatch<SetStateAction<string>>
    setSearchModeFn: Dispatch<SetStateAction<SearchMode>>
    searchMode: SearchMode
    searchOnlineFn: () => void
    searchKey: string
    className?: string
}

const SearchBar = ({ 
    search,
    setSearchFn,
    setSearchModeFn, 
    searchMode,
    searchOnlineFn,
    searchKey,
    className
}: SearchBarProp) => {
    const isLocalSearch = searchMode === "local"

    return (
        <div className={`${className ?? ""} w-full pr-5 flex gap-2 items-center`}>
            <button className="w-13 my-2 px-1 bg-foreground text-background hover:bg-(--red-clr) hover:text-white transition-colors"
                onClick={_ => setSearchModeFn(p => p === "local" ? "online" : "local")}
                title={`Is set to ${searchMode} search`}
            >
                {capsWord(searchMode)}
            </button>
            
            <button className={`${!isLocalSearch && "hover:bg-foreground hover:text-background rounded"} px-2`} 
                disabled={isLocalSearch}
                onClick={searchOnlineFn}
            >
                <SearchIcon className="w-7 h-7" />
            </button>

            {isLocalSearch
                ? <input type="text" 
                    title="Local search"
                    placeholder={`${searchKey !== "" ? searchKey : "Local search"}`}
                    value={search}
                    onChange={e => setSearchFn(e.target.value)}
                    className="flex-1 mr-5 px-2 border-b"
                />
                : <input type="text" 
                    placeholder={`${searchKey !== "" ? searchKey : "Online search"}`}
                    value={search}
                    onChange={e => setSearchFn(e.target.value)}
                    onKeyUp={e => {
                        if (e.key !== "Enter") return
                        searchOnlineFn()
                    }}
                    className="flex-1 mr-5 px-2 border-b"
                />
            }
        </div>
    )
}