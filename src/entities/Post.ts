import {z} from "zod";

// ✅ Post Request Schema - matches backend DTO
export const PostRequest = z.object({
    title: z.string(),
    body: z.string(),
    media: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
})

// ✅ Post Response Schema - matches backend DTO
export const PostResponse = z.object({
    id: z.string(),
    title: z.string(),
    content: z.string().nullable(),
    ownerUsername: z.string().nullable(),
    ownerProfilePicUrl: z.string().nullable(),
    createdAt: z.string(), // Backend sends: "2025-12-12T14:55:00.345+00:00"
    updatedAt: z.string(),
    likes: z.number(),
    comments: z.array(z.any()).default([]),
    shares: z.number(),
    media: z.array(z.string()).nullable(),
    tags: z.array(z.string()).default([])
}).transform((data) => ({
    ...data,
    // Backwards compatibility - add computed fields
    postId: data.id,
    commentsCount: data.comments.length
}))

export type PostRequest = z.infer<typeof PostRequest>;
export type PostResponseType = z.infer<typeof PostResponse>;