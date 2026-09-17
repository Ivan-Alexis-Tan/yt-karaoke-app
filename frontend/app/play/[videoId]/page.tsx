import KaraokePlayer from "./KaraokePlayer"
import { cacheToHistory, getRandomVideos, getVideo } from "@/src/api/videosApi";
import ShowVideos from "@/app/ShowVideos";
import MainPlayer from "./MainPlayer";

type PlayerPageProps = {
    params: Promise<{videoId: string}>
}

export default async function PlayerPage({ params }: PlayerPageProps) {
    const videoId = (await params).videoId;
    const videoDetails = await getVideo(videoId)
    const randomVideos = await getRandomVideos()
    await cacheToHistory(videoId)

    return (
        <div className="h-[calc(100vh-75px)] sm:h-[calc(100vh-87px)] md:sm:h-[calc(100vh-75px)]">
            <MainPlayer 
                videoId={videoId}
                videoList={randomVideos}
                className="h-full"
            />
        </div>
    )
}