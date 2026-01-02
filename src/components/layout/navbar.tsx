"use client"

import { Bell, Search, LogOut, User as UserIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useEffect, useState } from "react"
import useAuthStore from "@/store/authStore"
import useInitStore from "@/store/initStore"
import { authInstance } from "@/api/apiClient"
import { useNavigate, Link } from "react-router-dom"
import { Separator } from "@/components/ui/separator"

export function Navbar() {
    const { accessToken, logout } = useAuthStore()
    const [searchQuery, setSearchQuery] = useState("")
    const [type, setType] = useState("users")
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

    // Debug: Log all initStore values
    useEffect(() => {
        console.log("📊 InitStore State:", {
            user_email,
            username,
            name,
            profile_pic,
            interestsCompleted: useInitStore.getState().interestsCompleted
        })
    }, [user_email, username, name, profile_pic])

    const handleLogout = () => {
        logout()
        clearUser()
        navigate("/login")
    }

    
    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-700 bg-gray-900/95 backdrop-blur-lg supports-[backdrop-filter]:bg-gray-900/80 shadow-lg shadow-black/10">
            <div className="flex h-16 items-center justify-between px-4 md:px-6">
                {/* Left */}
                <div className="flex items-center gap-3">
                    <div 
                        onClick={() => {
                            console.log('🏠 Home clicked - navigating to /app');
                            navigate("/app");
                        }}
                        className="hidden sm:flex items-center gap-2 hover:opacity-80 transition-all duration-300 cursor-pointer group"
                    >
                        <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-teal-500/50 transition-all duration-300 group-hover:scale-110">
                            <div className="w-4 h-4 bg-white rounded-sm"></div>
                        </div>
                        <span className="text-xl font-semibold gradient-text">DevConnect</span>
                    </div>
                </div>

                {/* Center */}
                <div className="hidden md:flex flex-1 max-w-md mx-4">
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="bg-gray-800/50 backdrop-blur-sm border border-gray-600 text-white px-3 py-2 rounded-l-md focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all duration-200"
                    >
                        <option value="users">Users</option>
                        <option value="posts">Posts</option>       
                        <option value="tags">Tags</option>
                        <option value="projects">Projects</option>
                    </select>
                    <div className="relative w-full group">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-teal-500 transition-colors" />
                        <Input
                            placeholder="Search..."
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && searchQuery.trim() !== "") {
                                    navigate(`/search/${type}/${encodeURIComponent(searchQuery.trim())}`);
                                }
                            }}
                            className="pl-10 bg-gray-800/50 backdrop-blur-sm border-gray-600 text-white placeholder-gray-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all duration-200"
                        />
                    </div>
                </div>

                {/* Right */}
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate('/notifications')}
                        className="text-gray-300 hover:text-teal-400 hover:bg-gray-800 relative transition-all duration-200"
                    >
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 rounded-full text-xs flex items-center justify-center text-white font-bold shadow-lg animate-pulse">3</span>
                    </Button>

                    {/* Profile Menu */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:ring-2 hover:ring-teal-500 transition-all duration-200">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={profile_pic} alt="Profile" />
                                    <AvatarFallback className="bg-gradient-to-br from-teal-600 to-teal-700 text-white">
                                        {username ? username.substring(0, 2).toUpperCase() : "U"}
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
                                    <p className="text-sm font-medium text-white">{name || username || "User"}</p>
                                    <p className="text-xs text-gray-400">@{username || user_email?.split("@")[0] || "username"}</p>
                                    <p className="text-xs text-gray-500 truncate">{user_email}</p>
                                </div>
                                <Separator className="bg-gray-700" />
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700"
                                    onClick={() => navigate(`/profiles/${username || user_email?.split("@")[0] || "profile"}`)}
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
