export interface User {
    id: number;
    email: string;
    username?: string;
    full_name?: string;
    enrollment_number?: string;
    department?: string;
    role: 'student' | 'faculty' | 'admin';
    bio?: string;
    profile_photo_url?: string;
    created_at?: string;
}

export interface Vote {
    id: number;
    user_id: number;
    post_id?: number;
    comment_id?: number;
    vote_type: 1 | -1;
}

export interface Post {
    id: number;
    title: string;
    content: string;
    department: string;
    type: string;
    tags?: string;
    created_at: string;
    author_id?: number;
    author?: User;
    upvotes: number;
    downvotes: number;
    comments_count: number;
    user_vote?: 1 | -1 | null; // Current user's vote
}

export interface Comment {
    id: number;
    content: string;
    created_at: string;
    post_id: number;
    author_id?: number;
    author?: User;
    parent_id?: number;
    replies?: Comment[];
    upvotes: number;
    downvotes: number;
    user_vote?: 1 | -1 | null;
}
