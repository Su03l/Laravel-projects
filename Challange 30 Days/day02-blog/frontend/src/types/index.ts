export interface Category {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
}

export interface Post {
    id: number;
    title: string;
    content: string;
    category_id: number;
    category?: Category;
    created_at: string;
    updated_at: string;
}
