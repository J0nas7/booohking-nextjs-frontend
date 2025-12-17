"use client"

// External
import { useMutation } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from "react"

// Internal
import { useAuth } from '@/hooks'
import { env } from '@/types'
import { ActivateAccountFieldErrors, ActivateAccountView, ActivateAccountViewProps } from '@/views'

export const ActivateAccountPage: React.FC = () => {
    // ---- Hooks ----
    const { handleActivateAccount } = useAuth()
    const searchParams = useSearchParams()

    // ---- State ----
    const mailToken = searchParams.get("token")
    const [token, setToken] = useState<string>(mailToken || "")
    const [fieldErrors, setFieldErrors] = useState<ActivateAccountFieldErrors>({})

    // ---- Effects ----
    useEffect(() => {
        document.title = "Activate account - " + env.app_name;
    }, [])

    // ---- React Query Mutation ----
    const { mutate: doActivate, isPending: activatePending, error: activateError, reset: activateReset } = useMutation({
        mutationFn: () => handleActivateAccount(token)
    })

    // ---- Methods ----
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const tempErrors: ActivateAccountFieldErrors = {}
        setFieldErrors({})
        activateReset()

        if (!token.trim()) tempErrors.token = "Please provide your token"

        if (Object.keys(tempErrors).length > 0) {
            setFieldErrors(tempErrors)
            return
        }

        doActivate()
    }

    // ---- Render ----
    const activateAccountViewProps: ActivateAccountViewProps = {
        handleSubmit,
        fieldErrors,
        setFieldErrors,
        token,
        setToken,
        activateError,
        activatePending
    }

    return <ActivateAccountView {...activateAccountViewProps} />
}
