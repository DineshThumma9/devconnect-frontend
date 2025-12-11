import {create} from "zustand";
import {persist} from "zustand/middleware";



type UserState = {
    user_email:string,
    profile_pic:string,
    username:string,
    name:string



    setUserEmail : (email:string)=>void,
    setUsername:(username:string) => void,
    setName:(name:string) => void,
    setProfilePic:(profile_pic:string) => void,
    clearUser: () => void

}

const useInitStore = create<UserState>()(
    persist(
        (set) => ({
             user_email:"",
            profile_pic:"",
            username:"",
            name:"",

            setName:(name:string) => set({name}),
            setUserEmail:(email:string) => set({user_email:email}),
            setProfilePic:(profile) => set({profile_pic:profile}),
            setUsername:(username) => set({username:username}),
            clearUser: () => set({user_email: "", profile_pic: "", username: "", name: ""})


        }),
        {
           name: "init-me"
        }
    )

)

export default useInitStore