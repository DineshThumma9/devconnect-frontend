import {z} from "zod";


export const UserRequest = z.object({

    username: z.string(),
    name: z.string(),
    email: z.string(),
    password: z.string(),
    profile_pic: z.string().optional()


})


export const UserResponse = z.object({
    id: z.string().optional(),
    name: z.string().optional().nullable(),
    username: z.string(),
    email: z.string(),
    profilePicUrl: z.string().optional().nullable(),  
    interests: z.array(z.string()).optional(),
    followers: z.array(z.string()).optional(),
    followings: z.array(z.string()).optional(),
    subscribedProjects: z.array(z.string()).optional(),
})


export type UserResponseType = z.infer<typeof UserResponse>;


