import { cacheToHistory, getRandomVideos } from "@/src/api/videosApi";
import MainPlayer from "./MainPlayer";
import { getCurrentUser } from "@/src/api/auth";
import { auth } from "@/auth";

type PlayerPageProps = {
    params: Promise<{videoId: string}>
}

export default async function PlayerPage({ params }: PlayerPageProps) {
    const videoId = (await params).videoId;
    const session = await auth()
    const randomVideos = getRandomVideos()
    const currentUser = session ? getCurrentUser(session) : null
    // await cacheToHistory(videoId)

    return (
        <div className="lg:h-[calc(100vh-75px)]">
            <MainPlayer 
                videoId={videoId}
                videoList={randomVideos}
                currentUser={currentUser}
                className="h-full"
            />
        </div>
    )
}