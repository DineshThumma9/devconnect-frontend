import { follow, unfollow } from "@/api/userClient";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {Button} from "@/components/ui/button.tsx";
import useConstants from "@/hooks/useConstants.ts";
import useInitStore from "@/store/initStore";
import { useState } from "react";
import { set } from "zod";

interface ProfileSectionsProps {
    isOwnProfile?: boolean;
    profileUsername: string;
}

const ProfileSections = ({ isOwnProfile = false, profileUsername }: ProfileSectionsProps) => {

    const { username: loggedInUsername, user_email, name, followings } = useInitStore();

    // Display the profile username, not the logged-in user's username
    const displayName = profileUsername;
    
    // Get initials from the profile username
    const getInitials = () => {
        if (profileUsername) return profileUsername.substring(0, 2).toUpperCase();
        return 'U';
    };



    


    
    const [isFollowing, setIsFollowing] = useState<boolean>(followings.includes(profileUsername));



    const handleFollow = async () => {
        if (isFollowing) {
             setIsFollowing(false);
             const res = await unfollow(profileUsername);
        }
        else{
            setIsFollowing(true);
            const res = await follow(profileUsername);
        }
    };


    return (

        <div className="bg-gray-900 px-6 py-12">
            <div className="max-w-6xl mx-auto text-center">
                <Avatar className="w-32 h-32 mx-auto mb-6">
                    <AvatarImage src="" alt={displayName} />
                    <AvatarFallback className="text-2xl bg-teal-600 text-white">{getInitials()}</AvatarFallback>
                </Avatar>
                <h1 className="text-3xl font-bold mb-2">{displayName}</h1>
                <p className="text-gray-400 mb-1">@{profileUsername}</p>
                {/* <p className="text-gray-400 text-sm mb-6">{userData.joinDate}</p> */}
                {!isOwnProfile && (
                    <Button onClick={handleFollow}>
                        {isFollowing ? 'Unfollow' : 'Follow'}
                    </Button>
                )}
            </div>
        </div>
    )
}

export default ProfileSections;
