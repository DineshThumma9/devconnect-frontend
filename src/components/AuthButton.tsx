import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

interface AuthButtonProps {
    readonly mode: "login" | "signup"
    readonly message: string
    readonly route: string
}

export function AuthButton({ mode, message, route }: AuthButtonProps) {
    const navigate = useNavigate()
    const actionText = mode === "login" ? "Sign up" : "Sign in"

    const handleOauthLogin = (provider: "github" | "google") => (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
             e.stopPropagation()
    
        const oauthUrls: Record<string, string> = {
          github: `http://localhost:8000/oauth2/authorization/github`,
            google: `http://localhost:8000/oauth2/authorization/google`,
    }
    
   
        // Redirect to backend OAuth endpoint - user will authenticate and be redirected back
        window.location.href = oauthUrls[provider]
    }

    return (
        <>
            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                    Or continue with
                </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <Button 
                    type="button"
                    variant="outline" 
                    onClick={handleOauthLogin("github")}
                    className="border-gray-600 text-gray-200 hover:bg-gray-700 hover:text-white hover:border-gray-500 transition-colors"
                >
                    <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path
                            d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                            fill="currentColor"
                        />
                    </svg>
                    GitHub
                </Button>

                <Button 
                    type="button"
                    variant="outline" 
                    onClick={handleOauthLogin("google")}
                    className="border-gray-600 text-gray-200 bg-gray-700 text-white border-gray-500 transition-colors"
                >
                    <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 533.5 544.3">
                        <path
                            d="M533.5 278.4c0-17.7-1.6-35.1-4.7-51.8H272.1v97.9h146.9c-6.4 34.7-25.7 64.1-54.8 83.7v69.6h88.7c51.9-47.8 81.6-118.3 81.6-199.4z"
                            fill="#4285F4"
                        />
                        <path
                            d="M272.1 544.3c73.8 0 135.7-24.5 180.9-66.4l-88.7-69.6c-24.6 16.5-56.1 26-92.2 26-70.9 0-130.9-47.9-152.4-112.3H27.6v70.6c45.1 89.6 137.3 151.7 244.5 151.7z"
                            fill="#34A853"
                        />
                        <path
                            d="M119.7 322.1c-10.4-30.6-10.4-63.7 0-94.3v-70.6H27.6c-43.7 87.5-43.7 190.3 0 277.8l92.1-70.6z"
                            fill="#FBBC04"
                        />
                        <path
                            d="M272.1 107.7c39.7-.6 77.9 13.8 107.5 40.8l80.5-80.5C408.3 24.3 342.2-.5 272.1 0 165 0 72.7 62.1 27.6 151.7l92.1 70.6c21.5-64.4 81.5-112.3 152.4-114.6z"
                            fill="#EA4335"
                        />
                    </svg>
                    Google
                </Button>
            </div>

            <div className="text-center text-sm text-muted-foreground">
                {message}{" "}
                <button
                    type="button"
                    onClick={() => navigate(route)}
                    className="underline underline-offset-4 hover:text-foreground"
                >
                    {actionText}
                </button>
            </div>
        </>
    )
}
