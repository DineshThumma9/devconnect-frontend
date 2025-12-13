import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface TeamMember {
  id: string
  name: string
  avatar: string
}

interface TeamAvatarsProps {
  members: TeamMember[]
  maxVisible?: number
}

export function TeamAvatars({ members, maxVisible = 5 }: TeamAvatarsProps) {
  const visibleMembers = members.slice(0, maxVisible)
  const remainingCount = members.length - maxVisible

  return (
    <div className="flex -space-x-2">
      {visibleMembers.map((member) => (
        <Avatar key={member.id} className="w-10 h-10 border-2 border-gray-900">
          <AvatarImage 
            src={member.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`} 
            alt={member.name} 
          />
          <AvatarFallback className="bg-gray-800 text-white text-xs">
            {member.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
      ))}
      {remainingCount > 0 && (
        <div className="w-10 h-10 bg-gray-800 border-2 border-gray-900 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-medium">+{remainingCount}</span>
        </div>
      )}
    </div>
  )
}
