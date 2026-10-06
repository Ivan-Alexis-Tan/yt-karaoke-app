export default async function CurrentUserSkeleton() {
    return (
        <div className="flex flex-col gap-3 border">
            <div className="mx-auto min-w-35 min-h-35 rounded-full bg-(--gray-clr)" />

            <div className="min-w-0 w-full *:mb-2">
                <div className="mx-auto min-w-0 max-w-50 w-full h-5 bg-(--gray-clr) rounded-full" />
                <div className="mx-auto min-w-0 max-w-70 w-full h-5 bg-(--gray-clr) rounded-full" />
            </div>
        </div>
    )
}