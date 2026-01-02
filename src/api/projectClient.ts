import { projectInstance } from "@/api/apiClient";
import { ProjectResponse, ProjectRequest } from "@/entities/Project";

export const createProject = async (project: ProjectRequest) => {
    const parsed = ProjectRequest.safeParse(project);
    if (!parsed.success) {
        throw new Error("Invalid project data: " + JSON.stringify(parsed.error.format()));
    }
    
    const formData = new FormData();
    formData.append('project', new Blob([JSON.stringify(parsed.data)], { type: 'application/json' }));
    formData.append('images', new Blob([], { type: 'application/json' }));
    
    const response = await projectInstance.post("/create", formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    
    return response.data;
};

export const deleteProject = async (projectId: string) => {
    const response = await projectInstance.delete(`/delete/${projectId}`);
    return response.data;
};

export const getProject = async (id: string) => {
    const response = await projectInstance.get(`/id/${id}`);
    const parsed = ProjectResponse.safeParse(response.data);

    if (!parsed.success) {
        throw new Error("Invalid response format from server.");
    }

    return parsed.data;
};

export const updateProject = async (id: string, updatedData: ProjectRequest) => {
    const parsed = ProjectRequest.safeParse(updatedData);
    if (!parsed.success) {
        throw new Error("Invalid update payload: " + JSON.stringify(parsed.error.format()));
    }

    const response = await projectInstance.put(`/update/${id}`, parsed.data);
    return response.data;
};

export const getProjectsByUser = async (username: string) => {
    const response = await projectInstance.get(`/get-projects/${username}`);
    return response.data;
};

export const subscribeToProject = async (projectId: string) => {
    const response = await projectInstance.post(`/subscribe/${projectId}`);
    return response.data;
};

export const unsubscribeFromProject = async (projectId: string) => {
    const response = await projectInstance.delete(`/unsubscribe/${projectId}`);
    return response.data;
};
