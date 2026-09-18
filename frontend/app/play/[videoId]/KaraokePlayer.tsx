"use client";

type KaraokePlayerProps = {
    videoId: string
    className?: string
}


export default function KaraokePlayer({ videoId, className }: KaraokePlayerProps) {
    return (
        <div className={`${className ?? ""}`}>
            <iframe src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                allow="autoplay"
                allowFullScreen
                className="max-h-130 w-full aspect-video"
            ></iframe>
        </div>
    )
}