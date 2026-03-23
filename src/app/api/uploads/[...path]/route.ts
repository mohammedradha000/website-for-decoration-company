import { NextRequest, NextResponse } from "next/server";
import { readUploadedFile } from "@/lib/content-store";

export async function GET(
    _request: NextRequest,
    context: { params: Promise<{ path: string[] }> },
) {
    try {
        const params = await context.params;
        const assetPath = params.path.join("/");
        const file = await readUploadedFile(assetPath);

        return new NextResponse(file.buffer, {
            headers: {
                "Content-Type": file.contentType,
                "Cache-Control": "public, max-age=31536000, immutable",
            },
        });
    } catch (error) {
        console.error("Failed to read uploaded asset:", error);
        return NextResponse.json({ error: "File not found" }, { status: 404 });
    }
}
