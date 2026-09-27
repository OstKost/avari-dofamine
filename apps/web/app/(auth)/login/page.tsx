"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { apiFetch, getOrCreateGuestId } from "@/lib/api/client";
import { ShieldCheck } from "lucide-react";

import { OAuthDialog, type OAuthProvider } from "@/components/features/auth/oauth-dialog";

const loginSchema = z.object({
  email: z.string().email("Введите корректный email адрес"),
  password: z.string().min(8, "Пароль должен содержать минимум 8 символов"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/";

  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeOAuthProvider, setActiveOAuthProvider] = useState<OAuthProvider | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const handleQuickSocial = (provider: OAuthProvider) => {
    setActiveOAuthProvider(provider);
  };

  const handleOAuthConfirm = async (email: string, nickname: string, provider: OAuthProvider) => {
    setServerError(null);
    setIsLoading(true);
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(`dofamine_auth_${provider}`, JSON.stringify({ email, nickname }));
      }

      await apiFetch("/auth/quick-login", {
        method: "POST",
        body: { email, nickname, provider },
      });

      const guestId = getOrCreateGuestId();
      if (guestId) {
        try {
          await apiFetch("/cart/merge", { method: "POST", body: { guest_id: guestId } });
        } catch {
          // ignore
        }
      }

      setActiveOAuthProvider(null);
      router.push(next);
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setServerError(err.message);
      } else {
        setServerError("Ошибка быстрого входа.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);
    setIsLoading(true);

    try {
      await apiFetch("/auth/login", {
        method: "POST",
        body: data,
      });

      const guestId = getOrCreateGuestId();
      if (guestId) {
        try {
          await apiFetch("/cart/merge", { method: "POST", body: { guest_id: guestId } });
        } catch {
          // ignore
        }
      }

      router.push(next);
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setServerError(err.message);
      } else {
        setServerError("Не удалось войти. Проверьте данные и попробуйте снова.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-2xl border-[#1E3A50] bg-[#0B1622] space-y-2">
      <CardHeader className="space-y-1 text-center pb-2">
        <CardTitle className="text-2xl text-[#F4F1E8]">Вход в аккаунт</CardTitle>
        <CardDescription className="text-[#9FB3C4]">
          Быстрый вход через соцсети или по почте
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {serverError && (
          <div className="rounded-xl bg-rose-950/40 border border-rose-500/30 p-3 text-sm text-rose-300">
            {serverError}
          </div>
        )}

        {/* 1-Click Social Auth Buttons */}
        <div className="space-y-2">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#5E7488] block text-center">
            Вход в 1 клик
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              disabled={isLoading}
              onClick={() => handleQuickSocial("google")}
              className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-2xl bg-[#0E1B29] border border-[#1E3A50] hover:border-amber-400/60 hover:bg-[#122234] transition-all group disabled:opacity-50"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.3 8.9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.7 0-1.1.2-1.9.4-2.7L1.6 6.4C.6 8.3 0 10.6 0 12s.6 3.7 1.6 5.6l3.7-2.9z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.3-6.7-5.3L1.6 15.9C3.5 19.7 7.4 23 12 23z"
                />
              </svg>
              <span className="text-xs font-bold text-[#F4F1E8] group-hover:text-amber-300">Google</span>
            </button>

            <button
              type="button"
              disabled={isLoading}
              onClick={() => handleQuickSocial("yandex")}
              className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-2xl bg-[#0E1B29] border border-[#1E3A50] hover:border-red-400/60 hover:bg-[#122234] transition-all group disabled:opacity-50"
            >
              <div className="flex h-4 w-4 items-center justify-center rounded-full bg-[#FC3F1D] text-white font-black text-[10px]">
                Я
              </div>
              <span className="text-xs font-bold text-[#F4F1E8] group-hover:text-red-300">Яндекс</span>
            </button>

            <button
              type="button"
              disabled={isLoading}
              onClick={() => handleQuickSocial("apple")}
              className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-2xl bg-[#0E1B29] border border-[#1E3A50] hover:border-teal-400/60 hover:bg-[#122234] transition-all group disabled:opacity-50"
            >
              <svg className="h-4 w-4 fill-current text-[#F4F1E8]" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.77 1.05-1.83.93-2.9-.91.04-2 .6-2.65 1.37-.57.65-1.06 1.73-.93 2.77 1.02.08 2.03-.48 2.65-1.24z" />
              </svg>
              <span className="text-xs font-bold text-[#F4F1E8] group-hover:text-teal-300">Apple</span>
            </button>
          </div>
        </div>

        <div className="relative flex items-center justify-center pt-2">
          <div className="w-full border-t border-[#1E3A50]" />
          <span className="absolute px-3 text-[10px] font-bold text-[#5E7488] bg-[#0B1622] uppercase">
            или вход по паролю
          </span>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">
          <Input
            label="Email"
            type="email"
            placeholder="user@example.com"
            error={errors.email?.message}
            {...register("email")}
          />

          <Input
            label="Пароль"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register("password")}
          />

          <Button type="submit" variant="reward" className="w-full text-base font-bold py-3 rounded-xl shadow-lg shadow-amber-500/20" isLoading={isLoading}>
            Войти
          </Button>
        </form>

        <div className="p-3 rounded-xl bg-[#050B14] border border-[#1E3A50] flex items-start gap-2 text-[11px] text-[#9FB3C4]">
          <ShieldCheck className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
          <span>Мы сохраняем только уникальный Email и выбранный никнейм. Без персональных данных!</span>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-2 pt-0">
        <p className="text-center text-xs text-[#9FB3C4]">
          Нет аккаунта?{" "}
          <Link href="/register" className="font-semibold text-amber-400 hover:text-amber-300 underline underline-offset-2">
            Зарегистрироваться
          </Link>
        </p>
      </CardFooter>

      <OAuthDialog
        isOpen={Boolean(activeOAuthProvider)}
        provider={activeOAuthProvider}
        isLoading={isLoading}
        onClose={() => setActiveOAuthProvider(null)}
        onConfirm={handleOAuthConfirm}
      />
    </Card>
  );
}
