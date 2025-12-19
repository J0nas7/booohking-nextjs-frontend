// Internal
import type { LoadingStateType } from "@/types";

// User Type
export interface UserDTO {
    User_ID?: number;                   // Primary key
    name: string;                  // User name (max 255 chars)
    User_Email: string;                 // Email (unique, max 255 chars)
    User_Password: string;              // Hashed password (max 255 chars)
    email_verified_at?: string | null; // ISO format

    role: "ROLE_ADMIN" | "ROLE_USER"; // Enum

    // Date fields
    User_CreatedAt?: string | null;    // ISO format
    User_UpdatedAt?: string | null;    // ISO format
    User_DeletedAt?: string | null;    // ISO format
}

export type UserFields =
    | "User_ID"
    | "name"
    | "User_Email"
    | "User_Password"
    | "email_verified_at"
    | "role"
    | "User_CreatedAt"
    | "User_UpdatedAt"
    | "User_DeletedAt"

export type UserStates = UserDTO | LoadingStateType
export type UsersStates = UserDTO[] | LoadingStateType
