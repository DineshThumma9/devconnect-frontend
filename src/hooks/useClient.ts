import useAuthStore from "@/store/authStore";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

let client: Client | null = null;

export function getStompClient() {
  if (client) return client;

  client = new Client({
    webSocketFactory: () => new SockJS("http://localhost:8000/wss"),
    reconnectDelay: 5000,

    connectHeaders: {
      Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
    },

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
