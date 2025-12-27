

import { time } from 'console';
import { z } from 'zod';

// @Data
// @Document("conversations")
// public class Conversation {
    
//     @Id
//     private String id;
//     private String recipentUsername;
//     private String authorUsername;
//     private long timestamp;
//     private String lastMessage;


// }



const Conversation = z.object({
    id: z.string(),
    senderUsername: z.string(),
    recipientUsername: z.string(),
    timestamp: z.string(),
    lastMessage: z.string()
})


export type ConversationType = z.infer<typeof Conversation>;
