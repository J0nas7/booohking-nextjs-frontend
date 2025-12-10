"use client"

// External
import React, { createContext, useContext } from "react"

// Internal
import { useResourceContext } from "@/hooks"
import type { BookingDTO } from "@/types"

// Bookings Context
export type BookingsContextType = {
    indexBookings: () => Promise<any>
    indexBookingsById: (parentId: number) => Promise<any>
    showBooking: (itemId: number) => Promise<any>
    storeBooking: (parentId: number, object?: BookingDTO | undefined) => Promise<false | BookingDTO>
    updateBooking: (itemChanges: BookingDTO, parentId: number) => Promise<boolean>
    destroyBooking: (itemId: number, parentId: number, redirect: string | undefined) => Promise<void>
}

const BookingsContext = createContext<BookingsContextType | undefined>(undefined)

// BookingsProvider using useResourceContext
export const BookingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const resource = "bookings"
    const idFieldName = "Booking_ID"
    const parentResource = "users"

    const {
        indexItems: indexBookings,
        indexItemsById: indexBookingsById,
        showItem: showBooking,
        storeItem: storeBooking,
        updateItem: updateBooking,
        destroyItem: destroyBooking
    } = useResourceContext<BookingDTO, "Booking_ID">(
        resource,
        idFieldName,
        parentResource
    )

    return (
        <BookingsContext.Provider
            value={{
                indexBookings,
                indexBookingsById,
                showBooking,
                storeBooking,
                updateBooking,
                destroyBooking
            }}
        >
            {children}
        </BookingsContext.Provider>
    )
}

export const useBookingsContext = () => {
    const context = useContext(BookingsContext)
    if (!context) {
        throw new Error("useBookingsContext must be used within a BookingsProvider")
    }
    return context
}
