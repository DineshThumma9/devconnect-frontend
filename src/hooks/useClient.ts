import useAuthStore from "@/store/authStore";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

let client: Client | null = null;


const token = useAuthStore.getState().accessToken;

export function getStompClient() {
  if (client) return client;

  console.log("🔌 Initializing STOMP client with token:", token);

  if(!token){
    console.error("No access token found for STOMP client initialization");
    throw new Error("No access token found for STOMP client initialization");
    
  }
  client = new Client({
    webSocketFactory: () => new SockJS(`http://localhost:8000/wss?access_token=${token}`),
    reconnectDelay: 5000,

   

    onConnect: () => {
      console.log("✅ STOMP connected");
    },

    onStompError: (frame) => {
      console.error("Broker error:", frame.headers["message"]);
    },
  });

  client.activate();
  return client;
}
