import useAuthStore from "@/store/authStore";
import useInitStore from "@/store/initStore";
import { Client } from "@stomp/stompjs"
import SockJS from "sockjs-client";





const token = useAuthStore.getState().accessToken;

export const client = new Client({
  webSocketFactory: () =>
    new SockJS("http://localhost:8000/wss"),

  reconnectDelay: 5000,
connectHeaders: {
    Authorization: `Bearer ${token}`,
    },
  onConnect: () => {
    console.log("✅ STOMP connected");

    client.subscribe("/topic/notifications", msg => {
      console.log("Notification:", msg.body);
    });
  },

  onStompError: frame => {
    console.error("Broker error:", frame.headers["message"]);
  }
});

client.activate();
