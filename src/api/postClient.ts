// postApi.ts

import { postInstance } from "@/api/apiClient";
import { z } from "zod";



// Use shared schema from entities
import { PostResponse } from "@/entities/Post";

export const postResSchema = PostResponse;



export const createPost = async (title: string, content: string, media: File[], tags: string[]) => {
    const postReq = {
        title,
        content,  // Changed from 'body' to match backend DTO
        media,
        tags
    };

    console.log("📤 Sending post request:", postReq);

    return postInstance.post("/create", postReq, {
        headers: {
            "Content-Type": "application/json"
        }
    });
};



export const deletePost = async (postId: string) => {
    return postInstance.delete(`/delete/${postId}`, {
        headers: {
            "Content-Type": "application/json"
        }
    });
};


export const updatePost = async (title: string, content: string, media: File[]) => {
    const postReq = {
        title,
        content,
        media
    };

    return postInstance.post("/update/", postReq, {
        headers: {
            "Content-Type": "application/json"
        }
    });
};



export const getPost = async (id: string) => {
    const response = await postInstance.get(`/id/${id}`);
    const result = postResSchema.safeParse(response.data);

    return result.success ? result.data : null;
};




export const getSuggestedConnections = async () => {
    return postInstance.get("/suggested-connections");
};


export const getPostsByUser = async (username: string): Promise<z.infer<typeof postResSchema>[]> => {
    const response = await postInstance.get(`/get-posts/${username}`);
    console.log("🔍 Raw posts from backend:", response.data);
    console.log("🔍 First post shape:", response.data[0]);
    
    const parsed = response.data.map((post: unknown, index: number) => {
        const result = postResSchema.safeParse(post);
        if (!result.success) {
            console.error(`❌ Post ${index} validation failed:`, result.error.format());
            console.error(`❌ Failed post data:`, post);
            throw new Error("Invalid post format");
        }
        return result.data;
    });
    return parsed;
}