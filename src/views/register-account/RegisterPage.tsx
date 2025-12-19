"use client"

// External
import { useMutation } from '@tanstack/react-query'
import React, { useEffect, useState } from "react"

// Internal
import { useAuth } from '@/hooks'
import { env, UserDTO } from "@/types"
import { RegisterPageFieldErrors, RegisterView, RegisterViewProps } from '@/views'

const initialUser: UserDTO = {
    name: "",
    email: "",
    password: "",
    role: "ROLE_USER",
}

export const RegisterPage: React.FC = () => {
    // ---- Hooks ----
    const { handleRegister } = useAuth()

    // ---- State ----
    const [user, setUser] = useState<UserDTO>(initialUser)
    const [passwordConfirm, setPasswordConfirm] = useState("")
    const [fieldErrors, setFieldErrors] = useState<RegisterPageFieldErrors>({})

    // ---- Effects ----
    useEffect(() => {
        document.title = "Register account - " + env.app_name;
    }, [])

    // --- React Query Mutation ---
    const { mutate: doRegister, isPending: registerPending, error: registerError } = useMutation({
        mutationFn: () => handleRegister({
            ...user,
            password_confirmation: passwordConfirm,
            acceptTerms: true // Temporarily just append acceptTerms, there is no user conditions yet
        })
    })

    // ---- Methods ----
    const handleChange = (field: keyof UserDTO, value: string) => {
        setUser((prev) => ({ ...prev, [field]: value }))
        setFieldErrors((prev) => ({ ...prev, [field]: undefined })) // clear error on change
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const tempErrors: RegisterPageFieldErrors = {}
        setFieldErrors({})

        if (!user.name.trim()) tempErrors.name = "Please provide a name"
        if (!user.email.trim()) tempErrors.email = "Please provide an email"
        if (!user.password) {
            tempErrors.password = "Please provide a password"
        } else if (user.password.length < 6) {
            tempErrors.password = "Password must be at least 6 characters"
        }
        if (user.password !== passwordConfirm) {
            tempErrors.PasswordConfirm = "Passwords do not match"
        }

        if (Object.keys(tempErrors).length > 0) {
            setFieldErrors(tempErrors)
            return
        }

        doRegister()
    }

    // ---- Render ----
    const registerViewProps: RegisterViewProps = {
        handleSubmit,
        fieldErrors,
        user,
        handleChange,
        passwordConfirm,
        setPasswordConfirm,
        registerError,
        registerPending
    }

    return <RegisterView {...registerViewProps} />
}
