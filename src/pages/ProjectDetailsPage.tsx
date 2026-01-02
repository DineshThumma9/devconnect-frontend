"use client"

import { getProject, subscribeToProject, unsubscribeFromProject } from "@/api/projectClient";
import {ActivityTimeline} from "@/components/activity-timeline"
import {TeamAvatars} from "@/components/team-avatars"
import { ProjectResponseType } from "@/entities/Project";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GithubIcon } from "lucide-react";

export default function ProjectDetailsPage() {

    const {id} = useParams<{id:string}>();

    const [projectData, setProjectData] = useState<ProjectResponseType | null>(null);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isSubscribing, setIsSubscribing] = useState(false);
    
    const activities: any[] = [];

     useEffect(() => {

            getProjectData();
        

     },[id]);
        
    const getProjectData = async () => {

        try{
            const data = await getProject(id!);
            setProjectData(data);
            
        }
        catch (error){
            console.error("Error fetching project data:", error);
        }

    }

    const handleSubscribe = async () => {
        if (!id || isSubscribing) return;
        
        setIsSubscribing(true);
        try {
            if (isSubscribed) {
                await unsubscribeFromProject(id);
                setIsSubscribed(false);
            } else {
                await subscribeToProject(id);
                setIsSubscribed(true);
            }
        } catch (error) {
            console.error("Error toggling subscription:", error);
        } finally {
            setIsSubscribing(false);
        }
    };

    const formatDate = (dateString: string | Date) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        }).format(date);
    };

    const getStatusBadgeVariant = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'active':
            case 'in_progress':
                return 'default';
            case 'completed':
                return 'secondary';
            case 'archived':
                return 'outline';
            default:
                return 'default';
        }
    };
    

    return (
        <div className="space-y-6 -mx-4 sm:-mx-6 lg:-mx-8">
            <div className="flex h-[calc(100vh-8rem)]">
                {/* Sidebar */}
                <div className="w-72 bg-gray-900 h-full p-6 flex-shrink-0 overflow-y-auto">
                    {/* Project Info */}
                    <div className="mb-8">
                        <div className="w-24 h-24 bg-orange-200 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                            {projectData?.media && projectData.media.length > 0 ? (
                                <img 
                                    src={projectData.media[0]} 
                                    alt={projectData.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-12 h-12 bg-orange-400 rounded-full opacity-80"></div>
                            )}
                        </div>
                        <h1 className="text-2xl font-bold mb-2">{projectData?.title}</h1>
                        <p className="text-gray-400 text-sm mb-3">{projectData?.description}</p>
                        <div className="flex items-center gap-2 mb-4">
                            <img 
                                src={projectData?.ownerProfilePicUrl || '/default-avatar.png'} 
                                alt={projectData?.ownerUsername}
                                className="w-6 h-6 rounded-full"
                            />
                            <p className="text-gray-500 text-xs">By {projectData?.ownerUsername}</p>
                        </div>

                        {/* Status Badge */}
                        {projectData?.status && (
                            <div className="mb-4">
                                <Badge variant={getStatusBadgeVariant(projectData.status)} className="uppercase">
                                    {projectData.status.replace('_', ' ')}
                                </Badge>
                            </div>
                        )}

                        {/* Subscribe Button */}
                        <Button 
                            onClick={handleSubscribe}
                            disabled={isSubscribing}
                            className="w-full mb-4"
                            variant={isSubscribed ? "outline" : "default"}
                        >
                            {isSubscribing ? "Loading..." : isSubscribed ? "Unsubscribe" : "Subscribe"}
                        </Button>

                        {/* GitHub Link */}
                        {projectData?.githubLink && (
                            <a 
                                href={projectData.githubLink} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors mb-4"
                            >
                                <GithubIcon className="w-4 h-4" />
                                View on GitHub
                            </a>
                        )}

                        {/* Project Tags */}
                        {projectData?.techRequirements && projectData.techRequirements.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold mb-2 uppercase text-gray-400">Tech Stack</h3>
                                <div className="flex flex-wrap gap-2">
                                    {projectData.techRequirements.map((tech, index) => (
                                        <Badge key={index} variant="secondary" className="text-xs">
                                            {tech}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Team */}
                    <div className="mb-8">
                        <h3 className="text-sm font-semibold mb-3 uppercase text-gray-400">
                            Team {projectData?.currentContributors && `(${projectData.currentContributors.length})`}
                        </h3>
                        <TeamAvatars members={[]}/>
                    </div>

                    {/* Privacy Badge */}
                    {projectData?.isPrivate && (
                        <div className="mb-6">
                            <Badge variant="outline" className="text-xs">
                                🔒 Private Project
                            </Badge>
                        </div>
                    )}

                    {/* Recent Activity */}
                    <div>
                        <h3 className="text-sm font-semibold mb-3 uppercase text-gray-400">Recent Activity</h3>
                        <ActivityTimeline activities={activities} compact/>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-8 overflow-y-auto">
                    <div className="max-w-3xl">
                        {/* Header Section */}
                        <div className="mb-8">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h1 className="text-4xl font-bold mb-2">{projectData?.title}</h1>
                                    <p className="text-gray-400 text-sm">
                                        Created on {projectData?.createdAt && formatDate(projectData.createdAt)}
                                    </p>
                                </div>
                            </div>
                            
                            {/* Tech Tags - Prominent Display */}
                            {projectData?.techRequirements && projectData.techRequirements.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {projectData.techRequirements.map((tech, index) => (
                                        <Badge key={index} variant="default" className="text-sm px-3 py-1">
                                            {tech}
                                        </Badge>
                                    ))}
                                </div>
                            )}

                            <p className="text-gray-300 text-lg leading-relaxed">{projectData?.description}</p>
                        </div>

                        {/* Media Gallery */}
                        {projectData?.media && projectData.media.length > 0 && (
                            <div className="mb-8">
                                <h2 className="text-2xl font-semibold mb-4">Project Media</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    {projectData.media.map((mediaUrl, index) => (
                                        <div key={index} className="rounded-lg overflow-hidden bg-gray-800">
                                            <img 
                                                src={mediaUrl} 
                                                alt={`${projectData.title} media ${index + 1}`}
                                                className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Overview Section */}
                        <div className="mb-8 bg-gray-900 rounded-lg p-6">
                            <h2 className="text-2xl font-semibold mb-4">About This Project</h2>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center border-b border-gray-800 pb-3">
                                    <span className="text-gray-400">Status</span>
                                    <Badge variant={getStatusBadgeVariant(projectData?.status || '')}>
                                        {projectData?.status?.replace('_', ' ') || 'N/A'}
                                    </Badge>
                                </div>
                                <div className="flex justify-between items-center border-b border-gray-800 pb-3">
                                    <span className="text-gray-400">Project Owner</span>
                                    <span className="text-white font-medium">{projectData?.ownerUsername}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-gray-800 pb-3">
                                    <span className="text-gray-400">Contributors</span>
                                    <span className="text-white font-medium">
                                        {projectData?.currentContributors?.length || 0}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center border-b border-gray-800 pb-3">
                                    <span className="text-gray-400">Visibility</span>
                                    <span className="text-white font-medium">
                                        {projectData?.isPrivate ? '🔒 Private' : '🌐 Public'}
                                    </span>
                                </div>
                                {projectData?.githubLink && (
                                    <div className="flex justify-between items-center pb-3">
                                        <span className="text-gray-400">Repository</span>
                                        <a 
                                            href={projectData.githubLink} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-blue-400 hover:text-blue-300 flex items-center gap-2"
                                        >
                                            <GithubIcon className="w-4 h-4" />
                                            View Code
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Activity Timeline */}
                        <div className="bg-gray-900 rounded-lg p-6">
                            <h2 className="text-2xl font-semibold mb-6">Activity</h2>
                            <ActivityTimeline activities={activities}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
