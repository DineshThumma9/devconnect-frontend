import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserResponseType } from "@/entities/User";
import { useNavigate } from "react-router-dom";

interface UserListItemProps {
    user: UserResponseType;
    onClick?: () => void;
    showBio?: boolean;
    actions?: React.ReactNode;
}

export default function UserListItem({ user, onClick, showBio = false, actions }: UserListItemProps) {
    const navigate = useNavigate();

    const handleClick = () => {
        if (onClick) {
            onClick();
        } else {
            navigate(`/profile/${user.username}`);
        }
    };

    return (
        <div
            className="flex items-center gap-3 p-3 hover:bg-gray-700/30 rounded-lg transition-colors cursor-pointer group"
            onClick={handleClick}
        >
            <Avatar className="w-12 h-12 ring-2 ring-gray-700 group-hover:ring-teal-500 transition-all">
                <AvatarImage
                    src={user.profilePicUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                    alt={user.username}
                />
                <AvatarFallback className="bg-gradient-to-br from-teal-600 to-teal-700 text-white text-xs font-semibold">
                    {user.username?.substring(0, 2).toUpperCase()}
                </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
                <p className="text-white font-semibold truncate group-hover:text-teal-400 transition-colors">
                    {user.name || user.username}
                </p>
                <p className="text-gray-400 text-sm truncate">@{user.username}</p>
                {showBio && user.bio && (
                    <p className="text-gray-500 text-xs truncate mt-1">{user.bio}</p>
                )}
            </div>
            {actions && (
                <div onClick={(e) => e.stopPropagation()}>
                    {actions}
                </div>
            )}
        </div>
    );
}
