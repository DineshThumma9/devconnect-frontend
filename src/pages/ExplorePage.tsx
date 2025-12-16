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
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">Explore Page</h1>
            <p className="text-gray-400">This is where users can explore content.</p>
            {trendingPosts.map((post) => (
                <PostCard  key={post.id} post={post} />
            ))}
        </div>
    )


}


export default ExplorePage;