import { createHmac, timingSafeEqual } from "node:crypto";
import type { NextRequest, NextResponse } from "next/server";

const ADMIN_COOKIE_NAME = "admin_session";
const ADMIN_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

function getAdminUser() {
    return process.env.ADMIN_USER ?? process.env.NEXT_PUBLIC_ADMIN_USER ?? "";
}

function getAdminPassword() {
    return process.env.ADMIN_PASS ?? process.env.NEXT_PUBLIC_ADMIN_PASS ?? "";
}

function getAdminSessionSecret() {
    return process.env.ADMIN_SESSION_SECRET ?? getAdminPassword();
}

function getExpectedSessionValue() {
    const secret = getAdminSessionSecret();
    const user = getAdminUser();
    const signature = createHmac("sha256", secret).update(`admin:${user}`).digest("hex");
    return `admin:${signature}`;
}

function safeEquals(left: string, right: string) {
    const leftBuffer = Buffer.from(left);
    const rightBuffer = Buffer.from(right);

    if (leftBuffer.length !== rightBuffer.length) {
        return false;
    }

    return timingSafeEqual(leftBuffer, rightBuffer);
}

export function hasAdminCredentialsConfigured() {
    return Boolean(getAdminUser() && getAdminPassword());
}

export function validateAdminCredentials(username: string, password: string) {
    return safeEquals(username, getAdminUser()) && safeEquals(password, getAdminPassword());
}

export function isAuthorizedAdminRequest(request: NextRequest) {
    const cookieValue = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    if (!cookieValue) {
        return false;
    }

    return safeEquals(cookieValue, getExpectedSessionValue());
}

export function attachAdminSession(response: NextResponse) {
    response.cookies.set(ADMIN_COOKIE_NAME, getExpectedSessionValue(), {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: ADMIN_COOKIE_MAX_AGE,
    });
}

export function clearAdminSession(response: NextResponse) {
    response.cookies.set(ADMIN_COOKIE_NAME, "", {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 0,
    });
}
