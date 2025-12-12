import { projectInstance } from "@/api/apiClient";
import { z } from "zod";
import { ProjectResponse ,ProjectRequest} from "@/entities/Project";



// ✅ Response DTO schema - matches ProjectResponseDTO

// ✅ Create project
export const createProject = async (project: z.infer<typeof ProjectRequest>) => {
    const parsed = ProjectRequest.safeParse(project);
    if (!parsed.success) {
        throw new Error("Invalid project data: " + JSON.stringify(parsed.error.format()));
    }

    const response = await projectInstance.post("/create", parsed.data);
    return response.data;
};

// ✅ Delete project
export const deleteProject = async (projectId: string) => {
    const response = await projectInstance.delete(`/delete/${projectId}`);
    return response.data;
};

// ✅ Get project by ID
export const getProject = async (id: string) => {
    const response = await projectInstance.get(`/id/${id}`);
    const parsed = ProjectResponse.safeParse(response.data);

    if (!parsed.success) {
        throw new Error("Invalid response format from server.");
    }

    return parsed.data;
};

// ✅ Update project
export const updateProject = async (
    id: string,
    updatedData: z.infer<typeof ProjectRequest>
) => {
    const parsed = ProjectRequest.safeParse(updatedData);
    if (!parsed.success) {
        throw new Error("Invalid update payload: " + JSON.stringify(parsed.error.format()));
    }

    const response = await projectInstance.put(`/update/${id}`, parsed.data);
    return response.data;
};


export const getProjectsByUser = async (username: string): Promise<z.infer<typeof ProjectResponse>[]> => {
    const response = await projectInstance.get(`/get-projects/${username}`);
    return response.data;
}
