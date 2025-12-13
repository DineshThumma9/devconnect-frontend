import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthButton } from "@/components/AuthButton"
import { useState } from "react"
import { loginUser } from "@/api/authClient"
import { useNavigate } from "react-router-dom"
import useInitStore from "@/store/initStore"
import useAuthStore from "@/store/authStore"

export function LoginForm({ className, ...props }: React.ComponentProps<"form">) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const { setAccessToken, setRefreshToken } = useAuthStore()
    const { setUserEmail, setUsername, setName, setProfilePic } = useInitStore()
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setIsLoading(true)

        try {
            const res = await loginUser({ email, password })
            console.log("📥 Full Login response:", JSON.stringify(res, null, 2))
            console.log("📥 res.success:", res?.success)
            console.log("📥 res.data:", res?.data)
            console.log("📥 res.data.user:", res?.data?.user)
            
            if (res?.success && res.data) {
                const { accessToken, refreshToken, user } = res.data
                
                console.log("🔍 Extracted from res.data:", { accessToken: !!accessToken, refreshToken: !!refreshToken, user })
                
                // Store tokens
                setAccessToken(accessToken)
                setRefreshToken(refreshToken)
                
                // Store user data in initStore
                if (user) {
                    console.log("👤 User object:", user)
                    console.log("👤 user.email:", user.email)
                    console.log("👤 user.username:", user.username)
                    console.log("👤 user.profilePicUrl:", user.profilePicUrl)
                    
                    setUserEmail(user.email)
                    setUsername(user.username)
                    setProfilePic(user.profilePicUrl || "")
                    setName(user.username) // Use username as name if name not provided
                    
                    console.log("✅ User data stored:", { email: user.email, username: user.username, profilePicUrl: user.profilePicUrl })
                } else {
                    console.error("❌ No user object in response!")
                }
                
                navigate("/app")
            } else {
                setError("Invalid email or password")
            }
        } catch (err) {
            setError("Login failed. Please check your credentials and try again.")
            console.error("Login error:", err)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className={cn("flex flex-col gap-6", className)} {...props}>
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground text-sm text-balance">
                    Enter your credentials to access your account
                </p>
                {error && (
                    <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-2 rounded w-full">
                        {error}
                    </div>
                )}
            </div>

            <div className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                </div>

                <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <button
                            type="button"
                            className="text-sm text-muted-foreground hover:text-foreground underline-offset-4 hover:underline"
                            onClick={() => alert("Password reset functionality coming soon")}
                        >
                            Forgot password?
                        </button>
                    </div>
                    <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign in"}
                </Button>

                <AuthButton 
                    mode="login" 
                    message="Don't have an account?" 
                    route="/register" 
                />
            </div>
        </form>
    )
}
