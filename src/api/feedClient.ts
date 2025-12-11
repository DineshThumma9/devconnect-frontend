import {feedInstance} from "@/api/apiClient.ts";
import {z} from "zod";
import {postResSchema} from "@/api/postClient.ts";


export const projectResSchema = z.object({
    id: z.string(),                                   // String - required
    title: z.string(),                                // String - required
    description: z.string(),                          // String - required
    techRequirements: z.array(z.string()),            // List<String> - required
    ownerUsername: z.string(),                        // String - required
    ownerProfilePicUrl: z.string().url(),             // URL - required
    isPrivate: z.boolean(),                           // boolean - required
    status: z.string(),                               // String - required
    ownerId: z.string(),                              // String - required
    currentContributors: z.array(z.string()),         // List<String> - required
    pastContributors: z.array(z.string()),            // List<String> - required
    githubLink: z.string().url(),                     // URL - required
    createdAt: z.union([                              // Java Date can be:
        z.string().datetime(),                          // ISO string format
        z.date()                                        // or JS Date object
    ]),
    media: z.array(z.string())                        // String[] - required
});








const connectionSchema = z.object({
    username: z.string(),
    email: z.string(),
    profile_pic: z.string(),
});

// Fetch posts for user feed (for-you)
export const fetchForYouPosts = async () => {
    const response = await feedInstance.get("/for-you");
    return response.data.map((post: unknown) => {
        const parsed = postResSchema.safeParse(post);
        if (!parsed.success) throw new Error("Invalid post format");
        return parsed.data;
    });
};

// Fetch project recommendations
export const fetchProjectRecommendations = async () => {
    const response = await feedInstance.get("/recommendations");
    return response.data.map((proj: unknown) => {
        const parsed = projectResSchema.safeParse(proj);
        if (!parsed.success) throw new Error("Invalid project format");
        return parsed.data;
    });
};

// Fetch suggested connections for a specific user
export const fetchSuggestedConnectionsForUser = async (username: string) => {
    const response = await feedInstance.get(`/${username}/suggested-connections`);
    return response.data
        .map((conn: unknown) => {
            const parsed = connectionSchema.safeParse(conn);
            return parsed.success ? parsed.data : null;
        })
        .filter(Boolean);
};

// Legacy endpoints (kept for backward compatibility)

// Fetch feed posts
export const fetchFeedPosts = async () => {
    const response = await feedInstance.get("/feed/posts");
    return response.data.map((post: unknown) => {
        const parsed = postResSchema.safeParse(post);
        if (!parsed.success) throw new Error("Invalid post format");
        return parsed.data;
    });
};

// Fetch feed projects
export const fetchFeedProjects = async () => {
    const response = await feedInstance.get("/feed/projects");
    return response.data.map((proj: unknown) => {
        const parsed = projectResSchema.safeParse(proj);
        if (!parsed.success) throw new Error("Invalid project format");
        return parsed.data;
    });
};

// Fetch suggested connections
export const fetchSuggestedConnections = async () => {
    const response = await feedInstance.get("/connections");
    return response.data
        .map((conn: unknown) => {
            const parsed = connectionSchema.safeParse(conn);
            return parsed.success ? parsed.data : null;
        })
        .filter(Boolean);
};