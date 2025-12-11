import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import useAuthStore from "@/store/authStore"
import useInitStore from "@/store/initStore"

export default function OAuthCallbackPage() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const { setAccessToken, setRefreshToken } = useAuthStore()
    const { setUserEmail } = useInitStore()
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const token = searchParams.get("token")
        const email = searchParams.get("email")
        const errorParam = searchParams.get("error")

        // Handle OAuth error
        if (errorParam) {
            setError(`OAuth failed: ${errorParam}`)
            setTimeout(() => navigate("/login"), 3000)
            return
        }

        // Handle successful OAuth
        if (token && email) {
            // Store tokens in Zustand (which persists to localStorage)
            setAccessToken(token)
            setRefreshToken(token) // If backend provides separate refresh token, use that
            setUserEmail(email)

            // Redirect to app
            navigate("/app")
        } else {
            setError("Missing authentication data from OAuth provider")
            setTimeout(() => navigate("/login"), 3000)
        }
    }, [searchParams, navigate, setAccessToken, setRefreshToken, setUserEmail])

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-950">
                <div className="bg-red-900/20 border border-red-500 text-red-400 px-6 py-4 rounded-lg max-w-md">
                    <h2 className="text-xl font-bold mb-2">Authentication Failed</h2>
                    <p>{error}</p>
                    <p className="text-sm mt-2 text-gray-400">Redirecting to login...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-950">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-300 text-lg">Completing authentication...</p>
            </div>
        </div>
    )
}
