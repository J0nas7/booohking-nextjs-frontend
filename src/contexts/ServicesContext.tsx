"use client"

// External
import React, { createContext, useContext } from "react"

// Internal
import { useResourceContext } from "@/hooks"
import type { ServiceDTO } from "@/types"

// Services Context
export type ServicesContextType = {
    indexServices: () => Promise<any>
    indexServicesById: (parentId: number) => Promise<any>
    showService: (itemId: number) => Promise<any>
    storeService: (parentId: number, object?: ServiceDTO | undefined) => Promise<false | ServiceDTO>
    updateService: (itemChanges: ServiceDTO, parentId: number) => Promise<boolean>
    destroyService: (itemId: number, parentId: number, redirect: string | undefined) => Promise<void>
}

const ServicesContext = createContext<ServicesContextType | undefined>(undefined)

// ServicesProvider using useResourceContext
export const ServicesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const resource = "services"
    const idFieldName = "Service_ID"
    const parentResource = "users"

    const {
        indexItems: indexServices,
        indexItemsById: indexServicesById,
        showItem: showService,
        storeItem: storeService,
        updateItem: updateService,
        destroyItem: destroyService
    } = useResourceContext<ServiceDTO, "Service_ID">(
        resource,
        idFieldName,
        parentResource
    )

    return (
        <ServicesContext.Provider
            value={{
                indexServices,
                indexServicesById,
                showService,
                storeService,
                updateService,
                destroyService
            }}
        >
            {children}
        </ServicesContext.Provider>
    )
}

export const useServicesContext = () => {
    const context = useContext(ServicesContext)
    if (!context) {
        throw new Error("useServicesContext must be used within a ServicesProvider")
    }
    return context
}
