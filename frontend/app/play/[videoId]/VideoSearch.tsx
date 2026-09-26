"use client";

import { Dispatch, SetStateAction, useState } from "react";

import { searchVideosLocal, searchVideosOnline } from "@/src/api/videosApi";
import { SearchMode } from "@/src/types/states";
import { capsWord } from "@/src/utils/helpers";

import useCurrentVideo, { 
    searchKeySelector, 
    updateSearchKeySelector, 
    updateVideoListSelector, 
    videoListSelector 
} from "@/src/utils/useCurrentVideo";

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

    async function fetchVideos() {
        if (!search) return

        setIsLoading(true)
        let fetched

        try {
            if (searchMode === "local") {
                fetched = await searchVideosLocal(search)
            }
            else {
                fetched = await searchVideosOnline(search)
            }
        }
        catch(e) { 
            console.error(e) 
        }
        finally {
            updateVideoList(fetched as VideoListResponse)
            updateSearchKey(search)
            setSearchMode("local")
            setIsLoading(false)
        }
    }

    return (
        <div className={`${className ?? ""} relative flex flex-col lg:overflow-auto`}>
            <SearchBar className="mb-3 sticky top-17 sm:top-21 md:top-17 lg:top-0 z-(--z-sticky) bg-background"
                search={search} 
                setSearchFn={setSearch} 
                searchMode={searchMode} 
                setSearchModeFn={setSearchMode}
                fetchVideos={fetchVideos}
                searchKey={searchKey}
            />

            {isLoading
                ? <CenterText text={<Spinner />} />
                : (
                    search === "" && videoList.length === 0
                        ? <CenterText text={`Search song ${searchMode === "local" ? "on local" : searchMode}`} />
                        : (
                            videoList.length >= 1
                                ? <div className="player-video-karaoke">
                                    <p>{capsWord(searchMode)} search results:</p>

                                    {videoList.map(vid => (
                                        <KaraokeVideoCard key={vid.video_id}
                                            video_details={vid}
                                            className="mx-auto max-w-200 lg:max-w-"
                                        />
                                    ))}
                                </div>
                                : <CenterText text={`Pressing "Enter" to start searching`} />
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
    fetchVideos: () => void
    searchKey: string
    className?: string
}

const SearchBar = ({ 
    search,
    setSearchFn,
    setSearchModeFn, 
    searchMode,
    fetchVideos,
    searchKey,
    className
}: SearchBarProp) => {
    return (
        <div className={`${className ?? ""} w-full pr-5 flex gap-2 items-center`}>
            <button className="w-13 my-2 px-1 bg-foreground text-background hover:bg-(--red-clr) hover:text-white transition-colors"
                onClick={_ => setSearchModeFn(p => p === "local" ? "online" : "local")}
                title={`Is set to ${searchMode} search`}
            >
                {capsWord(searchMode)}
            </button>
            
            <button className={`hover:bg-foreground hover:text-background rounded px-2`}
                onClick={fetchVideos}
            >
                <SearchIcon className="w-7 h-7" />
            </button>

            <input type="text" 
                title="Local search"
                placeholder={searchKey !== "" ? searchKey : `${capsWord(searchMode)} search`}
                value={search}
                onChange={e => setSearchFn(e.target.value)}
                onKeyUp={e => {
                    if (e.key !== "Enter") return
                    fetchVideos()
                }}
                className="min-w-0 flex-1 px-2 border-b"
            />
        </div>
    )
}