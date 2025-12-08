"use client"

// External
import React, { createContext, useContext } from "react"

// Internal
import { useResourceContext } from "@/hooks"
import type { ProviderWorkingHoursDTO } from "@/types"

// ProviderWorkingHours Context
export type ProviderWorkingHoursContextType = {
    indexProvidersWH: () => Promise<any>
    indexProvidersWHById: (parentId: number) => Promise<any>
    showProviderWH: (itemId: number) => Promise<any>
    storeProviderWH: (parentId: number, object?: ProviderWorkingHoursDTO | undefined) => Promise<false | ProviderWorkingHoursDTO>
    updateProviderWH: (itemChanges: ProviderWorkingHoursDTO, parentId: number) => Promise<boolean>
    destroyProviderWH: (itemId: number, parentId: number, redirect: string | undefined) => Promise<void>
}

const ProviderWorkingHoursContext = createContext<ProviderWorkingHoursContextType | undefined>(
    undefined
)

// ProviderWorkingHoursProvider using useResourceContext
export const ProviderWorkingHoursProvider: React.FC<{ children: React.ReactNode }> = ({
    children
}) => {
    const resource = "provider-working-hours"

    const {
        indexItems: indexProvidersWH,
        indexItemsById: indexProvidersWHById,
        showItem: showProviderWH,
        storeItem: storeProviderWH,
        updateItem: updateProviderWH,
        destroyItem: destroyProviderWH
    } = useResourceContext<ProviderWorkingHoursDTO, "PWH_ID">(
        resource,
        "PWH_ID",
        "provider-working-hours"
    )

    return (
        <ProviderWorkingHoursContext.Provider
            value={{
                indexProvidersWH,
                indexProvidersWHById,
                showProviderWH,
                storeProviderWH,
                updateProviderWH,
                destroyProviderWH
            }}
        >
            {children}
        </ProviderWorkingHoursContext.Provider>
    )
}

export const useProviderWorkingHoursContext = () => {
    const context = useContext(ProviderWorkingHoursContext)
    if (!context) {
        throw new Error(
            "useProviderWorkingHoursContext must be used within a ProviderWorkingHoursProvider"
        )
    }
    return context
}
