import {z} from "zod";


export const UserRequest = z.object({

    username: z.string(),
    name: z.string(),
    email: z.string(),
    password: z.string(),
    profile_pic: z.string().optional()


})


export const UserResponse = z.object({
    id: z.string().optional(),
    name: z.string().optional().nullable(),
    username: z.string(),
    email: z.string(),
    profilePicUrl: z.string().optional().nullable(),  // Changed from profile_pic to match backend
    interests: z.array(z.string()).optional(),
    followers: z.array(z.string()).optional(),
    followings: z.array(z.string()).optional(),
    subscribedProjects: z.array(z.string()).optional(),
})



// @Data
// public class UserResponseDTO {

//     public String id;
//     public String name;
//     public String username;
//     public String email;
//     public String profilePicUrl;
//     public Set<String> interests = new HashSet<>();
    
//     /*
//     Here we have UserResponseDTO but if i set 
//     followers and following to as UserResponseDTO will it be and infinate recurrsion
//     also should i use String or and ObjectId and
//     if do that how can i show username and email 
//     profilePic on frontend if i only pass String for followrs and follwing
    
//      */
//     public Set<String> followers = new HashSet<>();
//     public Set<String> followings = new HashSet<>();
//     public Set<String> subscribedProjects = new HashSet<>();

// }
