// postApi.ts

import { postInstance } from "@/api/apiClient";
import { z } from "zod";



export const postResSchema = z.object({
    postId: z.string(),
    title: z.string(),
    content: z.string(),
    ownerUsername: z.string(),
    ownerProfilePic: z.string().url(),
    createdAt: z.string().datetime(),
    updatesAt: z.string().datetime(),
    likes: z.number(),
    comments: z.number(),
    shares: z.number(),
    media: z.array(z.string())
});



export const createPost = async (title: string, body: string, media: File[]) => {
    const postReq = {
        title,
        body,
        media
    };

    return postInstance.post("/create/", postReq, {
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


export const updatePost = async (title: string, body: string, media: File[]) => {
    const postReq = {
        title,
        body,
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
