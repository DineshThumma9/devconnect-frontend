import useInitStore from "@/store/initStore";
import { useEffect, useState, useRef } from "react";
import { getFollowings } from "@/api/userClient";
import { IMessage } from "@stomp/stompjs";
import { getStompClient } from "@/hooks/useClient";
import { Send } from "lucide-react";
import { MessageType } from "@/entities/Message";
import { axiosInstance } from "@/api/apiClient";
import PageHeader from "@/components/PageHeader";
import { UserResponseType } from "@/entities/User";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { EmptyState } from "@/components/ui/empty-state";

interface Message {
  sender: string;
  content: string;
  timestamp: string;
}

const ChatPage = () => {
  const { username } = useInitStore();

  const [following, setFollowing] = useState<UserResponseType[]>([]);
  const [onChat, setOnChat] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [typeMsg, setTypeMsg] = useState("");
  const [reciver, setReciver] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);



  useEffect(() => {
    if (!username) return;

    getFollowings(username)
      .then(setFollowing)
      .catch(console.error);
  }, [username]);



  useEffect(() => {
    if (!username) return;

    const stomp = getStompClient();
    let subscription: any;

    const waitForConnection = setInterval(() => {
      if (!stomp.connected) return;

      console.log("📡 Subscribed to private message queue");

      subscription = stomp.subscribe(
        `/queue/user/${username}`,
        (message: IMessage) => {
          console.log("📥 Message received on /queue/user/" + username);
          const body = JSON.parse(message.body);
          console.log("📨 New message received:", body);
          setMessages((prev) => [
            ...prev,
            {
              sender: body.senderUsername,
              content: body.content,
              timestamp: body.timestamp,
            },
          ]);
        }
      );

      clearInterval(waitForConnection);
    }, 100);

    return () => {
      clearInterval(waitForConnection);
      subscription?.unsubscribe();
    };
  }, [username]);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  

  const getConversation = async (user1: string, user2: string) => {
    try {
      const res = await axiosInstance.get(`/chat/${user1}/${user2}`);
      setMessages(
        res.data.map((msg: MessageType) => ({
          sender: msg.senderUsername,
          content: msg.content,
          timestamp: msg.timestamp,
        }))
      );
    } catch {
      setMessages([]);
    }

    setReciver(user2);
    setOnChat(true);
  };

  const onClickChat = (user: string) => {
    if (username) getConversation(username, user);
  }

  const sendMessage = () => {
    if (!typeMsg.trim() || !reciver) return;

    const stomp = getStompClient();
    if (!stomp.connected) return;

    stomp.publish({
      destination: "/app/chat.sendMessage",
      body: JSON.stringify({
        senderUsername: username,
        recipientUsername: reciver,
        content: typeMsg,
        timestamp: new Date().toISOString(),
      }),
    });

    setTypeMsg("");
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        icon="💬"
        title="Messages"
        description="Connect with your network"
      />
  
      <div className="flex gap-6 h-[calc(100vh-16rem)]">
        {/* Contacts List */}
        <div className="w-80 flex-shrink-0 bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-gray-700 bg-gray-800/70">
            <h2 className="text-lg font-semibold text-white">Conversations</h2>
            <p className="text-sm text-gray-400 mt-1">{following.length} contacts</p>
          </div>
          <div className="overflow-y-auto h-[calc(100%-5rem)]">
            {following.length === 0 ? (
              <EmptyState
                icon="💬"
                title="No contacts yet"
                description="Start following people to chat"
              />
            ) : (
              following.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => onClickChat(user.username)}
                  className="w-full text-left p-4 border-b border-gray-700/50 hover:bg-gray-700/30 cursor-pointer transition-all duration-200 group bg-transparent"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12 ring-2 ring-gray-700 group-hover:ring-teal-500 transition-all">
                      <AvatarImage
                        src={user.profilePicUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                        alt={user.username}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-teal-600 to-teal-700 text-white text-xs font-semibold">
                        {user.username?.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-white font-medium group-hover:text-teal-400 transition-colors">
                        {user.username}
                      </p>
                      <p className="text-gray-400 text-sm">{user.name}</p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden">
          {onChat ? (
            <div className="flex flex-col h-full">
              <div className="p-4 border-b border-gray-700 bg-gray-800/70">
                <h2 className="text-xl font-semibold text-white">
                  Chat with {reciver}
                </h2>
              </div>
              <div className="flex-1 overflow-y-auto bg-gray-900/30 p-4 flex flex-col">
                {messages.length === 0 ? (
                  <EmptyState
                    icon="💬"
                    title="No messages yet"
                    description="Start the conversation!"
                  />
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.timestamp + msg.sender + msg.content}
                      className={`mb-4 p-3 rounded-lg max-w-xs ${
                        msg.sender === username 
                          ? "bg-teal-500 text-white self-end ml-auto" 
                          : "bg-gray-700 text-gray-300 self-start"
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <span className="text-xs opacity-75 mt-1 block">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
              <div className="p-4 border-t border-gray-700 bg-gray-800/70">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={typeMsg}
                    placeholder="Type a message..."
                    onChange={(e) => setTypeMsg(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                  <button
                    onClick={sendMessage}
                    className="px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors flex items-center gap-2 font-medium"
                  >
                    <Send className="w-5 h-5" />
                    Send
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <EmptyState
              icon="💬"
              title="Select a conversation"
              description="Choose a contact to start chatting"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;