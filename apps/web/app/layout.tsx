import type { Metadata, Viewport } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BottomNav } from "@/components/layout/bottom-nav";
import { CurrencyProvider } from "@/lib/context/currency-context";
import { WebsiteJsonLd, OrganizationJsonLd } from "@/components/seo/JsonLd";
import { AnalyticsScripts } from "@/components/analytics/AnalyticsScripts";
import { NavigationTracker } from "@/components/analytics/NavigationTracker";
import { WebVitalsTracker } from "@/components/analytics/WebVitalsTracker";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dofamine.avari.dev";

export const viewport: Viewport = {
  themeColor: "#050B14",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Avari Dofamine — Маркетплейс мгновенного дофамина",
    template: "%s | Avari Dofamine",
  },
  description: "Маркетплейс мгновенной радости: 200+ товаров по 10 ₽, бесплатное оформление заказов, интерактивная симуляция доставки 100–500м, стрики и чистый эндорфин.",
  keywords: [
    "маркетплейс",
    "дофамин",
    "доставка за 10 рублей",
    "товары по 10 рублей",
    "пункты выдачи заказов",
    "пвз",
    "симуляция доставки",
    "геймификация покупок",
    "стрики",
    "ростов-на-дону",
  ],
  authors: [{ name: "Avari Dofamine Team", url: siteUrl }],
  creator: "Avari Dofamine",
  publisher: "Avari Dofamine",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/logo-minimal-star.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: ["/favicon.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: siteUrl,
    siteName: "Avari Dofamine Market",
    title: "Avari Dofamine — Маркетплейс мгновенного дофамина",
    description: "Любой товар за 10 ₽ с интерактивной доставкой курьером к вашему ПВЗ! Стрики, подарки и мгновенное удовольствие.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Avari Dofamine — Маркетплейс мгновенного дофамина",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Avari Dofamine — Маркетплейс мгновенного дофамина",
    description: "Любой товар за 10 ₽ с интерактивной доставкой курьером к вашему ПВЗ!",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: siteUrl,
  },
  other: {
    "geo.region": "RU-ROS",
    "geo.placename": "Ростов-на-Дону",
    "geo.position": "47.222531;39.718705",
    "ICBM": "47.222531, 39.718705",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="dark">
      <head>
        <WebsiteJsonLd siteUrl={siteUrl} />
        <OrganizationJsonLd siteUrl={siteUrl} />
      </head>
      <body className="flex min-h-screen flex-col bg-[#050B14] text-[#F4F1E8] antialiased font-sans">
        <AnalyticsScripts />
        <NavigationTracker />
        <WebVitalsTracker />
        <CurrencyProvider>
          <Header />
          <main className="flex-1 pb-16 md:pb-0">{children}</main>
          <Footer />
          <BottomNav />
        </CurrencyProvider>
      </body>
    </html>
  );
}
