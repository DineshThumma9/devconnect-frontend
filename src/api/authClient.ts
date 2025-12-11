import {z} from "zod";

import axios from "axios";
import {UserResponse} from "@/entities/User.ts";


const APIClient = axios.create({
    baseURL: "http://localhost:8000/auth"

})




APIClient.interceptors.response.use((request) => request,
    (error) => {
        if (error.response) {
            console.error(`Error with API Response ${error.response.status}`, error.response.message)
        }
        if (error.request) {
            console.error(`Error in Sending request itself ${error.request}`, error.message)
        } else {
            console.error(`Some error has occured ${error.message}`)
        }
    })


const LoginRequest = z.object({
    accessToken:z.string(),
    refreshToken:z.string()
})

export const register = async (username: string, password: string, email: string, name?: string, profile_pic?: string) => {


    const body = {
        "username": username,
        "name": name,
        "email": email,
        "password": password,
        "profile_pic": profile_pic
    }

    console.log(body)

    const res = await APIClient.post("/register", body, {
        headers: {"Content-Type": "application/json"}
    })

    const parsed = LoginRequest.safeParse(res.data)

    if (!parsed.success) {
        console.error("Zod validation failed:", parsed.error);
        return null;
    }

    return parsed.data;

}

export const getUser = async (email: string) => {
    const res = APIClient.get(`/get-user/${email}`)

    const response = UserResponse.parse(res)

    return response

}


export const deleteUser = async (email: string) => {
    APIClient.get(`/delete-user/${email}`);
}


export const updateUser = async (username?: string, password?: string, email?: string, name?: string, profile_pic?: string) => {


    const body = {
        "username": username,
        "name": name,
        "email": email,
        "password": password,
        "profile_pic": profile_pic
    }
    const res = APIClient.post("/update-user", body, {
        headers: {"Content-Type": "application/json"}
    })

    const response = UserResponse.safeParse(res)

    return response.data

}


export const ProjectRequestSchema = z.object({
    title: z.string().min(1, "Title is required"),
    ownerId: z.string().optional(), // it's not annotated with @NotNull
    description: z.string().min(1, "Description is required"),
    techRequirements: z.array(z.string()).min(1, "At least one tech requirement is required"),
    isPrivate: z.boolean().optional().default(false),
    githubLink: z.string().url("Invalid GitHub link").optional(),
});

export type ProjectRequest = z.infer<typeof ProjectRequestSchema>;


export const createPost = () =>{

}

export const createProject = ()=> {

}


export const loginUser = async (
    data:
        {
            email: string;
            password: string;
        }) => {


    const form = new URLSearchParams();
    form.append("username", data.email);
    form.append("password", data.password);

    const res = await APIClient.post("/login", form, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });

    if (res.status != 200) {
        console.log(res.data)
        console.log(res.data.error)
         throw new Error("Some Error has occured")
    }

    return  LoginRequest.safeParse(res.data);
};