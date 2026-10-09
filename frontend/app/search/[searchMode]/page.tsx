// Next.js
import { Suspense } from "react";
import { auth } from "@/auth";
import { Session } from "next-auth";

// Utils
import { searchVideosLocal, searchVideosOnline } from "@/src/api/videosApi";
import { capsWord } from "@/src/utils/helpers";
import { getCurrentUser } from "@/src/api/auth";

// Types
import { SearchMode } from "@/src/types/states";

// Components
import SaveSearchResult from "./SaveSearchResult";
import LoadingSearchPage from "./LoadingSearchPage";
import KaraokeVideoCard from "@/src/components/KaraokeVideoCard";

type SearchPageProps = {
    searchParams: Promise<{query: string}>
    params: Promise<{searchMode: SearchMode}>
}

export default async function SearchPage({ searchParams, params }: SearchPageProps) {
    const { searchMode } = await params;
    const { query } = await searchParams;
    const session = await auth()

    return (
        <Suspense key={searchMode + query} 
            fallback={<LoadingSearchPage 
                className="adapt-vh-scrn mx-5 flex flex-col justify-center items-center" 
            />}
        >
            <SearchResults searchMode={searchMode} query={query} session={session as Session} />
        </Suspense>
    )
}

const SearchResults = async ({ searchMode, query, session }: { 
    searchMode: SearchMode, 
    query: string,
    session: Session
}) => {
    async function generateSearch(): Promise<VideoListResponse> {
        if (searchMode === "local") return await searchVideosLocal(query);

        return await searchVideosOnline(query)
    }

    const searchResults = await generateSearch()
    const currentUser = await getCurrentUser(session)
    
    return (
        <div className={`mx-5 mb-5 flex flex-col justify-center`}>
            <p className="my-5 text-xl">{capsWord(searchMode)} search results:</p>
            
            {/* Caches search result */}
            <SaveSearchResult 
                searchkey={query}
                searchResultList={searchResults}
            />

            {/* Video Cards */}
            {searchResults.length >= 1
                ? <div className="mx-auto max-w-250">
                    {searchResults.map(vid => (
                        <KaraokeVideoCard key={vid.video_id}
                            video_details={vid}
                            currentUser={currentUser}
                            className="[&_a]:grid-cols-1 sm:[&_a]:grid-cols-2"
                        />
                    ))}
                </div>
                : <p className="text-2xl text-center">No song "{query}" found</p>
            }
        </div>
    )
}