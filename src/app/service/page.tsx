"use client"

import { useRouter } from 'next/navigation'
import React from 'react'

const Page = () => {
    const router = useRouter()

    React.useEffect(() => {
        router.push("/")
    }, [])

    return <></>
}

export default Page
