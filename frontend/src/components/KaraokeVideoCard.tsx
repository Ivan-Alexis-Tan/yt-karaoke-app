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
}: KaraokeVideoCardType) {
    return (
        <div className="p-1 max-w-130 flex flex-col gap-3 mb-5 rounded-2xl hover:bg-gray-700 transition-all">
            <img className="w-full rounded-2xl" 
                src={thumbnail_url} alt="video thumbnail" 
                width={thumbnail_width} height={thumbnail_height} 
            />

            <div className="m-1.5 gap-1 flex flex-col justify-center text-white">
                <h3 className="text-xl font-bold">{video_title}</h3>
                <p>{channel_title}</p>
            </div>
        </div>
    )
}