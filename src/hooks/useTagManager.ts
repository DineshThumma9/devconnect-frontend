import { useState, useCallback } from 'react'
export const useTagManager = (initialTags: string[] = []) => {
    const [tags, setTags] = useState<string[]>(initialTags);
    const [tagInput, setTagInput] = useState("");

    const addTag = useCallback(() => {
        const trimmedTag = tagInput.trim();
        if (trimmedTag && !tags.includes(trimmedTag)) {
            setTags(prev => [...prev, trimmedTag]);
            setTagInput("");
            return true;
        }
        return false;
    }, [tagInput, tags]);

    const removeTag = useCallback((tagToRemove: string) => {
        setTags(prev => prev.filter(tag => tag !== tagToRemove));
    }, []);

    const clearTags = useCallback(() => {
        setTags([]);
        setTagInput("");
    }, []);

    return {
        tags,
        tagInput,
        setTagInput,
        addTag,
        removeTag,
        clearTags,
        setTags
    };
};
