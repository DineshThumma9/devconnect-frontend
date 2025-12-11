"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

interface ProjectCardProps {
  id: string
  title: string
  description: string
  image: string
  tags?: string[]
  featured?: boolean
  onClick?: () => void
}

export  default function ProjectCard({ title, description, image, tags, featured, onClick }: ProjectCardProps) {
  return (
    <Card
      className="bg-gray-800/50 border border-gray-700 hover:border-teal-500 hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden"
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="aspect-video bg-gray-900 overflow-hidden relative">
          <img
            src={image || "/placeholder.svg?height=200&width=300"}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {featured && (
            <Badge className="absolute top-3 right-3 bg-teal-600 text-white border-0 shadow-lg">
              Featured
            </Badge>
          )}
        </div>
        <div className="p-5">
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-bold text-white text-base leading-tight group-hover:text-teal-400 transition-colors line-clamp-2">{title}</h3>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed line-clamp-3 mb-4">{description}</p>
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-gray-700 hover:bg-teal-600 text-gray-200 hover:text-white text-xs transition-colors">
                  {tag}
                </Badge>
              ))}
              {tags.length > 3 && (
                <Badge variant="secondary" className="bg-gray-700 text-gray-300 text-xs">
                  +{tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
