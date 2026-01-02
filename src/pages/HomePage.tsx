"use client"

import { useEffect, useState, useCallback } from "react"
import PostCard from "@/components/post-card"
import ProjectCard from "@/components/project-card"
import SuggestedConnections from "@/components/suggested-connections"
import NewPost from "@/components/new-post"
import NewProject from "@/components/new-project"
import useInitStore from "@/store/initStore"
import { fetchForYouPosts, fetchProjectRecommendations, fetchSuggestedConnectionsForUser } from "@/api/feedClient"
import { getStompClient } from "@/hooks/useClient"
import { PostResponseType } from "@/entities/Post"
import { ProjectResponseType } from "@/entities/Project"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal } from "lucide-react"
import { UserResponseType } from "@/entities/User"
import { LoadingState } from "@/components/ui/loading-state"
import { EmptyState } from "@/components/ui/empty-state"
import { ErrorMessage } from "@/components/ui/error-message"

const POLLING_INTERVAL = 5 * 60 * 1000

interface Notification {
    message: string;
}
export default function HomePage() {
    const { username, user_email } = useInitStore()
    
    const [posts, setPosts] = useState<PostResponseType[]>([])
    const [projects, setProjects] = useState<ProjectResponseType[]>([])
    const [friends, setFriends] = useState<UserResponseType[]>([])
    
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [notification, setNotification] = useState<Notification | null>(null)
    const [showNotification, setShowNotification] = useState(false)

        useEffect(() => {
                if (!user_email) return;
                const stomp = getStompClient();
                let sub: any;
                const interval = setInterval(() => {
            if (!stomp.connected) return;
            sub = stomp.subscribe(`/queue/user/notifications/${username}`, (message) => {
                setNotification({ message: message.body });
                setShowNotification(true);
            });
            clearInterval(interval);
        }, 100);
        
        return () => {
            clearInterval(interval);
            if (sub) sub.unsubscribe();
        };
    }, [user_email, username]);

    useEffect(() => {
        if (showNotification) {
            const timeout = setTimeout(() => {
                setShowNotification(false);
            }, 5000);
            return () => clearTimeout(timeout);
        }
    }, [showNotification]);

    // Fetch all data
    const fetchAllData = useCallback(async () => {
        if (!username) return;

        setLoading(true);
        setError(null);

        try {
            const [postsData, projectsData, friendsData] = await Promise.all([
                fetchForYouPosts(username),
                fetchProjectRecommendations(username),
                fetchSuggestedConnectionsForUser(username)
            ]);
            
            setPosts(postsData);
            setProjects(projectsData);
            setFriends(friendsData);
        } catch (err) {
            console.error("Failed to fetch data:", err);
            setError("Failed to load content");
        } finally {
            setLoading(false);
        }
    }, [username]);

    useEffect(() =>{
        fetchAllData();

        const intervalId = setInterval(() => {
            fetchAllData();
        }, POLLING_INTERVAL);

    
        return () => clearInterval(intervalId);
    }, [fetchAllData]);

    return (
        <div className="space-y-8">
            
            {notification && showNotification && (
                <Alert variant="default" className="flex items-start gap-4 relative">
                    <Terminal />
                    <div className="flex-1">
                        <AlertTitle>New Notification</AlertTitle>
                        <AlertDescription>{notification.message}</AlertDescription>
                    </div>
                    <button
                        onClick={() => setShowNotification(false)}
                        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                        aria-label="Dismiss notification"
                    >
                        ×
                    </button>
                </Alert>
            )}

            {/* Error Message */}
            {error && <ErrorMessage message={error} />}

            {/* Create Post and Project Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <NewPost />
                <NewProject />
            </div>

            {/* Recent Posts */}
            <section>
                <h2 className="text-3xl font-bold mb-6 text-white bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">For You</h2>
                {loading ? (
                    <LoadingState type="post" count={3} />
                ) : posts.length === 0 ? (
                    <EmptyState
                        icon="📝"
                        title="No posts available yet"
                        description="Start following people to see their posts!"
                    />
                ) : (
                    <div className="space-y-6">
                        {posts.map((post) => (
                            <PostCard key={post.postId} post={post} />
                        ))}
                    </div>
                )}
            </section>

            {/* Recommended Projects */}
            <section>
                <h2 className="text-3xl font-bold mb-6 text-white bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Recommended Projects</h2>
                {loading ? (
                    <LoadingState type="project" count={2} />
                ) : projects.length === 0 ? (
                    <EmptyState
                        icon="🚀"
                        title="No project recommendations yet"
                        description="Check back later for exciting projects!"
                    />
                ) : (
                    <div className="space-y-6">
                        {projects.map((project) => (
                            <ProjectCard project={project} key={project.id} />
                        ))}
                    </div>
                )}
            </section>

            {/* Suggested Connections */}
            <section>
                <h2 className="text-3xl font-bold mb-6 text-white bg-gradient-to-r from-green-400 to-teal-500 bg-clip-text text-transparent">Suggested Connections</h2>
                {loading ? (
                    <LoadingState type="list" count={3} />
                ) : friends.length === 0 ? (
                    <EmptyState
                        icon="👥"
                        title="No suggested connections"
                        description="We'll recommend people you might know!"
                    />
                ) : (
                    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                        <div className="space-y-2">
                            {friends.map((connection) => (  
                                <SuggestedConnections key={connection.username} connection={connection} />
                            ))}
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
}