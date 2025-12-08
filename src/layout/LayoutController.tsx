"use client"

// External
import React, { useEffect, useState } from "react"

// Internal
import { GuestLayout, OnlyPrivateRoutes, OnlyPublicRoutes, UserLayout } from "@/layout"
import { selectIsLoggedIn, useTypedSelector } from "@/redux"
import { Container } from '@/ui'

void React.createElement

export const LayoutController = (
    { children }: { children: React.ReactNode }
) => {
    // Redux
    const isLoggedIn = useTypedSelector(selectIsLoggedIn)

    // Internal variables
    const [isLoading, setIsLoading] = useState<boolean>(true)

    // Effects
    useEffect(() => {
        setIsLoading(false)
    }, [])

    if (isLoading) return null

    if (isLoggedIn === true) {
        return (
            <Container data-testid="mock-container" className="booohking-wrapper">
                <OnlyPrivateRoutes>
                    <UserLayout>
                        {children}
                    </UserLayout>
                </OnlyPrivateRoutes>
            </Container>
        )
    }

    return (
        <Container data-testid="mock-container" className="booohking-wrapper">
            <OnlyPublicRoutes>
                <GuestLayout>
                    {children}
                </GuestLayout>
            </OnlyPublicRoutes>
        </Container>
    )
}
