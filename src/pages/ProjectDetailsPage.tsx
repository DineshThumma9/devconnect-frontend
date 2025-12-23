"use client"

import { getProject } from "@/api/projectClient";
import {ActivityTimeline} from "@/components/activity-timeline"
import {TeamAvatars} from "@/components/team-avatars"
import { ProjectResponseType } from "@/entities/Project";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ProjectDetailsPage() {

    const {id} = useParams<{id:string}>();

    const [projectData, setProjectData] = useState<ProjectResponseType | null>(null);
    const teamMembers: any[] = [];
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
    

    return (
        <div className="space-y-6 -mx-4 sm:-mx-6 lg:-mx-8">
            <div className="flex h-[calc(100vh-8rem)]">
                {/* Sidebar */}
                <div className="w-72 bg-gray-900 h-full p-6 flex-shrink-0 overflow-y-auto">
                    {/* Project Info */}
                    <div className="mb-8">
                        <div className="w-24 h-24 bg-orange-200 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                            <div className="w-12 h-12 bg-orange-400 rounded-full opacity-80"></div>
                        </div>
                        <h1 className="text-2xl font-bold mb-2">{projectData?.title}</h1>
                        <p className="text-gray-400 text-sm mb-1">{projectData?.description}</p>
                        <p className="text-gray-500 text-xs">By {projectData?.ownerUsername}</p>
                    </div>

                    {/* Team */}
                    <div className="mb-8">
                        <h3 className="text-sm font-semibold mb-3 uppercase text-gray-400">Team</h3>
                        <TeamAvatars members={teamMembers}/>
                    </div>

                    {/* Recent Activity */}
                    <div>
                        <h3 className="text-sm font-semibold mb-3 uppercase text-gray-400">Recent Activity</h3>
                        <ActivityTimeline activities={activities} compact/>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-8 overflow-y-auto">
                    <div className="max-w-3xl">
                        <h1 className="text-3xl font-bold mb-2">{projectData?.title}</h1>
                        <p className="text-gray-400 mb-6">{projectData?.description}</p>

                        {/* Overview */}
                        <div className="mb-8">
                            <p className="text-gray-300 leading-relaxed">{projectData?.description}</p>
                        </div>

                        {/* Activity Timeline */}
                        <div className="bg-gray-900 rounded-lg p-6">
                            <h2 className="text-lg font-semibold mb-6">Activity</h2>
                            <ActivityTimeline activities={activities}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
