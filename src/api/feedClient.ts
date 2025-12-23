import {axiosInstance, feedInstance} from "@/api/apiClient.ts";
import {z} from "zod";
import {postResSchema} from "@/api/postClient.ts";
import { ProjectResponse } from "@/entities/Project";
import { PostResponse } from "@/entities/Post";


const connectionSchema = z.object({
    username: z.string(),
    email: z.string(),
    profile_pic: z.string(),
});

// Fetch posts for user feed (for-you)
export const fetchForYouPosts = async (username: string) => {
    const response = await feedInstance.get(`/for-you/posts`);
    return response.data.map((post: unknown) => {
        const parsed = PostResponse.safeParse(post);
        if (!parsed.success) {
            console.log("Posts:", response.data);
            console.error("Invalid post format:", parsed.error);
            throw new Error("Invalid post format");

        }
        return parsed.data;
    });
};

// Fetch project recommendations
export const fetchProjectRecommendations = async (username: string) => {
    const response = await feedInstance.get(`/recommendations`);
    return response.data.map((proj: unknown) => {
        const parsed = ProjectResponse.safeParse(proj);
        if (!parsed.success) throw new Error("Invalid project format");
        return parsed.data;
    });
};

// Fetch suggested connections for a specific user
export const fetchSuggestedConnectionsForUser = async (username: string) => {
    const response = await feedInstance.get(`/suggested-connections/${username}`);
    return response.data
        .map((conn: unknown) => {
            const parsed = connectionSchema.safeParse(conn);
            return parsed.success ? parsed.data : null;
        })
        .filter(Boolean);
};



export const getTrendingPosts = async () => {
    const response = await feedInstance.get("/trending/posts");
    return response.data.map((post: unknown) => {
        const parsed = postResSchema.safeParse(post);
        if (!parsed.success) {
            console.log("Posts:", response.data);
            console.error("Invalid post format:", parsed.error);
            throw new Error("Invalid post format");
        }
        return parsed.data;
    }
    );
}
// Legacy endpoints (kept for backward compatibility)

// // Fetch feed posts
// export const fetchFeedPosts = async () => {
//     const response = await feedInstance.get("/feed/posts");
//     return response.data.map((post: unknown) => {
//         const parsed = postResSchema.safeParse(post);
//         if (!parsed.success) throw new Error("Invalid post format");
//         return parsed.data;
//     });
// };

// // Fetch feed projects
// export const fetchFeedProjects = async () => {
//     const response = await feedInstance.get("/feed/projects");
//     return response.data.map((proj: unknown) => {
//         const parsed = projectResSchema.safeParse(proj);
//         if (!parsed.success) throw new Error("Invalid project format");
//         return parsed.data;
//     });
// };

// // Fetch suggested connections
// export const fetchSuggestedConnections = async () => {
//     const response = await feedInstance.get("/connections");
//     return response.data
//         .map((conn: unknown) => {
//             const parsed = connectionSchema.safeParse(conn);
//             return parsed.success ? parsed.data : null;
//         })
//         .filter(Boolean);
// };