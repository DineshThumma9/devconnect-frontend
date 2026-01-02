import { time } from "console";
import { z } from "zod";



export const Notification = z.object({
    id: z.string().optional(),
    title: z.string().optional(),
    userName: z.string().nullable().optional(),
    type: z.string(),
    isRead: z.boolean().optional().default(false),
    timestamp: z.number().optional(),
    message: z.string()
});
export type NotificationType = z.infer<typeof Notification>;
