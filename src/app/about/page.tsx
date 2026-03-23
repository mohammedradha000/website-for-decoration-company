import Image from "next/image";
import Link from "next/link";
import { cn } from "@/shared";
import { Award, Users, Clock, ShieldCheck, ArrowLeft, LucideIcon } from "lucide-react";
import { getSiteContent } from "@/lib/content-store";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
    const { about } = await getSiteContent();

    const IconMap: Record<string, LucideIcon> = {
        Clock: Clock,
        Award: Award,
        Users: Users,
        ShieldCheck: ShieldCheck
    };

    return (
        <div className="bg-background min-h-screen">
            {/* Hero Section */}
            <div className="relative pt-32 pb-24 px-6 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-secondary z-0" />
                <div className="absolute top-20 left-20 w-96 h-96 bg-primary rounded-full blur-[150px] opacity-20 z-0" />

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">{about.title}</h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        {about.description}
                    </p>
                </div>
            </div>

            {/* Our Story Section */}
            <div className="max-w-7xl mx-auto px-6 py-24">
                <div className="flex flex-col lg:flex-row gap-16 items-center">
                    <div className="w-full lg:w-1/2 space-y-6 text-right">
                        <span className="text-primary font-medium tracking-wider uppercase text-sm">چیرۆکی ئێمە</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-secondary dark:text-gray-100">
                            {about.storyTitle}
                        </h2>
                        <div className="space-y-4 text-lg text-gray-600 dark:text-gray-400">
                            <p>{about.story1}</p>
                            <p>{about.story2}</p>
                        </div>

                        <div className="pt-4 flex justify-start">
                            <Link href="/gallery" className="text-primary font-bold hover:text-yellow-600 transition-colors flex items-center gap-2">
                                <ArrowLeft className="w-5 h-5" /> پۆرتفۆلیۆکەمان ببینە
                            </Link>
                        </div>
                    </div>

                    <div className="w-full lg:w-1/2 relative">
                        <div className="relative z-10 aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
                            <Image
                                src={about.image}
                                alt="تیمی سەرکۆ دیکۆر لە کاتی کارکردن"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-primary rounded-2xl -z-10" />
                        <div className="absolute -top-8 -left-8 w-48 h-48 border-2 border-primary rounded-2xl -z-10" />
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="bg-secondary py-20 text-white">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
                    {about.stats.map((stat, i) => {
                        const Icon = IconMap[stat.icon] || Clock;
                        return (
                            <div key={i} className="text-center space-y-3">
                                <div className="w-12 h-12 mx-auto bg-white/10 rounded-full flex items-center justify-center text-primary">
                                    <Icon className="w-6 h-6" />
                                </div>
                                <div className="text-4xl md:text-5xl font-bold text-white">{stat.value}</div>
                                <div className="text-gray-400 font-medium">{stat.label}</div>
                            </div>
                        );
                    })}
                </div>
            </div>


            <div className="py-24 bg-background">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-secondary dark:text-gray-100 mb-12">بۆچی سەرکۆ دیکۆر هەڵبژێریت؟</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-right">
                        <div className="p-8 bg-card border border-card-border rounded-2xl">
                            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary mb-4 font-bold">١</div>
                            <h3 className="text-xl font-bold text-secondary dark:text-gray-100 mb-2">بەرزترین کوالیتی</h3>
                            <p className="text-gray-600 dark:text-gray-400">ئێمە جۆری باشترین کەرەستەکان بەکاردەهێنین و کۆنترۆڵی وردی کوالیتی پەیڕەو دەکەین.</p>
                        </div>

                        <div className="p-8 bg-card border border-card-border rounded-2xl">
                            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary mb-4 font-bold">٢</div>
                            <h3 className="text-xl font-bold text-secondary dark:text-gray-100 mb-2">نرخی ڕوون</h3>
                            <p className="text-gray-600 dark:text-gray-400">بێ تێچووی شاراوە. ئێمە نرخی وردت پێ دەدەین و پابەند دەبین بەو بڕەی دیاریکراوە.</p>
                        </div>

                        <div className="p-8 bg-card border border-card-border rounded-2xl">
                            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary mb-4 font-bold">٣</div>
                            <h3 className="text-xl font-bold text-secondary dark:text-gray-100 mb-2">کاتی ڕێک و پێک</h3>
                            <p className="text-gray-600 dark:text-gray-400">کاتت بۆ ئێمە گرنگە و دڵنیا دەبینەوە کە پڕۆژەکەت لە کاتی دیاریکراودا تەواو ببێت.</p>
                        </div>

                        <div className="p-8 bg-card border border-card-border rounded-2xl">
                            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary mb-4 font-bold">٤</div>
                            <h3 className="text-xl font-bold text-secondary dark:text-gray-100 mb-2">پاڵپشتی بەردەوام</h3>
                            <p className="text-gray-600 dark:text-gray-400">تیمی ڕاوێژکاریمان هەمیشە ئامادەیە بۆ وەڵامدانەوەی پرسیارەکانت و پێدانی زانیاری نوێ.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
