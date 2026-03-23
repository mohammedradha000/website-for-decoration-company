import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export type Project = {
    id: string;
    title: string;
    category: string;
    tags: string[];
    image: string;
    location?: string;
    duration?: string;
    materials?: string;
    galleryImages: string[];
};

export type Service = {
    id?: string;
    title: string;
    desc: string;
    fullDesc?: string;
    icon: string;
    image?: string;
    features?: string[];
};

export type SiteConfig = {
    name: string;
    title: string;
    description: string;
    heroImage: string;
    contact: {
        phone: string;
        whatsapp: string;
    };
};

export type AboutConfig = {
    title: string;
    description: string;
    storyTitle: string;
    story1: string;
    story2: string;
    image: string;
    stats: { label: string; value: string; icon: string }[];
};

export type ContactConfig = {
    email: string;
    title: string;
    description: string;
    socials: { name: string; href: string; icon: string; bg: string }[];
};

export type Testimonial = {
    name: string;
    role: string;
    content: string;
    rating: number;
};

export type SiteContent = {
    site: SiteConfig;
    visibility: {
        stats: boolean;
        testimonials: boolean;
        projects: boolean;
    };
    categoryLinks?: Record<string, string>;
    services: Service[];
    about: AboutConfig;
    contact: ContactConfig;
    projects: Project[];
    testimonials: Testimonial[];
};

export const getCategories = (projects: Project[]) => Array.from(new Set(projects.map((project) => project.category)));
export const getTags = (projects: Project[]) => Array.from(new Set(projects.flatMap((project) => project.tags)));
