"use client"

// External
import React, { createContext, useContext } from "react"

// Internal
import { ServiceResponse, useAxios, useResourceContext } from "@/hooks"
import type { ProviderDTO } from "@/types"

// Providers Context
export type ProvidersContextType = {
    indexProviders: () => Promise<any>
    indexProvidersById: (parentId: number) => Promise<any>
    showProvider: (itemId: number) => Promise<any>
    storeProvider: (parentId: number, object?: ProviderDTO | undefined) => Promise<ServiceResponse<ProviderDTO>>
    updateProvider: (itemChanges: ProviderDTO, parentId: number) => Promise<boolean>
    destroyProvider: (itemId: number, parentId: number, redirect: string | undefined) => Promise<void>

    // Custom methods:
    readAvailableSlots: (providerId: number, serviceId?: number | undefined, page?: number) => Promise<any>
}

const ProvidersContext = createContext<ProvidersContextType | undefined>(undefined)

// ProvidersProvider using useResourceContext
export const ProvidersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const resource = "providers"
    const idFieldName = "Provider_ID"
    const parentResource = "services"

    const {
        indexItems: indexProviders,
        indexItemsById: indexProvidersById,
        showItem: showProvider,
        storeItem: storeProvider,
        updateItem: updateProvider,
        destroyItem: destroyProvider
    } = useResourceContext<ProviderDTO, "Provider_ID">(
        resource,
        idFieldName,
        parentResource
    )

    const { httpGetRequest } = useAxios()

    const readAvailableSlots = async (providerId: number, serviceId?: number, page: number = 1) => {
        const params = [`page=${page}`];
        if (serviceId) params.push(`service_id=${serviceId}`);
        const query = params.length ? `?${params.join("&")}` : "";

        const response = await httpGetRequest(`bookings/${providerId}/available-slots${query}`);
        if (!response.success) throw new Error("Failed to load available slots");
        return response;
    };

    return (
        <ProvidersContext.Provider
            value={{
                indexProviders,
                indexProvidersById,
                showProvider,
                storeProvider,
                updateProvider,
                destroyProvider,

                // Custom methods
                readAvailableSlots
            }}
        >
            {children}
        </ProvidersContext.Provider>
    )
}

export const useProvidersContext = () => {
    const context = useContext(ProvidersContext)
    if (!context) {
        throw new Error("useProvidersContext must be used within a ProvidersProvider")
    }
    return context
}
