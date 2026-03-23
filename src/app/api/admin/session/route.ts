import { NextRequest, NextResponse } from "next/server";
import { isAuthorizedAdminRequest } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
    return NextResponse.json({
        authenticated: isAuthorizedAdminRequest(request),
    });
}
