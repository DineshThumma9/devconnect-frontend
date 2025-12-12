"use client"

import { Bell, Search, LogOut, User as UserIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useEffect } from "react"
import useAuthStore from "@/store/authStore"
import useInitStore from "@/store/initStore"
import { axiosInstance } from "@/api/apiClient"
import { useNavigate, Link } from "react-router-dom"
import { Separator } from "@/components/ui/separator"

export function Navbar() {
    const { accessToken, logout } = useAuthStore()
    const {
        setProfilePic,
        setName,
        setUsername,
        clearUser,
        user_email,
        name,
        username,
        profile_pic
    } = useInitStore()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        clearUser()
        navigate("/login")
    }

    useEffect(() => {
        const fetchUser = async () => {
            try {
                if (accessToken) {
                    const res = await axiosInstance.get(`/get-user/${user_email}`, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    })

                    const { name, username, profile_pic } = res.data
                    setName(name)
                    setUsername(username)
                    setProfilePic(profile_pic)
                }
            } catch (error) {
                console.error("Failed to fetch user info:", error)
            }
        }

        fetchUser()
    }, [accessToken, setName, setUsername, setProfilePic, user_email])

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-700 bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/60">
            <div className="flex h-16 items-center justify-between px-4 md:px-6">
                {/* Left */}
                <div className="flex items-center gap-3">
                    <div 
                        onClick={() => {
                            console.log('🏠 Home clicked - navigating to /app');
                            navigate("/app");
                        }}
                        className="hidden sm:flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
                    >
                        <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
                            <div className="w-4 h-4 bg-white rounded-sm"></div>
                        </div>
                        <span className="text-xl font-semibold text-white">DevConnect</span>
                    </div>
                </div>

                {/* Center */}
                <div className="hidden md:flex flex-1 max-w-md mx-4">
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="Search..."
                            className="pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-teal-500 focus:ring-teal-500"
                        />
                    </div>
                </div>

                {/* Right */}
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => console.log("Notifications clicked")}
                        className="text-gray-300 hover:text-teal-400 hover:bg-gray-800 relative transition-colors"
                    >
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 rounded-full text-xs flex items-center justify-center text-white font-bold shadow-lg">3</span>
                    </Button>

                    {/* Profile Menu */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={profile_pic} alt="Profile" />
                                    <AvatarFallback className="bg-teal-600 text-white">
                                        {username?.[0]?.toUpperCase() || "U"}
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent
                            className="w-56 bg-gray-800 border-gray-700"
                            align="end"
                        >
                            <div className="flex flex-col space-y-1">
                                <div className="px-2 py-1.5">
                                    <p className="text-sm font-medium text-white">{name || "User"}</p>
                                    <p className="text-xs text-gray-400">@{username || "username"}</p>
                                    <p className="text-xs text-gray-500 truncate">{user_email}</p>
                                </div>
                                <Separator className="bg-gray-700" />
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700"
                                    onClick={() => navigate(`/profiles/${username || "1"}`)}
                                >
                                    <UserIcon className="mr-2 h-4 w-4" />
                                    Profile
                                </Button>
                                <Separator className="bg-gray-700" />
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-gray-700"
                                    onClick={handleLogout}
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Logout
                                </Button>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
        </header>
    )
}
