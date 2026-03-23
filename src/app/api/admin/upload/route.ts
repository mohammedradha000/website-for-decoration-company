import { NextRequest, NextResponse } from "next/server";
import { isAuthorizedAdminRequest } from "@/lib/admin-auth";
import { saveUploadedFile } from "@/lib/content-store";

export async function POST(request: NextRequest) {
    if (!isAuthorizedAdminRequest(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;
        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const url = await saveUploadedFile(file);

        return NextResponse.json({ 
            success: true, 
            url,
        });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
    }
}
