import { time } from "console";
import { z } from "zod";



export const Notification = z.object({
    title: z.string(),
    userName: z.string(),
    type: z.string(),
    isRead: z.boolean().optional().default(false),
    timestamp: z.string().optional(),
    message: z.string()
});
export type NotificationType = z.infer<typeof Notification>;
