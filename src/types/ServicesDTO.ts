// Internal
import { BookingDTO, LoadingStateType, ProviderDTO } from '@/types';

// Service Type
export interface ServiceDTO {
    Service_ID?: number;                  // Primary key
    Service_Name: string;                 // Service name (max 255 chars)
    Service_DurationMinutes: number;      // Duration in minutes (integer)
    Service_Description?: string | null;  // Description (nullable text)

    // Date fields
    Service_CreatedAt?: string | null;    // Creation timestamp
    Service_UpdatedAt?: string | null;    // Creation timestamp
    Service_DeletedAt?: string | null;    // Creation timestamp

    // Relationships
    bookings?: BookingDTO[]
    providers?: ProviderDTO[]
}

export type ServiceFields =
    | "Service_ID"
    | "Service_Name"
    | "Service_DurationMinutes"
    | "Service_Description"
    | "Service_CreatedAt"
    | "Service_UpdatedAt"
    | "Service_DeletedAt"

export type ServiceStates = ServiceDTO | LoadingStateType
export type ServicesStates = ServiceDTO[] | LoadingStateType
