"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Package, User, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api/client";
import { useCurrency } from "@/lib/context/currency-context";

interface UserStats {
  total_orders: number;
  current_streak_days: number;
}

export function Header() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [cartCount, setCartCount] = useState<number>(0);
  const { currency, setCurrency } = useCurrency();

  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    apiFetch<UserStats>(`/orders/stats?tz=${encodeURIComponent(tz)}`)
      .then((data) => {
        if (data) {
          setStats(data);
          setIsLoggedIn(true);
        }
      })
      .catch(() => {
        setStats(null);
        setIsLoggedIn(false);
      });

    apiFetch<{ total_quantity?: number }>("/cart")
      .then((data) => setCartCount(data?.total_quantity || 0))
      .catch(() => null);
  }, []);

  const streakDays = isLoggedIn && stats ? stats.current_streak_days : 0;
  const totalOrders = isLoggedIn && stats ? stats.total_orders : 0;
  const level = isLoggedIn ? Math.max(1, Math.floor(totalOrders / 3) + 1) : 0;
  const progressPercent = isLoggedIn ? Math.min(100, Math.max(15, (totalOrders % 3) * 33 + 33)) : 0;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#1E3A50]/80 bg-[#050B14]/85 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 gap-2 sm:gap-4">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-[#0B1622] border border-[#1E3A50] shadow-sm shadow-amber-500/10 group-hover:scale-105 group-hover:border-amber-400/50 transition-all overflow-hidden p-1">
            <Image
              src="/logo-detailed.png"
              alt="Avari Dofamine Logo"
              width={36}
              height={36}
              className="object-contain"
              priority
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base sm:text-lg font-black tracking-tight text-[#F4F1E8] group-hover:text-amber-300 transition-colors">
                Avari
              </span>
              <span className="text-base sm:text-lg font-black tracking-tight bg-gradient-to-r from-[#F2B84B] to-[#FFD37A] bg-clip-text text-transparent">
                Dofamine
              </span>
            </div>
            <span className="text-[10px] font-semibold text-[#9FB3C4] block -mt-1 tracking-wider uppercase">
              Market · Instant Joy
            </span>
          </div>
        </Link>

        {/* Gamification Level & XP Bar (Desktop / Tablet) - Links to Profile */}
        <Link
          href="/profile"
          className="hidden md:flex items-center gap-4 px-3.5 py-1.5 rounded-full bg-[#0B1622]/80 hover:bg-[#0B1622] border border-[#1E3A50] hover:border-amber-400/40 transition-all cursor-pointer group"
          title={isLoggedIn ? "Перейти в профиль" : "Войдите в профиль"}
        >
          <div className="flex items-center gap-2 text-xs font-bold text-[#F4F1E8]">
            <span className="text-[#9FB3C4] group-hover:text-[#F4F1E8] transition-colors">Ур.</span>
            <span className="text-amber-300 font-black">{level}</span>
            <div className="w-16 lg:w-24 h-2 rounded-full bg-[#050B14] overflow-hidden border border-[#1E3A50]/60 p-0.5">
              <div
                className={`h-full rounded-full bg-gradient-to-r from-[#F2B84B] to-[#FFD37A] transition-all duration-500 shadow-glow-amber ${
                  progressPercent === 0 ? "opacity-0" : "opacity-100"
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs font-black pl-2 border-l border-[#1E3A50]">
            <Flame className={`h-4 w-4 ${isLoggedIn && streakDays > 0 ? "fill-amber-400 text-amber-500 animate-pulse" : "text-[#5E7488]"}`} />
            <span className={isLoggedIn && streakDays > 0 ? "text-amber-400" : "text-[#5E7488]"}>{streakDays}</span>
          </div>
        </Link>

        {/* Navigation links & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <nav className="hidden lg:flex items-center gap-4 text-sm font-medium text-[#9FB3C4] mr-1">
            <Link href="/catalog" className="hover:text-amber-300 transition-colors">
              Каталог
            </Link>
            <Link href="/about" className="hover:text-amber-300 transition-colors">
              О проекте
            </Link>
            <Link href="/orders" className="hover:text-amber-300 transition-colors flex items-center gap-1.5">
              <Package className="h-4 w-4" />
              Заказы
            </Link>
          </nav>

          {/* Currency Switcher Toggle */}
          <button
            type="button"
            onClick={() => setCurrency(currency === "RUB" ? "USD" : "RUB")}
            className="flex items-center p-0.5 rounded-xl bg-[#0B1622] border border-[#1E3A50] hover:border-amber-400/40 text-xs font-bold transition-colors cursor-pointer select-none"
            title={`Текущая валюта: ${currency === "RUB" ? "Рубли (₽)" : "Доллары ($)"}. Нажмите, чтобы переключить.`}
          >
            <span
              className={`w-6 h-6 flex items-center justify-center rounded-lg transition-all text-xs font-black ${
                currency === "RUB"
                  ? "bg-amber-400/20 text-amber-300 shadow-sm border border-amber-400/40"
                  : "text-[#9FB3C4] hover:text-[#F4F1E8] border border-transparent"
              }`}
            >
              ₽
            </span>
            <span
              className={`w-6 h-6 flex items-center justify-center rounded-lg transition-all text-xs font-black ${
                currency === "USD"
                  ? "bg-amber-400/20 text-amber-300 shadow-sm border border-amber-400/40"
                  : "text-[#9FB3C4] hover:text-[#F4F1E8] border border-transparent"
              }`}
            >
              $
            </span>
          </button>

          <Link href="/cart">
            <Button variant="gold" size="sm" className="gap-2 relative rounded-xl font-bold">
              <ShoppingBag className="h-4 w-4 text-[#050B14]" />
              <span className="hidden xs:inline">Корзина</span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#FC3F1D] text-white text-[10px] font-black shadow-md">
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>

          <Link href="/profile">
            <Button variant="secondary" size="sm" className="gap-1.5 rounded-xl border-[#1E3A50]">
              <div className="h-5 w-5 rounded-full bg-gradient-to-tr from-amber-400 to-teal-400 flex items-center justify-center p-0.5">
                <div className="h-full w-full rounded-full bg-[#0B1622] flex items-center justify-center">
                  <User className="h-3 w-3 text-amber-300" />
                </div>
              </div>
              <span className="hidden sm:inline text-xs font-bold text-[#F4F1E8]">Профиль</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
