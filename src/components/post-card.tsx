import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.tsx"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageSquare, Send, Share2, Copy, Check, MoreHorizontalIcon, MoreVertical } from "lucide-react"
import { commentOnPost, likeAPost, postResSchema, unlikeAPost } from "@/api/postClient"
import type { z } from "zod"
import { useNavigate, useLocation } from "react-router-dom"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { postInstance } from "@/api/apiClient"
import useInitStore from "@/store/initStore"
import NewPost from "./new-post"
import { title } from "process"

interface Props {
    post: z.infer<typeof postResSchema>
}

const PostCard = ({ post }: Props) => {
    const navigate = useNavigate()
    const location = useLocation()
    
    // Debug: log the post data
    console.log("PostCard received:", post)
    
    // Check if already on this post's page
    const isOnPostPage = location.pathname === `/posts/${post.id}`

    const [comment, setComment] = useState<boolean>(false);
    const [liked, setLiked] = useState<boolean>(post.likedByCurrentUser);
    const [shareDialogOpen, setShareDialogOpen] = useState<boolean>(false);
    const [copied, setCopied] = useState<boolean>(false);
    const [commentText, setCommentText] = useState<string>("");
    const {username} = useInitStore();
    const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
    const [moreOptions , setMoreOptions] = useState<boolean>(false);
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

    const onClickUsername = (e: React.MouseEvent) => {
        e.stopPropagation();
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
        const res = await commentOnPost(post.id,comm)
        
        console.log("Comment submitted:", res);

    }


     const onClickMoreOptions = (e: React.MouseEvent) => {

        e.stopPropagation();
        setMoreOptions(!moreOptions);
        console.log("More options clicked");

     }


    console.log("Post display data:", {
        hasContent,
        title: post.title,
        content: post.content,
        username: displayUsername,
        ownerProfilePicUrl: post.ownerProfilePicUrl
    })

    return (
        <div className="bg-gray-800/50 border border-gray-700 hover:border-teal-500/50 rounded-lg p-6 transition-all duration-300 hover:shadow-xl hover:shadow-teal-500/10 hover-lift animate-fadeIn">
            <div 
                className={`flex items-start gap-4 mb-4 ${!isOnPostPage ? 'cursor-pointer group' : ''}`}
                onClick={() => !isOnPostPage && navigate(`/posts/${post.id}`)}
            >
                <Avatar className="ring-2 ring-gray-700 hover:ring-teal-500 transition-all duration-300 hover:scale-110">
                    <AvatarImage 
                        src={post.ownerProfilePicUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${displayUsername}`} 
                        alt={displayUsername} 
                    />
                    <AvatarFallback className="bg-gradient-to-br from-teal-600 to-teal-700 text-white font-semibold text-sm">
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

                        { username === displayUsername && (
                            <div className="ml-auto text-gray-400 hover:text-gray-200 cursor-pointer transition-colors relative">
                                <MoreHorizontalIcon onClick={onClickMoreOptions} />
                            </div>
                        )}
                      
                        {
                            moreOptions && username === displayUsername && (
                                <div className="ml-auto space-y-1 bg-gray-700 border border-gray-600 rounded-md p-2 absolute mt-8 right-8 z-10">
                                    <button 
                                        className="block w-full text-left px-3 py-2 text-sm text-white hover:bg-gray-600 rounded transition-colors"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setMoreOptions(false);
                                            setEditDialogOpen(true);
                                        }}
                                    >
                                        Edit Post
                                    </button>
                                    <button 
                                        className="block w-full text-left px-3 py-2 text-sm text-white hover:bg-gray-600 rounded transition-colors"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            console.log("Delete Post clicked");
                                        }}
                                    >
                                        Delete Post
                                    </button>
                                </div>
                            )
                        }
                    </div>
                    
                    {/* Title */}
                    {post.title && (
                        <h3 className="text-lg font-bold text-white mb-2 leading-tight group-hover:text-teal-400 transition-colors duration-300">{post.title}</h3>
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
                <button 
                    className={`flex items-center gap-2 transition-all duration-200 hover:scale-110 group/like ${liked ? "text-red-500" : "text-gray-400 hover:text-red-400"}`} 
                    onClick={() => {
                        likedToggler(!liked);
                        console.log(`Like button clicked for post ID: ${post.id}`)
                    }}
                >
                    <Heart className={`w-5 h-5 transition-all ${liked ? "fill-red-500 animate-pulse" : "group-hover/like:fill-red-400"}`} />
                    <span className="text-sm font-medium">{post.likes}</span>
                </button>
                <button 
                    className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-all duration-200 hover:scale-110 group/comment" 
                    onClick={() => {
                        console.log(`Comment button clicked for post ID: ${post.id}`)
                        setComment(true);
                    }}
                >
                    <MessageSquare className="w-5 h-5 group-hover/comment:fill-blue-400 transition-all" />
                    <span className="text-sm font-medium">{post.commentsCount || post.comments.length}</span>
                </button>
                <button 
                    className="flex items-center gap-2 text-gray-400 hover:text-green-400 transition-all duration-200 hover:scale-110 group/share" 
                    onClick={() => {
                        console.log(`Share button clicked for post ID: ${post.id}`)
                        setShareDialogOpen(true)
                    }}
                >
                    <Share2 className="w-5 h-5 group-hover/share:fill-green-400 transition-all" />
                    <span className="text-sm font-medium">{post.shares}</span>
                </button>
            </div>

            {comment && (
                <div className="mt-4 relative animate-fadeIn">
                    <input
                        type="text"
                        placeholder="Write a comment..."
                        value={commentText}
                        className="w-full px-4 py-3 pr-12 rounded-lg bg-gray-700/50 backdrop-blur-sm text-white border border-gray-600 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none transition-all duration-200"
                        onChange={e => setCommentText(e.currentTarget.value)}
                        onKeyPress={e => e.key === 'Enter' && handleCommentSubmit(e)}
                    />
                    <button 
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-teal-500 hover:text-teal-400 hover:scale-110 transition-all duration-200 disabled:opacity-50"
                        onClick={handleCommentSubmit}
                        disabled={!commentText.trim()}
                    >
                        <Send className="w-5 h-5" />
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


            {editDialogOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setEditDialogOpen(false)} />
                    <div className="relative z-50">
                        <NewPost post={{title:post.title, content:post.content!, media:[], tags:post.tags}} />
                    </div>
                </div>
            )}
        </div>
    )
}

export default PostCard;
