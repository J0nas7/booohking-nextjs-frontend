import { cookies } from "next/headers"

export const getServerCookie = async (name: string) => {
    const cookieStore = await cookies()
    return cookieStore.get(name)?.value ?? null
}
