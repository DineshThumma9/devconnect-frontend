import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {Button} from "@/components/ui/button.tsx";
import useConstants from "@/hooks/useConstants.ts";
import useInitStore from "@/store/initStore";

interface ProfileSectionsProps {
    isOwnProfile?: boolean;
}

const ProfileSections = ({ isOwnProfile = false }: ProfileSectionsProps) => {

    const {userData}=useConstants();
    const { username, user_email, name } = useInitStore();

    // Get display name: username > name from store > email prefix
    const displayName = username || name || user_email?.split('@')[0] || 'User';
    
    // Get initials for avatar fallback
    const getInitials = () => {
        if (username) return username.substring(0, 2).toUpperCase();
        if (name) return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        if (user_email) return user_email.substring(0, 2).toUpperCase();
        return 'U';
    };

    return (

        <div className="bg-gray-900 px-6 py-12">
            <div className="max-w-6xl mx-auto text-center">
                <Avatar className="w-32 h-32 mx-auto mb-6">
                    <AvatarImage 
                        src={userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}`} 
                        alt={displayName}
                    />
                    <AvatarFallback className="text-2xl">{getInitials()}</AvatarFallback>
                </Avatar>
                <h1 className="text-3xl font-bold mb-2">{displayName}</h1>
                <p className="text-gray-400 mb-1">{user_email}</p>
                <p className="text-gray-400 text-sm mb-6">{userData.joinDate}</p>
                {!isOwnProfile && (
                    <Button
                        className="bg-gray-800 hover:bg-gray-700">{userData.isFollowing ? "Following" : "Follow"}</Button>
                )}
            </div>
        </div>
    )
}

export default ProfileSections;
