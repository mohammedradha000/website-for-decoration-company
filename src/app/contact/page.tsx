import { contact } from "@/shared";
import { 
    Mail, 
    Phone, 
    MessageCircle, 
    Facebook, 
    Video, 
    MessageSquare,
    LucideIcon
} from "lucide-react";

export const metadata = {
    title: "پەیوەندی | سەرکۆ دیکۆر",
    description: "پەیوەندی بکە بە سەرکۆ دیکۆر بۆ جێبەجێکردنی پڕۆژەکانی نەخشەسازی ناوەوە و دەرەوە ماڵەکەت.",
};

export default function ContactPage() {
    const IconMap: Record<string, LucideIcon> = {
        MessageCircle: MessageCircle,
        Phone: Phone,
        MessageSquare: MessageSquare,
        Video: Video,
        Facebook: Facebook,
        Mail: Mail
    };

    return (
        <div className="bg-background min-h-screen pt-32 pb-24">
            <div className="max-w-4xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-secondary dark:text-gray-100 mb-4">{contact.title}</h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        {contact.description}
                    </p>
                </div>

                <div className="space-y-16">
                    {/* Primary Contact Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-card p-8 rounded-3xl flex flex-col items-center justify-center text-center shadow-lg border border-card-border transition-transform hover:scale-[1.02]">
                            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
                                <Phone className="w-10 h-10" />
                            </div>
                            <h3 className="font-bold text-secondary dark:text-gray-100 text-2xl mb-3">ژمارەی تەلەفۆن</h3>
                            <a href={`tel:${contact.socials.find(s => s.name === "تەلەفۆن")?.href.replace("tel:", "") || ""}`} className="text-gray-600 dark:text-gray-400 text-xl font-medium hover:text-primary transition-colors" dir="ltr">
                                {contact.socials.find(s => s.name === "تەلەفۆن")?.href.replace("tel:", "") || ""}
                            </a>
                        </div>

                        <div className="bg-card p-8 rounded-3xl flex flex-col items-center justify-center text-center shadow-lg border border-card-border transition-transform hover:scale-[1.02]">
                            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
                                <Mail className="w-10 h-10" />
                            </div>
                            <h3 className="font-bold text-secondary dark:text-gray-100 text-2xl mb-3">ئیمەیڵ</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-xl font-medium">{contact.email}</p>
                        </div>
                    </div>

                    {/* Social Grid */}
                    <div className="pt-8 border-t border-gray-200 dark:border-gray-800 border-dashed">
                        <h2 className="text-2xl font-bold text-secondary dark:text-gray-100 mb-8 text-center">لە تۆڕە کۆمەڵایەتییەکان لەگەڵمان بە</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            {contact.socials.map((method) => {
                                const Icon = IconMap[method.icon] || MessageCircle;
                                return (
                                    <a
                                        key={method.name}
                                        href={method.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`group flex flex-col items-center justify-center gap-3 p-6 rounded-2xl font-bold text-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${method.bg}`}
                                    >
                                        <div className="transition-transform duration-300 group-hover:scale-125">
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <span>{method.name}</span>
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
