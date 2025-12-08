// Internal
import type { BookingDTO, LoadingStateType, ProviderWorkingHoursDTO, ServiceDTO } from "@/types";

// Provider Type
export interface ProviderDTO {
    Provider_ID?: number;                // Primary key
    Service_ID?: number;                 // Primary key
    Provider_Name: string;               // Provider name (max 255 chars)
    Provider_Timezone: string;           // Timezone (max 50 chars, default: 'UTC')

    // Date fields
    Provider_CreatedAt?: string | null;  // ISO format
    Provider_UpdatedAt?: string | null;  // ISO format
    Provider_DeletedAt?: string | null;  // ISO format

    // Relationships
    working_hours?: ProviderWorkingHoursDTO[]
    bookings?: BookingDTO[]
    service?: ServiceDTO
}

export type ProviderFields =
    | "Provider_ID"
    | "Provider_Name"
    | "Provider_Timezone"
    | "Provider_CreatedAt"
    | "Provider_UpdatedAt"
    | "Provider_DeletedAt"

export type ProviderStates = ProviderDTO | LoadingStateType
export type ProvidersStates = ProviderDTO[] | LoadingStateType
