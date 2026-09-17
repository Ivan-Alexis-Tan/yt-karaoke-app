import { searchVideosLocal, searchVideosOnline } from "@/src/api/videosApi";
import { bannedChannels } from "@/src/appData";
import { capsWord, formatMinutesSeconds } from "@/src/utils/helpers";
import Image from "next/image";
import Link from "next/link";

type SearchPageProps = {
    searchParams: Promise<{query: string}>
    params: Promise<{searchMode: SearchMode}>
}

export default async function SearchPage({ searchParams, params }: SearchPageProps) {
    const { searchMode } = await params;
    const { query } = await searchParams;

    async function generateSearch(): Promise<VideoListResponse> {
        if (searchMode === "local") return await searchVideosLocal(query);

        return await searchVideosOnline(query)
    }

    const searchResults = await generateSearch()

    return (
        <div className="mx-5 flex flex-col justify-center">
            <p className="my-5 text-xl">{capsWord(searchMode)} search results:</p>
            {searchResults.map(vid => (
                <Link key={vid.video_id}
                    href={`/play/${vid.video_id}`}
                    className={`${bannedChannels.includes(vid.channel_title) && "hidden"} mx-auto max-h-90 max-w-300 w-full p-2 gap-3 grid grid-cols-[minmax(160px,0.7fr)_minmax(100,1.3fr)] items-center rounded-2xl hover:bg-(--gry-700)`}
                >
                    <div className="relative">
                        <Image className="max-h-fit h-full rounded-2xl" 
                            src={vid.thumbnail_url}
                            width={vid.thumbnail_width}
                            height={vid.thumbnail_height}
                            alt="video-thumbnail"
                        />
                        <div className="px-1 absolute bottom-3 right-3 bg-(--lucent-blk-clr)">
                            {vid.duration_sec as number && formatMinutesSeconds(vid.duration_sec as number)}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold mb-3">{vid.video_title}</h3>
                        <p>{vid.channel_title}</p>
                    </div>
                </Link>
            ))}
        </div>
    )
}