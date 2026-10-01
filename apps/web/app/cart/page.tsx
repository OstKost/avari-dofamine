"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Trash2,
  Plus,
  Minus,
  Sparkles,
  MapPin,
  ShoppingBag,
  AlertCircle,
  Tag,
  Gift,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiFetch, isUnauthorizedError } from "@/lib/api/client";
import { useCurrency } from "@/lib/context/currency-context";
import { getProductImageUrl } from "@/lib/utils/product-image";
import { trackRemoveFromCart, trackBeginCheckout } from "@/lib/analytics/tracker";

import { QuickAuthModal } from "@/components/features/auth/quick-auth-modal";

interface CartItem {
  product_id: string;
  category_id: string;
  category_name?: string;
  name: string;
  price_rub: string;
  image_seed?: string;
  quantity: number;
  subtotal_rub: string;
}

interface PickupPoint {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  distance_meters: number;
}

interface Cart {
  items: CartItem[];
  pickup_point?: PickupPoint;
  total_quantity: number;
  total_price_rub: string;
  fixed_order_cost: string;
}

interface PromoDiscount {
  code: string;
  percent: number;
  label: string;
}

const KNOWN_PROMOS: Record<string, PromoDiscount> = {
  DOFAMINE: { code: "DOFAMINE", percent: 20, label: "Скидка -20% на весь заказ" },
  BOOST: { code: "BOOST", percent: 30, label: "Скидка -30% для фанатов Boosty" },
  SUPER50: { code: "SUPER50", percent: 50, label: "Супер-скидка -50%" },
  MAX70: { code: "MAX70", percent: 70, label: "Максимальная скидка -70%" },
  FREE100: { code: "FREE100", percent: 100, label: "Полная скидка -100% (0 ₽)" },
  AVARI: { code: "AVARI", percent: 50, label: "Спецкод Avari -50%" },
};

function getPromoForCode(codeStr: string): PromoDiscount {
  const clean = codeStr.trim().toUpperCase();
  if (KNOWN_PROMOS[clean]) {
    return KNOWN_PROMOS[clean];
  }
  let hash = 0;
  for (let i = 0; i < clean.length; i++) {
    hash = (hash << 5) - hash + clean.charCodeAt(i);
    hash |= 0;
  }
  const percent = 10 + (Math.abs(hash) % 7) * 10;
  return {
    code: clean,
    percent,
    label: `Промокод «${clean}» активирован (-${percent}%)`,
  };
}

export default function CartPage() {
  const router = useRouter();
  const { formatPrice } = useCurrency();
  const [cart, setCart] = useState<Cart | null>(null);
  const [currentUser, setCurrentUser] = useState<{ id: string; email: string; nickname?: string } | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Promo code state
  const [promoInput, setPromoInput] = useState("DOFAMINE");
  const [appliedPromo, setAppliedPromo] = useState<PromoDiscount | null>(KNOWN_PROMOS.DOFAMINE);
  const [promoFeedback, setPromoFeedback] = useState<{ message: string; isError?: boolean } | null>({
    message: "Промокод «DOFAMINE» успешно применен (-20%)",
  });

  const handleApplyPromo = () => {
    const trimmed = promoInput.trim().toUpperCase();
    if (!trimmed) {
      setAppliedPromo(null);
      setPromoFeedback(null);
      return;
    }

    const promo = getPromoForCode(trimmed);
    setAppliedPromo(promo);
    setPromoFeedback({
      message: `${promo.label}!`,
    });
  };

  const handleRemovePromo = () => {
    setPromoInput("");
    setAppliedPromo(null);
    setPromoFeedback(null);
  };

  const checkAuth = useCallback(async () => {
    try {
      const res = await apiFetch<{ user: { id: string; email: string; nickname?: string } }>("/auth/me");
      if (res?.user) {
        setCurrentUser(res.user);
        return res.user;
      }
    } catch {
      setCurrentUser(null);
    }
    return null;
  }, []);

  const fetchCart = useCallback(async () => {
    try {
      const data = await apiFetch<Cart>("/cart");
      setCart(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
    fetchCart();
  }, [checkAuth, fetchCart]);

  const handleUpdateQuantity = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemoveItem(productId);
      return;
    }

    setIsUpdating(true);
    try {
      const updated = await apiFetch<Cart>(`/cart/items/${productId}`, {
        method: "PATCH",
        body: { quantity: newQuantity },
      });
      setCart(updated);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveItem = async (productId: string) => {
    const itemToRemove = cart?.items.find((i) => i.product_id === productId);
    setIsUpdating(true);
    try {
      const updated = await apiFetch<Cart>(`/cart/items/${productId}`, {
        method: "DELETE",
      });
      if (itemToRemove) {
        trackRemoveFromCart(
          {
            item_id: itemToRemove.product_id,
            item_name: itemToRemove.name,
            price: itemToRemove.price_rub,
          },
          itemToRemove.quantity
        );
      }
      setCart(updated);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const executeCheckout = async (targetCart: Cart | null = cart) => {
    const activeCart = targetCart || cart;
    if (!activeCart?.pickup_point) {
      router.push("/onboarding");
      return;
    }

    setIsCheckingOut(true);
    setError(null);

    try {
      if (activeCart?.items) {
        trackBeginCheckout(
          activeCart.items.map((i) => ({
            item_id: i.product_id,
            item_name: i.name,
            price: i.price_rub,
            quantity: i.quantity,
          })),
          10.0
        );
      }

      const res = await apiFetch<{ id: string }>("/orders", {
        method: "POST",
      });

      router.push(`/orders/${res.id}`);
    } catch (err: unknown) {
      if (isUnauthorizedError(err)) {
        setIsAuthModalOpen(true);
        return;
      }
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Не удалось оформить заказ.");
      }
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleCheckout = async () => {
    // 1. Проверяем авторизацию
    let user = currentUser;
    if (!user) {
      user = await checkAuth();
    }

    if (!user) {
      // Пользователь не авторизован — открываем быстрое окно входа/регистрации
      setIsAuthModalOpen(true);
      return;
    }

    await executeCheckout();
  };

  const handleAuthSuccess = async (user: { id: string; email: string; nickname?: string }) => {
    setCurrentUser(user);
    // Обновляем корзину после мерджа
    try {
      const updatedCart = await apiFetch<Cart>("/cart");
      setCart(updatedCart);
      await executeCheckout(updatedCart);
    } catch {
      await fetchCart();
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-20 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-400 mx-auto mb-4" />
        <p className="text-sm text-[#9FB3C4]">Загрузка корзины...</p>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto max-w-md px-4 py-20 text-center space-y-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#0B1622] border border-[#1E3A50] text-amber-400 mx-auto shadow-glow-amber">
          <ShoppingBag className="h-10 w-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-[#F4F1E8]">
            Корзина пуста
          </h2>
          <p className="text-sm text-[#9FB3C4]">
            Выберите любые товары из каталога — бесплатное оформление и моментальный дофамин гарантированы!
          </p>
        </div>
        <Link href="/catalog" className="inline-block">
          <Button size="lg" variant="glow" className="rounded-2xl px-8">
            Перейти в каталог
          </Button>
        </Link>
      </div>
    );
  }

  // Calculate real totals
  const rawSubtotalRub = cart.items.reduce((sum, item) => {
    const itemSub = parseFloat(item.subtotal_rub) || (parseFloat(item.price_rub) * item.quantity);
    return sum + (isNaN(itemSub) ? 0 : itemSub);
  }, 0);

  const discountPercent = appliedPromo ? appliedPromo.percent : 0;
  const discountAmountRub = (rawSubtotalRub * discountPercent) / 100;
  const finalTotalRub = Math.max(0, rawSubtotalRub - discountAmountRub);

  return (
    <div className="container mx-auto max-w-5xl px-4 sm:px-6 py-8 space-y-6 sm:space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#F4F1E8] tracking-tight">
            Корзина ({cart.total_quantity})
          </h1>
          <p className="text-xs text-[#9FB3C4] mt-0.5">
            Товары готовы к оформлению
          </p>
        </div>
        <Link href="/catalog" className="text-xs sm:text-sm font-bold text-amber-400 hover:text-amber-300 transition-colors">
          + Добавить ещё
        </Link>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-2xl bg-red-500/10 border border-red-500/30 p-4 text-sm text-red-300">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Tip Banner with Promo Codes */}
      <div className="rounded-2xl bg-gradient-to-r from-amber-400/15 via-teal-500/10 to-amber-400/15 p-4 border border-amber-400/30 flex items-start sm:items-center justify-between gap-3 shadow-glow-amber">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400/20 text-amber-300 flex-shrink-0">
            <Gift className="h-5 w-5 animate-bounce" />
          </div>
          <p className="text-xs sm:text-sm text-[#F4F1E8] font-medium leading-relaxed">
            💡 <strong className="text-amber-300">Подсказка:</strong> используйте промокод{" "}
            <code className="px-1.5 py-0.5 rounded bg-[#050B14] border border-amber-400/40 text-amber-300 font-mono font-bold cursor-pointer hover:bg-amber-400/20" onClick={() => { setPromoInput("DOFAMINE"); setAppliedPromo(KNOWN_PROMOS.DOFAMINE); setPromoFeedback({ message: "Промокод «DOFAMINE» применен (-20%)" }); }}>DOFAMINE</code> (-20%),{" "}
            <code className="px-1.5 py-0.5 rounded bg-[#050B14] border border-amber-400/40 text-amber-300 font-mono font-bold cursor-pointer hover:bg-amber-400/20" onClick={() => { setPromoInput("BOOST"); setAppliedPromo(KNOWN_PROMOS.BOOST); setPromoFeedback({ message: "Промокод «BOOST» применен (-30%)" }); }}>BOOST</code> (-30%) или{" "}
            <code className="px-1.5 py-0.5 rounded bg-[#050B14] border border-amber-400/40 text-amber-300 font-mono font-bold cursor-pointer hover:bg-amber-400/20" onClick={() => { setPromoInput("MAX70"); setAppliedPromo(KNOWN_PROMOS.MAX70); setPromoFeedback({ message: "Промокод «MAX70» применен (-70%)" }); }}>MAX70</code> (-70%) для скидки до 70%!
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-3.5">
          {cart.items.map((item) => {
            const imageUrl = getProductImageUrl(item.image_seed || item.product_id, item.name, item.category_name);
            const itemSubtotal = parseFloat(item.subtotal_rub) || (parseFloat(item.price_rub) * item.quantity);

            return (
              <Card key={item.product_id} className="border-[#1E3A50] bg-[#0B1622]/90 shadow-sm overflow-hidden rounded-2xl hover:border-teal-400/40 transition-all">
                <CardContent className="p-4 sm:p-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                    <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-2xl overflow-hidden bg-[#050B14] border border-[#1E3A50] flex-shrink-0">
                      <Image
                        src={imageUrl}
                        alt={item.name}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                    <div className="space-y-1 min-w-0">
                      <h4 className="font-bold text-sm sm:text-base text-[#F4F1E8] truncate">
                        {item.name}
                      </h4>
                      {item.category_name && (
                        <p className="text-[11px] text-[#9FB3C4] truncate">{item.category_name}</p>
                      )}
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-extrabold text-[#F4F1E8]">
                          {formatPrice(itemSubtotal)}
                        </span>
                        {item.quantity > 1 && (
                          <span className="text-[11px] text-[#5E7488]">
                            ({formatPrice(item.price_rub)} / шт)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
                    {/* Stepper pill */}
                    <div className="flex items-center gap-1 border border-[#1E3A50] rounded-full p-1 bg-[#0E1B29]">
                      <button
                        onClick={() => handleUpdateQuantity(item.product_id, item.quantity - 1)}
                        disabled={isUpdating}
                        className="h-7 w-7 rounded-full flex items-center justify-center hover:bg-[#1E3A50] text-[#9FB3C4] hover:text-[#F4F1E8] disabled:opacity-50 transition-colors"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-6 text-center text-xs sm:text-sm font-bold text-[#F4F1E8]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(item.product_id, item.quantity + 1)}
                        disabled={isUpdating}
                        className="h-7 w-7 rounded-full flex items-center justify-center hover:bg-[#1E3A50] text-[#9FB3C4] hover:text-[#F4F1E8] disabled:opacity-50 transition-colors"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => handleRemoveItem(item.product_id)}
                      disabled={isUpdating}
                      className="p-1.5 text-[#5E7488] hover:text-red-400 transition-colors"
                      title="Удалить из корзины"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Sidebar Summary & Promo & Pickup point */}
        <div className="space-y-5">
          {/* Pickup Point Card */}
          <Card className="border-[#1E3A50] bg-[#0B1622]/90 shadow-sm rounded-2xl">
            <CardHeader className="p-4 sm:p-5 pb-2">
              <CardTitle className="text-sm font-bold flex items-center justify-between text-[#F4F1E8]">
                <span>Пункт выдачи</span>
                <Link href="/onboarding" className="text-xs font-bold text-teal-400 hover:text-teal-300">
                  {cart.pickup_point ? "Сменить" : "Выбрать"}
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-5 pt-0">
              {cart.pickup_point ? (
                <div className="flex items-start gap-3 p-3 bg-[#0E1B29] border border-[#1E3A50] rounded-xl">
                  <MapPin className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-xs sm:text-sm text-[#F4F1E8]">
                      {cart.pickup_point.name}
                    </h5>
                    <p className="text-[11px] text-[#9FB3C4]">
                      ~{Math.round(cart.pickup_point.distance_meters)}м от вас (2-4 мин пешком)
                    </p>
                  </div>
                </div>
              ) : (
                <Link href="/onboarding">
                  <Button variant="outline" className="w-full text-xs rounded-xl gap-2 border-teal-400/40 text-teal-300">
                    <MapPin className="h-4 w-4 text-teal-400" />
                    <span>Выбрать ближайший ПВЗ</span>
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>

          {/* Promo Code Input Card */}
          <Card className="border-[#1E3A50] bg-[#0B1622]/90 shadow-sm rounded-2xl">
            <CardContent className="p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#F4F1E8] flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5 text-amber-400" />
                  <span>Промокод на скидку</span>
                </span>
                {appliedPromo && (
                  <button
                    onClick={handleRemovePromo}
                    className="text-[11px] text-[#5E7488] hover:text-red-400 transition-colors"
                  >
                    Сбросить
                  </button>
                )}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleApplyPromo();
                  }}
                  placeholder="DOFAMINE / BOOST / MAX70"
                  className="flex-1 px-3 py-2 text-xs font-mono uppercase rounded-xl bg-[#050B14] border border-[#1E3A50] text-[#F4F1E8] focus:border-amber-400 focus:outline-none"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleApplyPromo}
                  className="text-xs rounded-xl border-[#1E3A50] text-[#F4F1E8] hover:bg-[#1E3A50]"
                >
                  Применить
                </Button>
              </div>

              {promoFeedback && (
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-300">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                  <span>{promoFeedback.message}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Summary & Free Order Checkout Card */}
          <Card className="border-[#1E3A50] bg-[#0B1622]/90 shadow-sm rounded-2xl">
            <CardContent className="p-5 sm:p-6 space-y-4">
              <div className="space-y-2.5 text-xs sm:text-sm text-[#9FB3C4]">
                <div className="flex justify-between">
                  <span>Товары ({cart.total_quantity} шт.)</span>
                  <span className="font-semibold text-[#F4F1E8]">{formatPrice(rawSubtotalRub)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Доставка в ПВЗ</span>
                  <span className="text-teal-400 font-semibold">Бесплатно (0.00)</span>
                </div>

                {appliedPromo && discountAmountRub > 0 && (
                  <div className="flex justify-between text-amber-300 font-bold">
                    <span>Скидка ({appliedPromo.percent}%)</span>
                    <span>- {formatPrice(discountAmountRub)}</span>
                  </div>
                )}

                <div className="border-t border-[#1E3A50] pt-3 flex justify-between items-center text-base sm:text-lg font-black text-[#F4F1E8]">
                  <span>Итого к оплате</span>
                  <span className="text-2xl font-black text-amber-400 drop-shadow-[0_0_8px_rgba(242,184,75,0.4)]">
                    {formatPrice(finalTotalRub)}
                  </span>
                </div>
              </div>

              <div className="pt-2 space-y-2.5">
                <Button
                  size="lg"
                  variant="gold"
                  className="w-full text-base font-black rounded-2xl gap-2 h-13 shadow-glow-amber-lg py-3.5"
                  isLoading={isCheckingOut}
                  onClick={handleCheckout}
                >
                  <ShoppingBag className="h-5 w-5" />
                  <span>Оформить заказ бесплатно</span>
                </Button>

                <p className="text-center text-[11px] font-bold text-teal-300/90 flex items-center justify-center gap-1">
                  <Sparkles className="h-3.5 w-3.5 text-teal-400 animate-spin" />
                  <span>Симуляция курьера стартует сразу после оформления</span>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Boosty Promo Support Box */}
          <div className="p-4 rounded-2xl bg-amber-400/5 border border-amber-400/20 space-y-2 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-amber-300">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>Нравится проект?</span>
            </div>
            <p className="text-[#9FB3C4] text-[11px] leading-relaxed">
              Dofamine Market полностью бесплатен для пользователей. Вы можете поддержать автора на Boosty!
            </p>
            <a
              href="https://boosty.to/avari"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-amber-300 font-bold hover:underline pt-1"
            >
              <span>💛 Поддержать на Boosty</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>

      <QuickAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}

