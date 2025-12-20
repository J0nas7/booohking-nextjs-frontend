"use client"

// External
import React, { createContext, useContext } from "react"

// Internal
import { ServiceResponse, useResourceContext } from "@/hooks"
import { setSnackMessage, useAppDispatch } from '@/redux'
import type { UserDTO } from "@/types"
import { useRouter } from 'next/navigation'

// Users Context
export type UsersContextType = {
    indexUsers: () => Promise<any>
    indexUsersById: (parentId: number) => Promise<any>
    showUser: (itemId: number) => Promise<any>
    storeUser: (parentId: number, object?: UserDTO | undefined) => Promise<ServiceResponse<UserDTO>>
    updateUser: (itemChanges: UserDTO, parentId: number) => Promise<boolean>
    destroyUser: (itemId: number, parentId: number, redirect: string | undefined) => Promise<void>
    handleRegister: (formData: any) => Promise<boolean>
}

const UsersContext = createContext<UsersContextType | undefined>(undefined)

// UsersProvider using useResourceContext
export const UsersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const resource = "users"
    const idFieldName = "id"
    const parentResource = "users"

    const {
        indexItems: indexUsers,
        indexItemsById: indexUsersById,
        showItem: showUser,
        storeItem: storeUser,
        updateItem: updateUser,
        destroyItem: destroyUser
    } = useResourceContext<UserDTO, "id">(
        resource,
        idFieldName,
        parentResource
    )

    // ---- Hooks ----
    const router = useRouter()
    const dispatch = useAppDispatch()

    // ---- Methods ----
    const handleRegister = async (formData: any): Promise<boolean> => {
        try {
            // Send data to the API for token generation
            const response = await storeUser(0, formData)

            if (!response.success) {
                const errors = response.errors
                const error = response.error

                if (errors && typeof errors === "object") {
                    const messages = Object.values(errors).flat()
                    const message = messages.join(" ")
                    throw new Error(message)
                }

                throw new Error(response.error || error || response.message || "Registration failed")
            }

            dispatch(setSnackMessage("Your account was created. Activation e-mail is sent."))

            const emailStatus: string = response?.data?.email_status
            const token: string = response?.data?.token
            if (emailStatus.includes("Failed to send email:")) {
                router.push(`/activate-account?token=${token}`)
            } else {
                router.push("/activate-account")
            }
            return true
        } catch (err) {
            console.log("useAuth register error:", err)

            if (err instanceof Error) {
                dispatch(setSnackMessage(err.message))
                throw err
            }

            // fallback (should almost never hit)
            const fallback = "Register-request failed. Try again."
            dispatch(setSnackMessage(fallback))
            throw new Error(fallback)
        }
    }

    return (
        <UsersContext.Provider
            value={{
                indexUsers,
                indexUsersById,
                showUser,
                storeUser,
                updateUser,
                destroyUser,
                handleRegister
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
