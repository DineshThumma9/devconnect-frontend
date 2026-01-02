
import { z } from 'zod';




const Conversation = z.object({
    id: z.string(),
    senderUsername: z.string(),
    recipientUsername: z.string(),
    timestamp: z.string(),
    lastMessage: z.string()
})


export type ConversationType = z.infer<typeof Conversation>;
