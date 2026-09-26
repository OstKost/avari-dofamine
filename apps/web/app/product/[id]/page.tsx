import { notFound } from "next/navigation";
import { apiFetch } from "@/lib/api/client";
import { ProductDetailClient } from "./ProductDetailClient";

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

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

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

  return <ProductDetailClient product={product} />;
}
