import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Link, Send, Tag, X} from "lucide-react";
import {Label} from "@/components/ui/label.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Badge} from "@/components/ui/badge.tsx";
import {useState} from "react";


const NewProject = () => {

    const [isNewProjOpen, setIsNewProjOpen] = useState(false)
    const [newProj, setNewProj] = useState({
        title: "",
        overview: "",
        image: null as File | null,
        tags: [] as string[],
        projectLink: "",
    })
    const [newTag, setNewTag] = useState("")


    const addTag = () => {
        if (newTag.trim() && !newProj.tags.includes(newTag.trim())) {
            setNewProj((prev) => ({
                ...prev,
                tags: [...prev.tags, newTag.trim()],
            }))
            setNewTag("")
        }
    }

    const removeTag = (tagToRemove: string) => {
        setNewProj((prev) => ({
            ...prev,
            tags: prev.tags.filter((tag) => tag !== tagToRemove),
        }))
    }

    const handleCreatePost = () => {
        console.log("Creating post:", newProj)
        setIsNewProjOpen(false)
        setNewProj({
            title:"",
            overview: "",
            image: null,
            tags: [],
            projectLink: "",
        })
    }
    return (
        <div className="bg-gray-900 rounded-lg p-4">
            <Dialog open={isNewProjOpen} onOpenChange={setIsNewProjOpen}>
                <DialogTrigger asChild>
                    <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                        <Send className="w-4 h-4 mr-2"/>
                        What's on your mind?
                    </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Create New Project</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">


                        <div>
                            <Label htmlFor="content">Project Name</Label>
                            <Textarea
                                id="content"
                                placeholder="Name of your project"
                                value={newProj.title}
                                onChange={(e) => setNewProj((prev) => ({...prev, content: e.target.value}))}
                                className="bg-gray-800 border-gray-600 text-white min-h-[100px]"
                            />
                        </div>


                        <div>
                            <Label htmlFor="content">Project Overview</Label>
                            <Textarea
                                id="overview"
                                placeholder="What is this Project about why building it descibe it?"
                                value={newProj.overview}
                                onChange={(e) => setNewProj((prev) => ({...prev, content: e.target.value}))}
                                className="bg-gray-800 border-gray-600 text-white min-h-[100px]"
                            />
                        </div>


                        {/* Project Link */}
                        <div>
                            <Label htmlFor="projectLink">Project Link </Label>
                            <div className="relative">
                                <Link
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"/>
                                <Input
                                    id="projectLink"
                                    placeholder="https://github.com/username/project"
                                    value={newProj.projectLink}
                                    onChange={(e) => setNewProj((prev) => ({...prev, projectLink: e.target.value}))}
                                    className="pl-10 bg-gray-800 border-gray-600 text-white"
                                />
                            </div>
                        </div>


                        {/* Tags */}
                        <div>
                            <Label>Tags</Label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {newProj.tags.map((tag) => (
                                    <Badge key={tag} variant="secondary" className="bg-gray-800 text-white">
                                        {tag}
                                        <button onClick={() => removeTag(tag)} className="ml-1 hover:text-red-400">
                                            <X className="w-3 h-3"/>
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Add a tag..."
                                    value={newTag}
                                    onChange={(e) => setNewTag(e.target.value)}
                                    onKeyPress={(e) => e.key === "Enter" && addTag()}
                                    className="bg-gray-800 border-gray-600 text-white"
                                />
                                <Button
                                    type="button"
                                    onClick={addTag}
                                    variant="outline"
                                    className="border-gray-600 text-gray-300 hover:bg-gray-800"
                                >
                                    <Tag className="w-4 h-4"/>
                                </Button>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-2 pt-4">
                            <Button
                                variant="outline"
                                onClick={() => setIsNewProjOpen(false)}
                                className="border-gray-600 text-gray-300 hover:bg-gray-800"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleCreatePost}
                                disabled={!newProj.overview.trim()}
                                className="bg-teal-600 hover:bg-teal-700 text-white"
                            >
                                <Send className="w-4 h-4 mr-2"/>
                                Post
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default NewProject;