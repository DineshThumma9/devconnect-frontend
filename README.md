
# DevConnect - Frontend

The client-side application for **DevConnect**, a developer collaboration platform designed to help coders connect, collaborate, and grow together.

This repository contains the frontend logic, built with a focus on real-time interaction, clean UI, and efficient state management.

## 🚀 Tech Stack

- **Language:** TypeScript
- **Framework:** React (Vite)
- **Styling:** Tailwind CSS + [shadcn/ui](https://ui.shadcn.com/)
- **State Management:** Zustand (Session & Global Store)
- **Networking:** Axios (REST API)
- **Real-time:** WebSockets (Live chat & Notifications)

## ✨ Key Features

* **Real-time Collaboration:** Powered by WebSockets for instant messaging and live notifications.
* **Developer Profiles:** Rich profile management with portfolio showcases.
* **Session Management:** Secure and lightweight auth state handling using Zustand.
* **Responsive UI:** A modern, accessible interface built with Shadcn components.

## 🛠️ Installation & Setup

### Prerequisites
Ensure you have Node.js (v18+) and npm/yarn/pnpm installed.

### 1. Clone the repository
```bash
git clone https://github.com/DineshThumma9/devconnect-frontend.git
cd devconnect-frontend

```

### 2. Install dependencies

```bash
npm install

```

### 3. Environment Configuration

Create a `.env` file in the root directory and configure your backend endpoints:

```env
VITE_API_BASE_URL=http://localhost:8080/api/v1

```

### 4. Run the development server

```bash
npm run dev

```

## 📂 Project Structure

```bash
src/
├── components/      # Reusable Shadcn UI components       # Feature-based modules (Auth, Chat, Feed)
├── hooks/           # Custom React hooks (useWebSocket, etc.)
├── lib/             # Utilities (Axios instance, utils.ts)
├── store/           # Zustand stores (useAuthStore, useChatStore)
├── models/           # TypeScript interfaces and types
└── App.tsx

```

## 🔌 Backend Integration

This frontend is designed to consume the **DevConnect Backend** (Spring Boot + Neo4j). Ensure the backend service is running for full functionality, particularly for:

* Authentication flow.
* Graph-based user recommendations.
* WebSocket handshake for chat services.

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

```

Would you like me to create a `CONTRIBUTING.md` file as well to help others onboard to the project?

```
