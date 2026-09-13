import Link from "next/link"
import { formatMinutesSeconds } from "../utils/helpers"
import Image from "next/image"

export type KaraokeVideoCardType = {
    video_id: string
    video_title: string
    channel_id: string
    channel_title: string
    thumbnail_url: string
    thumbnail_width: number
    thumbnail_height: number
    duration_sec: number
}

export default function KaraokeVideoCard({
    video_id,
    video_title,
    channel_id,
    channel_title,
    thumbnail_url,
    thumbnail_height,
    thumbnail_width,
    duration_sec,
}: KaraokeVideoCardType) {
    const durationInMinutes = formatMinutesSeconds(duration_sec)

    return (
        <Link className="p-1 max-w-130 flex flex-col gap-3 mb-5 rounded-2xl hover:bg-(--gry-700) transition-all"
            href={`play/${video_id}`}
        >
            <div className="relative">
                <Image className="w-full rounded-2xl" 
                    src={thumbnail_url} alt="video thumbnail" 
                    width={thumbnail_width} height={thumbnail_height} 
                />

                <div className="px-0.5 absolute bottom-3 right-3 bg-(--lucent-blk-clr)">
                    {durationInMinutes}
                </div>
            </div>

            <div className="m-1.5 gap-1 flex flex-col justify-center text-white">
                <h3 className="text-xl font-bold">{video_title}</h3>
                <p>{channel_title}</p>
            </div>
        </Link>
    )
}