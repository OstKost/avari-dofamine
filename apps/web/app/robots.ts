import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dofamine.avari.dev";

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/catalog",
          "/catalog/*",
          "/product/*",
          "/about",
          "/tech",
        ],
        disallow: [
          "/api/",
          "/orders",
          "/orders/*",
          "/cart",
          "/profile",
          "/onboarding",
          "/login",
          "/register",
        ],
      },
      {
        userAgent: "YandexBot",
        allow: [
          "/",
          "/catalog",
          "/catalog/*",
          "/product/*",
          "/about",
          "/tech",
        ],
        disallow: [
          "/api/",
          "/orders",
          "/orders/*",
          "/cart",
          "/profile",
          "/onboarding",
          "/login",
          "/register",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: [
          "/",
          "/catalog",
          "/catalog/*",
          "/product/*",
          "/about",
          "/tech",
        ],
        disallow: [
          "/api/",
          "/orders",
          "/orders/*",
          "/cart",
          "/profile",
          "/onboarding",
          "/login",
          "/register",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
