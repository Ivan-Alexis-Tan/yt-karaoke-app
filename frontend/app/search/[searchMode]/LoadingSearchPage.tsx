"use client";

import Spinner from "@/src/components/Spinner";
import { useParams } from "next/navigation";

export default function LoadingSearchPage({ className }: { className?: string }) {
    const { searchMode } = useParams()

    return (
        <div className={className ?? ""}>
            <Spinner />
            <h2 className="text-2xl">Loading {`${searchMode}`} search results...</h2>
        </div>
    )
}