
import { IPost } from "@/models/post";

export async function getPosts(page: number = 1, limit: number = 10, searchTerm?: string): Promise<IPost[]> {
    let url = `/api/posts?page=${page}&limit=${limit}`;
    if (searchTerm) {
        url += `&searchTerm=${searchTerm}`;
    }
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("Failed to fetch posts");
    }
    return response.json();
}

export async function getPostsAndCount(page: number = 1, limit: number = 10, layer?: string, searchTerm?: string): Promise<{ posts: IPost[], total: number }> {
    let url = `/api/posts?page=${page}&limit=${limit}&includeCount=true`;
    if (layer && layer !== 'all') {
        url += `&layer=${layer}`;
    }
    if (searchTerm) {
        url += `&searchTerm=${searchTerm}`;
    }
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("Failed to fetch posts and count");
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

export async function getPostBySlug(slug: string): Promise<IPost> {
    const response = await fetch(`/api/posts/slug/${slug}`);
    if (!response.ok) {
        throw new Error("Failed to fetch post");
    }
    return response.json();
}

export async function getPostsByLayer(layer: string): Promise<IPost[]> {
    const response = await fetch(`/api/posts/layer/${layer}`);
    if (!response.ok) {
        throw new Error("Failed to fetch posts by layer");
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
