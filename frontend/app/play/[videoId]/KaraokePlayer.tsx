"use client";

type KaraokePlayerProps = {
    videoId: string
    className?: string
}


export default function KaraokePlayer({ videoId, className }: KaraokePlayerProps) {
    return (
        <div className={`${className ?? ""}`}>
            <iframe src={`http://www.youtube.com/embed/${videoId}?autoplay=1`}
                allow="autoplay"
                allowFullScreen
                className="mb-5 max-h-130 w-full aspect-video"
            ></iframe>
        </div>
    )
}