

import { z } from "zod";

export const Comment = z.object({
    id: z.string(),
    comment:z.string(),
    username:z.string(),
    createdAt: z.union([z.string().datetime(), z.date()]),
    userProfilePicUrl: z.string().optional(),

});   

export type CommentType = z.infer<typeof Comment>;
