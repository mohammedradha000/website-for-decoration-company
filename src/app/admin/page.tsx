"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
    LayoutDashboard, 
    Image as ImageIcon, 
    Settings, 
    Plus, 
    Trash2, 
    Save, 
    ChevronRight, 
    LogOut, 
    CheckCircle2, 
    AlertCircle,
    ExternalLink,
    Info,
    Package,
    Phone,
    MessageCircle,
    ArrowLeft,
    Globe,
    Mail,
    Layout,
    Briefcase,
    Star,
    Eye,
    EyeOff
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/shared";

export default function AdminPage() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [saveError, setSaveError] = useState("");
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState<any>(null);
    const [activeTab, setActiveTab] = useState("site");
    const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");

    useEffect(() => {
        const checkSession = async () => {
            setLoading(true);
            try {
                const res = await fetch("/api/admin/session", { cache: "no-store" });
                const data = await res.json();

                if (data.authenticated) {
                    setIsLoggedIn(true);
                    await fetchContent();
                }
            } catch (err) {
                console.error("Failed to restore admin session", err);
            } finally {
                setLoading(false);
            }
        };

        void checkSession();
    }, []);

    const fetchContent = async () => {
        try {
            const res = await fetch("/api/admin/content", { cache: "no-store" });
            if (res.status === 401) {
                setIsLoggedIn(false);
                setContent(null);
                return;
            }
            const data = await res.json();
            setContent(data);
        } catch (err) {
            console.error("Failed to fetch content", err);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json().catch(() => null);
            if (!res.ok) {
            setError("هەڵەیەک لە ناو یان وشەی نهێنی هەیە");
            } else {
                setIsLoggedIn(true);
                setUsername("");
                setPassword("");
                await fetchContent();
            }
        } catch (err) {
            console.error("Login failed", err);
            setError("Login failed.");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        setIsLoggedIn(false);
        setContent(null);
        try {
            await fetch("/api/admin/logout", { method: "POST" });
        } catch (err) {
            console.error("Logout failed", err);
        }
    };

    const handleSave = async () => {
        setSaveStatus("saving");
        setSaveError("");
        try {
            const res = await fetch("/api/admin/content", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(content)
            });
            const data = await res.json().catch(() => null);
            if (res.ok) {
                setSaveStatus("success");
                setTimeout(() => setSaveStatus("idle"), 3000);
            } else if (res.status === 401) {
                setIsLoggedIn(false);
                setContent(null);
                setSaveStatus("error");
                setSaveError("Please sign in again.");
            } else {
                setSaveStatus("error");
                setSaveError(data?.error || "Save failed.");
            }
        } catch (err) {
            console.error("Save failed", err);
            setSaveStatus("error");
            setSaveError("Save failed.");
        }
    };

    const updateSiteInfo = (key: string, value: string) => {
        setContent({
            ...content,
            site: { ...content.site, [key]: value }
        });
    };

    const updateContact = (key: string, value: string) => {
        setContent({
            ...content,
            site: { 
                ...content.site, 
                contact: { ...content.site.contact, [key]: value } 
            }
        });
    };

    const updateService = (index: number, key: string, value: string) => {
        const newServices = [...content.services];
        newServices[index] = { ...newServices[index], [key]: value };
        setContent({ ...content, services: newServices });
    };

    const updateProject = (id: string, key: string, value: any) => {
        const newProjects = content.projects.map((p: any) => 
            p.id === id ? { ...p, [key]: value } : p
        );
        setContent({ ...content, projects: newProjects });
    };

    const updateVisibility = (key: string, value: boolean) => {
        setContent({
            ...content,
            visibility: { ...content.visibility, [key]: value }
        });
    };

    const updateTestimonial = (index: number, key: string, value: any) => {
        const newTestimonials = [...content.testimonials];
        newTestimonials[index] = { ...newTestimonials[index], [key]: value };
        setContent({ ...content, testimonials: newTestimonials });
    };

    const addTestimonial = () => {
        const newTestimonial = {
            name: "ناوی کڕیار",
            role: "خاوەن ماڵ",
            content: "فیدباکی کڕیار لێرە بنووسە...",
            rating: 5
        };
        setContent({ ...content, testimonials: [newTestimonial, ...content.testimonials] });
    };

    const deleteTestimonial = (index: number) => {
        if (confirm("دڵنیایت لە سڕینەوەی ئەم فیدباکە؟")) {
            setContent({ ...content, testimonials: content.testimonials.filter((_: any, i: number) => i !== index) });
        }
    };

    const addProject = () => {
        const newId = `project-${Date.now()}`;
        const newProject = {
            id: newId,
            title: "پڕۆژەی نوێ",
            category: "ناوەوە",
            tags: ["مۆدێرن"],
            image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
            galleryImages: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80"]
        };
        setContent({ ...content, projects: [newProject, ...content.projects] });
    };

    const deleteProject = (id: string) => {
        if (confirm("دڵنیایت لە سڕینەوەی ئەم پڕۆژەیە؟")) {
            setContent({ ...content, projects: content.projects.filter((p: any) => p.id !== id) });
        }
    };

    const handleUpload = async (file: File): Promise<string | null> => {
        const formData = new FormData();
        formData.append("file", file);
        try {
            const res = await fetch("/api/admin/upload", {
                method: "POST",
                body: formData
            });
            const data = await res.json();
            if (!res.ok) {
                console.error("Upload failed", data);
                return null;
            }
            return data.url;
        } catch (err) {
            console.error("Upload failed", err);
            return null;
        }
    };

    const ImageUploadField = ({ label, value, onUpload }: { label: string, value: string, onUpload: (url: string) => void }) => {
        const [uploading, setUploading] = useState(false);
        return (
            <div className="space-y-2">
                <label className="text-zinc-500 text-xs font-bold mr-1">{label}</label>
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-zinc-800 shrink-0">
                        <img src={value} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col gap-2">
                        <input 
                            type="text" 
                            value={value} 
                            onChange={(e) => onUpload(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-zinc-400 text-xs focus:outline-none focus:border-primary" 
                            placeholder="URL-ی وێنە یان ناوەکەی" 
                            dir="ltr"
                        />
                        <label className="cursor-pointer inline-flex items-center gap-2 text-xs font-bold text-primary hover:text-white transition-colors">
                            <Plus size={14} />
                            {uploading ? "کەمی تر..." : "وێنە باربکە (Upload)"}
                            <input 
                                type="file" 
                                className="hidden" 
                                accept="image/*"
                                onChange={async (e) => {
                                    if (e.target.files?.[0]) {
                                        setUploading(true);
                                        const url = await handleUpload(e.target.files[0]);
                                        if (url) onUpload(url);
                                        setUploading(false);
                                    }
                                }}
                            />
                        </label>
                    </div>
                </div>
            </div>
        );
    };

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6" dir="rtl">
                <div className="w-full max-w-md">
                    <div className="text-center mb-10">
                        <Link href="/" className="text-3xl font-black text-white inline-flex mb-4 group">
                            سەرکۆ <span className="text-primary mr-1 group-hover:text-white transition-colors">دیکۆر</span>
                        </Link>
                        <h1 className="text-gray-400 text-sm font-bold tracking-widest uppercase">بەشی بەڕێوەبردن (Admin)</h1>
                    </div>
                    
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl"
                    >
                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-zinc-400 text-xs font-bold mr-1">ناوی بەکارهێنەر</label>
                                <input 
                                    type="text" 
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-primary transition-colors"
                                    placeholder="Username"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-zinc-400 text-xs font-bold mr-1">وشەی نهێنی</label>
                                <input 
                                    type="password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-primary transition-colors"
                                    placeholder="Password"
                                />
                            </div>
                            {error && (
                                <div className="text-red-500 text-xs text-center font-bold bg-red-500/10 py-2 rounded-lg border border-red-500/20">{error}</div>
                            )}
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full bg-primary hover:bg-yellow-600 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-primary/20 active:scale-95"
                            >
                                چوونە ژوورەوە
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        );
    }

    if (!content) return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    const tabs = [
        { id: "site", label: "سەرەکی", icon: Globe },
        { id: "about", label: "دەربارە", icon: Info },
        { id: "services", label: "خزمەتگوزاری", icon: Layout },
        { id: "projects", label: "پڕۆژەکان", icon: Briefcase },
        { id: "testimonials", label: "ڕاوبۆچوونەکان", icon: Star },
        { id: "contact", label: "پەیوەندی", icon: Mail },
    ];

    return (
        <div className="min-h-screen bg-zinc-950 text-white flex flex-col md:flex-row" dir="rtl">
            {/* Sidebar */}
            <aside className="w-full md:w-80 bg-zinc-900 border-l border-zinc-800 flex flex-col p-6 space-y-8 z-50">
                <div className="flex items-center justify-between">
                    <div className="text-2xl font-black">بەڕێوەبردن</div>
                    <button onClick={handleLogout} className="p-2 bg-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-colors">
                        <LogOut size={20} />
                    </button>
                </div>

                <nav className="flex flex-col gap-2">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button 
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all",
                                    isActive ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-zinc-500 hover:bg-zinc-800"
                                )}
                            >
                                <Icon size={20} />
                                {tab.label}
                            </button>
                        );
                    })}
                </nav>

                <div className="mt-auto pt-8 border-t border-zinc-800 space-y-4">
                    <button 
                        onClick={handleSave}
                        disabled={saveStatus === "saving"}
                        className={cn(
                            "w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-black transition-all",
                            saveStatus === "saving" ? "bg-zinc-800 text-zinc-500" : 
                            saveStatus === "error" ? "bg-red-500 text-white" :
                            "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20 active:scale-95"
                        )}
                    >
                        {saveStatus === "saving" ? "کەمی تر..." : (saveStatus === "error" ? "هەڵە ڕویدا" : "پاشەکەوتکردن")}
                        <Save size={20} />
                    </button>
                    {saveError && (
                        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-center text-xs font-bold text-red-300">
                            {saveError}
                        </div>
                    )}
                    <Link href="/" className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-zinc-500 hover:bg-zinc-800 transition-all">
                        گەڕانەوە بۆ ماڵپەڕ
                        <ArrowLeft size={20} />
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-6 md:p-12">
                <div className="max-w-4xl">
                    <AnimatePresence mode="wait">
                        {activeTab === "site" && (
                            <motion.div 
                                key="site" 
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                className="space-y-12"
                            >
                                <section className="space-y-6">
                                    <h2 className="text-3xl font-black">زانیارییە گشتییەکان</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <label className="text-zinc-500 text-xs font-bold mr-1">ناوی ماڵپەڕ</label>
                                                <input type="text" value={content.site.name} onChange={(e) => updateSiteInfo("name", e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-primary" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-zinc-500 text-xs font-bold mr-1">ناونیشانی گشتی</label>
                                                <input type="text" value={content.site.title} onChange={(e) => updateSiteInfo("title", e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-primary" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-zinc-500 text-xs font-bold mr-1">دەربارەی ماڵپەڕ (Description)</label>
                                                <textarea rows={4} value={content.site.description} onChange={(e) => updateSiteInfo("description", e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-primary resize-none" />
                                            </div>
                                        </div>

                                        <div className="space-y-8">
                                            <ImageUploadField 
                                                label="وێنەی باکگراوندی سەرەکی (Hero Background)" 
                                                value={content.site.heroImage} 
                                                onUpload={(url) => updateSiteInfo("heroImage", url)} 
                                            />

                                            <div className="space-y-6">
                                                <h3 className="text-xl font-bold border-b border-zinc-800 pb-2">زانیاری پەیوەندی</h3>
                                                <div className="space-y-2">
                                                    <label className="text-zinc-500 text-xs font-bold mr-1">ژمارەی تەلەفۆن (نمایش)</label>
                                                    <input type="text" value={content.site.contact.phone} onChange={(e) => updateContact("phone", e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-primary" dir="ltr" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-zinc-500 text-xs font-bold mr-1">وەتسئەپ (تەنها ژمارە)</label>
                                                    <input type="text" value={content.site.contact.whatsapp} onChange={(e) => updateContact("whatsapp", e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-primary" dir="ltr" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <section className="space-y-6 pt-8 border-t border-zinc-800">
                                    <h2 className="text-2xl font-black flex items-center gap-3">
                                        بینینی بەشەکان (Visibility)
                                        <Settings size={20} className="text-primary" />
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex items-center justify-between">
                                            <div>
                                                <h4 className="font-bold">بەشی ئامارەکان (Stats)</h4>
                                                <p className="text-xs text-zinc-500">لە لاپەڕەی سەرەکی نمایش بکرێت یان نا</p>
                                            </div>
                                            <button 
                                                onClick={() => updateVisibility("stats", !content.visibility.stats)}
                                                className={cn(
                                                    "w-14 h-8 rounded-full p-1 transition-all",
                                                    content.visibility.stats ? "bg-primary" : "bg-zinc-800"
                                                )}
                                            >
                                                <div className={cn(
                                                    "w-6 h-6 bg-white rounded-full transition-all flex items-center justify-center",
                                                    content.visibility.stats ? "mr-6" : "mr-0"
                                                )}>
                                                    {content.visibility.stats ? <Eye size={12} className="text-primary" /> : <EyeOff size={12} className="text-zinc-500" />}
                                                </div>
                                            </button>
                                        </div>

                                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex items-center justify-between">
                                            <div>
                                                <h4 className="font-bold">دوگمەی پەیوەندی (Floating Button)</h4>
                                                <p className="text-xs text-zinc-500">دوگمەی چات و تەلەفۆن لە لای ڕاست</p>
                                            </div>
                                            <button 
                                                onClick={() => updateVisibility("floatingContact", !content.visibility.floatingContact)}
                                                className={cn(
                                                    "w-14 h-8 rounded-full p-1 transition-all",
                                                    content.visibility.floatingContact ? "bg-primary" : "bg-zinc-800"
                                                )}
                                            >
                                                <div className={cn(
                                                    "w-6 h-6 bg-white rounded-full transition-all flex items-center justify-center",
                                                    content.visibility.floatingContact ? "mr-6" : "mr-0"
                                                )}>
                                                    {content.visibility.floatingContact ? <Eye size={12} className="text-primary" /> : <EyeOff size={12} className="text-zinc-500" />}
                                                </div>
                                            </button>
                                        </div>

                                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex items-center justify-between">
                                            <div>
                                                <h4 className="font-bold">بەشی پڕۆژەکان (Featured Projects)</h4>
                                                <p className="text-xs text-zinc-500">لە لاپەڕەی سەرەکی نمایش بکرێت یان نا</p>
                                            </div>
                                            <button 
                                                onClick={() => updateVisibility("projects", !content.visibility.projects)}
                                                className={cn(
                                                    "w-14 h-8 rounded-full p-1 transition-all",
                                                    content.visibility.projects ? "bg-primary" : "bg-zinc-800"
                                                )}
                                            >
                                                <div className={cn(
                                                    "w-6 h-6 bg-white rounded-full transition-all flex items-center justify-center",
                                                    content.visibility.projects ? "mr-6" : "mr-0"
                                                )}>
                                                    {content.visibility.projects ? <Eye size={12} className="text-primary" /> : <EyeOff size={12} className="text-zinc-500" />}
                                                </div>
                                            </button>
                                        </div>

                                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex items-center justify-between">
                                            <div>
                                                <h4 className="font-bold">بەشی ڕاوبۆچوونەکان (Testimonials)</h4>
                                                <p className="text-xs text-zinc-500">لە لاپەڕەی سەرەکی نمایش بکرێت یان نا</p>
                                            </div>
                                            <button 
                                                onClick={() => updateVisibility("testimonials", !content.visibility.testimonials)}
                                                className={cn(
                                                    "w-14 h-8 rounded-full p-1 transition-all",
                                                    content.visibility.testimonials ? "bg-primary" : "bg-zinc-800"
                                                )}
                                            >
                                                <div className={cn(
                                                    "w-6 h-6 bg-white rounded-full transition-all flex items-center justify-center",
                                                    content.visibility.testimonials ? "mr-6" : "mr-0"
                                                )}>
                                                    {content.visibility.testimonials ? <Eye size={12} className="text-primary" /> : <EyeOff size={12} className="text-zinc-500" />}
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                </section>
                            </motion.div>
                        )}

                        {activeTab === "about" && (
                            <motion.div 
                                key="about" 
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                className="space-y-12"
                            >
                                <section className="space-y-6">
                                    <h2 className="text-3xl font-black">دەربارەی ئێمە</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <label className="text-zinc-500 text-xs font-bold mr-1">ناونیشانی لاپەڕە</label>
                                                <input type="text" value={content.about.title} onChange={(e) => setContent({ ...content, about: { ...content.about, title: e.target.value } })} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-primary" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-zinc-500 text-xs font-bold mr-1">تەسفی گشتی (Description)</label>
                                                <textarea rows={2} value={content.about.description} onChange={(e) => setContent({ ...content, about: { ...content.about, description: e.target.value } })} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-primary resize-none" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-zinc-500 text-xs font-bold mr-1">چرۆکی ئێمە (Story Title)</label>
                                                <input type="text" value={content.about.storyTitle} onChange={(e) => setContent({ ...content, about: { ...content.about, storyTitle: e.target.value } })} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-primary" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-zinc-500 text-xs font-bold mr-1">پەرەگرافی یەکەم</label>
                                                <textarea rows={4} value={content.about.story1} onChange={(e) => setContent({ ...content, about: { ...content.about, story1: e.target.value } })} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-primary resize-none" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-zinc-500 text-xs font-bold mr-1">پەرەگرافی دووەم</label>
                                                <textarea rows={4} value={content.about.story2} onChange={(e) => setContent({ ...content, about: { ...content.about, story2: e.target.value } })} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-primary resize-none" />
                                            </div>
                                        </div>

                                        <div className="space-y-8">
                                            <ImageUploadField 
                                                label="وێنەی دەربارە (About Image)" 
                                                value={content.about.image} 
                                                onUpload={(url) => setContent({ ...content, about: { ...content.about, image: url } })} 
                                            />

                                            <div className="space-y-6">
                                                <h3 className="text-xl font-bold border-b border-zinc-800 pb-2">ئامارەکان (Stats)</h3>
                                                <p className="text-xs text-zinc-500 bg-primary/5 p-3 rounded-xl border border-primary/10">
                                                    ئەم ئامارانە لە لاپەڕەی "دەربارە" و "لاپەڕەی سەرەکی" نمایش دەکرێن.
                                                </p>
                                                <div className="grid grid-cols-1 gap-4">
                                                    {content.about.stats.map((stat: any, idx: number) => (
                                                        <div key={idx} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-4">
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div className="space-y-1">
                                                                    <label className="text-zinc-500 text-[10px] font-bold uppercase">ناونیشان</label>
                                                                    <input type="text" value={stat.label} onChange={(e) => {
                                                                        const newStats = [...content.about.stats];
                                                                        newStats[idx].label = e.target.value;
                                                                        setContent({ ...content, about: { ...content.about, stats: newStats } });
                                                                    }} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm" />
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <label className="text-zinc-500 text-[10px] font-bold uppercase">ژمارە</label>
                                                                    <input type="text" value={stat.value} onChange={(e) => {
                                                                        const newStats = [...content.about.stats];
                                                                        newStats[idx].value = e.target.value;
                                                                        setContent({ ...content, about: { ...content.about, stats: newStats } });
                                                                    }} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </motion.div>
                        )}

                        {activeTab === "services" && (
                            <motion.div 
                                key="services" 
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div className="flex items-center justify-between">
                                    <h2 className="text-3xl font-black">خزمەتگوزارییەکان</h2>
                                    <button 
                                        onClick={() => {
                                            const newService = {
                                                id: `service-${Date.now()}`,
                                                title: "خزمەتگوزاری نوێ",
                                                desc: "تەسفی کورت",
                                                fullDesc: "تەسفی درێژ بۆ لاپەڕەی خزمەتگوزارییەکان",
                                                icon: "Layout",
                                                image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&q=80",
                                                features: ["خاڵی یەکەم", "خاڵی دووەم"]
                                            };
                                            setContent({ ...content, services: [...content.services, newService] });
                                        }}
                                        className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-bold hover:scale-105 transition-all shadow-lg"
                                    >
                                        زایدکردن <Plus size={20} />
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 gap-8">
                                    {content.services.map((service: any, index: number) => (
                                        <div key={index} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-6 group relative">
                                            <button 
                                                onClick={() => {
                                                    const newServices = content.services.filter((_: any, i: number) => i !== index);
                                                    setContent({ ...content, services: newServices });
                                                }}
                                                className="absolute top-6 left-6 p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="space-y-6">
                                                    <div className="space-y-2">
                                                        <label className="text-zinc-500 text-xs font-bold mr-1">ناوی خزمەتگوزاری</label>
                                                        <input type="text" value={service.title} onChange={(e) => updateService(index, "title", e.target.value)} className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary font-bold" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-zinc-500 text-xs font-bold mr-1">تەسفی کورت (بۆ لاپەڕەی سەرەکی)</label>
                                                        <textarea rows={2} value={service.desc} onChange={(e) => updateService(index, "desc", e.target.value)} className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary resize-none text-sm" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-zinc-500 text-xs font-bold mr-1">تەسفی درێژ (بۆ لاپەڕەی خزمەتگوزارییەکان)</label>
                                                        <textarea rows={4} value={service.fullDesc || ""} onChange={(e) => updateService(index, "fullDesc", e.target.value)} className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary resize-none text-sm" />
                                                    </div>
                                                </div>

                                                <div className="space-y-6">
                                                    <ImageUploadField 
                                                        label="وێنەی خزمەتگوزاری" 
                                                        value={service.image || ""} 
                                                        onUpload={(url) => updateService(index, "image", url)} 
                                                    />
                                                    <div className="space-y-2">
                                                        <label className="text-zinc-500 text-xs font-bold mr-1">خاڵەکان (Features) - هەر خاڵێک لە دێڕێک</label>
                                                        <textarea 
                                                            rows={4} 
                                                            value={(service.features || []).join("\n")} 
                                                            onChange={(e) => {
                                                                const newFeatures = e.target.value.split("\n");
                                                                const newServices = [...content.services];
                                                                newServices[index].features = newFeatures;
                                                                setContent({ ...content, services: newServices });
                                                            }} 
                                                            className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary resize-none text-sm" 
                                                            placeholder="خاڵی ١&#10;خاڵی ٢"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-zinc-500 text-xs font-bold mr-1">Icon ID (Lucide)</label>
                                                        <input type="text" value={service.icon} onChange={(e) => updateService(index, "icon", e.target.value)} className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-500 focus:outline-none text-sm" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {activeTab === "testimonials" && (
                            <motion.div 
                                key="testimonials" 
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                className="space-y-8 pb-32"
                            >
                                <div className="flex items-center justify-between">
                                    <h2 className="text-3xl font-black">ڕاوبۆچوونەکان</h2>
                                    <button onClick={addTestimonial} className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-bold hover:scale-105 transition-all shadow-lg shadow-primary/20">
                                        زیاتر بکە <Plus size={20} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 gap-6">
                                    {content.testimonials.map((t: any, idx: number) => (
                                        <div key={idx} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-6 group relative">
                                            <button 
                                                onClick={() => deleteTestimonial(idx)}
                                                className="absolute top-6 left-6 p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 size={18} />
                                            </button>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="space-y-6">
                                                    <div className="space-y-2">
                                                        <label className="text-zinc-500 text-xs font-bold mr-1">ناوی کڕیار</label>
                                                        <input type="text" value={t.name} onChange={(e) => updateTestimonial(idx, "name", e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary font-bold" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-zinc-500 text-xs font-bold mr-1">پلە یان ناونیشان</label>
                                                        <input type="text" value={t.role} onChange={(e) => updateTestimonial(idx, "role", e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary" />
                                                    </div>
                                                </div>
                                                <div className="space-y-6">
                                                    <div className="space-y-2">
                                                        <label className="text-zinc-500 text-xs font-bold mr-1">ناوەرۆکی ڕاوبۆچوونەکە</label>
                                                        <textarea rows={4} value={t.content} onChange={(e) => updateTestimonial(idx, "content", e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary resize-none" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-zinc-500 text-xs font-bold mr-1">پلەبەندی (Rating) - ١ تا ٥</label>
                                                        <div className="flex gap-2">
                                                            {[1, 2, 3, 4, 5].map((num) => (
                                                                <button 
                                                                    key={num}
                                                                    onClick={() => updateTestimonial(idx, "rating", num)}
                                                                    className={cn(
                                                                        "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                                                                        t.rating >= num ? "bg-primary text-white" : "bg-zinc-850 text-zinc-600"
                                                                    )}
                                                                >
                                                                    <Star size={16} fill={t.rating >= num ? "currentColor" : "none"} />
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {activeTab === "contact" && (
                            <motion.div 
                                key="contact" 
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                className="space-y-12"
                            >
                                <section className="space-y-6">
                                    <h2 className="text-3xl font-black">پەیوەندی</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <label className="text-zinc-500 text-xs font-bold mr-1">ناونیشانی لاپەڕە</label>
                                                <input type="text" value={content.contact.title} onChange={(e) => setContent({ ...content, contact: { ...content.contact, title: e.target.value } })} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-primary" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-zinc-500 text-xs font-bold mr-1">تەسفی کورت</label>
                                                <textarea rows={2} value={content.contact.description} onChange={(e) => setContent({ ...content, contact: { ...content.contact, description: e.target.value } })} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-primary resize-none" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-zinc-500 text-xs font-bold mr-1">ئیمەیڵی فەرمی</label>
                                                <input type="text" value={content.contact.email} onChange={(e) => setContent({ ...content, contact: { ...content.contact, email: e.target.value } })} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-primary" dir="ltr" />
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <h3 className="text-xl font-bold border-b border-zinc-800 pb-2">سۆشاڵ میدیا</h3>
                                            <div className="grid grid-cols-1 gap-4">
                                                {content.contact.socials.map((social: any, idx: number) => (
                                                    <div key={idx} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-3">
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-sm font-bold text-primary">{social.name}</span>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-zinc-500 text-[10px] font-bold uppercase">لینکی یان ژمارە</label>
                                                            <input type="text" value={social.href} onChange={(e) => {
                                                                const newSocials = [...content.contact.socials];
                                                                newSocials[idx].href = e.target.value;
                                                                setContent({ ...content, contact: { ...content.contact, socials: newSocials } });
                                                            }} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm" dir="ltr" />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </motion.div>
                        )}

                        {activeTab === "projects" && (
                            <motion.div 
                                key="projects" 
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                className="space-y-8 pb-32"
                            >
                                <div className="flex items-center justify-between">
                                    <h2 className="text-3xl font-black">پڕۆژەکان</h2>
                                    <button onClick={addProject} className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-bold hover:scale-105 transition-all shadow-lg shadow-primary/20">
                                        پڕۆژەی نوێ <Plus size={20} />
                                    </button>
                                </div>

                                <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 mb-8 mt-6 space-y-6">
                                    <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                                        <h3 className="text-xl font-bold flex items-center gap-2">لینکەکانی بینینی زیاتر (See More) <ExternalLink size={18} className="text-primary" /></h3>
                                        <div className="text-xs text-zinc-500 font-medium bg-zinc-950 px-3 py-1 rounded-full border border-zinc-800">
                                            {Object.keys(content.categoryLinks || {}).length} ئەلبوم بەستراوەتەوە
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {Array.from(new Set(content.projects.map((p: any) => p.category))).map((category: any) => {
                                            const hasLink = !!content.categoryLinks?.[category];
                                            return (
                                                <div key={category} className="space-y-2 group">
                                                    <div className="flex items-center justify-between mr-1">
                                                        <label className="text-zinc-400 text-xs font-bold">{category}</label>
                                                        {hasLink ? (
                                                            <span className="text-[10px] text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20">بەستراوەتەوە</span>
                                                        ) : (
                                                            <span className="text-[10px] text-zinc-600 bg-zinc-950 px-2 py-0.5 rounded-full border border-zinc-800">بەتاڵ</span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <input 
                                                            type="text" 
                                                            value={content.categoryLinks?.[category] || ""}
                                                            onChange={(e) => setContent({ ...content, categoryLinks: { ...(content.categoryLinks || {}), [category]: e.target.value } })}
                                                            className={`flex-1 bg-zinc-950 border ${hasLink ? 'border-primary/30' : 'border-zinc-800'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary text-sm transition-all`} 
                                                            placeholder={`لینکی درایڤ یان ئینستاگرام...`}
                                                            dir="ltr"
                                                        />
                                                        <Link 
                                                            href={`/gallery/${encodeURIComponent(category)}`}
                                                            target="_blank"
                                                            className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-zinc-400 hover:text-white transition-colors"
                                                            title="بۆ بینینی ئەم بەشە لە سایتەکە"
                                                        >
                                                            <Globe size={18} />
                                                        </Link>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="flex items-start gap-3 p-4 bg-primary/5 border border-primary/10 rounded-2xl">
                                        <Info size={18} className="text-primary shrink-0 mt-0.5" />
                                        <p className="text-xs text-zinc-400 leading-relaxed">
                                            لێرەدا دەتوانیت لینکی دەرەکی بۆ هەر بەشێکی گەلەری دابنێیت. 
                                            دوای نووسینی لینکەکە، دڵنیابەرەوە کە لە سەرەوەی پەڕەکە دوگمەی <strong className="text-white">"پاشەکەوتکردن"</strong> لێدەدەیت بۆ ئەوەی گۆڕانکارییەکان جێگیر ببن.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-6">
                                    {content.projects.map((project: any) => (
                                        <div key={project.id} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-8 space-y-8 group">
                                            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                                                <div className="flex-1 space-y-4 w-full">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <input type="text" value={project.title} onChange={(e) => updateProject(project.id, "title", e.target.value)} className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-3 text-white font-bold" placeholder="ناوی پڕۆژە" />
                                                        <input type="text" value={project.category} onChange={(e) => updateProject(project.id, "category", e.target.value)} className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-400" placeholder="بەش" />
                                                    </div>
                                                    
                                                    <ImageUploadField 
                                                        label="وێنەی سەرەکی (Cover)" 
                                                        value={project.image} 
                                                        onUpload={(url) => updateProject(project.id, "image", url)} 
                                                    />

                                                    <div className="space-y-4">
                                                        <label className="text-zinc-500 text-xs font-bold mr-1 uppercase tracking-widest">وێنەکانی گەلەری</label>
                                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                                            {project.galleryImages.map((img: string, i: number) => (
                                                                <div key={i} className="relative aspect-square rounded-xl overflow-hidden group/img">
                                                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                                                    <button 
                                                                        onClick={() => {
                                                                            const newImgs = project.galleryImages.filter((_: any, idx: number) => idx !== i);
                                                                            updateProject(project.id, "galleryImages", newImgs);
                                                                        }}
                                                                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-lg opacity-0 group-hover/img:opacity-100 transition-opacity"
                                                                    >
                                                                        <Trash2 size={12} />
                                                                    </button>
                                                                </div>
                                                            ))}
                                                            <label className="aspect-square rounded-xl border-2 border-dashed border-zinc-800 flex items-center justify-center text-zinc-600 hover:border-primary hover:text-primary cursor-pointer transition-all">
                                                                <Plus size={24} />
                                                                <input 
                                                                    type="file" 
                                                                    className="hidden" 
                                                                    accept="image/*"
                                                                    onChange={async (e) => {
                                                                        if (e.target.files?.[0]) {
                                                                            const url = await handleUpload(e.target.files[0]);
                                                                            if (url) {
                                                                                updateProject(project.id, "galleryImages", [...project.galleryImages, url]);
                                                                            }
                                                                        }
                                                                    }}
                                                                />
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>

                                                <button 
                                                    onClick={() => deleteProject(project.id)}
                                                    className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl transition-all"
                                                    title="سڕینەوەی پڕۆژە"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            {/* Save Toast Notification */}
            <AnimatePresence>
                {saveStatus === "success" && (
                    <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="fixed bottom-10 left-10 z-[100] bg-zinc-900 border border-emerald-500/20 px-8 py-4 rounded-3xl shadow-2xl flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500"><CheckCircle2 size={24} /></div>
                        <div>
                            <p className="text-white font-black">سەرکەوتوو بوو</p>
                            <p className="text-zinc-500 text-xs">گۆڕانکارییەکان بە سەرکەوتوویی پاشەکەوتکران.</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
