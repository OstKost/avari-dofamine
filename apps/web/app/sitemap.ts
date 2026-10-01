import type { MetadataRoute } from "next";
import { apiFetch } from "@/lib/api/client";

interface Product {
  id: string;
  created_at?: string;
  updated_at?: string;
}

export const revalidate = 3600; // revalidate sitemap every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dofamine.avari.dev";
  const now = new Date();

  // Static core routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/catalog`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/tech`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    },
  ];

  // Dynamic product routes from catalog
  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const res = await apiFetch<{ products?: Product[] }>("/catalog/products?limit=250", {
      cache: "no-store",
    });

    if (res?.products && Array.isArray(res.products)) {
      productRoutes = res.products.map((prod) => ({
        url: `${siteUrl}/product/${prod.id}`,
        lastModified: prod.updated_at ? new Date(prod.updated_at) : (prod.created_at ? new Date(prod.created_at) : now),
        changeFrequency: "daily",
        priority: 0.8,
      }));
    }
  } catch {
    // If backend is not accessible during static build, return static routes
  }

  return [...staticRoutes, ...productRoutes];
}
