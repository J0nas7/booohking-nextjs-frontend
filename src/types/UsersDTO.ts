// Internal
import type { LoadingStateType } from "@/types";

// User Type
export interface UserDTO {
    User_ID?: number;                   // Primary key
    User_Name: string;                  // User name (max 255 chars)
    User_Email: string;                 // Email (unique, max 255 chars)
    User_Password: string;              // Hashed password (max 255 chars)
    User_Email_VerifiedAt?: string | null; // ISO format

    User_Role: "ROLE_ADMIN" | "ROLE_USER"; // Enum

    // Date fields
    User_CreatedAt?: string | null;    // ISO format
    User_UpdatedAt?: string | null;    // ISO format
    User_DeletedAt?: string | null;    // ISO format
}

export type UserFields =
    | "User_ID"
    | "User_Name"
    | "User_Email"
    | "User_Password"
    | "User_Email_VerifiedAt"
    | "User_Role"
    | "User_CreatedAt"
    | "User_UpdatedAt"
    | "User_DeletedAt"

export type UserStates = UserDTO | LoadingStateType
export type UsersStates = UserDTO[] | LoadingStateType
