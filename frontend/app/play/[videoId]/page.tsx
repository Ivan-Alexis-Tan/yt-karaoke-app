import { cacheToHistory, getRandomVideos } from "@/src/api/videosApi";
import MainPlayer from "./MainPlayer";

type PlayerPageProps = {
    params: Promise<{videoId: string}>
}

export default async function PlayerPage({ params }: PlayerPageProps) {
    const videoId = (await params).videoId;
    const randomVideos = await getRandomVideos()
    await cacheToHistory(videoId)

    return (
        <div className="lg:h-[calc(100vh-75px)]">
            <MainPlayer 
                videoId={videoId}
                videoList={randomVideos}
                className="h-full"
            />
        </div>
    )
}