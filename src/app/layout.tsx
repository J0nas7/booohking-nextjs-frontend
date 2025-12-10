// External
import { Metadata } from 'next'
import React from "react"

export const metadata: Metadata = {
    title: {
        default: "Booohking",
        template: "%s - Booohking", // Automatically adds "* - Booohkings"
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
                {children}
            </body>
        </html>
    )
}
