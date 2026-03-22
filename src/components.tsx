"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { LucideIcon, Home, ImageIcon, Briefcase, Info, Moon, Sun, ArrowLeft, Facebook, Instagram, Phone, MapPin, MessageCircle, Video, MessageSquare, Layers, ExternalLink } from "lucide-react";
import Lightbox from "yet-another-react-lightbox";
import Download from "yet-another-react-lightbox/plugins/download";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";

import { cn, Project, getCategories, siteConfig } from "./shared";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);
    if (!mounted) return <>{children}</>;
    return (
        <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
        </NextThemesProvider>
    );
}

export function ThemeToggle({ className }: { className?: string }) {
    const { resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);
    if (!mounted) return <div className={cn("w-16 h-8", className)} />;
    const isDark = resolvedTheme === "dark";
    return (
        <div dir="ltr" className={cn("flex w-16 h-8 p-1 rounded-full cursor-pointer transition-all duration-300", isDark ? "bg-zinc-950 border border-zinc-800" : "bg-white border border-zinc-200", className)} onClick={() => setTheme(isDark ? "light" : "dark")} role="button" tabIndex={0}>
            <div className="flex justify-between items-center w-full">
                <div className={cn("flex justify-center items-center w-6 h-6 rounded-full transition-transform duration-300", isDark ? "transform translate-x-0 bg-zinc-800" : "transform translate-x-8 bg-gray-200")}>
                    {isDark ? <Moon className="w-4 h-4 text-white" strokeWidth={1.5} /> : <Sun className="w-4 h-4 text-gray-700" strokeWidth={1.5} />}
                </div>
                <div className={cn("flex justify-center items-center w-6 h-6 rounded-full transition-transform duration-300", isDark ? "bg-transparent" : "transform -translate-x-8")}>
                    {isDark ? <Sun className="w-4 h-4 text-gray-500" strokeWidth={1.5} /> : <Moon className="w-4 h-4 text-black" strokeWidth={1.5} />}
                </div>
            </div>
        </div>
    );
}

interface NavItem { name: string; url: string; icon: LucideIcon; }
export function NavBar({ items, className, defaultActive }: { items: NavItem[]; className?: string; defaultActive?: string; }) {
    const [activeTab, setActiveTab] = useState(defaultActive || items[0]?.name);
    return (
        <div className={cn("fixed bottom-0 lg:top-0 lg:bottom-auto left-1/2 -translate-x-1/2 z-[100] mb-6 lg:mb-0 lg:pt-6", className)}>
            <div className="flex items-center gap-2 lg:gap-3 bg-white/80 dark:bg-black/60 border border-black/10 dark:border-white/10 backdrop-blur-lg py-1 px-1 rounded-full shadow-lg">
                {items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.name;
                    return (
                        <Link key={item.name} href={item.url} onClick={() => setActiveTab(item.name)} className={cn("relative cursor-pointer text-sm font-semibold px-4 lg:px-6 py-2 rounded-full transition-colors flex items-center justify-center", "text-secondary/80 dark:text-white/80 hover:text-primary dark:hover:text-primary", isActive && "text-primary dark:text-primary")}>
                            <span className="hidden lg:inline">{item.name}</span>
                            <span className="lg:hidden"><Icon size={20} strokeWidth={2.5} /></span>
                            {isActive && (
                                <motion.div layoutId="lamp" className="absolute inset-0 w-full bg-primary/10 rounded-full -z-10" initial={false} transition={{ type: "spring", stiffness: 300, damping: 30 }}>
                                    <div className="absolute -top-1 sm:-top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-t-full">
                                        <div className="absolute w-12 h-6 bg-primary/20 rounded-full blur-md -top-2 -left-2" />
                                        <div className="absolute w-8 h-6 bg-primary/20 rounded-full blur-md -top-1" />
                                        <div className="absolute w-4 h-4 bg-primary/20 rounded-full blur-sm top-0 left-2" />
                                    </div>
                                </motion.div>
                            )}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

export const InteractiveHoverButton = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { text?: string; href?: string; }>(({ text = "Button", className, href, ...props }, ref) => {
    const inner = (
        <div className="relative z-10 flex h-full w-full items-center justify-center">
            <span className="inline-block transition-all duration-500 group-hover:-translate-x-[150%] group-hover:opacity-0">{text}</span>
            <div className="absolute inset-0 flex h-full w-full translate-x-[150%] items-center justify-center gap-2 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100">
                <span>{text}</span>
                <ArrowLeft className="w-4 h-4" />
            </div>
        </div>
    );
    const sharedClassName = cn("group relative flex items-center justify-center w-48 cursor-pointer overflow-hidden rounded-full border border-primary text-center font-bold text-primary transition-all duration-500 hover:scale-110 hover:shadow-[0_0_20px_rgba(212,160,23,0.4)]", className);
    if (href) return <a href={href} className={sharedClassName}>{inner}</a>;
    return <button ref={ref} className={sharedClassName} {...props}>{inner}</button>;
});
InteractiveHoverButton.displayName = "InteractiveHoverButton";

export function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();
    const { theme } = useTheme();
    const isHome = pathname === "/";

    if (pathname.startsWith("/admin")) return null;
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    const navItems = [
        { name: "سەرەتا", url: "/", icon: Home },
        { name: "گەلەری", url: "/gallery", icon: ImageIcon },
        { name: "خزمەتگوزارییەکان", url: "/services", icon: Briefcase },
        { name: "دەربارەی ئێمە", url: "/about", icon: Info },
    ];
    const currentTabName = navItems.find((item) => pathname === item.url || (pathname.startsWith(item.url) && item.url !== "/"))?.name || "سەرەتا";
    return (
        <>
            <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled || !isHome || theme === "dark" ? "bg-white/95 dark:bg-[#121212]/95 backdrop-blur-md shadow-sm py-4" : "bg-transparent py-6"}`}>
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                    <Link href="/" className="text-2xl font-bold tracking-tight group">
                        <span className={cn("transition-colors duration-300 group-hover:text-primary", isScrolled || !isHome || theme === "dark" ? "text-secondary dark:text-white" : "text-white")}>{siteConfig.name.split(" ")[0]}</span>
                        <span className="text-primary mr-1 transition-colors duration-300 group-hover:text-secondary dark:group-hover:text-white">{siteConfig.name.split(" ").slice(1).join(" ")}</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <Link href="/contact" className="bg-primary text-white px-4 sm:px-6 py-2 sm:py-2.5 flex items-center justify-center rounded-full font-medium hover:bg-yellow-600 transition-all shadow-md text-sm sm:text-base whitespace-nowrap">پەیوەندی</Link>
                    </div>
                </div>
            </header>
            <NavBar items={navItems} defaultActive={currentTabName} />
        </>
    );
}

export function Footer() {
    const pathname = usePathname();
    if (pathname.startsWith("/admin")) return null;
    return (
        <footer className="bg-secondary text-white pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                <div className="col-span-1 md:col-span-1">
                    <Link href="/" className="text-3xl font-bold tracking-tight mb-6 flex group">
                        <span className="transition-colors duration-300 group-hover:text-primary">{siteConfig.name.split(" ")[0]}</span>
                        <span className="text-primary mr-1 transition-colors duration-300 group-hover:text-white">{siteConfig.name.split(" ").slice(1).join(" ")}</span>
                    </Link>
                    <p className="text-gray-400 leading-relaxed mb-6">{siteConfig.description}</p>
                    <div className="flex gap-4">
                        <a href="https://www.facebook.com/share/1DFHrnBzw1/" target="_blank" rel="noopener noreferrer" className="group w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-all duration-300 hover:scale-110">
                            <Facebook size={20} className="transition-transform duration-300 group-hover:scale-110" />
                        </a>
                        <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="group w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-all duration-300 hover:scale-110">
                            <Instagram size={20} className="transition-transform duration-300 group-hover:scale-110" />
                        </a>
                        <a href={`https://wa.me/${siteConfig.contact.whatsapp}`} target="_blank" rel="noopener noreferrer" className="group w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-all duration-300 hover:scale-110">
                            <MessageCircle size={20} className="transition-transform duration-300 group-hover:scale-110" />
                        </a>
                        <a href="https://www.tiktok.com/" target="_blank" rel="noopener noreferrer" className="group w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-all duration-300 hover:scale-110">
                            <Video size={20} className="transition-transform duration-300 group-hover:scale-110" />
                        </a>
                    </div>
                </div>
                <div>
                    <h4 className="text-lg font-semibold mb-6">بەستەرە خێراکان</h4>
                    <ul className="flex flex-col gap-3">
                        <li><Link href="/gallery" className="text-gray-400 hover:text-primary transition-colors">پۆرتفۆلیۆ</Link></li>
                        <li><Link href="/services" className="text-gray-400 hover:text-primary transition-colors">خزمەتگوزارییەکان</Link></li>
                        <li><Link href="/about" className="text-gray-400 hover:text-primary transition-colors">دەربارەی ئێمە</Link></li>
                        <li><Link href="/contact" className="text-gray-400 hover:text-primary transition-colors">پەیوەندی</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-lg font-semibold mb-6">خزمەتگوزارییەکان</h4>
                    <ul className="flex flex-col gap-3">
                        <li className="text-gray-400">نەخشەسازی ناوەوە</li>
                        <li className="text-gray-400">ڕووپۆشی دەرەوە</li>
                        <li className="text-gray-400">سەقفی مەغریبی</li>
                        <li className="text-gray-400">چارەسەری ڕووناکی</li>
                        <li className="text-gray-400">بۆیە و تێکستەر</li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-lg font-semibold mb-6">زانیاری پەیوەندی</h4>
                    <ul className="flex flex-col gap-4">
                        <li className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                            <span className="text-gray-400">سلێمانی، کوردستان<br />عێراق</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Phone className="w-5 h-5 text-primary shrink-0" />
                            <a href={`tel:${siteConfig.contact.whatsapp}`} className="text-gray-400 text-left hover:text-primary transition-colors" dir="ltr">{siteConfig.contact.phone}</a>
                        </li>
                    </ul>
                </div>
            </div>

            {/* ULTRA-PREMIUM PROFESSIONAL SHOWCASE SECTION */}
            <div className="max-w-7xl mx-auto px-6 mb-24 mt-12 group">
                <div className="relative overflow-hidden rounded-[3rem] bg-[#0A0A0A] border border-white/10 p-8 md:p-20 shadow-2xl">
                    {/* Animated Background Mesh */}
                    <div className="absolute inset-0 z-0">
                        <motion.div 
                            animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, -30, 0] }}
                            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                            className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px]" 
                        />
                        <motion.div 
                            animate={{ scale: [1, 1.3, 1], x: [0, -40, 0], y: [0, 60, 0] }}
                            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                            className="absolute -bottom-[20%] -left-[10%] w-[500px] h-[500px] bg-fuchsia-600/20 rounded-full blur-[100px]" 
                        />
                    </div>

                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        {/* RIGHT SIDE: HEADLINE & BRANDING */}
                        <div className="text-center lg:text-right order-1">
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8"
                            >
                                <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
                                <span className="text-white text-sm font-bold tracking-widest uppercase">
                                    دیزاین و گەشەپێدراوە لەلایەن <span className="text-primary tracking-normal font-black">محەمەد ڕەزا (Fabbey)</span>
                                </span>
                            </motion.div>
                            <h2 className="text-4xl md:text-7xl font-black text-white leading-[1.1] mb-8 italic">
                                داهاتووی بزنسەکەت <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-400 to-fuchsia-400">لێرەوە دەستپێدەکات</span>
                            </h2>
                            <p className="text-gray-400 text-xl md:text-2xl leading-relaxed max-w-2xl lg:ml-0 lg:mr-auto mb-10">
                                ئەم پڕۆژەیە نموونەیەکی بچووکە لەو داهێنانەی کە دەتوانین بۆ تۆی بکەین. ئێمە ئەزموونی دیجیتاڵی بێهاوتا دیزاین دەکەین کە جێگای متمانەیە.
                            </p>
                            
                            {/* Trust Indicators */}
                            <div className="flex flex-wrap justify-center lg:justify-start gap-8 opacity-60">
                                <div className="flex items-center gap-2"><Layers className="w-5 h-5 text-primary" /> <span className="text-sm font-bold text-white tracking-widest">دیزاینی نایاب</span></div>
                                <div className="flex items-center gap-2"><Briefcase className="w-5 h-5 text-indigo-400" /> <span className="text-sm font-bold text-white tracking-widest">گەشەپێدەری شارەزا</span></div>
                                <div className="flex items-center gap-2"><Info className="w-5 h-5 text-fuchsia-400" /> <span className="text-sm font-bold text-white tracking-widest">خێراترین بارکردن</span></div>
                            </div>
                        </div>

                        {/* LEFT SIDE: PREMIUM CTA & FLOATING CARDS */}
                        <div className="relative flex flex-col items-center justify-center order-2">
                            {/* Floating Micro-UI Elements */}
                            <motion.div 
                                animate={{ y: [-10, 10, -10] }} 
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -top-12 -right-6 hidden sm:flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl shadow-2xl"
                            >
                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary"><ImageIcon size={20} /></div>
                                <div>
                                    <p className="text-white text-xs font-bold">دیجیتاڵ ئارت</p>
                                    <p className="text-gray-500 text-[10px]">١٠٠% کوالێتی بەرز</p>
                                </div>
                            </motion.div>
                            
                            <motion.div 
                                animate={{ y: [10, -10, 10] }} 
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -bottom-8 -left-6 hidden sm:flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl shadow-2xl"
                            >
                                <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400"><Layers size={20} /></div>
                                <div>
                                    <p className="text-white text-xs font-bold">بزنسەکەت بەرزکەرەوە</p>
                                    <p className="text-gray-500 text-[10px]">گەشەکردنی خێرا</p>
                                </div>
                            </motion.div>

                            <div className="relative z-10 flex flex-col items-center gap-6">
                                <a 
                                    href="https://wa.me/9647735222005" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="group relative flex items-center justify-center"
                                >
                                    <div className="absolute inset-0 bg-primary/40 rounded-full blur-2xl group-hover:bg-primary/60 transition-all duration-500 scale-75 group-hover:scale-110" />
                                    <div className="relative px-12 py-6 bg-gradient-to-br from-primary via-yellow-500 to-orange-500 rounded-full font-black text-2xl text-white shadow-2xl flex items-center gap-4 transition-transform group-hover:scale-105 group-hover:-rotate-1 active:scale-95">
                                        پەیوەندی بە Fabbey بکە
                                        <MessageCircle size={32} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </a>
                                <Link href="/services" className="px-8 py-3 text-white/50 hover:text-white font-bold text-lg transition-colors border border-white/10 rounded-full hover:bg-white/5">
                                    بینینی پڕۆفۆرتفۆلیۆ
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} سەرکۆ دیکۆر. هەموو مافەکان پارێزراون.</p>
                <p className="text-gray-500 text-sm flex items-center gap-2">
                    دەتەوێت ماڵپەڕێکی پڕۆفیشناڵی هاوشێوەت هەبێت؟ 
                    <a href="https://wa.me/9647735222005" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium flex items-center gap-1">
                        پەیوەندی بە گەشەپێدەر بکە
                        <MessageCircle size={14} />
                    </a>
                </p>
            </div>
        </footer>
    );
}

export function FloatingContact() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    if (pathname.startsWith("/admin")) return null;
    const contactLinks = [
        { name: "WhatsApp", icon: <MessageCircle className="w-5 h-5" />, href: `https://wa.me/${siteConfig.contact.whatsapp}`, bg: "bg-[#25D366]" },
        { name: "Phone", icon: <Phone className="w-5 h-5" />, href: `tel:${siteConfig.contact.whatsapp}`, bg: "bg-blue-500" },
        { name: "Messenger", icon: <MessageCircle className="w-5 h-5" />, href: "https://m.me/1DFHrnBzw1/", bg: "bg-[#0084FF]" },
        { name: "Viber", icon: <MessageSquare className="w-5 h-5" />, href: `viber://chat?number=${siteConfig.contact.whatsapp}`, bg: "bg-[#7360F2]" },
        { name: "TikTok", icon: <Video className="w-5 h-5" />, href: "https://www.tiktok.com/", bg: "bg-black" },
        { name: "Facebook", icon: <Facebook className="w-5 h-5" />, href: "https://www.facebook.com/share/1DFHrnBzw1/", bg: "bg-[#1877F2]" },
    ];
    return (
        <div className="fixed bottom-6 right-6 z-50">
            <AnimatePresence>
                {isOpen && (
                    <motion.div initial={{ opacity: 0, y: 20, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.8 }} className="absolute bottom-16 right-0 flex flex-col gap-3 mb-4">
                        {contactLinks.map((link) => (
                            <a key={link.name} href={link.href} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-3 p-3 rounded-full text-white shadow-lg transform transition hover:scale-110 ${link.bg}`} title={link.name}>
                                {link.icon}
                                <span className="sr-only">{link.name}</span>
                            </a>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
            <button onClick={() => setIsOpen(!isOpen)} className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-yellow-600 transition-transform hover:scale-105">
                {isOpen ? <var className="w-6 h-6 not-italic font-bold">✕</var> : <MessageCircle className="w-6 h-6" />}
            </button>
        </div>
    );
}

export function GalleryClient({ initialProjects, categoryLinks = {} }: { initialProjects: Project[], categoryLinks?: Record<string, string> }) {
    const categories = getCategories();
    const categoryThumbs = categories.map(cat => {
        const catProjects = initialProjects.filter(p => p.category === cat);
        const link = categoryLinks[cat];
        return {
            name: cat,
            thumbnail: catProjects.length > 0 ? catProjects[0].image : "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
            count: catProjects.reduce((acc, p) => acc + 1 + (p.galleryImages?.length || 0), 0),
            link
        };
    });
    return (
        <div className="py-24 max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6 pt-10 text-center md:text-right">
                <div>
                    <h1 className="text-4xl md:text-5xl font-bold text-secondary dark:text-gray-100 mb-4">پۆرتفۆلیۆی وێنەکان</h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg max-w-xl mx-auto md:mx-0">ئەلبومی تەواوی پڕۆژەکانمان بەپێی بەشەکان بپشکنە.</p>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categoryThumbs.map((cat, index) => (
                    <div key={index} className="flex flex-col">
                        <Link href={`/gallery/${encodeURIComponent(cat.name)}`} className="group cursor-pointer block">
                            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-300">
                                <Image src={cat.thumbnail} alt={cat.name} fill className="object-cover transition-transform duration-700 group-hover:scale-125" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                                <div className="absolute bottom-0 left-0 w-full p-8 translate-y-2 group-hover:translate-y-0 transition-transform">
                                    <div className="flex items-center gap-3 mb-2 opacity-80 group-hover:opacity-100 transition-opacity">
                                        <Layers className="w-5 h-5 text-primary" />
                                        <span className="text-white text-sm font-medium">{cat.count} وێنە</span>
                                    </div>
                                    <h2 className="text-white text-3xl font-bold">{cat.name}</h2>
                                </div>
                            </div>
                        </Link>
                        {cat.link && (
                            <div className="mt-4">
                                <a 
                                    href={cat.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 w-full py-3 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-secondary dark:text-white font-bold hover:bg-primary hover:text-white dark:hover:bg-primary transition-all group"
                                >
                                    بینینی زیاتر (بەستەری دەرەکی)
                                    <ExternalLink size={16} className="text-primary group-hover:text-white" />
                                </a>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export function OptimizedImageGrid({ images }: { images: string[] }) {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const [displayedImages, setDisplayedImages] = useState<string[]>([]);
    const [page, setPage] = useState(1);
    const loaderRef = useRef<HTMLDivElement>(null);
    const BATCH_SIZE = 30;
    useEffect(() => { setDisplayedImages(images.slice(0, BATCH_SIZE)); }, [images]);
    const loadMore = useCallback(() => {
        const nextBatch = images.slice(0, (page + 1) * BATCH_SIZE);
        setDisplayedImages(nextBatch);
        setPage((prev) => prev + 1);
    }, [images, page]);
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            const target = entries[0];
            if (target.isIntersecting && displayedImages.length < images.length) loadMore();
        }, { rootMargin: "200px" });
        if (loaderRef.current) observer.observe(loaderRef.current);
        return () => { if (loaderRef.current) observer.unobserve(loaderRef.current); };
    }, [loadMore, displayedImages.length, images.length]);
    const slides = images.map(src => ({ src }));
    return (
        <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
                {displayedImages.map((src, index) => (
                    <div key={`${src}-${index}`} className="relative aspect-square cursor-pointer group bg-gray-100 dark:bg-gray-800" onClick={() => { setLightboxIndex(index); setLightboxOpen(true); }}>
                        <Image src={src} alt="" fill className="object-cover hover:opacity-90 transition-opacity" loading={index < 12 ? "eager" : "lazy"} sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw" />
                    </div>
                ))}
            </div>
            {displayedImages.length < images.length && (
                <div ref={loaderRef} className="w-full h-20 flex items-center justify-center mt-8">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}
            <Lightbox open={lightboxOpen} close={() => setLightboxOpen(false)} index={lightboxIndex} slides={slides} plugins={[Download, Fullscreen, Zoom]} carousel={{ finite: false }} />
        </>
    );
}

export function ProjectGallery({ images, title }: { images: string[], title: string }) {
    const [open, setOpen] = useState(false);
    const [index, setIndex] = useState(0);
    const slides = images.map(src => ({ src, alt: title }));
    return (
        <>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {images.map((src, i) => (
                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group" onClick={() => { setIndex(i); setOpen(true); }}>
                        <Image src={src} alt={`${title} - view ${i + 1}`} fill className="object-cover transition-transform duration-700 group-hover:scale-125" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    </div>
                ))}
            </div>
            <Lightbox open={open} close={() => setOpen(false)} index={index} slides={slides} plugins={[Download, Fullscreen]} />
        </>
    );
}
