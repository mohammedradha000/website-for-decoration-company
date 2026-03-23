import { NextRequest, NextResponse } from "next/server";
import {
    attachAdminSession,
    hasAdminCredentialsConfigured,
    validateAdminCredentials,
} from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
    if (!hasAdminCredentialsConfigured()) {
        return NextResponse.json(
            { error: "Admin credentials are not configured on the server." },
            { status: 500 },
        );
    }

    try {
        const { username = "", password = "" } = await request.json() as {
            username?: string;
            password?: string;
        };

        if (!validateAdminCredentials(username, password)) {
            return NextResponse.json({ error: "Invalid username or password." }, { status: 401 });
        }

        const response = NextResponse.json({ success: true });
        attachAdminSession(response);
        return response;
    } catch (error) {
        console.error("Admin login failed:", error);
        return NextResponse.json({ error: "Failed to sign in." }, { status: 500 });
    }
}
