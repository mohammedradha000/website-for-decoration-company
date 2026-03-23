import { NextRequest, NextResponse } from "next/server";
import { isAuthorizedAdminRequest } from "@/lib/admin-auth";
import { getSiteContent, saveSiteContent } from "@/lib/content-store";

export async function GET(request: NextRequest) {
    if (!isAuthorizedAdminRequest(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const content = await getSiteContent();
        return NextResponse.json(content);
    } catch (error) {
        console.error("Failed to read admin content:", error);
        return NextResponse.json({ error: "Failed to read content" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    if (!isAuthorizedAdminRequest(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const newContent = await request.json();
        await saveSiteContent(newContent);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to save admin content:", error);
        return NextResponse.json({ error: "Failed to save content" }, { status: 500 });
    }
}
