import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Camera, Send, Tag, X} from "lucide-react";
import {Label} from "@/components/ui/label.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Badge} from "@/components/ui/badge.tsx";
import React, {useState} from "react";
import {createPost} from "@/api/postClient.ts"


const NewPost = () => {

    const [isNewPostOpen, setIsNewPostOpen] = useState(false)


    const [newPost, setNewPost] = useState({
        title: "",
        content: "",
        image: null as File | null,
        tags: [] as string[],
    })
    const [newTag, setNewTag] = useState("")


    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setNewPost((prev) => ({...prev, image: file}))
        }
    }

    const addTag = () => {
        if (newTag.trim() && !newPost.tags.includes(newTag.trim())) {
            setNewPost((prev) => ({
                ...prev,
                tags: [...prev.tags, newTag.trim()],
            }))
            setNewTag("")
        }
    }

    const removeTag = (tagToRemove: string) => {
        setNewPost((prev) => ({
            ...prev,
            tags: prev.tags.filter((tag) => tag !== tagToRemove),
        }))
    }

    const handleCreatePost = () => {
        console.log("Creating post:", newPost)
        setIsNewPostOpen(false)
        createPost(newPost.title, newPost.content, newPost.image, newPost.tags)

    }


    return (
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-colors">
            <Dialog open={isNewPostOpen} onOpenChange={setIsNewPostOpen}>
                <DialogTrigger asChild>
                    <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
                        <Send className="w-4 h-4 mr-2"/>
                        What's on your mind?
                    </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-white">Create New Post</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">


                        <div>
                            <Label htmlFor="title" className="text-gray-200 font-medium">Post Title</Label>
                            <Input
                                id="title"
                                placeholder="Title of your Post"
                                value={newPost.title}
                                onChange={(e) => setNewPost((prev) => ({...prev, title: e.target.value}))}
                                className="bg-gray-800 border-gray-600 text-white placeholder-gray-500 focus:border-teal-500"
                            />
                        </div>


                        <div>
                            <Label htmlFor="content" className="text-gray-200 font-medium">What's on your mind?</Label>
                            <Textarea
                                id="content"
                                placeholder="Share your thoughts, projects, or ask questions..."
                                value={newPost.content}
                                onChange={(e) => setNewPost((prev) => ({...prev, content: e.target.value}))}
                                className="bg-gray-800 border-gray-600 text-white placeholder-gray-500 focus:border-teal-500 min-h-[100px]"
                            />
                        </div>

                        {/* Image Upload */}
                        <div>
                            <Label htmlFor="image" className="text-gray-200 font-medium">Upload Image</Label>
                            <div className="flex items-center gap-2">
                                <input id="image" type="file" accept="image/*" onChange={handleImageUpload}
                                       className="hidden"/>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => document.getElementById("image")?.click()}
                                    className="bg-teal-600 text-white border-teal-600 hover:bg-transparent hover:text-teal-400 hover:border-teal-500 transition-all"
                                >
                                    <Camera className="w-4 h-4 mr-2"/>
                                    {newPost.image ? "Change Image" : "Add Image"}
                                </Button>
                                {newPost.image && <span className="text-sm text-gray-300">{newPost.image.name}</span>}
                            </div>
                        </div>


                        {/* Tags */}
                        <div>
                            <Label className="text-gray-200 font-medium">Tags</Label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {newPost.tags.map((tag) => (
                                    <Badge key={tag} variant="secondary" className="bg-teal-600/20 border border-teal-600 text-teal-400">
                                        {tag}
                                        <button onClick={() => removeTag(tag)} className="ml-2 text-teal-400 hover:text-red-400 transition-colors">
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
                                    className="bg-gray-800 border-gray-600 text-white placeholder-gray-500 focus:border-teal-500"
                                />
                                <Button
                                    type="button"
                                    onClick={addTag}
                                    variant="outline"
                                    className="bg-teal-600 text-white border-teal-600 hover:bg-transparent hover:text-teal-400 hover:border-teal-500 transition-all"
                                >
                                    <Tag className="w-4 h-4"/>
                                </Button>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
                            <Button
                                variant="outline"
                                onClick={() => setIsNewPostOpen(false)}
                                className="bg-gray-700 text-white border-gray-600 hover:bg-transparent hover:text-gray-300 hover:border-gray-500 transition-all"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleCreatePost}
                                disabled={!newPost.content.trim()}
                                className="bg-teal-600 hover:bg-teal-700 text-white disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed"
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

export default NewPost;