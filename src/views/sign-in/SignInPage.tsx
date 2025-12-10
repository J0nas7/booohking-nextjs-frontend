"use client"

// External
import { useMutation } from '@tanstack/react-query'
import React, { useEffect, useState } from "react"

// Internal
import { useAuth } from '@/hooks'
import { env, UserDTO } from "@/types"
import { SignInFieldErrors, SignInView, SignInViewProps } from '@/views'

const initialUser: Partial<UserDTO> = {
    User_Email: "",
    User_Password: "",
}

export const SignInPage: React.FC = () => {
    // ---- Hooks ----
    const { handleLoginSubmit } = useAuth()

    // ---- State ----
    const [user, setUser] = useState<Partial<UserDTO>>(initialUser)
    const [fieldErrors, setFieldErrors] = useState<SignInFieldErrors>({})

    // ---- Effects ----
    useEffect(() => {
        console.log("sign in", document.title)
        document.title = "Sign In - " + env.app_name;
    }, [])

    // --- React Query Mutation ---
    const { mutate: doLogin, isPending: loginPending, error: loginError } = useMutation({
        mutationFn: () => {
            if (!user.User_Email || !user.User_Password) return Promise.reject(new Error(""))
            return handleLoginSubmit(user.User_Email, user.User_Password)
        },
    });

    // ---- Methods ----
    const handleChange = (field: keyof UserDTO, value: string) => {
        setUser((prev) => ({ ...prev, [field]: value }))
        setFieldErrors((prev) => ({ ...prev, [field]: undefined }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const tempErrors: SignInFieldErrors = {}
        setFieldErrors({})

        if (!user.User_Email?.trim()) tempErrors.User_Email = "Please provide an email"
        if (!user.User_Password) tempErrors.User_Password = "Please provide a password"

        if (Object.keys(tempErrors).length > 0) {
            setFieldErrors(tempErrors)
            return
        }

        try {
            doLogin(undefined)
        } catch (err) {
            setFieldErrors({ User_Email: "Login failed. Check credentials." })
        }
    }

    // ---- Render ----
    const signInViewProps: SignInViewProps = {
        handleSubmit,
        fieldErrors,
        user,
        handleChange,
        loginError,
        loginPending
    }

    return <SignInView {...signInViewProps} />
}
