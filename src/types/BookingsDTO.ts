// Internal
import type { LoadingStateType, ProviderDTO, ServiceDTO, UserDTO } from "@/types";

// Booking Type
export interface BookingDTO {
    Booking_ID?: number;                          // Primary key

    User_ID: number;                              // FK → Users
    Provider_ID: number;                          // FK → Providers
    Service_ID: number;                           // FK → Services

    Booking_StartAt: string;                      // ISO format
    Booking_EndAt: string;                        // ISO format

    Booking_Status: "booked" | "cancelled";       // Enum
    Booking_CancelledAt?: string | null;          // ISO format

    // Date fields
    Booking_CreatedAt?: string | null;            // ISO format
    Booking_UpdatedAt?: string | null;            // ISO format
    Booking_DeletedAt?: string | null;            // ISO format

    // Relationships (optional)
    user?: UserDTO;
    provider?: ProviderDTO;
    service?: ServiceDTO;
}

export type BookingFields =
    | "Booking_ID"
    | "User_ID"
    | "Provider_ID"
    | "Service_ID"
    | "Booking_StartAt"
    | "Booking_EndAt"
    | "Booking_Status"
    | "Booking_CancelledAt"
    | "Booking_CreatedAt"
    | "Booking_UpdatedAt"
    | "Booking_DeletedAt"

export type BookingStates = BookingDTO | LoadingStateType
export type BookingsStates = BookingDTO[] | LoadingStateType
