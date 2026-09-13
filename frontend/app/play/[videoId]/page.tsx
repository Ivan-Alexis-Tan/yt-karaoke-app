import { BASE_URL } from "@/src/utils/helpers";
import KaraokePlayer from "./KaraokePlayer"
import { cacheToHistory, getVideo } from "@/src/api/videosApi";

type PlayerPageProps = {
    params: Promise<{videoId: string}>
}

export default async function PlayerPage({ params }: PlayerPageProps) {
    const videoId = (await params).videoId;
    const videoDetails = await (await getVideo(videoId)).json()
    await cacheToHistory(videoId)

    console.log(`videoDetails =`, videoDetails)
    return (
        <div>
            <KaraokePlayer className=""
                videoId={videoId}
            />
        </div>
    )
}