export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
    avatar_url?: string; // If you have an accessor for this
    acronym?: string; // Helper for avatar fallback (e.g., "JD")
}

export interface Comment {
    id: number;
    task_id: number;
    user_id: number;
    content: string;
    created_at: string;
    updated_at: string;
    user?: User;
}

export interface Activity {
    id: number;
    task_id: number;
    user_id: number;
    description: string;
    created_at: string;
    updated_at: string;
    user?: User;
}

export interface Task {
    id: number;
    task_column_id: number;
    project_id: number;
    assigned_to?: number;
    title: string;
    description?: string;
    position: number;
    priority: 'low' | 'medium' | 'high';
    due_date?: string;
    created_at: string;
    updated_at: string;
    assignee?: User;
    comments?: Comment[];
    activities?: Activity[];
}

export interface TaskColumn {
    id: number;
    project_id: number;
    name: string;
    position: number;
    created_at: string;
    updated_at: string;
    tasks: Task[];
}

export interface Project {
    id: number;
    workspace_id: number;
    name: string;
    description?: string;
    bg_color: string;
    icon?: string;
    created_at: string;
    updated_at: string;
    columns?: TaskColumn[];
    workspace?: Workspace;
    tasks_count?: number;
}

export interface Workspace {
    id: number;
    name: string;
    slug: string;
    owner_id: number;
    logo?: string;
    created_at: string;
    updated_at: string;
    projects_count?: number;
    projects?: Project[];
    members?: User[];
}
