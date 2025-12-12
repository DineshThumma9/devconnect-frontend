import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Link, Send, Tag, X} from "lucide-react";
import {Label} from "@/components/ui/label.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Badge} from "@/components/ui/badge.tsx";
import {useState} from "react";
import { createProject } from "@/api/projectClient";


const NewProject = () => {

    const [isNewProjOpen, setIsNewProjOpen] = useState(false)
    const [newProj, setNewProj] = useState({
        title: "",
        description: "",
        techRequirements: [] as string[],
        githubLink: "",
        isPrivate: false,
    })
    const [newTag, setNewTag] = useState("")


    const addTag = () => {
        if (newTag.trim() && !newProj.techRequirements.includes(newTag.trim())) {
            setNewProj((prev) => ({
                ...prev,
                techRequirements: [...prev.techRequirements, newTag.trim()],
            }))
            setNewTag("")
        }
    }

    const removeTag = (tagToRemove: string) => {
        setNewProj((prev) => ({
            ...prev,
            techRequirements: prev.techRequirements.filter((tag) => tag !== tagToRemove),
        }))
    }

    const handleCreateProject = async () => {
        try {
            const projectData = {
                title: newProj.title,
                description: newProj.description,
                techRequirements: newProj.techRequirements,
                githubLink: newProj.githubLink || undefined,
                isPrivate: newProj.isPrivate,
            }
            
            const response = await createProject(projectData)
            console.log("Project created successfully:", response)
            
            // Reset form
            setIsNewProjOpen(false)
            setNewProj({
                title: "",
                description: "",
                techRequirements: [],
                githubLink: "",
                isPrivate: false,
            })
        } catch (error) {
            console.error("Error creating project:", error)
        }
    }
    return (
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-colors">
            <Dialog open={isNewProjOpen} onOpenChange={setIsNewProjOpen}>
                <DialogTrigger asChild>
                    <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
                        <Send className="w-4 h-4 mr-2"/>
                        Create a Project
                    </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-white">Create New Project</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">


                        <div>
                            <Label htmlFor="projectTitle" className="text-gray-200 font-medium">Project Name</Label>
                            <Input
                                id="projectTitle"
                                placeholder="Name of your project"
                                value={newProj.title}
                                onChange={(e) => setNewProj((prev) => ({...prev, title: e.target.value}))}
                                className="bg-gray-800 border-gray-600 text-white placeholder-gray-500 focus:border-purple-500"
                            />
                        </div>


                        <div>
                            <Label htmlFor="overview" className="text-gray-200 font-medium">Project Description</Label>
                            <Textarea
                                id="overview"
                                placeholder="What is this project about? Why are you building it?"
                                value={newProj.description}
                                onChange={(e) => setNewProj((prev) => ({...prev, description: e.target.value}))}
                                className="bg-gray-800 border-gray-600 text-white placeholder-gray-500 focus:border-purple-500 min-h-[100px]"
                            />
                        </div>


                        {/* Project Link */}
                        <div>
                            <Label htmlFor="projectLink" className="text-gray-200 font-medium">GitHub Link (Optional)</Label>
                            <div className="relative">
                                <Link
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-4 h-4"/>
                                <Input
                                    id="projectLink"
                                    placeholder="https://github.com/username/project"
                                    value={newProj.githubLink}
                                    onChange={(e) => setNewProj((prev) => ({...prev, githubLink: e.target.value}))}
                                    className="pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-500 focus:border-purple-500"
                                />
                            </div>
                        </div>


                        {/* Tech Requirements */}
                        <div>
                            <Label className="text-gray-200 font-medium">Tech Requirements</Label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {newProj.techRequirements.map((tag) => (
                                    <Badge key={tag} variant="secondary" className="bg-purple-600/20 border border-purple-600 text-purple-400">
                                        {tag}
                                        <button onClick={() => removeTag(tag)} className="ml-2 text-purple-400 hover:text-red-400 transition-colors">
                                            <X className="w-3 h-3"/>
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Add tech requirement (e.g., React, Node.js)..."
                                    value={newTag}
                                    onChange={(e) => setNewTag(e.target.value)}
                                    onKeyPress={(e) => e.key === "Enter" && addTag()}
                                    className="bg-gray-800 border-gray-600 text-white placeholder-gray-500 focus:border-purple-500"
                                />
                                <Button
                                    type="button"
                                    onClick={addTag}
                                    variant="outline"
                                    className="bg-purple-600 text-white border-purple-600 hover:bg-transparent hover:text-purple-400 hover:border-purple-500 transition-all"
                                >
                                    <Tag className="w-4 h-4"/>
                                </Button>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
                            <Button
                                variant="outline"
                                onClick={() => setIsNewProjOpen(false)}
                                className="bg-gray-700 text-white border-gray-600 hover:bg-transparent hover:text-gray-300 hover:border-gray-500 transition-all"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleCreateProject}
                                disabled={!newProj.description.trim() || !newProj.title.trim()}
                                className="bg-purple-600 hover:bg-purple-700 text-white disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                            >
                                <Send className="w-4 h-4 mr-2"/>
                                Create Project
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default NewProject;