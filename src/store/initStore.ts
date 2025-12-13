import {create} from "zustand";
import {persist} from "zustand/middleware";



type UserState = {
    user_email:string,
    profile_pic:string,
    username:string,
    name:string,
    interestsCompleted:boolean



    setUserEmail : (email:string)=>void,
    setUsername:(username:string) => void,
    setName:(name:string) => void,
    setProfilePic:(profile_pic:string) => void,
    setInterestsCompleted: (completed:boolean) => void,
    clearUser: () => void

}

const useInitStore = create<UserState>()(
    persist(
        (set) => ({
             user_email:"",
            profile_pic:"",
            username:"",
            name:"",
            interestsCompleted:false,

            setName:(name:string) => {
                console.log("🏪 setName called with:", name)
                set({name})
            },
            setUserEmail:(email:string) => {
                console.log("🏪 setUserEmail called with:", email)
                set({user_email:email})
            },
            setProfilePic:(profile) => {
                console.log("🏪 setProfilePic called with:", profile)
                set({profile_pic:profile})
            },
            setUsername:(username) => {
                console.log("🏪 setUsername called with:", username)
                set({username:username})
            },
            setInterestsCompleted:(completed:boolean) => {
                console.log("🏪 setInterestsCompleted called with:", completed)
                set({interestsCompleted:completed})
            },
            clearUser: () => {
                console.log("🏪 clearUser called")
                set({user_email: "", profile_pic: "", username: "", name: "", interestsCompleted: false})
            }


        }),
        {
           name: "init-me"
        }
    )

)

export default useInitStore