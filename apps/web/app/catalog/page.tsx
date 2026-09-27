import Link from "next/link";
import { ShoppingBag, MapPin, ChevronRight, Sparkles } from "lucide-react";
import { SearchBar } from "@/components/features/catalog/search-bar";
import { ProductCard } from "@/components/features/catalog/product-card";
import { Badge } from "@/components/ui/badge";
import { apiFetch } from "@/lib/api/client";

export const dynamic = "force-dynamic";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
}

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

interface CategoriesResponse {
  categories: Category[];
}

interface ProductsResponse {
  products: Product[];
  total: number;
  limit: number;
  offset: number;
}

interface SuperCategory {
  id: string;
  label: string;
  icon: string;
  slugPrefixes: string[];
}

const SUPER_CATEGORIES: SuperCategory[] = [
  { id: "all", label: "✨ Все товары", icon: "✨", slugPrefixes: [] },
  { id: "dofamine", label: "🎪 Допаминовая лавка", icon: "🎪", slugPrefixes: ["dofamine-"] },
  { id: "electronics", label: "⚡ Электроника", icon: "⚡", slugPrefixes: ["electronics-"] },
  { id: "computers", label: "💻 Компьютеры & Железо", icon: "💻", slugPrefixes: ["hardware-", "computers-"] },
  { id: "brands", label: "👑 Бренды & Премиум", icon: "👑", slugPrefixes: ["luxury-", "brands-"] },
  { id: "clothing", label: "👕 Одежда & Стритвир", icon: "👕", slugPrefixes: ["streetwear-", "clothing-"] },
  { id: "food", label: "🍕 Еда & Рестораны", icon: "🍕", slugPrefixes: ["food-", "restaurant-"] },
];

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ category_id?: string; super?: string; q?: string }>;
}) {
  const { category_id, super: superParam, q } = await searchParams;

  let categories: Category[] = [];
  let products: Product[] = [];

  try {
    const [catRes, prodRes] = await Promise.all([
      apiFetch<CategoriesResponse>("/catalog/categories", { cache: "no-store" }),
      apiFetch<ProductsResponse>("/catalog/products", {
        params: {
          query: {
            category_id,
            q,
            limit: 100,
          },
        },
        cache: "no-store",
      }),
    ]);

    categories = catRes.categories || [];
    products = prodRes.products || [];
  } catch (err) {
    console.error("Error fetching catalog data:", err);
  }

  // Active Super-Category
  const activeSuper = superParam && superParam !== "all" ? superParam : undefined;
  const superFilter = activeSuper ? SUPER_CATEGORIES.find((s) => s.id === activeSuper) : undefined;

  // Filter subcategories that belong to the active super-category
  const visibleCategories = categories.filter((cat) => {
    if (!superFilter || superFilter.slugPrefixes.length === 0) return true;
    return (
      superFilter.slugPrefixes.some((prefix) => cat.slug.startsWith(prefix)) ||
      cat.name.startsWith(superFilter.icon)
    );
  });

  // Strict product filtering by super-category / category_id
  let filteredProducts = products;
  if (category_id) {
    filteredProducts = products.filter((p) => p.category_id === category_id);
  } else if (superFilter && superFilter.slugPrefixes.length > 0) {
    const allowedCategoryIds = new Set(visibleCategories.map((c) => c.id));
    filteredProducts = products.filter(
      (p) =>
        allowedCategoryIds.has(p.category_id) ||
        (p.category_name && p.category_name.startsWith(superFilter.icon))
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Pickup Point Selection Pill */}
      <Link href="/onboarding" className="block group">
        <div className="flex items-center justify-between p-3.5 px-4 rounded-2xl bg-[#0B1622]/90 border border-[#1E3A50] group-hover:border-teal-400/50 group-hover:shadow-glow-teal transition-all">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-400/15 text-amber-400 border border-amber-400/30">
              <MapPin className="h-4 w-4" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-[#9FB3C4] block">Пункт выдачи</span>
              <span className="text-sm font-bold text-[#F4F1E8] group-hover:text-amber-300 transition-colors">
                ул. Малая Садовая, 12 (240м)
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-teal-400">
            <span>Сменить</span>
            <ChevronRight className="h-4 w-4" />
          </div>
        </div>
      </Link>

      {/* Top Banner & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-[#F4F1E8] tracking-tight">
              Каталог дофамина
            </h1>
            <Badge variant="gold" className="text-[10px] font-bold px-2 py-0.5">
              <Sparkles className="h-3 w-3 mr-1" />
              Бесплатно
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-[#9FB3C4]">
            {filteredProducts.length} товаров · Бесплатное оформление заказов
          </p>
        </div>

        <SearchBar />
      </div>

      {/* Super Category Filter Chips */}
      <div className="space-y-2">
        <span className="text-xs font-extrabold uppercase tracking-wider text-[#9FB3C4] block">
          Направления каталога
        </span>
        <div className="flex items-center gap-2.5 custom-scrollbar-x pt-2 pb-3 px-1">
          {SUPER_CATEGORIES.map((cat) => {
            const isActive = (!activeSuper && cat.id === "all") || activeSuper === cat.id;
            const queryUrl = cat.id === "all"
              ? `/catalog${q ? `?q=${encodeURIComponent(q)}` : ""}`
              : `/catalog?super=${cat.id}${q ? `&q=${encodeURIComponent(q)}` : ""}`;

            return (
              <Link key={cat.id} href={queryUrl}>
                <div
                  className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-2xl cursor-pointer whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isActive
                      ? "bg-amber-400/20 text-amber-300 border border-amber-400/80 shadow-glow-amber scale-105"
                      : "bg-[#0B1622] text-[#9FB3C4] border border-[#1E3A50] hover:border-teal-400/50 hover:text-[#F4F1E8]"
                  }`}
                >
                  <span>{cat.label}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Regular Category Sub-pills (if categories exist) */}
      {visibleCategories.length > 0 && (
        <div className="flex items-center gap-2 custom-scrollbar-x pt-1.5 pb-2.5 px-1 text-xs">
          <Link
            href={`/catalog${activeSuper ? `?super=${activeSuper}` : ""}${q ? `${activeSuper ? "&" : "?"}q=${encodeURIComponent(q)}` : ""}`}
          >
            <div
              className={`px-3.5 py-1.5 rounded-full cursor-pointer transition-all whitespace-nowrap ${
                !category_id
                  ? "bg-teal-500/20 text-teal-300 border border-teal-400/50 font-bold"
                  : "bg-[#050B14] text-[#9FB3C4] border border-[#1E3A50] hover:text-[#F4F1E8]"
              }`}
            >
              Все подкатегории
            </div>
          </Link>
          {visibleCategories.map((cat) => {
            const isActive = category_id === cat.id;
            const href = `/catalog?category_id=${cat.id}${activeSuper ? `&super=${activeSuper}` : ""}${q ? `&q=${encodeURIComponent(q)}` : ""}`;
            return (
              <Link key={cat.id} href={href}>
                <div
                  className={`px-3.5 py-1.5 rounded-full cursor-pointer whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-teal-500/20 text-teal-300 border border-teal-400/50 font-bold"
                      : "bg-[#050B14] text-[#9FB3C4] border border-[#1E3A50] hover:text-[#F4F1E8]"
                  }`}
                >
                  {cat.name}
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Product Grid (2 cols mobile, 3 tablet, 4 desktop) */}
      {filteredProducts.length === 0 ? (
        <div className="flex min-h-[40vh] flex-col items-center justify-center text-center p-8 border border-dashed border-[#1E3A50] rounded-3xl bg-[#0B1622]/40">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#122234] text-amber-400 mb-4 border border-[#1E3A50]">
            <ShoppingBag className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-[#F4F1E8]">
            Ничего не найдено
          </h3>
          <p className="text-sm text-[#9FB3C4] max-w-sm mt-1">
            Попробуйте выбрать другое супер-направление или сбросить фильтры.
          </p>
          <Link href="/catalog" className="mt-4">
            <Badge variant="gold" className="px-4 py-1.5 cursor-pointer">
              Сбросить фильтры
            </Badge>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              categoryName={product.category_name}
              description={product.description}
              priceRub={product.price_rub}
              imageSeed={product.image_seed}
            />
          ))}
        </div>
      )}
    </div>
  );
}
