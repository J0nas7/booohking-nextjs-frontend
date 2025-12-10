// src/app/lib/serverGet.ts
import { paths } from "@/types";
import { cookies } from 'next/headers';

export async function serverGet(apiEndPoint: string) {
    // Build the "real" target URL
    const url = apiEndPoint.startsWith("http")
        ? apiEndPoint
        : `http://backend:8080${paths.API_ROUTE}${apiEndPoint}`;

    // Encode the URL and call the Next.js proxy route
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const proxyUrl = `${baseUrl}/api/get?url=${encodeURIComponent(url)}`;

    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join("; ");

    // Fetch via the proxy route
    const response = await fetch(proxyUrl, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Cookie": allCookies,  // forward cookies manually
        },
        credentials: "include",
        cache: "no-store",
    });

    return response.json();
}
