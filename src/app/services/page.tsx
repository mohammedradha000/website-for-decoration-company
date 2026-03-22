import Image from "next/image";
import { services } from "@/shared";
import { Paintbrush, Home, Building2, Lightbulb, Hammer, Layout, LucideIcon } from "lucide-react";
import { InteractiveHoverButton } from "@/components";

export const metadata = {
    title: "خزمەتگوزارییەکانمان | سەرکۆ دیکۆر",
    description: "خزمەتگوزارییە گشتگیرەکانی نەخشەسازی ناوەوە و دەرەوە لەوانە سەقفی مەغریبی، بۆیە، ڕووناکی و تەواوکاری.",
};

export default function ServicesPage() {
    const IconMap: Record<string, LucideIcon> = {
        Paintbrush: Paintbrush,
        Home: Home,
        Building2: Building2,
        Lightbulb: Lightbulb,
        Hammer: Hammer,
        Layout: Layout
    };

    return (
        <div className="bg-background min-h-screen">
            {/* Header */}
            <div className="bg-secondary text-white py-32 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">خزمەتگوزارییەکانمان</h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        چارەسەری تەواوکاری گشتگیر بۆ ماڵان کە بە کوالیتییەکی بەرز و وردەکارییەکی زۆرەوە پێشکەش دەکرێت.
                    </p>
                </div>
            </div>

            {/* Services List */}
            <div className="max-w-7xl mx-auto px-6 py-24 space-y-24">
                {services.map((service, index) => {
                    const Icon = IconMap[service.icon] || Layout;
                    return (
                        <div key={service.id || index} className={`flex flex-col lg:flex-row gap-12 items-center ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
                            <div className="w-full lg:w-1/2 relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg border border-card-border">
                                {service.image && (
                                    <Image
                                        src={service.image}
                                        alt={service.title}
                                        fill
                                        className="object-cover transition-transform duration-700 hover:scale-105"
                                    />
                                )}
                            </div>

                            <div className="w-full lg:w-1/2 space-y-6">
                                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                                    <Icon className="w-8 h-8" />
                                </div>
                                <h2 className="text-3xl lg:text-4xl font-bold text-secondary dark:text-gray-100">{service.title}</h2>
                                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {service.fullDesc || service.desc}
                                </p>

                                {service.features && service.features.length > 0 && (
                                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
                                        {service.features.map((feature, i) => (
                                            <li key={i} className="flex items-center gap-3 text-secondary dark:text-gray-300 font-medium">
                                                <div className="w-2 h-2 rounded-full bg-primary" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                <InteractiveHoverButton
                                    href={`/contact?service=${service.id}`}
                                    text="داوای نرخ بکە"
                                    className="w-auto px-8 py-4"
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
