import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Zap,
  ShieldCheck,
  Flame,
  Gift,
  Laptop,
  Crown,
  Shirt,
  Pizza,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HeroParallax } from "@/components/features/home/HeroParallax";

const SUPER_CATEGORIES = [
  {
    id: "dopamine",
    title: "Допаминовая лавка",
    icon: "🎪",
    lucideIcon: Gift,
    badge: "Хит предвкушения",
    description: "Секретные боксы, антистресс, артефакты радости и чистый концентрированный эндорфин.",
    href: "/catalog?super=dopamine",
    gradient: "from-[#F2B84B]/20 via-[#FFD37A]/10 to-transparent",
    borderGlow: "hover:border-amber-400/60 hover:shadow-glow-amber",
    accentColor: "text-amber-400",
    bgAccent: "bg-amber-400/10 border-amber-400/30",
  },
  {
    id: "electronics",
    title: "Электроника",
    icon: "⚡",
    lucideIcon: Zap,
    badge: "Гаджеты & Аудио",
    description: "Смартфоны, футуристичные девайсы, наушники с шумоподавлением и умные часы.",
    href: "/catalog?super=electronics",
    gradient: "from-blue-500/20 via-teal-500/10 to-transparent",
    borderGlow: "hover:border-teal-400/60 hover:shadow-glow-teal",
    accentColor: "text-teal-400",
    bgAccent: "bg-teal-400/10 border-teal-400/30",
  },
  {
    id: "computers",
    title: "Компьютеры & Железо",
    icon: "💻",
    lucideIcon: Laptop,
    badge: "Cyber & Hardware",
    description: "Игровые станции, мощные видеокарты, быстрые процессоры и механические клавиатуры.",
    href: "/catalog?super=computers",
    gradient: "from-purple-500/20 via-indigo-500/10 to-transparent",
    borderGlow: "hover:border-purple-400/60 hover:shadow-glow-purple",
    accentColor: "text-purple-400",
    bgAccent: "bg-purple-400/10 border-purple-400/30",
  },
  {
    id: "brands",
    title: "Бренды & Премиум",
    icon: "👑",
    lucideIcon: Crown,
    badge: "PineApple & Balenciago",
    description: "Люксовые дропы PineApple, Pileson, Balenciago, золото, часы и премиальный стиль.",
    href: "/catalog?super=brands",
    gradient: "from-amber-400/25 via-yellow-500/15 to-transparent",
    borderGlow: "hover:border-yellow-400/70 hover:shadow-glow-amber-lg",
    accentColor: "text-amber-300",
    bgAccent: "bg-yellow-400/15 border-yellow-400/40",
  },
  {
    id: "clothing",
    title: "Одежда & Стритвир",
    icon: "👕",
    lucideIcon: Shirt,
    badge: "Nikey, Adibas & Мерч",
    description: "Культовые кроссовки Nikey, костюмы Adibas, оверсайз худи и свежий уличный дроп.",
    href: "/catalog?super=clothing",
    gradient: "from-rose-500/20 via-pink-500/10 to-transparent",
    borderGlow: "hover:border-rose-400/60 hover:shadow-glow-rose",
    accentColor: "text-rose-400",
    bgAccent: "bg-rose-400/10 border-rose-400/30",
  },
  {
    id: "food",
    title: "Еда & Рестораны",
    icon: "🍕",
    lucideIcon: Pizza,
    badge: "Шашлык, Роллы, Бургеры",
    description: "Горячий шашлык с углей, сочные бургеры, сеты филадельфия и хрустящая пицца.",
    href: "/catalog?super=food",
    gradient: "from-orange-500/20 via-amber-500/10 to-transparent",
    borderGlow: "hover:border-orange-400/60 hover:shadow-glow-orange",
    accentColor: "text-orange-400",
    bgAccent: "bg-orange-400/10 border-orange-400/30",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col items-center">
      {/* Interactive Parallax Hero with Floating Popular Brand Items */}
      <HeroParallax />

      {/* 6 Super-Categories Grid */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-10 space-y-6">
        <div className="text-center space-y-2 max-w-2xl mx-auto mb-8">
          <Badge variant="teal" className="text-xs px-3.5 py-1 uppercase tracking-wider">
            6 Супер-Категорий
          </Badge>
          <h2 className="text-2xl sm:text-4xl font-black text-[#F4F1E8] tracking-tight">
            Выберите направление настроения
          </h2>
          <p className="text-sm text-[#9FB3C4]">
            От концентрированного антистресса до брендов, стритвира и сочной еды с доставкой.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {SUPER_CATEGORIES.map((cat) => {
            const IconComp = cat.lucideIcon;
            return (
              <Link key={cat.id} href={cat.href} className="group block">
                <Card
                  className={`h-full border-[#1E3A50] bg-[#0B1622]/90 bg-gradient-to-br ${cat.gradient} shadow-md rounded-3xl p-6 transition-all duration-300 group-hover:-translate-y-1.5 ${cat.borderGlow} flex flex-col justify-between`}
                >
                  <CardContent className="p-0 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${cat.bgAccent} border shadow-inner group-hover:scale-110 transition-transform duration-300 text-2xl`}>
                        {cat.icon}
                      </div>
                      <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-[#050B14]/80 border border-[#1E3A50] text-[#9FB3C4] group-hover:text-[#F4F1E8] transition-colors">
                        {cat.badge}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-xl font-black text-[#F4F1E8] group-hover:text-amber-300 transition-colors flex items-center gap-2">
                        <span>{cat.title}</span>
                      </h3>
                      <p className="text-xs sm:text-sm text-[#9FB3C4] leading-relaxed">
                        {cat.description}
                      </p>
                    </div>
                  </CardContent>

                  <div className="pt-5 mt-4 border-t border-[#1E3A50]/60 flex items-center justify-between">
                    <span className={`text-xs font-extrabold ${cat.accentColor} flex items-center gap-1.5`}>
                      <IconComp className="h-4 w-4" />
                      <span>Смотреть товары</span>
                    </span>
                    <div className="h-8 w-8 rounded-xl bg-[#050B14] border border-[#1E3A50] flex items-center justify-center text-[#9FB3C4] group-hover:text-amber-300 group-hover:border-amber-400/50 group-hover:translate-x-1 transition-all">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          <Card className="border-[#1E3A50] bg-[#0B1622]/90 shadow-sm rounded-3xl hover:border-amber-400/50 hover:shadow-glow-amber transition-all">
            <CardContent className="p-6 space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400/15 text-amber-300 border border-amber-400/30">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-[#F4F1E8]">
                Бесплатные заказы
              </h3>
              <p className="text-xs sm:text-sm text-[#9FB3C4] leading-relaxed">
                Выбирайте любые синтетические товары из каталога — оформляйте заказ в один клик без реальных списаний.
              </p>
            </CardContent>
          </Card>

          <Card className="border-[#1E3A50] bg-[#0B1622]/90 shadow-sm rounded-3xl hover:border-teal-400/50 hover:shadow-glow-teal transition-all">
            <CardContent className="p-6 space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-400/15 text-teal-300 border border-teal-400/30">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-[#F4F1E8]">
                Интерактивная доставка 100-500м
              </h3>
              <p className="text-xs sm:text-sm text-[#9FB3C4] leading-relaxed">
                Синтетические ПВЗ в шаговой доступности и живой таймер-трекинг движения курьера прямо на экране.
              </p>
            </CardContent>
          </Card>

          <Card className="border-[#1E3A50] bg-[#0B1622]/90 shadow-sm rounded-3xl hover:border-amber-400/50 hover:shadow-glow-amber transition-all">
            <CardContent className="p-6 space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400/15 text-amber-300 border border-amber-400/30">
                <Flame className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-[#F4F1E8]">
                Стрики, уровни и XP
              </h3>
              <p className="text-xs sm:text-sm text-[#9FB3C4] leading-relaxed">
                Сохраняйте ежедневный стрик, повышайте уровень аккаунта и открывайте коллекцию достижений.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
