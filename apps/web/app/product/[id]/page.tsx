import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { apiFetch } from "@/lib/api/client";
import { ProductDetailClient } from "./ProductDetailClient";
import { ProductJsonLd, BreadcrumbsJsonLd } from "@/components/seo/JsonLd";
import { getProductImageUrl } from "@/lib/utils/product-image";

export const dynamic = "force-dynamic";

interface Product {
  id: string;
  category_id: string;
  category_name?: string;
  name: string;
  description?: string;
  price_rub: string;
  image_seed: string;
  created_at: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dofamine.avari.dev";

  try {
    const res = await apiFetch<{ product: Product }>(`/catalog/products/${id}`, {
      cache: "no-store",
    });
    const product = res.product;
    if (!product) {
      return {
        title: "Товар не найден | Avari Dofamine",
      };
    }

    const title = `${product.name} — купить за 10 ₽`;
    const description =
      product.description ||
      `Купить ${product.name} в маркетплейсе Avari Dofamine. Категория: ${product.category_name || "Товары"}. Доставка 100–500м, стейт-машина трекинга и мгновенная радость.`;
    const imageUrl = getProductImageUrl(
      product.image_seed || product.id,
      product.name,
      product.category_name
    );

    return {
      title,
      description,
      alternates: {
        canonical: `${siteUrl}/product/${product.id}`,
      },
      openGraph: {
        title: `${product.name} — Avari Dofamine Market`,
        description,
        url: `${siteUrl}/product/${product.id}`,
        type: "website",
        images: [
          {
            url: imageUrl,
            width: 800,
            height: 800,
            alt: product.name,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `${product.name} — Avari Dofamine`,
        description,
        images: [imageUrl],
      },
    };
  } catch {
    return {
      title: "Товар | Avari Dofamine",
    };
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dofamine.avari.dev";

  let product: Product | null = null;
  try {
    const res = await apiFetch<{ product: Product }>(`/catalog/products/${id}`, {
      cache: "no-store",
    });
    product = res.product || null;
  } catch {
    // If not found or error, product remains null and triggers notFound()
  }

  if (!product) {
    notFound();
  }

  const imageUrl = getProductImageUrl(
    product.image_seed || product.id,
    product.name,
    product.category_name
  );

  const breadcrumbs = [
    { name: "Главная", url: "/" },
    { name: "Каталог", url: "/catalog" },
    ...(product.category_name ? [{ name: product.category_name, url: `/catalog?category=${product.category_id}` }] : []),
    { name: product.name, url: `/product/${product.id}` },
  ];

  return (
    <>
      <ProductJsonLd
        id={product.id}
        name={product.name}
        description={product.description}
        price="10.00"
        imageUrl={imageUrl}
        categoryName={product.category_name}
        siteUrl={siteUrl}
      />
      <BreadcrumbsJsonLd items={breadcrumbs} siteUrl={siteUrl} />
      <ProductDetailClient product={product} />
    </>
  );
}
