import "server-only";

import fs from "node:fs/promises";
import path from "node:path";
import { SiteContent } from "@/shared";

const LOCAL_CONTENT_PATH = path.join(process.cwd(), "src", "data", "content.json");
const LOCAL_UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

const GITHUB_OWNER = process.env.GITHUB_OWNER;
const GITHUB_REPO = process.env.GITHUB_REPO;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_BRANCH = process.env.GITHUB_BRANCH ?? "main";
const GITHUB_CONTENT_PATH = process.env.GITHUB_CONTENT_PATH ?? "src/data/content.json";
const GITHUB_UPLOADS_DIR = (process.env.GITHUB_UPLOADS_DIR ?? "uploads").replace(/^\/+|\/+$/g, "");

function getGitHubHeaders(extraHeaders: HeadersInit = {}) {
    return {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        "Content-Type": "application/json",
        "X-GitHub-Api-Version": "2022-11-28",
        ...extraHeaders,
    };
}

function isGitHubStorageEnabled() {
    return Boolean(GITHUB_OWNER && GITHUB_REPO && GITHUB_TOKEN);
}

function toGitHubContentsUrl(filePath: string, includeRef = true) {
    const encodedPath = filePath
        .split("/")
        .map((segment) => encodeURIComponent(segment))
        .join("/");

    const url = new URL(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${encodedPath}`);
    if (includeRef) {
        url.searchParams.set("ref", GITHUB_BRANCH);
    }
    return url;
}

function normalizeAssetPath(inputPath: string) {
    const normalized = inputPath.replace(/\\/g, "/").replace(/^\/+/, "");

    if (!normalized || normalized.includes("..")) {
        throw new Error("Invalid asset path.");
    }

    return normalized;
}

function sanitizeUploadFilename(filename: string) {
    const safeName = filename
        .replace(/\s+/g, "-")
        .replace(/[^a-zA-Z0-9._-]/g, "")
        .replace(/-+/g, "-");

    return safeName || `upload-${Date.now()}`;
}

function getContentType(filePath: string) {
    const extension = path.extname(filePath).toLowerCase();

    switch (extension) {
        case ".png":
            return "image/png";
        case ".jpg":
        case ".jpeg":
            return "image/jpeg";
        case ".webp":
            return "image/webp";
        case ".gif":
            return "image/gif";
        case ".svg":
            return "image/svg+xml";
        case ".avif":
            return "image/avif";
        default:
            return "application/octet-stream";
    }
}

async function readLocalContent() {
    const fileContent = await fs.readFile(LOCAL_CONTENT_PATH, "utf-8");
    return JSON.parse(fileContent) as SiteContent;
}

async function writeLocalContent(content: SiteContent) {
    await fs.writeFile(LOCAL_CONTENT_PATH, JSON.stringify(content, null, 2), "utf-8");
}

async function readGitHubFile(filePath: string) {
    const response = await fetch(toGitHubContentsUrl(filePath), {
        headers: getGitHubHeaders(),
        cache: "no-store",
    });

    if (!response.ok) {
        const details = await response.text();
        throw new Error(`GitHub read failed (${response.status}): ${details}`);
    }

    const payload = await response.json() as { content?: string; sha?: string };

    if (!payload.content || !payload.sha) {
        throw new Error(`GitHub response for ${filePath} did not include file content.`);
    }

    return {
        sha: payload.sha,
        content: Buffer.from(payload.content.replace(/\n/g, ""), "base64").toString("utf-8"),
    };
}

async function readGitHubBinaryFile(filePath: string) {
    const response = await fetch(toGitHubContentsUrl(filePath), {
        headers: getGitHubHeaders({
            Accept: "application/vnd.github.raw+json",
        }),
        cache: "no-store",
    });

    if (!response.ok) {
        const details = await response.text();
        throw new Error(`GitHub binary read failed (${response.status}): ${details}`);
    }

    return Buffer.from(await response.arrayBuffer());
}

async function writeGitHubFile(filePath: string, fileContent: Buffer | string, message: string) {
    const existingFile = await fetch(toGitHubContentsUrl(filePath), {
        headers: getGitHubHeaders(),
        cache: "no-store",
    });

    let sha: string | undefined;

    if (existingFile.ok) {
        const existingPayload = await existingFile.json() as { sha?: string };
        sha = existingPayload.sha;
    } else if (existingFile.status !== 404) {
        const details = await existingFile.text();
        throw new Error(`GitHub metadata read failed (${existingFile.status}): ${details}`);
    }

    const encodedContent = Buffer.isBuffer(fileContent)
        ? fileContent.toString("base64")
        : Buffer.from(fileContent, "utf-8").toString("base64");

    const response = await fetch(toGitHubContentsUrl(filePath, false), {
        method: "PUT",
        headers: getGitHubHeaders(),
        body: JSON.stringify({
            message,
            content: encodedContent,
            branch: GITHUB_BRANCH,
            ...(sha ? { sha } : {}),
        }),
        cache: "no-store",
    });

    if (!response.ok) {
        const details = await response.text();
        throw new Error(`GitHub write failed (${response.status}): ${details}`);
    }
}

async function readGitHubContent() {
    const file = await readGitHubFile(GITHUB_CONTENT_PATH);
    return JSON.parse(file.content) as SiteContent;
}

export async function getSiteContent() {
    if (isGitHubStorageEnabled()) {
        return readGitHubContent();
    }

    return readLocalContent();
}

export async function saveSiteContent(content: SiteContent) {
    if (isGitHubStorageEnabled()) {
        await writeGitHubFile(
            GITHUB_CONTENT_PATH,
            JSON.stringify(content, null, 2),
            "Update site content from admin panel",
        );
        return;
    }

    await writeLocalContent(content);
}

export async function saveUploadedFile(file: File) {
    const safeFilename = `${Date.now()}-${sanitizeUploadFilename(file.name)}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    if (isGitHubStorageEnabled()) {
        const remotePath = `${GITHUB_UPLOADS_DIR}/${safeFilename}`;
        await writeGitHubFile(remotePath, buffer, `Upload asset ${safeFilename} from admin panel`);
        return `/api/uploads/${safeFilename}`;
    }

    await fs.mkdir(LOCAL_UPLOADS_DIR, { recursive: true });
    await fs.writeFile(path.join(LOCAL_UPLOADS_DIR, safeFilename), buffer);
    return `/uploads/${safeFilename}`;
}

export async function readUploadedFile(assetPath: string) {
    const normalizedPath = normalizeAssetPath(assetPath);

    if (isGitHubStorageEnabled()) {
        const remotePath = `${GITHUB_UPLOADS_DIR}/${normalizedPath}`;
        return {
            buffer: await readGitHubBinaryFile(remotePath),
            contentType: getContentType(normalizedPath),
        };
    }

    const localFilePath = path.join(LOCAL_UPLOADS_DIR, normalizedPath);
    return {
        buffer: await fs.readFile(localFilePath),
        contentType: getContentType(normalizedPath),
    };
}
