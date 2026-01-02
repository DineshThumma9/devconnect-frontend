import { axiosInstance } from "@/api/apiClient";
import PostCard from "@/components/post-card";
import ProjectCard from "@/components/project-card";
import UserListItem from "@/components/UserListItem";
import { PostResponse, PostResponseType } from "@/entities/Post";
import { ProjectResponse } from "@/entities/Project";
import { UserResponse } from "@/entities/User";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { LoadingState } from "@/components/ui/loading-state";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorMessage } from "@/components/ui/error-message";
import PageHeader from "@/components/PageHeader";
import { validateAndFilter } from "@/utils/validation";

const SearchPage = () => {
    const query = useParams().query as string;
    const type = useParams().type as string;

    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const urls: Record<string, string> = {
        users: `/users/search?q=${query}`,
        posts: `/posts/search?q=${query}`,
        tags: `/tags/search?q=${query}`,
        projects: `/projects/search?q=${query}`
    };

    useEffect(() => {
        fetchResults();
    }, [query, type]);

    const fetchResults = async () => {
        if (!query || !type) return;

        try {
            setLoading(true);
            setError(null);

            const response = await axiosInstance.get(urls[type]);
            setResults(response.data);
        } catch (error) {
            console.error("Error fetching search results:", error);
            setError("Failed to fetch search results. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const renderResults = () => {
        if (type === "users") {
            const users = validateAndFilter(results, UserResponse);
            return users.map((user) => (
                <UserListItem key={user.id} user={user} showBio />
            ));
        }

        if (type === "posts") {
            const posts = validateAndFilter(results, PostResponse);
            return posts.map((post:PostResponseType) => (
                <PostCard key={post.id} post={post} />
            ));
        }

        if (type === "projects") {
            const projects = validateAndFilter(results, ProjectResponse);
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
            );
        }

        return null;
    };

    return (
        <div>
            <PageHeader
                title={`Search Results for "${query}"`}
                description={`Showing results in ${type}`}
                icon="🔍"
            />

            {error && <ErrorMessage message={error} />}

            {loading ? (
                <LoadingState type={type === "projects" ? "project" : "post"} count={3} />
            ) : results.length === 0 && !error ? (
                <EmptyState
                    icon="🔍"
                    title={`No ${type} found`}
                    description={`No results found for "${query}" in ${type}`}
                />
            ) : (
                <div className="space-y-6">{renderResults()}</div>
            )}
        </div>
    );
};

export default SearchPage;