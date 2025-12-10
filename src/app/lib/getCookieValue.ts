import { getCookie } from "cookies-next";
import { cookies } from "next/headers";

// Automatically detects server or client
export async function getCookieValue(name: string): Promise<string | undefined> {
    try {
        // If on server → use next/headers
        const cookieStore = await cookies()
        const token = cookieStore.get("accessToken")?.value;
        return token
    } catch {
        // If on client → use cookies-next
        return getCookie(name)?.toString();
    }
}
