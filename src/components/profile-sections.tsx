import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {Button} from "@/components/ui/button.tsx";
import useConstants from "@/hooks/useConstants.ts";


const ProfileSections = ()=>{

    const {userData}=useConstants();

    return (

        <div className="bg-gray-900 px-6 py-12">
            <div className="max-w-6xl mx-auto text-center">
                <Avatar className="w-32 h-32 mx-auto mb-6">
                    <AvatarImage src={userData.avatar || "/placeholder.svg"} alt={userData.name}/>
                    <AvatarFallback className="text-2xl">SC</AvatarFallback>
                </Avatar>
                <h1 className="text-3xl font-bold mb-2">{userData.name}</h1>
                <p className="text-gray-400 mb-1">{userData.title}</p>
                <p className="text-gray-400 text-sm mb-6">{userData.joinDate}</p>
                <Button
                    className="bg-gray-800 hover:bg-gray-700">{userData.isFollowing ? "Following" : "Follow"}</Button>
            </div>
        </div>
    )
}

export default ProfileSections;
