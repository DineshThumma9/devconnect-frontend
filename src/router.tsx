import { createBrowserRouter, RouterProvider } from "react-router-dom"
import {Layout} from "@/components/layout/layout"
import LoginPage from "@/pages/LoginPage"
import RegisterPage from "@/pages/RegisterPage"
import HomePage from "@/pages/HomePage"
import ChatPage from "./pages/ChatPage"
import ExplorePage from "@/pages/ExplorePage"
import ProjectDetailsPage from "@/pages/ProjectDetailsPage"
import UserProfilePage from "@/pages/UserProfilePage"
import OAuthCallbackPage from "@/pages/OAuthCallbackPage"
import InterestsPage from "@/pages/InterestsPage"
import PublicRoute from "@/router/PublicRoute"
import PrivateRoute from "@/router/PrivateRoute"
import PostPage from "@/pages/PostPage"
import NotificationPage from "./pages/NotificationPage"
import SearchPage from "./pages/SearchPage"

const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/oauth/callback", element: <OAuthCallbackPage /> }
    ]
  },
  {
    element: <PrivateRoute />,
    children: [
      { path: "/interests", element: <InterestsPage /> },
      {
        element: <Layout />,
        children: [
          { path: "/app", element: <HomePage /> },
          { path: "/projects/:id", element: <ProjectDetailsPage /> },
          { path: "/profiles/:username", element: <UserProfilePage /> },
          { path: "/posts/:id", element: <PostPage /> },
          { path: "/explore", element: <ExplorePage /> },
          { path: "/chat", element: <ChatPage /> },
          { path: "/notifications", element: <NotificationPage /> },
          { path: "/search/:type/:query", element: <SearchPage /> }
        ]
      }
    ]
  }
])

export default function AppRouter() {
  return <RouterProvider router={router} />
}
