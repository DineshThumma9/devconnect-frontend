


import { CommentType } from "@/entities/Comment";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatTimeAgo } from "@/utils/dateHelpers";

interface CommentProps {
    comment: CommentType
}

const Comment = ({ comment }: CommentProps) => {
    // Return null if comment is undefined
    if (!comment) {
        return null;
    }

    return (
        <div className="group animate-fadeIn">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-800/30 border border-gray-700/50 hover:border-gray-600 hover:bg-gray-800/50 transition-all duration-200">
                {/* Avatar */}
                <Avatar className="w-10 h-10 ring-2 ring-gray-700 group-hover:ring-teal-500 transition-all">
                    <AvatarImage 
                        src={comment.userProfilePicUrl != undefined ?  comment.userProfilePicUrl : `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.username}`} 
                        alt={comment.username} 
                    />
                    <AvatarFallback className="bg-teal-600 text-white font-semibold text-xs">
                        {comment.username.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                </Avatar>

                {/* Comment Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-white hover:text-teal-400 transition-colors cursor-pointer text-sm">
                            @{comment.username}
                        </span>
                        <span className="text-gray-500 text-xs">•</span>
                        <time className="text-gray-400 text-xs">
                            {formatDate(comment.createdAt)}
                        </time>
                    </div>
                    <p className="text-gray-200 text-sm leading-relaxed break-words">
                        {comment.comment}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Comment;