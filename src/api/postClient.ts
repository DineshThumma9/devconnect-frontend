
import { postInstance } from "@/api/apiClient";
import { Comment } from "@/entities/Comment";
import { PostResponse, PostResponseType } from "@/entities/Post";

export const createPost = async (title: string, content: string, media: File[], tags: string[]) => {
    const formData = new FormData();
    
    formData.append('post', new Blob([JSON.stringify({ title, content, tags })], { type: 'application/json' }));
    
    media.forEach((file) => formData.append('images', file));

    return postInstance.post("/create", formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};

export const deletePost = async (postId: string) => {
    return postInstance.delete(`/delete/${postId}`);
};

export const updatePost = async (title: string, content: string, media: File[]) => {
    return postInstance.post("/update/", { title, content, media });
};

export const getPost = async (id: string) => {
    const response = await postInstance.get(`/${id}`);
    const result = PostResponse.safeParse(response.data);
    return result.success ? result.data : null;
};

export const getPostsByUser = async (username: string): Promise<PostResponseType[]> => {
    const response = await postInstance.get(`/get-posts/${username}`);
    
    return response.data.map((post: unknown) => {
        const result = PostResponse.safeParse(post);
        if (!result.success) {
            console.error("❌ Post validation failed:", result.error.format());
            throw new Error("Invalid post format");
        }
        return result.data;
    });
};

export const likeAPost = async (postId: string) => {
    return postInstance.put(`/like/${postId}`);
};

export const unlikeAPost = async (postId: string) => {
    return postInstance.delete(`/unlike/${postId}`);
};

export const shareAPost = async (postId: string, username: string) => {
    return postInstance.post(`/share/${username}`);
};

export const commentOnPost = async (postId: string, comment: string) => {
    return postInstance.post(`/comment`, { comment, postId });
};

export const getCommentsForPost = async (postId: string) => {
    const res = await postInstance.get(`/comments/${postId}`);
    
    return res.data.map((comment: any) => {
        const result = Comment.safeParse(comment);
        if (!result.success) {
            console.error("❌ Comment validation failed:", result.error.format());
            throw new Error("Invalid comment format");
        }
        return result.data;
    });
};


