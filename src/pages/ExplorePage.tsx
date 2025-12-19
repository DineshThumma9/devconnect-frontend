import { getTrendingPosts } from "@/api/feedClient";
import PostCard from "@/components/post-card";
import { PostResponseType } from "@/entities/Post";
import { ProjectResponseType } from "@/entities/Project";
import { useEffect, useState } from "react";



const ExplorePage = () => {



    


    const [trendingPosts, setTrendingPosts] = useState<Array<PostResponseType>>([]);
    const [trendingProjects, setTrendingProjects] = useState<Array<ProjectResponseType>>([]);
    


    useEffect(() => {
        fetchTrendingPosts();
    }, []);

    const fetchTrendingPosts = async () => {
            setTrendingPosts(await getTrendingPosts())
    };


    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                    <span className="text-teal-500">🔥</span>
                    Trending Posts
                </h1>
                <p className="text-gray-400 text-lg">Discover what's popular in the developer community</p>
            </div>

            {/* Posts Grid */}
            <div className="space-y-6">
                {trendingPosts.length === 0 ? (
                    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-12 text-center">
                        <p className="text-gray-300 text-lg mb-2">No trending posts yet</p>
                        <p className="text-gray-500 text-sm">Check back later for trending content</p>
                    </div>
                ) : (
                    trendingPosts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))
                )}
            </div>
        </div>
    )


}


export default ExplorePage;