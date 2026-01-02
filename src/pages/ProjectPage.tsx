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
import { ProjectResponse, ProjectResponseType } from "@/entities/Project"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal } from "lucide-react"
import { UserResponseType } from "@/entities/User"
import { LoadingState } from "@/components/ui/loading-state"
import { EmptyState } from "@/components/ui/empty-state"
import { ErrorMessage } from "@/components/ui/error-message"
import { projectInstance } from "@/api/apiClient"
import { sub } from "date-fns"

const POLLING_INTERVAL = 5 * 60 * 1000


export default function ProjectPage() {
    const { username } = useInitStore()
    

    const [projects, setProjects] = useState<ProjectResponseType[]>([]);
    
    const [loading, setLoading] = useState(true)
    const [subscribedProjects, setSubscribedProjects] = useState<ProjectResponse[]>([]);
    const [error, setError] = useState<string | null>(null);

    // Fetch all data
    const fetchAllData = useCallback(async () => {
        if (!username) return;

        setLoading(true);
        setError(null);

        try {
            const [projectsData] = await Promise.all([
                
                fetchProjectRecommendations(username),
                getProjects(username)
            ]);
            
            
            setProjects(projectsData);
            
            
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



    const getProjects = async (username: string) => {

        const res = await projectInstance.get(`/all/${username}`);
    
        const subscribed = res.data.map((proj: unknown) => {
            const parsed = ProjectResponse.safeParse(proj);
            return parsed ? parsed.data : null;
        }
        )

        setSubscribedProjects(subscribed);
    }

    return (
        <div className="space-y-8">



            {/* Recommended Projects */}
             <section>
                <h1>Your Project's</h1>
                {loading ? (
                    <LoadingState type="project" count={2} />
                ) : subscribedProjects.length === 0 ? (
                    <EmptyState
                        icon="🚀"
                        title="No projects yet"
                        description="Participate in some projetcs!"
                    />
                ) : (
                    <div className="space-y-6">
                        {subscribedProjects.map((project) => (
                            <ProjectCard project={project} key={project.id} />
                        ))}
                    </div>
                )}

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
    </div>
    
    );
}