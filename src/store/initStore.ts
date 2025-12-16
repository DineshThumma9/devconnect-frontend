import {create} from "zustand";
import {persist} from "zustand/middleware";



type UserState = {
    id: string,
    user_email: string,
    profile_pic: string,
    username: string,
    name: string,
    interests: string[],
    followers: string[],
    followings: string[],
    subscribedProjects: string[],
    interestsCompleted: boolean
    
    setId: (id: string) => void,
    setUserEmail: (email: string) => void,
    setUsername: (username: string) => void,
    setName: (name: string) => void,
    setProfilePic: (profile_pic: string) => void,
    setInterests: (interests: string[]) => void,
    setFollowers: (followers: string[]) => void,
    setFollowings: (followings: string[]) => void,
    setSubscribedProjects: (subscribedProjects: string[]) => void,
    setInterestsCompleted: (completed: boolean) => void,
    clearUser: () => void

}

const useInitStore = create<UserState>()(
    persist(
        (set) => ({
            id: "",
            user_email: "",
            profile_pic: "",
            username: "",
            name: "",
            interests: [],
            followers: [],
            followings: [],
            subscribedProjects: [],
            interestsCompleted: false,

            setId: (id: string) => {
                console.log("🏪 setId called with:", id)
                set({id})
            },
            setName: (name: string) => {
                console.log("🏪 setName called with:", name)
                set({name})
            },
            setUserEmail: (email: string) => {
                console.log("🏪 setUserEmail called with:", email)
                set({user_email: email})
            },
            setProfilePic: (profile: string) => {
                console.log("🏪 setProfilePic called with:", profile)
                set({profile_pic: profile})
            },
            setUsername: (username: string) => {
                console.log("🏪 setUsername called with:", username)
                set({username})
            },
            setInterests: (interests: string[]) => {
                console.log("🏪 setInterests called with:", interests)
                set({interests})
            },
            setFollowers: (followers: string[]) => {
                console.log("🏪 setFollowers called with:", followers)
                set({followers})
            },
            setFollowings: (followings: string[]) => {
                console.log("🏪 setFollowings called with:", followings)
                set({followings})
            },
            setSubscribedProjects: (subscribedProjects: string[]) => {
                console.log("🏪 setSubscribedProjects called with:", subscribedProjects)
                set({subscribedProjects})
            },
            setInterestsCompleted: (completed: boolean) => {
                console.log("🏪 setInterestsCompleted called with:", completed)
                set({interestsCompleted: completed})
            },
            clearUser: () => {
                console.log("🏪 clearUser called")
                set({
                    id: "",
                    user_email: "",
                    profile_pic: "",
                    username: "",
                    name: "",
                    interests: [],
                    followers: [],
                    followings: [],
                    subscribedProjects: [],
                    interestsCompleted: false
                })
            }


        }),
        {
           name: "init-me"
        }
    )

)

export default useInitStore