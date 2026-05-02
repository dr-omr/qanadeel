import type { Metadata, Viewport } from "next";
import { Tajawal } from "next/font/google";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { ChatBotWidget } from "@/components/ChatBotWidget";
import { FloatingContactBadge } from "@/components/FloatingContactBadge";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { PwaManager } from "@/components/PwaManager";
import { ScrollProgress } from "@/components/ScrollProgress";
import { SplashScreen } from "@/components/SplashScreen";
import { schoolInfo } from "@/data/school-info";
import "./globals.css";

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic"],
  weight: ["400", "500", "700", "800"],
});

export const viewport: Viewport = {
  themeColor: "#17483A",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://qandeel-school-site.vercel.app"),
  title: schoolInfo.seoTitle,
  description: schoolInfo.seoDescription,
  applicationName: schoolInfo.fullName,
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "قناديل العلم",
    statusBarStyle: "default",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "64x64", type: "image/x-icon" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    title: schoolInfo.seoTitle,
    description: schoolInfo.seoDescription,
    locale: "ar_OM",
    type: "website",
    images: [
      {
        url: schoolInfo.logoPath,
        width: 1200,
        height: 461,
        alt: schoolInfo.fullName,
      },
    ],
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: schoolInfo.officialName,
    alternateName: schoolInfo.shortName,
    url: "https://qandeel-school-site.vercel.app",
    logo: "https://qandeel-school-site.vercel.app/branding/logo-full.png",
    image: "https://qandeel-school-site.vercel.app/images/school-exterior-hero-desktop.png",
    description: schoolInfo.seoDescription,
    address: {
      "@type": "PostalAddress",
      addressLocality: "صحار",
      addressRegion: "الجفرة",
      addressCountry: "OM",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: `+968${schoolInfo.phone}`,
      contactType: "customer service",
      availableLanguage: "Arabic",
    },
    sameAs: [`https://wa.me/${schoolInfo.whatsappInternational}`],
  };

  return (
    <html
      lang="ar-OM"
      dir="rtl"
      className={`${tajawal.variable} h-full scroll-smooth antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="flex min-h-full flex-col">
        <div className="flex min-h-full flex-col bg-brand-ivory pb-[calc(88px+env(safe-area-inset-bottom))] lg:pb-0">
          <AnnouncementBar />
          <Header />
          <ScrollProgress />
          {children}
          <SplashScreen />
          <ChatBotWidget />
          <FloatingContactBadge />
          <MobileBottomNav />
          <PwaManager />
          <Footer />
        </div>
      </body>
    </html>
  );
}
