import PostCard from "@/components/post-card"
import { CommentType } from "@/entities/Comment";
import { PostResponseType } from "@/entities/Post";
import { useEffect, useState } from "react";
import { getCommentsForPost, getPost, commentOnPost } from "@/api/postClient";
import Comment from "@/components/comment";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, ArrowLeft } from "lucide-react";
import useInitStore from "@/store/initStore";

const PostPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { username } = useInitStore();
    
    const [post, setPost] = useState<PostResponseType | null>(null);
    const [comments, setComments] = useState<CommentType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [commentText, setCommentText] = useState<string>("");
    const [submittingComment, setSubmittingComment] = useState(false);

    useEffect(() => {
        if (id) {
            fetchPost();
            fetchComments();
        }
    }, [id]);

    const fetchPost = async () => {
        try {
            setLoading(true);
            setError(null);
            const postData = await getPost(id!);
            if (postData) {
                setPost(postData);
            } else {
                setError("Post not found");
            }
        } catch (error) {
            console.error("Error fetching post:", error);
            setError("Failed to load post");
        } finally {
            setLoading(false);
        }
    };

    const fetchComments = async () => {
        try {
            const commentsData = await getCommentsForPost(id!);
            setComments(commentsData);
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    };

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim() || !id) return;

        try {
            setSubmittingComment(true);
            await commentOnPost(id, commentText);
            setCommentText("");
            await fetchComments();
        } catch (error) {
            console.error("Error submitting comment:", error);
        } finally {
            setSubmittingComment(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-gray-400 text-lg">Loading post...</div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <div className="text-red-400 text-lg">{error || "Post not found"}</div>
                <Button onClick={() => navigate("/app")} variant="outline">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Feed
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-400 hover:text-teal-400 transition-colors mb-4 group"
            >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
            </button>

            {/* Post Card */}
            <PostCard key={post.id} post={post} />

            {/* Comments Section */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 space-y-6">
                <h2 className="text-xl font-semibold text-white">
                    Comments ({comments.length})
                </h2>

                {/* Comment Input */}
                <form onSubmit={handleCommentSubmit} className="flex gap-3">
                    <Input
                        type="text"
                        placeholder="Write a comment..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        className="flex-1 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-teal-500"
                        disabled={submittingComment}
                    />
                    <Button
                        type="submit"
                        disabled={!commentText.trim() || submittingComment}
                        className="bg-teal-600 hover:bg-teal-700 disabled:opacity-50"
                    >
                        <Send className="w-4 h-4" />
                    </Button>
                </form>

                {/* Comments List */}
                <div className="space-y-4">
                    {comments.length === 0 ? (
                        <p className="text-gray-400 text-center py-8">
                            No comments yet. Be the first to comment!
                        </p>
                    ) : (
                        comments.map((comment) => (
                            <Comment key={comment.id} comment={comment} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default PostPage;