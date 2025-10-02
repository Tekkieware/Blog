
import { IPost } from "@/models/post";

export async function getPosts(): Promise<IPost[]> {
    const response = await fetch("/api/posts");
    if (!response.ok) {
        throw new Error("Failed to fetch posts");
    }
    return response.json();
}

export async function getPost(id: string): Promise<IPost> {
    const response = await fetch(`/api/posts/${id}`);
    if (!response.ok) {
        throw new Error("Failed to fetch post");
    }
    return response.json();
}

export async function createPost(post: Partial<IPost>): Promise<IPost> {
    const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(post),
    });
    if (!response.ok) {
        throw new Error("Failed to create post");
    }
    return response.json();
}

export async function updatePost(id: string, post: Partial<IPost>): Promise<IPost> {
    const response = await fetch(`/api/posts/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(post),
    });
    if (!response.ok) {
        throw new Error("Failed to update post");
    }
    return response.json();
}

export async function deletePost(id: string): Promise<{ message: string }> {
    const response = await fetch(`/api/posts/${id}`, {
        method: "DELETE",
    });
    if (!response.ok) {
        throw new Error("Failed to delete post");
    }
    return response.json();
}
