
import { IPost } from "@/models/post";

export async function getPosts(page: number = 1, limit: number = 10, searchTerm?: string): Promise<IPost[]> {
    let url = `/api/posts?page=${page}&limit=${limit}`;
    if (searchTerm) {
        url += `&searchTerm=${searchTerm}`;
    }
    const fetchUrl = typeof window === 'undefined'
        ? `${process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.isaiahozadhe.tech'}${url}`
        : url;
    const response = await fetch(fetchUrl);
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
    const fetchUrl = typeof window === 'undefined'
        ? `${process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.isaiahozadhe.tech'}${url}`
        : url;
    const response = await fetch(fetchUrl);
    if (!response.ok) {
        throw new Error("Failed to fetch posts and count");
    }
    return response.json();
}

export async function getPost(id: string): Promise<IPost> {
    const path = `/api/posts/${id}`;
    const fetchUrl = typeof window === 'undefined'
        ? `${process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.isaiahozadhe.tech'}${path}`
        : path;
    const response = await fetch(fetchUrl);
    if (!response.ok) {
        throw new Error("Failed to fetch post");
    }
    return response.json();
}

export async function getPostBySlug(slug: string): Promise<IPost> {
    const path = `/api/posts/slug/${slug}`;
    const fetchUrl = typeof window === 'undefined'
        ? `${process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.isaiahozadhe.tech'}${path}`
        : path;
    const response = await fetch(fetchUrl);
    if (!response.ok) {
        throw new Error("Failed to fetch post");
    }
    return response.json();
}

export async function getPostsByLayer(layer: string): Promise<IPost[]> {
    const path = `/api/posts/layer/${layer}`;
    const fetchUrl = typeof window === 'undefined'
        ? `${process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.isaiahozadhe.tech'}${path}`
        : path;
    const response = await fetch(fetchUrl);
    if (!response.ok) {
        throw new Error("Failed to fetch posts by layer");
    }
    return response.json();
}

export async function createPost(post: Partial<IPost>): Promise<IPost> {
    const path = "/api/posts";
    const fetchUrl = typeof window === 'undefined'
        ? `${process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.isaiahozadhe.tech'}${path}`
        : path;
    const response = await fetch(fetchUrl, {
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
    const path = `/api/posts/${id}`;
    const fetchUrl = typeof window === 'undefined'
        ? `${process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.isaiahozadhe.tech'}${path}`
        : path;
    const response = await fetch(fetchUrl, {
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
    const path = `/api/posts/${id}`;
    const fetchUrl = typeof window === 'undefined'
        ? `${process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.isaiahozadhe.tech'}${path}`
        : path;
    const response = await fetch(fetchUrl, {
        method: "DELETE",
    });
    if (!response.ok) {
        throw new Error("Failed to delete post");
    }
    return response.json();
}

export async function getLayerCounts(): Promise<{ [key: string]: number }> {
    const path = `/api/posts/layer/count`;
    const fetchUrl = typeof window === 'undefined'
        ? `${process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.isaiahozadhe.tech'}${path}`
        : path;
    const response = await fetch(fetchUrl);
    if (!response.ok) {
        throw new Error("Failed to fetch layer counts");
    }
    return response.json();
}
