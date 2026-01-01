// src/app/lib/serverGet.ts
import { env, paths } from "@/types";
import { cookies } from 'next/headers';

export async function serverGet(apiEndPoint: string) {
    // Build the "real" target URL
    const url = apiEndPoint.startsWith("http")
        ? apiEndPoint
        : `${env.url.BACKEND_URL}${paths.API_ROUTE}${apiEndPoint}`;

    // Encode the URL and call the Next.js proxy route
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || env.url.APP_URL;
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
