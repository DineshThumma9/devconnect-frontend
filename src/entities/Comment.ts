

import { z } from "zod";

export const Comment = z.object({
    id: z.string(),
    comment:z.string(),
    username:z.string(),
    createdAt: z.string(),
    userProfilePicUrl: z.string().nullable().optional()

});   

export type CommentType = z.infer<typeof Comment>;
