import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.tsx"
import { Heart, MessageSquare, Share2 } from "lucide-react"
import { postResSchema } from "@/api/postClient"
import type { z } from "zod"

interface Props {
    post: z.infer<typeof postResSchema>
}

const PostCard = ({ post }: Props) => {
    // Format the date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

        if (diffInSeconds < 60) return "just now"
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`
        return date.toLocaleDateString()
    }

    return (
        <div className="bg-gray-800/50 border border-gray-700 hover:border-gray-600 rounded-lg p-6 transition-all duration-200 hover:shadow-lg">
            <div className="flex items-start gap-4 mb-4">
                <Avatar className="ring-2 ring-gray-700 hover:ring-teal-500 transition-all">
                    <AvatarImage src={post.ownerProfilePic || "/placeholder.svg"} alt={post.ownerUsername} />
                    <AvatarFallback className="bg-teal-600 text-white font-semibold">
                        {post.ownerUsername.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-white hover:text-teal-400 transition-colors cursor-pointer">@{post.ownerUsername}</span>
                        <span className="text-gray-500 text-sm">•</span>
                        <span className="text-gray-400 text-sm">{formatDate(post.createdAt)}</span>
                    </div>
                    
                    {/* Title */}
                    {post.title && (
                        <h3 className="text-xl font-bold text-white mb-2 leading-tight">{post.title}</h3>
                    )}
                    
                    {/* Content */}
                    <p className="text-gray-200 leading-relaxed">{post.content}</p>
                </div>
            </div>

            {/* Post Images */}
            {post.media && post.media.length > 0 && (
                <div className="mb-4 grid grid-cols-2 gap-2 rounded-lg overflow-hidden">
                    {post.media.slice(0, 4).map((mediaUrl) => (
                        <img
                            key={mediaUrl}
                            src={mediaUrl || "/placeholder.svg"}
                            alt="Post media"
                            className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                        />
                    ))}
                </div>
            )}

            {/* Interaction Buttons */}
            <div className="flex items-center gap-6 pt-4 border-t border-gray-700">
                <button className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors group">
                    <Heart className="w-5 h-5 group-hover:fill-red-400" />
                    <span className="text-sm font-medium">{post.likes}</span>
                </button>
                <button className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors group">
                    <MessageSquare className="w-5 h-5 group-hover:fill-blue-400" />
                    <span className="text-sm font-medium">{post.comments}</span>
                </button>
                <button className="flex items-center gap-2 text-gray-400 hover:text-green-400 transition-colors group">
                    <Share2 className="w-5 h-5 group-hover:fill-green-400" />
                    <span className="text-sm font-medium">{post.shares}</span>
                </button>
            </div>
        </div>
    )
}

export default PostCard