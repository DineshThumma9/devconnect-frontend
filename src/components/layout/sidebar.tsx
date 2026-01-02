"use client"
import { useLocation, useNavigate } from "react-router-dom"
import {
  Home,
  Compass,
  Bell,
  MessageCircle,
  User,
  Plus,
  LayoutDashboard,
  ListChecks,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SidebarProps {
  isCollapsed: boolean
  onToggle: () => void
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const location = useLocation()
  const navigate = useNavigate()

  const navigationItems = [
    { name: "Home", icon: Home, path: "/app" },
    // { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Projects", icon: ListChecks, path: "/projects" },
    // { name: "Community", icon: Users, path: "/community" },
    { name: "Explore", icon: Compass, path: "/explore" },
    //{ name: "Notifications", icon: Bell, path: "/notifications" },
    { name: "Messages", icon: MessageCircle, path: "/chat" },
    //{ name: "Profile", icon: User, path: "/profile/1" },
  ]

  return (
    <div
      className={cn(
        "relative flex flex-col h-full bg-gray-900 border-r border-gray-700 transition-all duration-300 ease-in-out shadow-lg",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggle}
        className="absolute -right-3 top-6 z-10 h-6 w-6 rounded-full border border-gray-700 bg-gray-900 text-gray-400 hover:text-white hover:bg-teal-600 hover:border-teal-500 transition-all duration-200 shadow-lg"
      >
        {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </Button>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3 pt-6">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          return (
            <Button
              key={item.name}
              variant="ghost"
              onClick={() => navigate(item.path)}
              className={cn(
                "w-full justify-start gap-3 text-gray-300 hover:text-white hover:bg-gray-800 transition-all duration-200 relative group",
                isActive && "bg-gradient-to-r from-teal-600 to-teal-700 text-white hover:from-teal-700 hover:to-teal-800 shadow-lg",
                isCollapsed && "justify-center px-2",
              )}
            >
              {isActive && !isCollapsed && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full"></div>
              )}
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span className="font-medium">{item.name}</span>}
              {isCollapsed && (
                <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-lg">
                  {item.name}
                </span>
              )}
            </Button>
          )
        })}
      </nav>

      {/* New Post Button */}
      {/* <div className="p-3">
        <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white">
          <Plus className="h-4 w-4 flex-shrink-0" />
          {!isCollapsed && <span className="ml-2">New Project</span>}
        </Button>
      </div> */}
    </div>
  )
}
