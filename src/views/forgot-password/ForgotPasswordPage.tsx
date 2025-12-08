"use client"

// External
import { useMutation } from '@tanstack/react-query'
import React, { useEffect, useState } from "react"

// Internal
import { useAuth } from '@/hooks'
import { env } from '@/types'
import { ForgotPasswordFieldErrors, ForgotPasswordView, ForgotPasswordViewProps } from '@/views'

export const ForgotPasswordPage: React.FC = () => {
    // ---- Hooks ----
    const { handleForgotRequest } = useAuth()

    // ---- State ----
    const [email, setEmail] = useState("")
    const [fieldErrors, setFieldErrors] = useState<ForgotPasswordFieldErrors>({})

    // ---- Effects ----
    useEffect(() => {
        document.title = "Forgot password - " + env.app_name;
    }, [])

    // ---- React Query Mutation ----
    const { mutate: doForgot, isPending: forgotPending, error: forgotError } = useMutation({
        mutationFn: () => handleForgotRequest(email)
    })

    // ---- Methods ----
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const tempErrors: ForgotPasswordFieldErrors = {}
        setFieldErrors({})

        if (!email.trim()) tempErrors.User_Email = "Please provide your email"

        if (Object.keys(tempErrors).length > 0) {
            setFieldErrors(tempErrors)
            return
        }

        doForgot()
    }

    // ---- Render ----
    const forgotPasswordViewProps: ForgotPasswordViewProps = {
        handleSubmit,
        fieldErrors,
        email,
        setEmail,
        setFieldErrors,
        forgotError,
        forgotPending
    }

    return <ForgotPasswordView {...forgotPasswordViewProps} />
}
