import {z} from "zod";
import {UserResponse} from "@/entities/User.ts";


export const PostRequest = z.object({
    title:z.string(),
    description:z.string(),
    post_img : z.string().optional(),

})


export const PostResponse = z.object({
    title:z.string(),
    description:z.string(),
    post_img:z.string().optional(),
    likes:z.number().default(0),
    comments:z.number().default(0),
    shares:z.number().default(0),
    user:UserResponse

})


export type PostRequest = z.infer<typeof PostRequest>;
export type PostResponseType = z.infer<typeof PostResponse>;