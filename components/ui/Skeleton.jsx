export default function Skeleton({ className = '' }) {
    return (
        <span className={`inline-block bg-slate-200 rounded animate-pulse ${className}`} />
    );
}