"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Sparkles, ShieldCheck, Zap, ShoppingBag, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { apiFetch, isUnauthorizedError } from "@/lib/api/client";
import { useCurrency } from "@/lib/context/currency-context";
import { getProductImageUrl } from "@/lib/utils/product-image";
import { trackProductView, trackAddToCart } from "@/lib/analytics/tracker";

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

export function ProductDetailClient({ product }: { product: Product }) {
  const { formatPrice } = useCurrency();
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const imageUrl = getProductImageUrl(product.image_seed || product.id, product.name, product.category_name);

  useEffect(() => {
    trackProductView({
      item_id: product.id,
      item_name: product.name,
      price: product.price_rub,
      item_category: product.category_name,
    });
  }, [product]);

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await apiFetch("/cart/items", {
        method: "POST",
        body: {
          product_id: product.id,
          quantity: 1,
        },
      });

      trackAddToCart(
        {
          item_id: product.id,
          item_name: product.name,
          price: product.price_rub,
          item_category: product.category_name,
        },
        1
      );

      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2500);
    } catch (err) {
      console.error("Failed to add item to cart:", err);
      if (isUnauthorizedError(err)) {
        window.location.href = `/login?next=/product/${product.id}`;
      }
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 sm:px-6 py-8 space-y-8">
      <Link
        href="/catalog"
        className="inline-flex items-center gap-2 text-sm text-[#9FB3C4] hover:text-[#F4F1E8] transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Назад в каталог</span>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
        {/* Product Image */}
        <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-[#0B1622] border border-[#1E3A50] shadow-xl">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            priority
            unoptimized
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
          {product.category_name && (
            <div className="absolute top-4 left-4">
              <Badge variant="teal" className="backdrop-blur-md text-xs font-bold px-3 py-1">
                {product.category_name}
              </Badge>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400/15 border border-amber-400/30 text-amber-300 flex items-center gap-1.5 shadow-glow-amber">
                <Sparkles className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
                <span>Бесплатное оформление по промокоду</span>
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-[#F4F1E8] tracking-tight">
              {product.name}
            </h1>

            <p className="text-base text-[#9FB3C4] leading-relaxed">
              {product.description ||
                "Оригинальный товар из каталога Avari Dofamine. Гарантия моментального удовольствия и ярких эмоций."}
            </p>

            <div className="pt-4 border-t border-[#1E3A50]">
              <span className="text-xs text-[#5E7488] block mb-1">Сумма в каталоге</span>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-black text-[#F4F1E8]">
                  {formatPrice(product.price_rub)}
                </span>
                <span className="text-xs text-amber-400 font-semibold">
                  (в корзине доступны промокоды со скидкой до 100%)
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                variant={isAdded ? "secondary" : "gold"}
                className="flex-1 gap-2 text-base rounded-2xl h-12 font-bold shadow-glow-amber"
                isLoading={isAdding}
                onClick={handleAddToCart}
              >
                {isAdded ? (
                  <>
                    <Check className="h-5 w-5 text-emerald-400" />
                    <span>Товар в корзине!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-5 w-5 text-[#050B14]" />
                    <span>Добавить в корзину</span>
                  </>
                )}
              </Button>

              <Link href="/cart">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-base rounded-2xl h-12 border-[#1E3A50] text-[#F4F1E8] hover:bg-[#1E3A50]">
                  Перейти в корзину
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <Card className="border-[#1E3A50] bg-[#0B1622]/60 rounded-2xl">
                <CardContent className="p-3.5 flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-teal-400 flex-shrink-0" />
                  <span className="text-xs text-[#9FB3C4] font-medium">
                    Синтетический оригинал
                  </span>
                </CardContent>
              </Card>

              <Card className="border-[#1E3A50] bg-[#0B1622]/60 rounded-2xl">
                <CardContent className="p-3.5 flex items-center gap-3">
                  <Zap className="h-5 w-5 text-amber-400 flex-shrink-0" />
                  <span className="text-xs text-[#9FB3C4] font-medium">
                    ПВЗ в радиусе 100-500м
                  </span>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
