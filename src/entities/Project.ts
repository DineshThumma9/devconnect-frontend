import {z} from "zod";
import {UserResponse} from "@/entities/User.ts";
export const ProjectRequest = z.object({
    title: z.string().min(1, "Title is required"),
    ownerId: z.string().optional(),
    description: z.string().min(1, "Description is required"),
    techRequirements: z.array(z.string()).default([]),
    isPrivate: z.boolean().optional().default(false),
    githubLink: z.string().optional(),
    media: z.array(z.string()).optional(),
});


export const ProjectResponse = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    techRequirements: z.array(z.string()).default([]),
    ownerUsername: z.string().nullable().optional(),
    ownerProfilePicUrl: z.string().optional().nullable(),
    isPrivate: z.boolean().optional().default(false),
    status: z.string(),
    ownerId: z.string(),
    currentContributors: z.array(z.string()).default([]),
    githubLink: z.string().optional().nullable(),
    createdAt: z.string(),
    media: z.array(z.string()).optional().nullable(),
});

export type ProjectRequest = z.infer<typeof ProjectRequest>;
export type ProjectResponseType = z.infer<typeof ProjectResponse>;
