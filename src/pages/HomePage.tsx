"use client"

import { useEffect, useState, useCallback } from "react"
import PostCard from "@/components/post-card.tsx"
import ProjectCard from "@/components/project-card.tsx"
import SuggestedConnections from "@/components/suggested-connections.tsx"
import NewPost from "@/components/new-post.tsx"
import NewProject from "@/components/new-project.tsx"
import useInitStore from "@/store/initStore"
import {
    fetchForYouPosts,
    fetchProjectRecommendations,
    fetchSuggestedConnectionsForUser,
    projectResSchema
} from "@/api/feedClient"
import { postResSchema } from "@/api/postClient"
import type { z } from "zod"
import { getStompClient} from "@/hooks/useClient.ts"
type Post = z.infer<typeof postResSchema>
type Project = z.infer<typeof projectResSchema>
type Connection = {
    username: string
    email: string
    profile_pic: string
}
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert.tsx"
import { Client, IMessage } from "@stomp/stompjs"
import SockJS from "sockjs-client"
import { Terminal } from "lucide-react"


const POLLING_INTERVAL = 5 * 60 * 1000 // 5 minutes in milliseconds


interface Notification{
    message: string;
}
export default function HomePage() {
    const { username ,user_email} = useInitStore()
    
    const [posts, setPosts] = useState<Post[]>([])
    const [projects, setProjects] = useState<Project[]>([])
    const [friends, setFriends] = useState<Connection[]>([])
    
    const [isLoadingPosts, setIsLoadingPosts] = useState(true)
    const [isLoadingProjects, setIsLoadingProjects] = useState(true)
    const [isLoadingFriends, setIsLoadingFriends] = useState(true)
    const [notification, setNotification] = useState<Notification | null>(null)
    const [showNotification, setShowNotification] = useState(false)

    
    const [error, setError] = useState<string | null>(null)

        useEffect(() => {
                if (!user_email) return;
                const stomp = getStompClient();
                let sub: any;
                const interval = setInterval(() => {
                        if (!stomp.connected) return;
                        sub = stomp.subscribe(`/queue/user/notifications/${username}`, (message) => {
                                console.log("📥 Notification received on /queue/user/notifications/" + message + "body " + message.body);
        
            
                                setNotification({
                                        message: message.body,
                                });
                                setShowNotification(true);
                        });
                        clearInterval(interval);
                }, 100);
                return () => {
                        clearInterval(interval);
                        if (sub) sub.unsubscribe();
                };
        }, [user_email, username]);

        // Auto-hide notification after 5 seconds
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
        if (!username) return

        try {
            // Fetch posts
            setIsLoadingPosts(true)
            const postsData = await fetchForYouPosts(username)
            setPosts(postsData)
        } catch (err) {
            console.error("Failed to fetch posts:", err)
            setError("Failed to load posts")
        } finally {
            setIsLoadingPosts(false)
        }

        try {
            // Fetch projects
            setIsLoadingProjects(true)
            const projectsData = await fetchProjectRecommendations(username)
            setProjects(projectsData)
        } catch (err) {
            console.error("Failed to fetch projects:", err)
            setError("Failed to load projects")
        } finally {
            setIsLoadingProjects(false)
        }

        try {
            // Fetch suggested connections
            setIsLoadingFriends(true)
            const friendsData = await fetchSuggestedConnectionsForUser(username)
            setFriends(friendsData as Connection[])
        } catch (err) {
            console.error("Failed to fetch connections:", err)
            setError("Failed to load suggested connections")
        } finally {
            setIsLoadingFriends(false)
        }
    }, [username])

    // Initial fetch and polling combined
    useEffect(() => {
        // Fetch immediately on mount
        fetchAllData()

        // Then poll every 5 minutes
        const intervalId = setInterval(() => {
            console.log("🔄 Polling - fetching updated data...")
            fetchAllData()
        }, POLLING_INTERVAL)

        // Cleanup interval on unmount
        return () => clearInterval(intervalId)
    }, [fetchAllData])

    const renderPosts = () => {
        if (isLoadingPosts) {
            return (
                <div className="space-y-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 animate-pulse">
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
                    ))}
                </div>
            )
        }

        if (posts.length === 0) {
            return (
                <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8 text-center">
                    <p className="text-gray-300 text-lg">No posts available yet.</p>
                    <p className="text-gray-400 text-sm mt-2">Start following people to see their posts!</p>
                </div>
            )
        }

        return (
            <div className="space-y-6">
                {posts.map((post) => (
                    <PostCard key={post.postId} post={post} />
                ))}
            </div>
        )
    }

    const renderProjects = () => {
        if (isLoadingProjects) {
            return (
                <div className="space-y-6">
                    {[1, 2].map((i) => (
                        <div key={i} className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden animate-pulse">
                            <div className="h-48 bg-gray-700"></div>
                            <div className="p-5 space-y-3">
                                <div className="h-5 bg-gray-700 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-700 rounded w-full"></div>
                                <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                            </div>
                        </div>
                    ))}
                </div>
            )
        }

        if (projects.length === 0) {
            return (
                <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8 text-center">
                    <p className="text-gray-300 text-lg">No project recommendations available yet.</p>
                    <p className="text-gray-400 text-sm mt-2">Check back later for exciting projects!</p>
                </div>
            )
        }

        return (
            <div className="space-y-6">
                {projects.map((project) => (
                    <ProjectCard
                        key={project.id}
                        id={project.id}
                        title={project.title}
                        description={project.description}
                        image={project.media[0] || "/placeholder.svg"}
                        tags={project.techRequirements}
                    />
                ))}
            </div>
        )
    }

    const renderConnections = () => {
        if (isLoadingFriends) {
            return (
                <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-3 animate-pulse">
                                <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-gray-700 rounded w-1/3"></div>
                                    <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )
        }

        if (friends.length === 0) {
            return (
                <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8 text-center">
                    <p className="text-gray-300 text-lg">No suggested connections available.</p>
                    <p className="text-gray-400 text-sm mt-2">We'll recommend people you might know!</p>
                </div>
            )
        }

        return (
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                <div className="space-y-2">
                    {friends.map((connection) => (
                        <SuggestedConnections key={connection.username} connection={connection} />
                    ))}
                </div>
            </div>
        )
    }





    return (
        <div className="space-y-8">
            {/* Notification Alert */}
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
            {error && (
                <div className="bg-red-900/30 border border-red-500 text-red-400 px-4 py-3 rounded-lg backdrop-blur-sm">
                    {error}
                </div>
            )}

            {/* Create Post and Project Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <NewPost />
                <NewProject />
            </div>

            {/* Recent Posts */}
            <section>
                <h2 className="text-3xl font-bold mb-6 text-white bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">For You</h2>
                {renderPosts()}
            </section>

            {/* Recommended Projects */}
            <section>
                <h2 className="text-3xl font-bold mb-6 text-white bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Recommended Projects</h2>
                {renderProjects()}
            </section>

            {/* Suggested Connections */}
            <section>
                <h2 className="text-3xl font-bold mb-6 text-white bg-gradient-to-r from-green-400 to-teal-500 bg-clip-text text-transparent">Suggested Connections</h2>
                {renderConnections()}
            </section>
        </div>
    )
}
