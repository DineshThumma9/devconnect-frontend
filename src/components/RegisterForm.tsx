import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthButton } from "@/components/AuthButton"
import { useState } from "react"
import { register } from "@/api/authClient"
import useAuthStore from "@/store/authStore"
import { useNavigate } from "react-router-dom"
import useInitStore from "@/store/initStore"

export function RegisterForm({
    className,
    ...props
}: React.ComponentProps<"form">) {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const { setAccessToken, setRefreshToken } = useAuthStore()
    const { setUserEmail } = useInitStore()
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (password !== confirmPassword) {
            setError("Passwords do not match")
            return
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters")
            return
        }

        setIsLoading(true)

        try {
            const res = await register(username, password, email)
            if (res?.accessToken && res?.refreshToken) {
                setAccessToken(res.accessToken)
                setRefreshToken(res.refreshToken)
                setUserEmail(email)
                navigate("/app")
            } else {
                setError("Registration failed. Please try again.")
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Registration failed. Please try again.")
            console.error("Register error:", err)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className={cn("flex flex-col gap-6", className)} {...props}>
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Create your account</h1>
                <p className="text-muted-foreground text-sm text-balance">
                    Enter your details to get started
                </p>
                {error && (
                    <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-2 rounded w-full">
                        {error}
                    </div>
                )}
            </div>

            <div className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                        id="username"
                        type="text"
                        placeholder="johndoe"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                </div>

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
                    <Label htmlFor="password">Password</Label>
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

                <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating account..." : "Sign up"}
                </Button>

                <AuthButton 
                    mode="signup" 
                    message="Already have an account?" 
                    route="/login" 
                />
            </div>
        </form>
    )
}
