import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.tsx"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageSquare, Send, Share2, Copy, Check } from "lucide-react"
import { commentOnPost, likeAPost, postResSchema, unlikeAPost } from "@/api/postClient"
import type { z } from "zod"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { postInstance } from "@/api/apiClient"
import useInitStore from "@/store/initStore"

interface Props {
    post: z.infer<typeof postResSchema>
}

const PostCard = ({ post }: Props) => {
    const navigate = useNavigate()
    
    // Debug: log the post data
    console.log("PostCard received:", post)

    const [comment, setComment] = useState<Boolean>(false);
    const [liked, setLiked] = useState<Boolean>(false);
    const [shareDialogOpen, setShareDialogOpen] = useState<boolean>(false);
    const [copied, setCopied] = useState<boolean>(false);
    const [commentText, setCommentText] = useState<string>("");
    const {username} = useInitStore();

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

    // Check if we have any displayable content
    const hasContent = post.title || post.content
    const displayUsername = post.ownerUsername || "Anonymous"

    const onClickUsername = () => {
        console.log(`Username @${displayUsername} clicked - navigating to profile`)
        navigate(`/profiles/${displayUsername}`)
    }

    const shareUrl = `${window.location.origin}/posts/${post.id}`

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy:', err)
        }
    }

    

    const likedToggler = (like: boolean) => {
        if (like) {
            post.likes += 1
            setLiked(true)
            likeAPost(post.id)
        
        } else {
            post.likes -= 1
            setLiked(false)
            unlikeAPost(post.id)
        }
    }


    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const comm = commentText;
        setCommentText("");
        setComment(false);
        const res = await commentOnPost(post.id,comm,username)
        
        console.log("Comment submitted:", res);

    }


    console.log("Post display data:", {
        hasContent,
        title: post.title,
        content: post.content,
        username: displayUsername,
        ownerProfilePicUrl: post.ownerProfilePicUrl
    })

    return (
        <div className="bg-gray-800/50 border border-gray-700 hover:border-gray-600 rounded-lg p-6 transition-all duration-200 hover:shadow-lg">
            <div className="flex items-start gap-4 mb-4">
                <Avatar className="ring-2 ring-gray-700 hover:ring-teal-500 transition-all">
                    <AvatarImage 
                        src={post.ownerProfilePicUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${displayUsername}`} 
                        alt={displayUsername} 
                    />
                    <AvatarFallback className="bg-teal-600 text-white font-semibold text-sm">
                        {displayUsername.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span 
                            onClick={onClickUsername}
                            className="font-semibold text-white hover:text-teal-400 transition-colors cursor-pointer text-sm"
                        >
                            @{displayUsername}
                        </span>
                        <span className="text-gray-500 text-sm">•</span>
                        <span className="text-gray-400 text-sm">{formatDate(post.createdAt)}</span>
                    </div>
                    
                    {/* Title */}
                    {post.title && (
                        <h3 className="text-lg font-bold text-white mb-2 leading-tight">{post.title}</h3>
                    )}
                    
                    {/* Content - Always show if exists */}
                    {post.content && (
                        <p className="text-gray-200 leading-relaxed text-sm mb-3">{post.content}</p>
                    )}
                    
                    {/* Fallback if no content */}
                    {!hasContent && (
                        <p className="text-gray-500 italic text-sm">No content available</p>
                    )}
                    
                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {post.tags.map((tag, idx) => (
                                <Badge 
                                    key={idx} 
                                    variant="secondary" 
                                    className="bg-teal-600/20 border border-teal-600 text-teal-400 text-xs px-2 py-0.5"
                                >
                                    #{tag}
                                </Badge>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Post Images */}
            {post.media && post.media.length > 0 && (
                <div className="mb-4 grid grid-cols-2 gap-2 rounded-lg overflow-hidden">
                    {post.media.slice(0, 4).map((mediaUrl, idx) => (
                        <img
                            key={idx}
                            src={mediaUrl || "/placeholder.svg"}
                            alt="Post media"
                            className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                        />
                    ))}
                </div>
            )}

            {/* Interaction Buttons */}
            <div className="flex items-center gap-6 pt-4 border-t border-gray-700">
                <button className={`flex items-center gap-2 text-gray-400 ${liked ? "text-red-400" : "text-gray-400"} transition-colors group`} onClick={() => {
                     likedToggler(!liked);
                     console.log(`Like button clicked for post ID: ${post.id}`)
                }}>
                    <Heart className={`w-5 h-5 ${liked ? "fill-red-400" : "fill-gray-400"}`} />
                    <span className="text-sm font-medium">{post.likes}</span>
                </button>
                <button className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors group" onClick={() => {
                    console.log(`Comment button clicked for post ID: ${post.id}`)
                    setComment(true);
                    // navigate(`/posts/${post.id}`)
                }}>
                    <MessageSquare className="w-5 h-5 group-hover:fill-blue-400" />
                    <span className="text-sm font-medium">{post.commentsCount || post.comments.length}</span>
                </button>
                <button className="flex items-center gap-2 text-gray-400 hover:text-green-400 transition-colors group" onClick={() => {
                    console.log(`Share button clicked for post ID: ${post.id}`)
                    setShareDialogOpen(true)
                }}>
                    <Share2 className="w-5 h-5 group-hover:fill-green-400" />
                    <span className="text-sm font-medium">{post.shares}</span>
                </button>
            </div>

            {comment && (
                <div className="mt-4 relative">
                    <input
                        type="text"
                        placeholder="Write a comment..."
                        className="w-full px-4 py-2 pr-12 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-teal-500 focus:outline-none"
                        onChange={e => setCommentText(e.currentTarget.value)}
                    />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-teal-500 hover:text-teal-400 transition-colors">
                        <Send className="w-5 h-5" onClick={handleCommentSubmit} />
                    </button>
                </div>
            )}

            {/* Share Dialog */}
            <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
                <DialogContent className="bg-gray-800 border border-gray-700 text-white">
                    <DialogHeader>
                        <DialogTitle>Share Post</DialogTitle>
                        <DialogDescription className="text-gray-400">
                            Copy the link below to share this post
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center gap-2 mt-4">
                        <Input
                            value={shareUrl}
                            readOnly
                            className="bg-gray-700 border-gray-600 text-white flex-1"
                        />
                        <Button
                            onClick={handleCopyLink}
                            className="bg-teal-600 hover:bg-teal-700"
                        >
                            {copied ? (
                                <>
                                    <Check className="w-4 h-4 mr-2" />
                                    Copied!
                                </>
                            ) : (
                                <>
                                    <Copy className="w-4 h-4 mr-2" />
                                    Copy
                                </>
                            )}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default PostCard;
