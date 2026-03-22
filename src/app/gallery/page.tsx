import { GalleryClient } from "@/components";
import fs from "fs";
import path from "path";
import { Project } from "@/shared";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "Gallery | Sarko Decor",
    description: "Browse our extensive portfolio of interior and exterior home decoration projects.",
};

export default function GalleryPage() {
    // Read dynamically to avoid build-time caching in dev
    const filePath = path.join(process.cwd(), "src/data/content.json");
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const content = JSON.parse(fileContent);
    const projects = content.projects as Project[];
    const categoryLinks = (content.categoryLinks || {}) as Record<string, string>;

    return (
        <div className="min-h-screen bg-background">
            <GalleryClient initialProjects={projects} categoryLinks={categoryLinks} />
        </div>
    );
}
