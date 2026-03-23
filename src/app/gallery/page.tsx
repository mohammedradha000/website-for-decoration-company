import { GalleryClient } from "@/components";
import { Project } from "@/shared";
import { getSiteContent } from "@/lib/content-store";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "Gallery | Sarko Decor",
    description: "Browse our extensive portfolio of interior and exterior home decoration projects.",
};

export default async function GalleryPage() {
    const content = await getSiteContent();
    const projects = content.projects as Project[];
    const categoryLinks = (content.categoryLinks || {}) as Record<string, string>;

    return (
        <div className="min-h-screen bg-background">
            <GalleryClient initialProjects={projects} categoryLinks={categoryLinks} />
        </div>
    );
}
