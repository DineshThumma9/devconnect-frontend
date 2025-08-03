import { projectInstance } from "@/api/apiClient";
import { z } from "zod";

// ✅ Request DTO schema
export const projectRequestDTOSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    techRequirements: z.array(z.string()).min(1, "Tech requirements are required"),
    ownerId: z.string().optional(),
    isPrivate: z.boolean().optional().default(false),
    githubLink: z.string().url().optional(),
    media: z.array(z.string()).optional().default([]),
});

// ✅ Response DTO schema
export const projectResponseDTOSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    techRequirements: z.array(z.string()),
    ownerUsername: z.string(),
    ownerProfilePicUrl: z.string().url(),
    isPrivate: z.boolean(),
    status: z.string(),
    ownerId: z.string(),
    currentContributors: z.array(z.string()),
    pastContributors: z.array(z.string()),
    githubLink: z.string().url(),
    createdAt: z.union([z.string().datetime(), z.date()]),
    media: z.array(z.string()),
});

// ✅ Create project
export const createProject = async (project: z.infer<typeof projectRequestDTOSchema>) => {
    const parsed = projectRequestDTOSchema.safeParse(project);
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
    const parsed = projectResponseDTOSchema.safeParse(response.data);

    if (!parsed.success) {
        throw new Error("Invalid response format from server.");
    }

    return parsed.data;
};

// ✅ Update project
export const updateProject = async (
    id: string,
    updatedData: z.infer<typeof projectRequestDTOSchema>
) => {
    const parsed = projectRequestDTOSchema.safeParse(updatedData);
    if (!parsed.success) {
        throw new Error("Invalid update payload: " + JSON.stringify(parsed.error.format()));
    }

    const response = await projectInstance.put(`/update/${id}`, parsed.data);
    return response.data;
};
