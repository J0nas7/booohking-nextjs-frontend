"use client"

// External
import { useMutation } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from "react"

// Internal
import { useAuth } from '@/hooks'
import { env } from '@/types'
import { ResetPasswordFieldErrors, ResetPasswordView, ResetPasswordViewProps } from '@/views'

export const ResetPasswordPage: React.FC = () => {
    // ---- Hooks ----
    const { handleResetPassword } = useAuth()
    const searchParams = useSearchParams()

    // ---- State ----
    const mailToken = searchParams.get("token")
    const [token, setToken] = useState<string>(mailToken || "")
    const [password, setPassword] = useState<string>("")
    const [passwordConfirm, setPasswordConfirm] = useState<string>("")
    const [fieldErrors, setFieldErrors] = useState<ResetPasswordFieldErrors>({})

    // ---- Effects ----
    useEffect(() => {
        document.title = "Reset Password - " + env.app_name;
    }, [])

    // ---- React Query Mutation ----
    const { mutate: doReset, isPending: resetPending, error: resetError } = useMutation({
        mutationFn: () => handleResetPassword(
            token,
            password,
            passwordConfirm
        )
    })

    // ---- Methods ----
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const tempErrors: ResetPasswordFieldErrors = {}
        setFieldErrors({})

        if (!token.trim()) tempErrors.token = "Please provide your reset token"
        if (!password.trim()) {
            tempErrors.password = "Please provide your new password"
        } else if (password.length < 6) {
            tempErrors.password = "Password must be at least 6 characters"
        }
        if (!passwordConfirm.trim()) tempErrors.passwordConfirm = "Please confirm your new password"
        if (password !== passwordConfirm) tempErrors.passwordConfirm = "Passwords do not match"

        if (Object.keys(tempErrors).length > 0) {
            setFieldErrors(tempErrors)
            return
        }

        doReset()
    }

    // ---- Render ----
    const resetPasswordViewProps: ResetPasswordViewProps = {
        handleSubmit,
        fieldErrors,
        token,
        setToken,
        setFieldErrors,
        password,
        setPassword,
        passwordConfirm,
        setPasswordConfirm,
        resetError,
        resetPending
    }

    return <ResetPasswordView {...resetPasswordViewProps} />
}
