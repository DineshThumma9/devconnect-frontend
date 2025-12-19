"use client"

import {useEffect, useState} from "react"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import { useParams } from "react-router-dom"
import ProjectCard from "@/components/project-card.tsx";
import ProfileSections from "@/components/profile-sections.tsx";
import { getProjectsByUser } from "@/api/projectClient";
import { getPostsByUser } from "@/api/postClient";
import PostCard from "@/components/post-card";
import { ProjectResponseType } from "@/entities/Project";
import { PostResponseType } from "@/entities/Post";
import useInitStore from "@/store/initStore";

export default function UserProfilePage() {
    const [activeTab, setActiveTab] = useState("overview")
    const { username: urlUsername } = useParams<{ username: string }>()
    const { username: loggedInUsername } = useInitStore()

    // Determine which username to use - URL param or logged-in user
    const profileUsername = urlUsername || loggedInUsername
    const isOwnProfile = profileUsername === loggedInUsername

    const [userProjects, setUserProjects] = useState<ProjectResponseType[]>([]);
    const [userPosts, setUserPosts] = useState<PostResponseType[]>([]);

    useEffect(() => {
        if (profileUsername) {
            console.log("Fetching data for user:", profileUsername);
            getUserProjects();
            getUserPosts();
        }
    }, [profileUsername]);
    
    const getUserProjects = async () => {
        try {
            const response = await getProjectsByUser(profileUsername!);
            setUserProjects(response);
        } catch (error) {
            console.error("Error fetching projects:", error);
        }
    }

    const getUserPosts = async () => {
        try {
            const response = await getPostsByUser(profileUsername!);
            console.log("Posts fetched:", response);
            setUserPosts(response);
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    }

    return (
        <div className="space-y-6 -mx-4 sm:-mx-6 lg:-mx-8">
            <div className="w-full">
                {/* Profile Header */}
                <ProfileSections isOwnProfile={isOwnProfile} profileUsername={profileUsername!} />

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
                            {/* <TabsTrigger value="skills" className="data-[state=active]:bg-gray-800">
                                Skills
                            </TabsTrigger>
                            <TabsTrigger value="activity" className="data-[state=active]:bg-gray-800">
                                Activity
                            </TabsTrigger> */}
                        </TabsList>

                        <TabsContent value="overview">
                            <div>
                                <h2 className="text-2xl font-semibold mb-6">{isOwnProfile ? "Your Posts" : `${profileUsername}'s Posts`}</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {userPosts.map((post) => (
                                        <PostCard key={post.postId} post={post} />
                                    ))}
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="projects">
                            <div>
                                <h2 className="text-2xl font-semibold mb-6">{isOwnProfile ? "Your Projects" : `${profileUsername}'s Projects`}</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {userProjects.map((project) => (
                                        <ProjectCard key={project.id} project={project} />
                                    ))}
                                </div>
                            </div>
                        </TabsContent>

                        {/* <TabsContent value="skills">
                            <div className="bg-gray-900 rounded-lg p-6">
                                <h3 className="text-xl font-semibold mb-4">Skills & Technologies</h3>
                                <p className="text-gray-400">Skills and technologies would be displayed here.</p>
                            </div>
                        </TabsContent> */}

                        {/* <TabsContent value="activity">
                            <div className="bg-gray-900 rounded-lg p-6">
                                <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
                                <p className="text-gray-400">User activity timeline would be displayed here.</p>
                            </div>
                        </TabsContent> */}
                    </Tabs>
                </div>
            </div>
        </div>
    )
}
