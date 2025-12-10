"use client"

// External
import React, { createContext, useContext } from "react"

// Internal
import { useResourceContext } from "@/hooks"
import type { UserDTO } from "@/types"

// Users Context
export type UsersContextType = {
    indexUsers: () => Promise<any>
    indexUsersById: (parentId: number) => Promise<any>
    showUser: (itemId: number) => Promise<any>
    storeUser: (parentId: number, object?: UserDTO | undefined) => Promise<false | UserDTO>
    updateUser: (itemChanges: UserDTO, parentId: number) => Promise<boolean>
    destroyUser: (itemId: number, parentId: number, redirect: string | undefined) => Promise<void>
}

const UsersContext = createContext<UsersContextType | undefined>(undefined)

// UsersProvider using useResourceContext
export const UsersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const resource = "users"
    const idFieldName = "User_ID"
    const parentResource = "users"

    const {
        indexItems: indexUsers,
        indexItemsById: indexUsersById,
        showItem: showUser,
        storeItem: storeUser,
        updateItem: updateUser,
        destroyItem: destroyUser
    } = useResourceContext<UserDTO, "User_ID">(
        resource,
        idFieldName,
        parentResource
    )

    return (
        <UsersContext.Provider
            value={{
                indexUsers,
                indexUsersById,
                showUser,
                storeUser,
                updateUser,
                destroyUser
            }}
        >
            {children}
        </UsersContext.Provider>
    )
}

export const useUsersContext = () => {
    const context = useContext(UsersContext)
    if (!context) {
        throw new Error("useUsersContext must be used within a UsersProvider")
    }
    return context
}
