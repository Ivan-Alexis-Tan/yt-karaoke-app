export default function VideoCardSkeleton({ className }: { className?: string }) {
    return (
        <div className={className ?? ""}>
            <div className="karaoke-video-card gap-3 p-2 grid items-center">
                <div className="w-full min-h-0 h-40 sm:h-50 relative">
                    <div className="w-full h-full bg-[hsla(218,12%,64%,0.3)] text-[hsla(218,12%,64%,0.3)] rounded-2xl"/>
                </div>

                <div className="m-1.5 gap-1 flex flex-col justify-center text-white  *:text-ellipsis *:overflow-hidden">
                    <h3 className="h-5 mb-1 font-bold bg-[hsla(218,12%,64%,0.3)] text-[hsla(218,12%,64%,0.3)] rounded"></h3>
                    <p className="h-5 w-[50%] bg-[hsla(218,12%,64%,0.3)] text-[hsla(218,12%,64%,0.3)] rounded"></p>
                </div>
            </div>
        </div>
    )
}