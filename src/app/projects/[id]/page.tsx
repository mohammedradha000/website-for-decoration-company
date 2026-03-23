import { Project } from "@/shared";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Calendar, Layers, Hammer } from "lucide-react";
import { ProjectGallery } from "@/components";
import { getSiteContent } from "@/lib/content-store";

export const dynamic = "force-dynamic";

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const content = await getSiteContent();
    const projects = content.projects as Project[];
    const project = projects.find((p) => p.id === id);

    if (!project) {
        notFound();
    }

    return (
        <div className="bg-background min-h-screen pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-6">
                <Link href="/gallery" className="inline-flex items-center text-gray-500 hover:text-primary transition-colors mb-8 font-medium">
                    <ArrowRight className="w-4 h-4 ml-2" /> گەڕانەوە بۆ پۆرتفۆلیۆ
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    <div className="lg:col-span-2 space-y-8">
                        <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-sm border border-card-border">
                            <Image
                                src={project.image}
                                alt={project.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>

                        <ProjectGallery images={project.galleryImages} title={project.title} />
                    </div>


                    <div className="space-y-8 lg:sticky lg:top-32 h-fit">
                        <div className="bg-card p-8 rounded-2xl shadow-sm border border-card-border">
                            <span className="text-primary font-medium mb-2 block">{project.category}</span>
                            <h1 className="text-3xl font-bold text-secondary dark:text-gray-100 mb-6">{project.title}</h1>

                            <div className="space-y-6 mb-8 border-t border-card-border pt-6">
                                {project.location && (
                                    <div className="flex gap-4 items-start">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                            <MapPin className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">ناونیشان</p>
                                            <p className="font-semibold text-secondary dark:text-gray-100">{project.location}</p>
                                        </div>
                                    </div>
                                )}

                                {project.duration && (
                                    <div className="flex gap-4 items-start">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                            <Calendar className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">ماوەی پڕۆژە</p>
                                            <p className="font-semibold text-secondary dark:text-gray-100">{project.duration}</p>
                                        </div>
                                    </div>
                                )}

                                {project.materials && (
                                    <div className="flex gap-4 items-start">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                            <Layers className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">کەرەستەکان</p>
                                            <p className="font-semibold text-secondary dark:text-gray-100">{project.materials}</p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-4 items-start">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                        <Hammer className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">خزمەتگوزارییەکان</p>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {project.tags.map(t => (
                                                <span key={t} className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-xs text-secondary dark:text-gray-300">
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* DYNAMIC CATEGORY LINK FROM ADMIN */}
                            {(() => {
                                const categoryLinks = content.categoryLinks || {};
                                const seeMoreUrl = categoryLinks[project.category];
                                
                                if (seeMoreUrl) {
                                    return (
                                        <div className="mt-8 border-t border-card-border pt-6">
                                            <a 
                                                href={seeMoreUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-full flex items-center justify-center gap-2 bg-primary text-white py-4 rounded-xl font-bold hover:scale-105 transition-all shadow-lg mb-4"
                                            >
                                                بینینی زیاتر لەم ئەلبومە
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                                            </a>
                                        </div>
                                    );
                                }
                                return null;
                            })()}

                            <a
                                href={`/contact?ref=${project.id}`}
                                className="w-full flex justify-center text-center bg-secondary dark:bg-gray-800 text-white py-4 rounded-xl font-medium hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors shadow-md"
                            >
                                داوای پڕۆژەی لەم شێوەیە بکە
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
