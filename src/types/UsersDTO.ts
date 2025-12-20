// Internal
import type { LoadingStateType } from "@/types";

// User Type
export interface UserDTO {
    id?: number;                   // Primary key
    name: string;                  // User name (max 255 chars)
    email: string;                 // Email (unique, max 255 chars)
    password: string;              // Hashed password (max 255 chars)
    email_verified_at?: string | null; // ISO format

    role: "ROLE_ADMIN" | "ROLE_USER"; // Enum

    // Date fields
    created_at?: string | null;    // ISO format
    updated_at?: string | null;    // ISO format
}

export type UserFields =
    | "id"
    | "name"
    | "email"
    | "password"
    | "email_verified_at"
    | "role"
    | "created_at"
    | "updated_at"

export type UserStates = UserDTO | LoadingStateType
export type UsersStates = UserDTO[] | LoadingStateType
