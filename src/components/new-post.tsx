import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Camera, Send, Tag, X} from "lucide-react";
import {Label} from "@/components/ui/label.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Badge} from "@/components/ui/badge.tsx";
import React, {useState} from "react";
import {createPost} from "@/api/postClient.ts"
import { set } from "zod";


const NewPost = () => {

    const [isNewPostOpen, setIsNewPostOpen] = useState(false)


    const [newPost, setNewPost] = useState({
        title: "",
        content: "",
        media: [] as File[],
        tags: [] as string[],
    })
    const [newTag, setNewTag] = useState("")

    // Character limits
    const TITLE_MAX = 100
    const CONTENT_MAX = 1000


    const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files) {
            const newFiles = Array.from(files)
            setNewPost((prev) => ({
                ...prev,
                media: [...prev.media, ...newFiles]
            }))
        }
    }

    const removeMedia = (index: number) => {
        setNewPost((prev) => ({
            ...prev,
            media: prev.media.filter((_, i) => i !== index)
        }))
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
        console.log("Creating post:", newPost);

        setIsNewPostOpen(false);
        console.log("Post Content:",newPost.content);
        createPost(newPost.title, newPost.content, newPost.media, newPost.tags);
        setNewPost({
            title: "",
            content: "",
            media: [],
            tags: [],
        })
        setNewTag("")
    }


    return (
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 hover:border-teal-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/10">
            <Dialog open={isNewPostOpen} onOpenChange={setIsNewPostOpen}>
                <DialogTrigger asChild>
                    <Button className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200">
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
                            <div className="flex items-center justify-between mb-2">
                                <Label htmlFor="title" className="text-gray-200 font-medium">Post Title</Label>
                                <span className={`text-xs ${newPost.title.length > TITLE_MAX ? 'text-red-400' : 'text-gray-400'}`}>
                                    {newPost.title.length}/{TITLE_MAX}
                                </span>
                            </div>
                            <Input
                                id="title"
                                placeholder="Title of your Post"
                                value={newPost.title}
                                maxLength={TITLE_MAX}
                                onChange={(e) => setNewPost((prev) => ({...prev, title: e.target.value}))}
                                className="bg-gray-800 border-gray-600 text-white placeholder-gray-500 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                            />
                        </div>


                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <Label htmlFor="content" className="text-gray-200 font-medium">What's on your mind?</Label>
                                <span className={`text-xs ${newPost.content.length > CONTENT_MAX ? 'text-red-400' : 'text-gray-400'}`}>
                                    {newPost.content.length}/{CONTENT_MAX}
                                </span>
                            </div>
                            <Textarea
                                id="content"
                                placeholder="Share your thoughts, projects, or ask questions..."
                                value={newPost.content}
                                maxLength={CONTENT_MAX}
                                onChange={(e) => setNewPost((prev) => ({...prev, content: e.target.value}))}
                                className="bg-gray-800 border-gray-600 text-white placeholder-gray-500 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 min-h-[120px] transition-all"
                            />
                        </div>

                        {/* Media Upload */}
                        <div>
                            <Label htmlFor="media" className="text-gray-200 font-medium">Upload Images</Label>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <input 
                                        id="media" 
                                        type="file" 
                                        accept="image/*" 
                                        multiple
                                        onChange={handleMediaUpload}
                                        className="hidden"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => document.getElementById("media")?.click()}
                                        className="bg-teal-600 text-white border-teal-600 hover:bg-transparent hover:text-teal-400 hover:border-teal-500 transition-all"
                                    >
                                        <Camera className="w-4 h-4 mr-2"/>
                                        {newPost.media.length > 0 ? `${newPost.media.length} image(s)` : "Add Images"}
                                    </Button>
                                </div>
                                {newPost.media.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {newPost.media.map((file, index) => (
                                            <Badge 
                                                key={index} 
                                                variant="secondary" 
                                                className="bg-gray-800 border border-gray-600 text-gray-300"
                                            >
                                                {file.name}
                                                <button 
                                                    onClick={() => removeMedia(index)} 
                                                    className="ml-2 text-gray-400 hover:text-red-400 transition-colors"
                                                >
                                                    <X className="w-3 h-3"/>
                                                </button>
                                            </Badge>
                                        ))}
                                    </div>
                                )}
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
                                    onKeyPress={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            addTag();
                                        }
                                    }}
                                    className="bg-gray-800 border-gray-600 text-white placeholder-gray-500 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                                />
                                <Button
                                    type="button"
                                    onClick={addTag}
                                    variant="outline"
                                    className="bg-teal-600 text-white border-teal-600 hover:bg-teal-700 hover:border-teal-700 transition-all"
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
                                className="bg-gray-700 text-white border-gray-600 hover:bg-gray-600 hover:border-gray-500 transition-all"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleCreatePost}
                                disabled={!newPost.content.trim() && !newPost.title.trim()}
                                className="bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white disabled:from-gray-700 disabled:to-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
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