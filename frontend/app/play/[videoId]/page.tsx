import { BASE_URL } from "@/src/utils/helpers";
import KaraokePlayer from "./KaraokePlayer"

type PlayerPageProps = {
    params: Promise<{videoId: string}>
}

export default async function PlayerPage({ params }: PlayerPageProps) {
    const videoId = (await params).videoId;
    const videoDetails = await (await fetch(`${BASE_URL}/videos/${videoId}`)).json()

    console.log(`videoDetails =`, videoDetails)
    return (
        <div>
            <KaraokePlayer className=""
                videoId={videoId}
            />
        </div>
    )
}