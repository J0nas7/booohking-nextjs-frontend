// External
import type { Metadata } from "next"
import React from "react"

// Internal
import { Providers } from '@/layout'

export const metadata: Metadata = {
    title: {
        default: "Booohking",
        template: "Booohking - %s", // Automatically adds "Booohking - " as a prefix
    },
    description: "Book services at your favorite providers",
}

export default async function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang={"en-US"}>
            <body className={`font-sans`}>
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    )
}
