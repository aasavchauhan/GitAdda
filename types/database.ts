export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    username: string
                    full_name: string | null
                    avatar_url: string | null
                    bio: string | null
                    github_username: string | null
                    tech_stack: Json
                    open_to_collab: boolean
                    looking_for_contributors: boolean
                    looking_for_feedback: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    username: string
                    full_name?: string | null
                    avatar_url?: string | null
                    bio?: string | null
                    github_username?: string | null
                    tech_stack?: Json
                    open_to_collab?: boolean
                    looking_for_contributors?: boolean
                    looking_for_feedback?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    username?: string
                    full_name?: string | null
                    avatar_url?: string | null
                    bio?: string | null
                    github_username?: string | null
                    tech_stack?: Json
                    open_to_collab?: boolean
                    looking_for_contributors?: boolean
                    looking_for_feedback?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            repositories: {
                Row: {
                    id: string
                    shared_by: string | null
                    github_url: string
                    name: string
                    owner: string | null
                    description: string | null
                    readme: string | null
                    stars: number
                    forks: number
                    languages: string[]
                    topics: string[]
                    purpose: string | null
                    use_case: string | null
                    difficulty: 'beginner' | 'intermediate' | 'advanced' | null
                    maintenance_status: 'active' | 'maintained' | 'archived' | null
                    demo_url: string | null
                    shared_at: string
                }
                Insert: {
                    id?: string
                    shared_by?: string | null
                    github_url: string
                    name: string
                    owner?: string | null
                    description?: string | null
                    readme?: string | null
                    stars?: number
                    forks?: number
                    languages?: string[]
                    topics?: string[]
                    purpose?: string | null
                    use_case?: string | null
                    difficulty?: 'beginner' | 'intermediate' | 'advanced' | null
                    maintenance_status?: 'active' | 'maintained' | 'archived' | null
                    demo_url?: string | null
                    shared_at?: string
                }
                Update: {
                    id?: string
                    shared_by?: string | null
                    github_url?: string
                    name?: string
                    owner?: string | null
                    description?: string | null
                    readme?: string | null
                    stars?: number
                    forks?: number
                    languages?: string[]
                    topics?: string[]
                    purpose?: string | null
                    use_case?: string | null
                    difficulty?: 'beginner' | 'intermediate' | 'advanced' | null
                    maintenance_status?: 'active' | 'maintained' | 'archived' | null
                    demo_url?: string | null
                    shared_at?: string
                }
            }
            collections: {
                Row: {
                    id: string
                    created_by: string | null
                    name: string
                    description: string | null
                    is_public: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    created_by?: string | null
                    name: string
                    description?: string | null
                    is_public?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    created_by?: string | null
                    name?: string
                    description?: string | null
                    is_public?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            collection_items: {
                Row: {
                    id: string
                    collection_id: string | null
                    repository_id: string | null
                    position: number
                    added_at: string
                }
                Insert: {
                    id?: string
                    collection_id?: string | null
                    repository_id?: string | null
                    position?: number
                    added_at?: string
                }
                Update: {
                    id?: string
                    collection_id?: string | null
                    repository_id?: string | null
                    position?: number
                    added_at?: string
                }
            }
            saves: {
                Row: {
                    id: string
                    user_id: string | null
                    repository_id: string | null
                    saved_at: string
                }
                Insert: {
                    id?: string
                    user_id?: string | null
                    repository_id?: string | null
                    saved_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string | null
                    repository_id?: string | null
                    saved_at?: string
                }
            }
            comments: {
                Row: {
                    id: string
                    user_id: string | null
                    repository_id: string | null
                    content: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id?: string | null
                    repository_id?: string | null
                    content: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string | null
                    repository_id?: string | null
                    content?: string
                    created_at?: string
                    updated_at?: string
                }
            }
            follows: {
                Row: {
                    id: string
                    follower_id: string | null
                    following_id: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    follower_id?: string | null
                    following_id?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    follower_id?: string | null
                    following_id?: string | null
                    created_at?: string
                }
            }
            likes: {
                Row: {
                    id: string
                    user_id: string | null
                    repository_id: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id?: string | null
                    repository_id?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string | null
                    repository_id?: string | null
                    created_at?: string
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
    }
}
