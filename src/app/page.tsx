import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Star, Layout, Palmtree, Home as HomeIcon, Paintbrush, Lightbulb, Utensils } from "lucide-react";
import { InteractiveHoverButton } from "@/components";
import { getSiteContent } from "@/lib/content-store";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { site: siteConfig, services, projects } = await getSiteContent();
  const featuredProjects = projects.slice(0, 6);

  return (
    <>

      <section className="relative h-screen min-h-[600px] flex items-center justify-center pt-20">
        <div className="absolute inset-0 z-0 bg-secondary">
          <Image
            src={siteConfig.heroImage}
            alt="Luxury Home Interior"
            fill
            className="object-cover brightness-[0.4]"
            priority
          />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto space-y-8 mt-16 md:mt-0">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight drop-shadow-lg font-noto-arabic">
            {siteConfig.title.split(" ").slice(0, -1).join(" ")} <span className="text-primary">{siteConfig.title.split(" ").slice(-1)}</span>
          </h1>
          <p className="text-lg md:text-2xl text-gray-200 max-w-2xl mx-auto font-light drop-shadow-md">
            {siteConfig.description}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <InteractiveHoverButton
              href="/gallery"
              text="کارەکانمان ببینە"
              className="w-auto px-8 py-4 text-lg border-white/30 bg-white/10 backdrop-blur-md text-white"
            />
            <Link
              href="/contact"
              className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 font-medium rounded-full hover:bg-white/20 transition-all shadow-lg text-lg text-center"
            >
              داوای نرخ بکە
            </Link>
          </div>
        </div>
      </section>


      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary dark:text-gray-100 mb-4">شارەزاییمان</h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
              ئێمە چارەسەری تەواوکاری دابین دەکەین بۆ ماڵەکەت، گرنگی بە بچووکترین وردەکاری دەدەین بۆ ئەوەی باشترین ئەنجام بەدەست بهێنین.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const IconMap: { [key: string]: any } = {
                Layout: Layout,
                Palmtree: Palmtree,
                Home: HomeIcon,
                Paintbrush: Paintbrush,
                Lightbulb: Lightbulb,
                Utensils: Utensils,
              };
              const Icon = IconMap[service.icon || "Layout"];

              return (
                <div key={index} className="bg-card p-8 rounded-2xl shadow-sm border border-card-border hover:shadow-lg transition-all duration-300 group hover:-translate-y-2">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300 text-primary">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-secondary dark:text-gray-100 mb-3">{service.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{service.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>


      <section className="py-24 bg-card">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-secondary dark:text-gray-100 mb-4">پڕۆژە دیارەکانمان</h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl">
                بەشێک لە جوانترین کارەکانمان لە نەخشەسازی ناوەوە و دەرەوە ببینە.
              </p>
            </div>
            <Link href="/gallery" className="text-primary font-medium hover:text-yellow-600 flex items-center gap-2">
              هەموو پڕۆژەکان <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project) => (
              <Link href={`/projects/${project.id}`} key={project.id} className="group block overflow-hidden rounded-2xl relative aspect-[4/3]">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-115"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 transition-opacity group-hover:opacity-100" />
                <div className="absolute bottom-0 left-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform">
                  <span className="text-primary font-medium text-sm mb-2 block">{project.category}</span>
                  <h3 className="text-white text-xl font-bold">{project.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>


      <section className="py-24 bg-secondary text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full blur-[120px] opacity-20" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary rounded-full blur-[120px] opacity-20" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">کڕیارەکانمان چی دەڵێن</h2>
            <p className="text-gray-400 text-lg">تەنها قسەی ئێمە بەس نییە، گوێ لە کڕیارەکانمان بگرە.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10">
                <div className="flex gap-1 text-primary mb-6">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
                </div>
                <p className="text-gray-300 mb-6 italic">
                  "سەرکۆ دیکۆر ماڵەکەی ئێمەی گۆڕی بۆ شاکارێکی هونەری. گرنگیدانیان بە وردەکارییەکان و شێوازی کارکردنیان زۆر نایاب بوو لە سەرەتای پڕۆژەکەوە تا کۆتایی."
                </p>
                <div>
                  <h4 className="font-bold text-white">سارا ئەحمەد</h4>
                  <span className="text-gray-400 text-sm">خاوەن ماڵ</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      <section className="py-16 bg-primary">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">ئامادەی بۆ گۆڕینی ماڵەکەت؟</h2>
            <p className="text-white/90 text-lg">پەیوەندیمان پێوە بکە بۆ ڕاوێژکاری و وەرگرتنی نرخ.</p>
          </div>
          <a
            href={`https://wa.me/${siteConfig.contact.whatsapp}`}
            className="px-8 py-4 bg-white text-secondary font-bold rounded-full hover:bg-gray-50 transition-colors shadow-lg text-lg flex items-center gap-2 whitespace-nowrap"
          >
            نامەمان بۆ بنێرە لە وەتسئەپ
          </a>
        </div>
      </section>
    </>
  );
}
