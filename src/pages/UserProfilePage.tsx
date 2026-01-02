"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useParams, useNavigate } from "react-router-dom"
import ProjectCard from "@/components/project-card"
import ProfileSections from "@/components/profile-sections"
import { getProjectsByUser } from "@/api/projectClient"
import { getPostsByUser } from "@/api/postClient"
import PostCard from "@/components/post-card"
import { ProjectResponseType } from "@/entities/Project"
import { PostResponseType } from "@/entities/Post"
import useInitStore from "@/store/initStore"
import { UserResponseType } from "@/entities/User"
import { getFollowers, getFollowings } from "@/api/userClient"
import UserListItem from "@/components/UserListItem"
import { EmptyState } from "@/components/ui/empty-state"



export default function UserProfilePage() {
    const [activeTab, setActiveTab] = useState("overview")
    const { username: urlUsername } = useParams<{ username: string }>()
    const { username: loggedInUsername } = useInitStore()
    const navigate = useNavigate()

    
    const profileUsername = urlUsername || loggedInUsername
    const isOwnProfile = profileUsername === loggedInUsername

    const [userProjects, setUserProjects] = useState<ProjectResponseType[]>([]);
    const [userPosts, setUserPosts] = useState<PostResponseType[]>([]);
    const [followers, setFollowers] = useState<UserResponseType[]>([]);
    const [followings, setFollowings] = useState<UserResponseType[]>([]);


    useEffect(() => {
        if (profileUsername) {
            console.log("Fetching data for user:", profileUsername);
            getUserProjects();
            getUserPosts();
            getUserFollowers();
            getUserFollowings();
        }
    }, [profileUsername]);
    
    const getUserProjects = async () => {
        if (!profileUsername) return;
        try {
            const response = await getProjectsByUser(profileUsername);
            setUserProjects(response);
        } catch (error) {
            console.error("Error fetching projects:", error);
        }
    }

    const getUserPosts = async () => {
        if (!profileUsername) return;
        try {
            const response = await getPostsByUser(profileUsername);
            setUserPosts(response);
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    }

    const getUserFollowers = async () => {
        if (!profileUsername) return;
        try {
            const response = await getFollowers(profileUsername);
            setFollowers(response);
        } catch (error) {
            console.error("Error fetching followers:", error);
        }
    }

    const getUserFollowings = async () => {
        if (!profileUsername) return;
        try {
            const response = await getFollowings(profileUsername);
            setFollowings(response);
        } catch (error) {
            console.error("Error fetching followings:", error);
        }
    }
    return (
        <div className="space-y-6 -mx-4 sm:-mx-6 lg:-mx-8">
            <div className="w-full">
                {/* Profile Header */}
                {profileUsername && (
                    <ProfileSections isOwnProfile={isOwnProfile} profileUsername={profileUsername} />
                )}

                {/* Profile Content */}
                <div className="container mx-auto px-6 lg:px-8 py-8">
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="bg-gray-900 border-gray-700 mb-8">
                            <TabsTrigger value="overview" className="data-[state=active]:bg-gray-800">
                                Posts
                            </TabsTrigger>
                            <TabsTrigger value="projects" className="data-[state=active]:bg-gray-800">
                                Projects
                            </TabsTrigger>
                            <TabsTrigger value="followers" className="data-[state=active]:bg-gray-800">
                                Followers
                            </TabsTrigger>
                            <TabsTrigger value="following" className="data-[state=active]:bg-gray-800">
                                Following
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview">
                            <div>
                                <h2 className="text-2xl font-semibold mb-6 text-white">
                                    {isOwnProfile ? "Your Posts" : `${profileUsername}'s Posts`}
                                </h2>
                                {userPosts.length === 0 ? (
                                    <EmptyState
                                        icon="📝"
                                        title="No posts yet"
                                        description={isOwnProfile ? "Start creating posts to share with your network" : "This user hasn't posted anything yet"}
                                    />
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {userPosts.map((post) => (
                                            <PostCard key={post.postId} post={post} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="projects">
                            <div>
                                <h2 className="text-2xl font-semibold mb-6 text-white">
                                    {isOwnProfile ? "Your Projects" : `${profileUsername}'s Projects`}
                                </h2>
                                {userProjects.length === 0 ? (
                                    <EmptyState
                                        icon="🚀"
                                        title="No projects yet"
                                        description={isOwnProfile ? "Create your first project to collaborate with others" : "This user hasn't created any projects yet"}
                                    />
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {userProjects.map((project) => (
                                            <ProjectCard 
                                                key={project.id} 
                                                project={project}
                                                onClick={() => navigate(`/projects/${project.id}`)}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="followers">
                            <div>
                                <h2 className="text-2xl font-semibold mb-6 text-white">Followers</h2>
                                {followers.length === 0 ? (
                                    <EmptyState
                                        icon="👥"
                                        title="No followers yet"
                                        description={isOwnProfile ? "Share great content to attract followers" : "This user doesn't have any followers yet"}
                                    />
                                ) : (
                                    <div className="bg-gray-900 rounded-lg p-6 space-y-2">
                                        {followers.map((follower) => (
                                            <UserListItem key={follower.id} user={follower} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="following">
                            <div>
                                <h2 className="text-2xl font-semibold mb-6 text-white">Following</h2>
                                {followings.length === 0 ? (
                                    <EmptyState
                                        icon="👥"
                                        title="Not following anyone yet"
                                        description={isOwnProfile ? "Start following people to see their content" : "This user isn't following anyone yet"}
                                    />
                                ) : (
                                    <div className="bg-gray-900 rounded-lg p-6 space-y-2">
                                        {followings.map((following) => (
                                            <UserListItem key={following.id} user={following} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}
