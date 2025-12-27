// package com.pm.jujutsu.model;

// import lombok.AllArgsConstructor;
// import lombok.Builder;
// import lombok.Data;
// import lombok.NoArgsConstructor;

// import java.time.LocalDateTime;

// @Data
// @Builder
// @AllArgsConstructor
// @NoArgsConstructor
// public class Message {

//    private String id;
//    private String conversationId;
//    private String content;
//    private String recipientUsername;
//    private String senderUsername;
//    private LocalDateTime timestamp;
//    // private boolean read;
   
// }

import { z } from "zod";

const Message = z.object({
    senderUsername: z.string(),
    content: z.string(),
    timestamp: z.string(),
    recipentUsername: z.string().optional(),
});

export type MessageType = z.infer<typeof Message>;




