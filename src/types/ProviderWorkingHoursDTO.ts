// Internal
import type { LoadingStateType, ProviderDTO } from "@/types";

// Provider Working Hours Type
export interface ProviderWorkingHoursDTO {
    PWH_ID?: number;                     // Primary key
    Provider_ID: number;                 // FK → Providers.Provider_ID

    PWH_DayOfWeek: number;               // 0 = Sunday ... 6 = Saturday
    PWH_StartTime: string;               // Time (HH:MM:SS)
    PWH_EndTime: string;                 // Time (HH:MM:SS)

    // Date fields
    PWH_CreatedAt?: string | null;       // ISO format
    PWH_UpdatedAt?: string | null;       // ISO format
    PWH_DeletedAt?: string | null;       // ISO format

    // Relationships
    provider?: ProviderDTO;              // Optional loaded relation
}

export type ProviderWorkingHoursFields =
    | "PWH_ID"
    | "Provider_ID"
    | "PWH_DayOfWeek"
    | "PWH_StartTime"
    | "PWH_EndTime"
    | "PWH_CreatedAt"
    | "PWH_UpdatedAt"
    | "PWH_DeletedAt"

export type ProviderWorkingHoursStates = ProviderWorkingHoursDTO | LoadingStateType
export type ProviderWorkingHoursListStates = ProviderWorkingHoursDTO[] | LoadingStateType
