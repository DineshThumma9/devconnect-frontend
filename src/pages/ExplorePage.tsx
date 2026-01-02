import { getTrendingPosts } from "@/api/feedClient";
import PostCard from "@/components/post-card";
import { PostResponseType } from "@/entities/Post";
import { useEffect, useState } from "react";
import { LoadingState } from "@/components/ui/loading-state";
import { EmptyState } from "@/components/ui/empty-state";
import PageHeader from "@/components/PageHeader";

const ExplorePage = () => {
    const [trendingPosts, setTrendingPosts] = useState<PostResponseType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTrendingPosts();
    }, []);

    const fetchTrendingPosts = async () => {
        try {
            setLoading(true);
            const posts = await getTrendingPosts();
            setTrendingPosts(posts);
        } catch (error) {
            console.error("Error fetching trending posts:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader
                icon="🔥"
                title="Trending Posts"
                description="Discover what's popular in the developer community"
            />

            {loading ? (
                <LoadingState type="post" count={3} />
            ) : trendingPosts.length === 0 ? (
                <EmptyState
                    icon="🔥"
                    title="No trending posts yet"
                    description="Check back later for trending content"
                />
            ) : (
                <div className="space-y-6">
                    {trendingPosts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ExplorePage;