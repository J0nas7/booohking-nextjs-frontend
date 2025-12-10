"use client"

// External
import React, { useEffect, useState } from "react"

// Internal
import { GuestLayout, OnlyPrivateRoutes, OnlyPublicRoutes, UserLayout } from "@/layout"
import { useAppDispatch } from "@/redux"
import { Container } from '@/ui'

void React.createElement

interface LayoutControllerProps {
    children: React.ReactNode
    isLoggedIn: boolean;
}

export const LayoutController: React.FC<LayoutControllerProps> = (props) => {
    // ---- Hooks ----
    const dispatch = useAppDispatch()

    // ---- State ----
    const [isClientReady, setIsClientReady] = useState(false);

    // ---- Effects ----
    useEffect(() => {
        setIsClientReady(true);
        // dispatch(setIsLoggedIn(props.isLoggedIn))
    }, [props.isLoggedIn, dispatch]);

    // ---- Render ----
    if (!isClientReady) return null;

    if (props.isLoggedIn === true) {
        return (
            <Container data-testid="mock-container" className="booohking-wrapper">
                <OnlyPrivateRoutes>
                    <UserLayout>
                        {props.children}
                    </UserLayout>
                </OnlyPrivateRoutes>
            </Container>
        )
    }

    return (
        <Container data-testid="mock-container" className="booohking-wrapper">
            <OnlyPublicRoutes>
                <GuestLayout>
                    {props.children}
                </GuestLayout>
            </OnlyPublicRoutes>
        </Container>
    )
}
