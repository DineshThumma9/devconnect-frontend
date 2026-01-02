import {z} from "zod";


export const PostRequest = z.object({
    title: z.string(),
    body: z.string(),
    media: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
})

export const PostResponse = z.object({
    id: z.string(),
    title: z.string(),
    content: z.string().nullable(),
    ownerUsername: z.string().nullable(),
    ownerProfilePicUrl: z.string().nullable(),
    createdAt: z.string(), 
    updatedAt: z.string(),
    likes: z.number(),
    likedByCurrentUser: z.boolean().optional(),
    comments: z.array(z.any()).default([]),
    shares: z.number(),
    media: z.array(z.string()).nullable(),
    tags: z.array(z.string()).default([])
}).transform((data) => ({
    ...data,

    postId: data.id,
    commentsCount: data.comments.length
}))

export type PostRequest = z.infer<typeof PostRequest>;
export type PostResponseType = z.infer<typeof PostResponse>;