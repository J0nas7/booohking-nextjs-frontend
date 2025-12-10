import { cookies } from 'next/headers';
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    // The request origin (protocol + host)
    const { headers, url } = req;
    const origin = headers.get("origin") || new URL(url).origin;

    // Extract query params
    const { searchParams } = new URL(req.url);
    const urlParam = searchParams.get("url");

    if (!urlParam) {
        return NextResponse.json(
            { error: "Missing `url` query parameter" },
            { status: 400 }
        );
    }

    // Decode/parse if needed
    const targetUrl = decodeURIComponent(urlParam);

    // Forward cookies from the request
    const cookieStore = await cookies();
    const allCookies = cookieStore
        .getAll()
        .map(c => `${c.name}=${c.value}`)
        .join("; ");

    try {

        // Optional: whitelist allowed domains for safety
        const allowedHosts = ["backend:8080"];
        const parsedUrl = new URL(targetUrl);
        if (!allowedHosts.includes(parsedUrl.host)) {
            return NextResponse.json(
                { error: "Host not allowed" },
                { status: 403 }
            );
        }

        // Fetch the target URL
        const response = await fetch(targetUrl, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Cookie": allCookies, // forward cookies
            }
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: `Fetch failed (${response.status})` },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (err: unknown) {
        const error = err instanceof Error
            ? err.message
            : typeof err === "string"
                ? err
                : "Unknown error";

        const stack = err instanceof Error ? err.stack : undefined;

        console.error("API proxy error:", err);

        return NextResponse.json(
            {
                message: "Server error",
                error,
                stack
            },
            { status: 500 }
        );
    }
}
