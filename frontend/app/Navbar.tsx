import SearchIcon from "@/src/svgs/SearchIcon";
import Link from "next/link";

export default function Navbar({ className }: { className?: string }) {
    return (
        <nav className={`${className ?? ""} flex justify-between items-center`}>
            <Link href={"/"}
                className="text-(--red-clr) hover:text-foreground"
            >
                <h2 className="text-2xl font-bold">YT Karaoke App</h2>
            </Link>

            <div className="w-[40%] flex border rounded-2xl">
                <input type="text" 
                    title="Search a song"
                    placeholder="Search"
                    className="pl-5 flex-1 rounded-l-2xl"
                />

                <button className="pl-3 w-20 rounded-r-2xl text-foreground hover:bg-(--light-gray-clr) bg-(--gray-clr)">
                    <SearchIcon className="w-10 h-10" />
                </button>
            </div>

            <div>
                <p>Something here</p>
            </div>
        </nav>
    )
}