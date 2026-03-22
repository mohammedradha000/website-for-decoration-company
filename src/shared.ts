import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

import content from "./data/content.json";

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

export const projects = content.projects as Project[];
export const siteConfig = content.site;
export const services = content.services as Service[];
export const about = content.about as AboutConfig;
export const contact = content.contact as ContactConfig;
export const categoryLinks = ((content as any).categoryLinks || {}) as Record<string, string>;

export const getCategories = () => Array.from(new Set(projects.map(p => p.category)));
export const getTags = () => Array.from(new Set(projects.flatMap(p => p.tags)));
