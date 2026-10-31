"use client";

// Next.js
import { Dispatch, SetStateAction, use, useState } from "react";

// Types
import { SearchMode } from "@/src/types/states";

// Api fetch function, useHook and other helper functions
import { searchVideosLocal, searchVideosOnline } from "@/src/api/videosApi";
import { capsWord } from "@/src/utils/helpers";
import useCurrentVideo, { 
    searchKeySelector, 
    updateSearchKeySelector, 
    updateVideoListSelector, 
    videoListSelector 
} from "@/src/utils/useCurrentVideo";

// Components
import Spinner from "@/src/components/Spinner";
import SearchIcon from "@/src/svgs/SearchIcon";
import PaginatedVideoCards from "@/src/components/PaginatedVideoCards";
import CloseIcon from "@/src/svgs/CloseIcon";

type VideoSearchProps = {
    currentUserPromise: Promise<CurrentUserResponse> | CurrentUserResponse | null
    className?: string
}

export default function VideoSearch({ className, currentUserPromise }: VideoSearchProps) {
    const currentUser = currentUserPromise instanceof Promise ? use(currentUserPromise) : currentUserPromise
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
                ? <CenterText>
                    <Spinner />
                </CenterText>
                : <>
                    {videoList.length >= 1
                        && <div className="player-video-karaoke">
                            <p>{capsWord(searchMode)} search results:</p>

                            <PaginatedVideoCards
                                videoList={videoList}
                                currentUser={currentUser}
                                className="mx-auto max-w-200 lg:max-w-"
                            />
                        </div>
                    }

                    {search === "" && searchKey === "" && videoList.length === 0
                        && <CenterText>
                            <h3>Search song {searchMode === "local" ? "on local" : searchMode}</h3>
                        </CenterText>
                    }

                    {search !== "" && searchKey === "" && videoList.length === 0 
                        && <CenterText>
                            <h3>Press Enter</h3>
                        </CenterText>
                    }

                    {searchKey !== "" && videoList.length === 0
                        && <CenterText>
                            <h3>No "{searchKey}" found.</h3>
                            <p><i>Try online search.</i></p>
                        </CenterText>
                    }
                </>
            }
        </div>
    )
} 

const CenterText = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="h-full flex flex-col justify-center items-center [&>h3]:text-2xl">
            {children}
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
        <div className={`${className ?? ""} w-full flex gap-2 items-center justify-center`}>
            <button className="w-13 my-2 px-1 bg-foreground text-background hover:bg-(--red-clr) hover:text-white transition-colors"
                onClick={_ => setSearchModeFn(p => p === "local" ? "online" : "local")}
                title={`Is set to ${searchMode} search`}
            >
                {capsWord(searchMode)}
            </button>
            
            <div className="player-search-bar min-w-0 max-w-120 py-1 flex-1 flex items-center [&:has(>input:focus)]:border-(--red-clr) border border-(--light-gray-clr) rounded-2xl">
                <input type="text" 
                    title="Local search"
                    placeholder={searchKey !== "" ? searchKey : `${capsWord(searchMode)} search`}
                    value={search}
                    onChange={e => setSearchFn(e.target.value)}
                    onKeyUp={e => {
                        if (e.key !== "Enter") return
                        fetchVideos()
                    }}
                    className="min-w-0 px-2 flex-1"
                />

                {search !== ""
                    && <button className="hover:text-(--red-clr) rounded"
                        onClick={_ => setSearchFn("")}
                    >
                        <CloseIcon className="w-7 h-7" />
                    </button>
                }

                <button className={`m-1 px-1 hover:bg-foreground hover:text-background rounded`}
                    onClick={fetchVideos}
                    title="Search"
                >
                    <SearchIcon className="w-7 h-7" />
                </button>
            </div>
        </div>
    )
}