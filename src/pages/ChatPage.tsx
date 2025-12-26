import useInitStore from "@/store/initStore";
import { useEffect, useState } from "react";
import { getFollowers, getFollowings } from "@/api/userClient";
import { Client, IMessage } from "@stomp/stompjs"
import {client} from "@/hooks/useClient";
import { Send } from "lucide-react";


interface Message {
    sender: string;
    content: string;
    timestamp: string;
}
const ChatPage = () => {


  const [following, setFollowing] = useState<any[]>([]);
  const  [onChat, setOnChat] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
    const [typeMsg, setTypeMsg] = useState("");
    const [reciver, setReciver] = useState("");

  const {username} = useInitStore();

  useEffect(() => { 
    getFollowings(username!).then((data) => {
      console.log("Followers data:", data);
      setFollowing(data);
    }).catch((error) => {
      console.error("Error fetching followers:", error);
    });
  }, []);


  const getConversation = (user1: string, user2: string) => {

    const conversation = axios.get(`/chat/conversation/${user1}/${user2}`);
    const messages = conversation.data.map((msg: any) => ({
        sender: msg.senderUsername,
        content: msg.content,
        timestamp: msg.timestamp
    }));
    setMessages(messages);
    setOnChat(true);
    setReciver(user2);

  }

  const onClickChat = (recipientUsername: string) => {
    getConversation(username!, recipientUsername);
  }


//   @Data
// @Builder
// @AllArgsConstructor
// @NoArgsConstructor
// public class ChatMessageDTO {
    
    
//     // public enum MessageType {
//     //     CHAT,           // Regular text message
//     //     TYPING,         // User is typing indicator
//     //     STOP_TYPING,    // User stopped typing
//     //     JOIN,           // User joined conversation
//     //     LEAVE           // User left conversation
//     // }
    
//     private String id;
//     private String conversationId;
//     private String senderUsername;
//     private String recipientUsername;
//     private String content;
//     // private MessageType type;
//     private LocalDateTime timestamp;
//     // private boolean read;
// }


  const sendMessage = () => {
    if (typeMsg.trim() === "") return;
    const newMessage: Message = {
        sender: username!,
        content: typeMsg,
        timestamp: new Date().toISOString()
    };
    setMessages([...messages, newMessage]);
    const messagePayload = {
        senderUsername: username!,
        content: typeMsg,
        recipientUsername: reciver,
        timestamp: new Date().toISOString()
    }
    client.publish({
        destination: "/app/chat.sendMessage", 
        body: JSON.stringify(messagePayload)
    })
    setTypeMsg("");
  }




  return (
    <div className="space-y-6">
        {/* Page Header */}
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                <span className="text-teal-500">💬</span>
                Messages
            </h1>
            <p className="text-gray-400 text-lg">Connect with your network</p>
        </div>

        {/* Chat Interface */}
        <div className="flex gap-6 h-[calc(100vh-16rem)]">
            {/* User List */}
            <div className="w-80 flex-shrink-0 bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden">
                <div className="p-4 border-b border-gray-700 bg-gray-800/70">
                    <h2 className="text-lg font-semibold text-white">Conversations</h2>
                    <p className="text-sm text-gray-400 mt-1">{following.length} contacts</p>
                </div>
                <div className="overflow-y-auto h-[calc(100%-5rem)]">
                    {following.length === 0 ? (
                        <div className="p-6 text-center">
                            <p className="text-gray-400">No contacts yet</p>
                            <p className="text-gray-500 text-sm mt-1">Start following people to chat</p>
                        </div>
                    ) : (
                        following.map((user: any) => (
                            <div
                                key={user.id}
                                onClick={() => onClickChat(user.username)}
                                className="p-4 border-b border-gray-700/50 hover:bg-gray-700/30 cursor-pointer transition-all duration-200 group"
                            >
                                <div className="flex items-center gap-3">
                                    <img
                                        src={user.profilePicUrl}
                                        alt={user.username}
                                        className="w-12 h-12 rounded-full ring-2 ring-gray-700 group-hover:ring-teal-500 transition-all"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-white font-semibold truncate group-hover:text-teal-400 transition-colors">
                                            @{user.username}
                                        </h3>
                                        <p className="text-gray-400 text-sm truncate">Click to start chatting</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden">
                {onChat ? (
                    <div className="flex flex-col h-full">
                        <div className="p-4 border-b border-gray-700 bg-gray-800/70">
                            <h2 className="text-xl font-semibold text-white">Chat with Username</h2>
                        </div>
                        <div className="flex-1 overflow-y-auto bg-gray-900/30 p-4">
                            {messages.length === 0 ? (
                                <p className="text-gray-300 text-center">Chat messages will be displayed here.</p>
                            ) : (
                                messages.map((msg, index) => (
                                    <div
                                        key={index}
                                        className={`mb-4 p-3 rounded-lg max-w-xs ${
                                            msg.sender === username ? "bg-teal-500 text-white self-end" : "bg-gray-700 text-gray-300 self-start"
                                        }`}
                                    >
                                        <p className="text-sm">{msg.content}</p>
                                        <span className="text-xs text-gray-200 mt-1 block">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="p-4 border-t border-gray-700 bg-gray-800/70">
                            <input
                                type="text"
                                placeholder="Type a message..."
                                onChange={(e) => setTypeMsg(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            />
                            <Send onClick={sendMessage}/>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <div className="text-6xl mb-4">💬</div>
                            <p className="text-gray-300 text-lg mb-2">Select a conversation</p>
                            <p className="text-gray-500 text-sm">Choose a contact to start chatting</p>
                        </div>
                    </div>
                    
                )}
            </div>
        </div>
    </div>
  )
}
export default ChatPage;