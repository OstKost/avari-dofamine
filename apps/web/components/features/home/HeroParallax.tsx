"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, ArrowRight, HeartHandshake, ShieldCheck, Zap, Flame, Star, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ParallaxOffset {
  x: number;
  y: number;
}

export function HeroParallax() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState<ParallaxOffset>({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let animationFrameId: number;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Normalized between -1 and 1
      targetX = Math.max(-1, Math.min(1, (e.clientX - centerX) / (rect.width / 2)));
      targetY = Math.max(-1, Math.min(1, (e.clientY - centerY) / (rect.height / 2)));
    };

    const handleMouseLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    // Smooth lerp update loop
    const updateMotion = () => {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      setOffset({ x: currentX, y: currentY });
      animationFrameId = requestAnimationFrame(updateMotion);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    animationFrameId = requestAnimationFrame(updateMotion);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full overflow-hidden py-16 sm:py-24 md:py-28 select-none"
    >
      {/* 1. Deep Ambient Radial Glows (Layer 0 - Slowest Parallax) */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-teal-500/10 rounded-full blur-[140px] pointer-events-none transition-transform duration-700 ease-out"
        style={{
          transform: `translate(calc(-50% + ${offset.x * -25}px), calc(-50% + ${offset.y * -25}px))`,
        }}
      />
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-amber-500/15 rounded-full blur-[110px] pointer-events-none transition-transform duration-700 ease-out"
        style={{
          transform: `translate(calc(-50% + ${offset.x * 35}px), calc(-50% + ${offset.y * 35}px))`,
        }}
      />
      <div
        className="absolute top-2/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-rose-500/10 rounded-full blur-[120px] pointer-events-none transition-transform duration-700 ease-out"
        style={{
          transform: `translate(calc(-50% + ${offset.x * 20}px), calc(-50% + ${offset.y * 20}px))`,
        }}
      />

      {/* 2. Floating Background Sparkle Dots */}
      <div
        className="absolute top-16 left-[15%] w-2 h-2 rounded-full bg-amber-400/60 blur-[1px] animate-pulse pointer-events-none"
        style={{ transform: `translate(${offset.x * -40}px, ${offset.y * -40}px)` }}
      />
      <div
        className="absolute top-32 right-[18%] w-3 h-3 rounded-full bg-teal-400/50 blur-[1px] animate-pulse pointer-events-none"
        style={{ transform: `translate(${offset.x * 45}px, ${offset.y * 45}px)` }}
      />
      <div
        className="absolute bottom-20 left-[22%] w-2.5 h-2.5 rounded-full bg-rose-400/50 blur-[1px] animate-pulse pointer-events-none"
        style={{ transform: `translate(${offset.x * -30}px, ${offset.y * -30}px)` }}
      />
      <div
        className="absolute bottom-28 right-[25%] w-2 h-2 rounded-full bg-amber-300/70 blur-[1px] animate-pulse pointer-events-none"
        style={{ transform: `translate(${offset.x * 35}px, ${offset.y * 35}px)` }}
      />

      {/* ========================================================================= */}
      {/* 3. Floating Popular Parody Brand Products (Phone, MacBook, Dyson Hair Dryer) */}
      {/* ========================================================================= */}

      {/* ITEM 1: PineApple Phone 16 Pro (Left side float) */}
      <div
        className="hidden lg:block absolute left-4 xl:left-12 top-24 z-20 transition-transform duration-500 ease-out"
        style={{
          transform: `translate(${offset.x * -45}px, ${offset.y * -40}px)`,
        }}
      >
        <Link href="/catalog?super=electronics" className="block group">
          <div className="animate-float-slow">
            <div className="relative w-64 p-4 rounded-3xl bg-[#0B1622]/90 backdrop-blur-xl border border-amber-400/40 hover:border-amber-400 shadow-2xl shadow-amber-500/15 group-hover:shadow-glow-amber-lg transition-all duration-300 transform -rotate-3 group-hover:rotate-0 group-hover:scale-105">
              {/* Floating Top Badge */}
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400/20 border border-amber-400/40 text-amber-300 flex items-center gap-1">
                  <span>⚡ Хит года</span>
                </span>
                <span className="flex items-center text-amber-400 text-xs font-bold gap-0.5">
                  <Star className="h-3 w-3 fill-amber-400" />
                  <span>5.0</span>
                </span>
              </div>

              {/* Product Visual Container (Phone Mockup) */}
              <div className="relative h-32 w-full rounded-2xl bg-gradient-to-b from-[#152436] to-[#0A131D] border border-[#1E3A50] overflow-hidden p-2 flex items-center justify-center group-hover:border-amber-400/40 transition-colors">
                {/* Phone screen bezel */}
                <div className="relative w-20 h-28 rounded-xl bg-[#050B14] border-2 border-amber-400/50 shadow-inner flex flex-col items-center justify-between p-1.5 overflow-hidden">
                  {/* Dynamic Island pill */}
                  <div className="w-6 h-1.5 rounded-full bg-black border border-white/10" />
                  {/* Screen Content Graphic */}
                  <div className="text-center space-y-0.5 my-auto">
                    <span className="text-2xl block">🍍</span>
                    <span className="text-[8px] font-black text-amber-300 tracking-tight block">PineOS 18</span>
                  </div>
                  {/* Home bar */}
                  <div className="w-8 h-0.5 rounded-full bg-white/40" />
                </div>

                {/* Floating shine accent */}
                <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-amber-400/10 rounded-full blur-xl pointer-events-none" />
              </div>

              {/* Product Info */}
              <div className="mt-3 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-[#F4F1E8] group-hover:text-amber-300 transition-colors">
                    PineApple Phone 16 Pro
                  </h4>
                </div>
                <p className="text-[11px] text-[#9FB3C4]">256GB · Night Titanium</p>
                <div className="pt-2 flex items-center justify-between border-t border-[#1E3A50]/70">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xs font-black text-amber-400">10.00 ₽</span>
                    <span className="text-[10px] text-teal-400 font-bold">0 ₽ по промо</span>
                  </div>
                  <span className="text-[10px] font-bold text-amber-300 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                    В лавку →
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* ITEM 2: PineBook Pro M3 Max (Right side float) */}
      <div
        className="hidden lg:block absolute right-4 xl:right-12 top-20 z-20 transition-transform duration-500 ease-out"
        style={{
          transform: `translate(${offset.x * 50}px, ${offset.y * -35}px)`,
        }}
      >
        <Link href="/catalog?super=computers" className="block group">
          <div className="animate-float-reverse">
            <div className="relative w-68 sm:w-72 p-4 rounded-3xl bg-[#0B1622]/90 backdrop-blur-xl border border-teal-400/40 hover:border-teal-400 shadow-2xl shadow-teal-500/15 group-hover:shadow-glow-teal-lg transition-all duration-300 transform rotate-3 group-hover:rotate-0 group-hover:scale-105">
              {/* Floating Top Badge */}
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-teal-400/20 border border-teal-400/40 text-teal-300 flex items-center gap-1">
                  <span>💻 M3 Max · 36GB</span>
                </span>
                <span className="flex items-center text-amber-400 text-xs font-bold gap-0.5">
                  <Star className="h-3 w-3 fill-amber-400" />
                  <span>4.9</span>
                </span>
              </div>

              {/* Product Visual Container (Laptop Mockup) */}
              <div className="relative h-32 w-full rounded-2xl bg-gradient-to-b from-[#102433] to-[#0A1620] border border-[#1E3A50] overflow-hidden p-2 flex flex-col items-center justify-center group-hover:border-teal-400/40 transition-colors">
                {/* Laptop Screen Open */}
                <div className="relative w-36 h-22 rounded-t-lg bg-[#050B14] border border-teal-400/40 p-1 flex flex-col items-center justify-center shadow-lg">
                  <div className="flex items-center gap-1 text-[9px] text-teal-300 font-mono font-bold bg-teal-950/80 px-2 py-0.5 rounded">
                    <span>const joy = 100%;</span>
                  </div>
                  <span className="text-xl block mt-0.5">💻</span>
                </div>
                {/* Laptop Base Keyboard */}
                <div className="w-44 h-2.5 rounded-b-md bg-[#182C3D] border-t border-teal-400/30 shadow-md flex justify-center items-center">
                  <div className="w-8 h-1 rounded bg-black/50" />
                </div>

                {/* Ambient glow in corner */}
                <div className="absolute -left-6 -bottom-6 w-20 h-20 bg-teal-400/15 rounded-full blur-xl pointer-events-none" />
              </div>

              {/* Product Info */}
              <div className="mt-3 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-[#F4F1E8] group-hover:text-teal-300 transition-colors">
                    PineBook Pro 16&quot;
                  </h4>
                </div>
                <p className="text-[11px] text-[#9FB3C4]">Space Black · 1TB SSD</p>
                <div className="pt-2 flex items-center justify-between border-t border-[#1E3A50]/70">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xs font-black text-amber-400">10.00 ₽</span>
                    <span className="text-[10px] text-teal-400 font-bold">0 ₽ по промо</span>
                  </div>
                  <span className="text-[10px] font-bold text-teal-300 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                    В лавку →
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* ITEM 3: Pileson Supersonic Glow Hair Dryer (Bottom-right float) */}
      <div
        className="hidden xl:block absolute right-6 xl:right-16 bottom-20 xl:bottom-28 z-30 transition-transform duration-500 ease-out"
        style={{
          transform: `translate(${offset.x * 35}px, ${offset.y * 30}px)`,
        }}
      >
        <Link href="/catalog?super=brands" className="block group">
          <div className="animate-float-gentle">
            <div className="relative w-64 p-4 rounded-3xl bg-[#0B1622]/90 backdrop-blur-xl border border-rose-400/40 hover:border-rose-400 shadow-2xl shadow-rose-500/15 group-hover:shadow-glow-rose transition-all duration-300 transform -rotate-2 group-hover:rotate-0 group-hover:scale-105">
              {/* Floating Top Badge */}
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-400/20 border border-rose-400/40 text-rose-300 flex items-center gap-1">
                  <span>👑 Pileson Haircare</span>
                </span>
                <span className="flex items-center text-amber-400 text-xs font-bold gap-0.5">
                  <Star className="h-3 w-3 fill-amber-400" />
                  <span>5.0</span>
                </span>
              </div>

              {/* Product Visual Container (Dyson Supersonic Parody Mockup) */}
              <div className="relative h-28 w-full rounded-2xl bg-gradient-to-b from-[#24131E] to-[#120A10] border border-[#1E3A50] overflow-hidden p-2 flex items-center justify-center group-hover:border-rose-400/40 transition-colors">
                <div className="flex items-center gap-2">
                  {/* Dyson Ring Head */}
                  <div className="relative w-12 h-12 rounded-full border-4 border-rose-400 bg-[#050B14] flex items-center justify-center shadow-glow-rose">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-rose-500 to-amber-300 animate-spin" />
                  </div>
                  {/* Dryer Handle */}
                  <div className="w-12 h-4 rounded-r-lg bg-gradient-to-r from-rose-400 to-[#1E3A50] border border-rose-400/30" />
                  <span className="text-xl">✨</span>
                </div>

                <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-rose-500/15 rounded-full blur-xl pointer-events-none" />
              </div>

              {/* Product Info */}
              <div className="mt-3 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-[#F4F1E8] group-hover:text-rose-300 transition-colors">
                    Pileson Supersonic Glow
                  </h4>
                </div>
                <p className="text-[11px] text-[#9FB3C4]">Ионизация · Салонный фен</p>
                <div className="pt-2 flex items-center justify-between border-t border-[#1E3A50]/70">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xs font-black text-amber-400">10.00 ₽</span>
                    <span className="text-[10px] text-teal-400 font-bold">0 ₽ по промо</span>
                  </div>
                  <span className="text-[10px] font-bold text-rose-300 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                    В лавку →
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* ========================================================================= */}
      {/* 4. Center Content (Emblem, Badge, Title, CTA) - Stable without Parallax */}
      {/* ========================================================================= */}
      <div className="container relative z-10 mx-auto max-w-4xl px-4 sm:px-6 text-center space-y-6">
        {/* Super-Premium Animated Aura & Emblem */}
        <div className="relative inline-flex items-center justify-center group mb-1">
          {/* Multi-color Rotating Living Aura Halo */}
          <div className="absolute inset-0 m-auto w-44 h-44 sm:w-52 sm:h-52 rounded-full bg-gradient-to-tr from-[#F2B84B]/40 via-[#54ACBF]/30 to-[#FFD37A]/50 blur-2xl animate-spin-slow pointer-events-none opacity-85 group-hover:opacity-100 transition-opacity duration-700" />
          
          {/* Soft Breathing Ambient Pulse Glow */}
          <div className="absolute inset-0 m-auto w-36 h-36 rounded-full bg-amber-400/30 blur-xl animate-pulse pointer-events-none" />

          {/* Subtle Expanding Energy Ripple Rings */}
          <div className="absolute inset-0 m-auto w-32 h-32 rounded-full border border-amber-400/30 animate-ping opacity-20 pointer-events-none" style={{ animationDuration: "3s" }} />

          {/* Magical Twinkling Fairy Dust Particles */}
          <div className="absolute -top-2 left-6 w-2 h-2 rounded-full bg-amber-300 shadow-[0_0_10px_#FFD37A] animate-pulse pointer-events-none" />
          <div className="absolute top-8 -right-3 w-1.5 h-1.5 rounded-full bg-teal-300 shadow-[0_0_8px_#54ACBF] animate-ping pointer-events-none opacity-80" style={{ animationDuration: "3s" }} />
          <div className="absolute -bottom-2 right-8 w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_10px_#F2B84B] animate-pulse pointer-events-none" style={{ animationDelay: "1s" }} />
          <div className="absolute bottom-6 -left-3 w-1.5 h-1.5 rounded-full bg-rose-300 shadow-[0_0_8px_#FB7185] animate-pulse pointer-events-none" style={{ animationDelay: "1.5s" }} />
          <div className="absolute top-1/2 -right-5 w-1 h-1 rounded-full bg-white shadow-[0_0_6px_#FFF] animate-ping pointer-events-none" style={{ animationDuration: "2.5s" }} />
          <div className="absolute top-3 left-1/4 w-1 h-1 rounded-full bg-amber-200 shadow-[0_0_6px_#FFD37A] animate-pulse pointer-events-none" />

          {/* Emblem Card Base */}
          <div className="relative z-10 p-3.5 sm:p-4 rounded-3xl bg-[#0B1622]/95 backdrop-blur-2xl border border-amber-400/50 shadow-[0_0_35px_rgba(242,184,75,0.35)] group-hover:shadow-[0_0_50px_rgba(242,184,75,0.6)] group-hover:border-amber-300 transition-all duration-500 cursor-pointer">
            <Image
              src="/logo-detailed.png"
              alt="Avari Dofamine Emblem"
              width={88}
              height={88}
              className="object-contain drop-shadow-[0_0_20px_rgba(242,184,75,0.5)] group-hover:scale-105 transition-transform duration-500"
              priority
            />
          </div>
        </div>

        {/* Top Feature Pill */}
        <div className="flex items-center justify-center gap-2">
          <Badge variant="gold" className="px-4 py-1 text-xs gap-1.5 shadow-glow-amber">
            <span>Уютный маркетплейс · Быстрая симуляция доставки</span>
          </Badge>
        </div>

        {/* Main Cozy Heading */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-[#F4F1E8] max-w-3xl mx-auto leading-tight">
          Уютный уголок{" "}
          <span className="bg-gradient-to-r from-[#F2B84B] via-[#FFD37A] to-[#F2B84B] bg-clip-text text-transparent">
            радости
          </span>{" "}
          и тёплых эмоций в каждом заказе
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-lg sm:text-xl text-[#9FB3C4] max-w-2xl mx-auto leading-relaxed">
          Добро пожаловать в место приятного предвкушения: выбирайте душевные вещи из 6 направлений, оформляйте заказы бесплатно и наблюдайте, как курьер везёт вам хорошее настроение.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link href="/catalog">
            <Button size="lg" variant="glow" className="gap-2 text-base px-8 h-12 rounded-2xl shadow-glow-amber-lg font-black">
              Открыть каталог
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
          <a
            href="https://boosty.to/avari"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="lg" variant="outline" className="text-base h-12 rounded-2xl border-amber-400/40 text-amber-300 hover:bg-amber-400/10 gap-2 font-bold">
              <HeartHandshake className="h-5 w-5 text-amber-400" />
              <span>Поддержать на Boosty</span>
            </Button>
          </a>
        </div>

        {/* Mobile Floating Brand Chips Row (for smaller screens) */}
        <div className="flex lg:hidden items-center justify-center gap-2 pt-4 flex-wrap text-xs">
          <Link href="/catalog?super=electronics">
            <div className="px-3 py-1.5 rounded-full bg-[#0B1622] border border-amber-400/40 text-[#F4F1E8] flex items-center gap-1.5 shadow-sm">
              <span>📱</span>
              <span className="font-bold text-amber-300">PineApple 16 Pro</span>
              <span className="text-[10px] text-[#9FB3C4]">10 ₽</span>
            </div>
          </Link>
          <Link href="/catalog?super=computers">
            <div className="px-3 py-1.5 rounded-full bg-[#0B1622] border border-teal-400/40 text-[#F4F1E8] flex items-center gap-1.5 shadow-sm">
              <span>💻</span>
              <span className="font-bold text-teal-300">PineBook Pro</span>
              <span className="text-[10px] text-[#9FB3C4]">10 ₽</span>
            </div>
          </Link>
          <Link href="/catalog?super=brands">
            <div className="px-3 py-1.5 rounded-full bg-[#0B1622] border border-rose-400/40 text-[#F4F1E8] flex items-center gap-1.5 shadow-sm">
              <span>💨</span>
              <span className="font-bold text-rose-300">Фен Pileson</span>
              <span className="text-[10px] text-[#9FB3C4]">10 ₽</span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
