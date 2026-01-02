
import { z } from "zod";

const Message = z.object({
    senderUsername: z.string(),
    content: z.string(),
    timestamp: z.string(),
    recipentUsername: z.string().optional(),
});

export type MessageType = z.infer<typeof Message>;




