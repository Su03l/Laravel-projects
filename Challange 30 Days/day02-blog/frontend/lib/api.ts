// API Configuration
const API_BASE_URL = "http://localhost:8000";

// Types
export interface Category {
    id: number;
    name: string;
    created_at?: string;
    updated_at?: string;
}

export interface Post {
    id: number;
    title: string;
    content: string;
    category_id: number;
    category?: Category;
    created_at: string;
    updated_at?: string;
}

// API Functions
export const api = {
    // Categories
    getCategories: async (): Promise<Category[]> => {
        const res = await fetch(`${API_BASE_URL}/categories`);
        if (!res.ok) throw new Error("Failed to fetch categories");
        return res.json();
    },

    getCategory: async (id: number): Promise<Category> => {
        const res = await fetch(`${API_BASE_URL}/categories/${id}`);
        if (!res.ok) throw new Error("Failed to fetch category");
        return res.json();
    },

    createCategory: async (name: string): Promise<Category> => {
        const res = await fetch(`${API_BASE_URL}/categories`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name }),
        });
        if (!res.ok) throw new Error("Failed to create category");
        const data = await res.json();
        return data.category;
    },

    updateCategory: async (id: number, name: string): Promise<Category> => {
        const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name }),
        });
        if (!res.ok) throw new Error("Failed to update category");
        const data = await res.json();
        return data.category;
    },

    deleteCategory: async (id: number): Promise<void> => {
        const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
            method: "DELETE",
        });
        if (!res.ok) throw new Error("Failed to delete category");
    },

    // Posts
    getPosts: async (): Promise<Post[]> => {
        const res = await fetch(`${API_BASE_URL}/posts`);
        if (!res.ok) throw new Error("Failed to fetch posts");
        return res.json();
    },

    getPost: async (id: number): Promise<Post> => {
        const res = await fetch(`${API_BASE_URL}/posts/${id}`);
        if (!res.ok) throw new Error("Failed to fetch post");
        return res.json();
    },

    createPost: async (data: { title: string; content: string; category_id: number }): Promise<Post> => {
        const res = await fetch(`${API_BASE_URL}/posts`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Failed to create post");
        const result = await res.json();
        return result.post;
    },

    updatePost: async (id: number, data: { title: string; content: string; category_id: number }): Promise<Post> => {
        const res = await fetch(`${API_BASE_URL}/posts/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Failed to update post");
        const result = await res.json();
        return result.post;
    },

    deletePost: async (id: number): Promise<void> => {
        const res = await fetch(`${API_BASE_URL}/posts/${id}`, {
            method: "DELETE",
        });
        if (!res.ok) throw new Error("Failed to delete post");
    },
};
