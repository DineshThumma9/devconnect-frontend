import useInitStore from "@/store/initStore";
import { useEffect, useState, useRef } from "react";
import { getFollowings } from "@/api/userClient";
import { IMessage } from "@stomp/stompjs";
import { getStompClient } from "@/hooks/useClient";
import { Send } from "lucide-react";
import axios from "axios";
import { MessageType } from "@/entities/Message";

interface Message {
  sender: string;
  content: string;
  timestamp: string;
}

const ChatPage = () => {
  const { username } = useInitStore();

  const [following, setFollowing] = useState<any[]>([]);
  const [onChat, setOnChat] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [typeMsg, setTypeMsg] = useState("");
  const [reciver, setReciver] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  /* ---------------- FOLLOWING LIST ---------------- */

  useEffect(() => {
    if (!username) return;

    getFollowings(username)
      .then(setFollowing)
      .catch(console.error);
  }, [username]);

  /* ---------------- STOMP SUBSCRIPTION ---------------- */

  useEffect(() => {
    if (!username) return;

    const stomp = getStompClient();
    let subscription: any;

    const waitForConnection = setInterval(() => {
      if (!stomp.connected) return;

      console.log("📡 Subscribed to private message queue");

      subscription = stomp.subscribe(
        "/user/queue/messages",
        (message: IMessage) => {
          const body = JSON.parse(message.body);

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

  /* ---------------- AUTOSCROLL ---------------- */

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ---------------- LOAD CONVERSATION ---------------- */

  const getConversation = async (user1: string, user2: string) => {
    try {
      const res = await axios.get(`/chat/${user1}/${user2}`);

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


  const onClickChat = (user:string)=>{
    getConversation(username!,user)
  }

  /* ---------------- SEND MESSAGE ---------------- */

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
                <h2 className="text-xl font-semibold text-white">
                  Chat with @{reciver}
                </h2>
              </div>
              <div className="flex-1 overflow-y-auto bg-gray-900/30 p-4 flex flex-col">
                {messages.length === 0 ? (
                  <p className="text-gray-300 text-center">No messages yet. Start the conversation!</p>
                ) : (
                  messages.map((msg, index) => (
                    <div
                      key={index}
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
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!typeMsg.trim()}
                    className="px-4 py-3 bg-teal-500 hover:bg-teal-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5 text-white" />
                  </button>
                </div>
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