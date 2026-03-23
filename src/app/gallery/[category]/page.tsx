import { OptimizedImageGrid } from "@/components";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";
import { Project } from "@/shared";
import { getSiteContent } from "@/lib/content-store";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "Gallery | Sarko Decor",
    description: "Browse our project photos.",
};

export default async function CategoryGalleryPage(props: { params: Promise<{ category: string }> }) {
    const params = await props.params;

    const decodedCategory = decodeURIComponent(params.category);

    const content = await getSiteContent();
    const projects = content.projects as Project[];
    const categoryLinks = (content.categoryLinks || {}) as Record<string, string>;

    const categoryProjects = projects.filter(p => p.category === decodedCategory);

    if (categoryProjects.length === 0) {
        notFound();
    }

    const allImages: string[] = [];
    categoryProjects.forEach(p => {
        if (p.image) allImages.push(p.image);
        if (p.galleryImages && p.galleryImages.length > 0) {
            allImages.push(...p.galleryImages);
        }
    });

    const uniqueImages = Array.from(new Set(allImages));
    
    // Professional normalization for Kurdish character matching
    const normalize = (str: string) => str.replace(/ی/g, 'ى').replace(/ک/g, 'ك').trim();
    const normalizedCategory = normalize(decodedCategory);
    
    let seeMoreUrl = categoryLinks[decodedCategory];
    if (!seeMoreUrl) {
        // Try normalized lookup
        const foundKey = Object.keys(categoryLinks).find(k => normalize(k) === normalizedCategory);
        if (foundKey) seeMoreUrl = categoryLinks[foundKey];
    }

    return (
        <div className="min-h-screen bg-background pt-32 pb-24">
            <div className="max-w-7xl mx-auto px-6 mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-4xl md:text-6xl font-black text-secondary dark:text-gray-100 italic">
                        {decodedCategory}
                    </h1>
                    <div className="h-1.5 w-24 bg-primary rounded-full" />
                </div>

                <div className="flex items-center gap-4">
                    {seeMoreUrl && (
                        <a 
                            href={seeMoreUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-bold hover:scale-105 transition-all shadow-lg"
                        >
                            بینی زیاتر <ExternalLink size={18} />
                        </a>
                    )}
                    <Link
                        href="/gallery"
                        className="flex items-center gap-2 px-5 py-3 bg-card border border-card-border rounded-full hover:border-primary transition-colors text-secondary dark:text-gray-200 font-bold"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>گەڕانەوە</span>
                    </Link>
                </div>
            </div>

            <div className="w-full">
                <OptimizedImageGrid images={uniqueImages} />

                {seeMoreUrl && (
                    <div className="mt-24 mb-12 flex flex-col items-center gap-6">
                        <div className="text-gray-500 font-medium">بۆ بینینی هەموو وێنەکانی ئەم ئەلبومە کرتە لێرە بکە</div>
                        <a 
                            href={seeMoreUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative inline-flex items-center gap-4 px-12 py-5 bg-gradient-to-r from-primary to-yellow-600 text-white rounded-full font-black text-xl hover:scale-110 transition-all shadow-2xl shadow-primary/30"
                        >
                            بینینی تەواوی ئەم ئەلبومە (See More)
                            <ExternalLink size={24} className="group-hover:rotate-12 transition-transform" />
                            <div className="absolute inset-0 bg-white/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}
