export default function TriangleArrowRightIcon({ className, title }: { className?: string, title?: string }) {
    return (
        <svg className={className ?? ""} xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor">
            {title && <title>{title}</title>}
            <path d="M400-280v-400l200 200-200 200Z"/>
        </svg>
    )
}