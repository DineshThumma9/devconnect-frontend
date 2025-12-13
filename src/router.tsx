import { createBrowserRouter, RouterProvider } from "react-router-dom"
import {Layout} from "@/components/layout/layout"
import LoginPage from "@/pages/LoginPage"
import RegisterPage from "@/pages/RegisterPage"
import HomePage from "@/pages/HomePage"
import ProjectDetailsPage from "@/pages/ProjectDetailsPage"
import UserProfilePage from "@/pages/UserProfilePage"
import OAuthCallbackPage from "@/pages/OAuthCallbackPage"
import InterestsPage from "@/pages/InterestsPage"
import PublicRoute from "@/router/PublicRoute"
import PrivateRoute from "@/router/PrivateRoute"

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
          { path: "/profiles/:id", element: <UserProfilePage /> }
        ]
      }
    ]
  }
])

export default function AppRouter() {
  return <RouterProvider router={router} />
}
