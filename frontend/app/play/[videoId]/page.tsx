import KaraokePlayer from "./KaraokePlayer"
import { cacheToHistory, getRandomVideos, getVideo } from "@/src/api/videosApi";
import ShowVideos from "@/app/ShowVideos";
import MainPlayer from "./MainPlayer";

type PlayerPageProps = {
    params: Promise<{videoId: string}>
}

export default async function PlayerPage({ params }: PlayerPageProps) {
    const videoId = (await params).videoId;
    const videoDetails = await (await getVideo(videoId)).json()
    const randomVideos = await (await getRandomVideos()).json()
    // await cacheToHistory(videoId)

    console.log(`videoDetails =`, videoDetails)
    return (
        <div>
            <MainPlayer 
                videoId={videoId}
                videoList={randomVideos} 
            />
        </div>
    )
}