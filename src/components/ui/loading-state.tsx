interface LoadingStateProps {
    type?: "post" | "project" | "list" | "card";
    count?: number;
}

export function LoadingState({ type = "post", count = 3 }: LoadingStateProps) {
    return (
        <div className="space-y-6">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i}>
                    {type === "post" && <PostSkeleton />}
                    {type === "project" && <ProjectSkeleton />}
                    {type === "list" && <ListSkeleton />}
                    {type === "card" && <CardSkeleton />}
                </div>
            ))}
        </div>
    );
}

function PostSkeleton() {
    return (
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 animate-pulse">
            <div className="flex gap-4 mb-4">
                <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-700 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-700 rounded w-1/6"></div>
                </div>
            </div>
            <div className="space-y-2">
                <div className="h-4 bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-700 rounded w-5/6"></div>
            </div>
        </div>
    );
}

function ProjectSkeleton() {
    return (
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-700"></div>
            <div className="p-5 space-y-3">
                <div className="h-5 bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-700 rounded w-5/6"></div>
            </div>
        </div>
    );
}

function ListSkeleton() {
    return (
        <div className="flex items-center gap-3 animate-pulse p-4">
            <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
            <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-700 rounded w-1/3"></div>
                <div className="h-3 bg-gray-700 rounded w-1/2"></div>
            </div>
        </div>
    );
}

function CardSkeleton() {
    return (
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 animate-pulse">
            <div className="space-y-3">
                <div className="h-5 bg-gray-700 rounded w-2/3"></div>
                <div className="h-4 bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-700 rounded w-4/5"></div>
            </div>
        </div>
    );
}
