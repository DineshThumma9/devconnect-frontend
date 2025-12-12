import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ProjectResponseType } from "@/entities/Project"
import type { z } from "zod"

interface Props {
  project: ProjectResponseType
  onClick?: () => void
}

export default function ProjectCard({ project, onClick }: Props) {
  // Format the date
  const formatDate = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return "just now"
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`
    return date.toLocaleDateString()
  }

  return (
    <Card
      className="bg-gray-800/50 border border-gray-700 hover:border-teal-500 hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden"
      onClick={onClick}
    >
      <CardContent className="p-0">
        {/* Project Media */}
        <div className="aspect-video bg-gray-900 overflow-hidden relative">
          <img
            src={project.media?.[0] || "/placeholder.svg?height=200&width=300"}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {project.status === "ACTIVE" && (
            <Badge className="absolute top-3 right-3 bg-teal-600 text-white border-0 shadow-lg">
              Active
            </Badge>
          )}
        </div>

        <div className="p-5">
          {/* Owner Info */}
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="w-8 h-8 ring-2 ring-gray-700">
              <AvatarImage src={project.ownerProfilePicUrl || "/placeholder.svg"} alt={project.ownerUsername} />
              <AvatarFallback className="bg-teal-600 text-white text-xs font-semibold">
                {project.ownerUsername}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-medium text-gray-300 hover:text-teal-400 transition-colors">
                @{project.ownerUsername}
              </span>
              <span className="text-gray-500 text-xs ml-2">•</span>
              <span className="text-gray-400 text-xs ml-2">{formatDate(project.createdAt)}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-bold text-white text-base leading-tight group-hover:text-teal-400 transition-colors line-clamp-2 mb-3">
            {project.title}
          </h3>

          {/* Description */}
          <p className="text-gray-300 text-sm leading-relaxed line-clamp-3 mb-4">{project.description}</p>

          {/* Tech Requirements */}
          {project.techRequirements && project.techRequirements.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {project.techRequirements.slice(0, 3).map((tech) => (
                <Badge key={tech} variant="secondary" className="bg-gray-700 hover:bg-teal-600 text-gray-200 hover:text-white text-xs transition-colors">
                  {tech}
                </Badge>
              ))}
              {project.techRequirements.length > 3 && (
                <Badge variant="secondary" className="bg-gray-700 text-gray-300 text-xs">
                  +{project.techRequirements.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
