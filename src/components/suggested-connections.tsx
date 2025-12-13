import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.tsx"
import { Button } from "@/components/ui/button.tsx"

interface Connection {
    username: string
    email: string
    profile_pic: string
}

interface Props {
    connection: Connection
}

const SuggestedConnections = ({ connection }: Props) => {
    return (
        <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-800/50 transition-colors group">
            <div className="flex items-center gap-3 flex-1 min-w-0">
                <Avatar className="ring-2 ring-gray-700 group-hover:ring-teal-500 transition-all">
                    <AvatarImage 
                        src={connection.profile_pic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${connection.username}`} 
                        alt={connection.username} 
                    />
                    <AvatarFallback className="bg-teal-600 text-white font-semibold">
                        {connection.username.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-white group-hover:text-teal-400 transition-colors truncate">@{connection.username}</h4>
                    <p className="text-gray-400 text-sm truncate">{connection.email}</p>
                </div>
            </div>
            <Button 
                variant="outline" 
                size="sm" 
                className="border-teal-600 text-teal-400 hover:bg-teal-600 hover:text-white hover:border-teal-500 transition-all duration-200 flex-shrink-0"
            >
                Connect
            </Button>
        </div>
    )
}

export default SuggestedConnections