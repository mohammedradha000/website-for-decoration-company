import type { Metadata } from "next";
import { Inter, Noto_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { Header, Footer, FloatingContact, ThemeProvider } from "@/components";
import { cn } from "@/shared";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const notoArabic = Noto_Sans_Arabic({
  variable: "--font-noto-arabic",
  subsets: ["arabic"],
});

export const metadata: Metadata = {
  title: "سەرکۆ دیکۆر | نەخشەسازی ناوەوە و دەرەوەی ماڵ",
  description: "لە دیزاینەوە بۆ جێبەجێکردن. جوانترین ئەنجام بۆ ماڵەکەت کە جێگای متمانەیە.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ckb" dir="rtl" suppressHydrationWarning>
      <body 
        className={cn(
          inter.variable, 
          notoArabic.variable, 
          "antialiased font-noto-arabic flex flex-col min-h-screen pb-[80px] md:pb-0"
        )}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <FloatingContact />
        </ThemeProvider>
      </body>
    </html>
  );
}
