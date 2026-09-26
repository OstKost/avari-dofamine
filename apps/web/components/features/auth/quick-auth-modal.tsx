"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, ShieldCheck, X, ArrowRight, UserCheck, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiFetch, getOrCreateGuestId } from "@/lib/api/client";

import { OAuthDialog, type OAuthProvider } from "./oauth-dialog";

interface QuickAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: { id: string; email: string; nickname?: string }) => void;
}

export function QuickAuthModal({ isOpen, onClose, onSuccess }: QuickAuthModalProps) {
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeOAuthProvider, setActiveOAuthProvider] = useState<OAuthProvider | null>(null);

  if (!isOpen) return null;

  const handleQuickLogin = async (userEmail: string, userNickname: string, provider: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const resp = await apiFetch<{
        user: { id: string; email: string; nickname?: string };
        access_token: string;
      }>("/auth/quick-login", {
        method: "POST",
        body: {
          email: userEmail,
          nickname: userNickname || undefined,
          provider,
        },
      });

      // Merge guest cart to user cart
      const guestId = getOrCreateGuestId();
      if (guestId) {
        try {
          await apiFetch("/cart/merge", {
            method: "POST",
            body: { guest_id: guestId },
          });
        } catch {
          // Ignore merge error if guest cart was already empty
        }
      }

      onSuccess(resp.user);
      setActiveOAuthProvider(null);
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Не удалось войти в аккаунт");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialClick = (provider: OAuthProvider) => {
    setActiveOAuthProvider(provider);
  };

  const handleOAuthConfirm = (selectedEmail: string, selectedNick: string, provider: OAuthProvider) => {
    handleQuickLogin(selectedEmail, selectedNick, provider);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Пожалуйста, укажите email");
      return;
    }
    handleQuickLogin(email.trim(), nickname.trim(), "quick_email");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#050B14]/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-gradient-to-b from-[#0E1B29] to-[#070E18] border border-[#1E3A50] shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Glow Effects */}
        <div className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 h-32 w-64 rounded-full bg-amber-400/15 blur-3xl" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#9FB3C4] hover:text-[#F4F1E8] hover:bg-[#1E3A50]/50 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="space-y-2 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-bold">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Оформление заказа</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-[#F4F1E8] tracking-tight">
            Быстрая авторизация
          </h3>
          <p className="text-xs sm:text-sm text-[#9FB3C4] max-w-sm mx-auto">
            Для оформления заказа выберите быстрый вход или введите Email и любой никнейм.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 font-medium">
            {error}
          </div>
        )}

        {/* Fast Social Auth Buttons (Google, Apple, Yandex) */}
        <div className="space-y-3">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#5E7488] block text-center">
            Вход в 1 клик через соцсети
          </span>

          <div className="grid grid-cols-3 gap-2.5">
            {/* Google */}
            <button
              type="button"
              disabled={isLoading}
              onClick={() => handleSocialClick("google")}
              className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-[#0B1622] border border-[#1E3A50] hover:border-amber-400/60 hover:bg-[#122234] transition-all group disabled:opacity-50"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
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

            {/* Yandex */}
            <button
              type="button"
              disabled={isLoading}
              onClick={() => handleSocialClick("yandex")}
              className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-[#0B1622] border border-[#1E3A50] hover:border-red-400/60 hover:bg-[#122234] transition-all group disabled:opacity-50"
            >
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FC3F1D] text-white font-black text-xs">
                Я
              </div>
              <span className="text-xs font-bold text-[#F4F1E8] group-hover:text-red-300">Яндекс</span>
            </button>

            {/* Apple */}
            <button
              type="button"
              disabled={isLoading}
              onClick={() => handleSocialClick("apple")}
              className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-[#0B1622] border border-[#1E3A50] hover:border-teal-400/60 hover:bg-[#122234] transition-all group disabled:opacity-50"
            >
              <svg className="h-5 w-5 fill-current text-[#F4F1E8]" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.77 1.05-1.83.93-2.9-.91.04-2 .6-2.65 1.37-.57.65-1.06 1.73-.93 2.77 1.02.08 2.03-.48 2.65-1.24z" />
              </svg>
              <span className="text-xs font-bold text-[#F4F1E8] group-hover:text-teal-300">Apple</span>
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="w-full border-t border-[#1E3A50]" />
          <span className="absolute px-3 text-[11px] font-bold text-[#5E7488] bg-[#0E1B29] uppercase">
            или укажите свой Email и Никнейм
          </span>
        </div>

        {/* Custom Email & Nickname Form */}
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-[#9FB3C4] mb-1 flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-amber-400" />
                <span>Электронная почта (Email) *</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-[#050B14] border border-[#1E3A50] text-[#F4F1E8] placeholder:text-[#5E7488] focus:border-amber-400 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#9FB3C4] mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-teal-400" />
                  <span>Никнейм или имя (на ваш выбор)</span>
                </span>
                <span className="text-[10px] text-[#5E7488]">Необязательно</span>
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="CyberDopamine / Алекс"
                className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-[#050B14] border border-[#1E3A50] text-[#F4F1E8] placeholder:text-[#5E7488] focus:border-teal-400 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="gold"
            isLoading={isLoading}
            className="w-full rounded-2xl py-3 font-black text-sm gap-2 shadow-glow-amber"
          >
            <UserCheck className="h-4 w-4" />
            <span>Войти и оформить заказ</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>

        {/* Privacy Assurance Box */}
        <div className="p-3.5 rounded-2xl bg-[#0B1622] border border-[#1E3A50] flex items-start gap-2.5">
          <ShieldCheck className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
          <p className="text-[11px] text-[#9FB3C4] leading-relaxed">
            <strong className="text-[#F4F1E8]">Приватность гарантирована:</strong> мы сохраняем только Email для доступа к вашим заказам и произвольный никнейм. Никаких паспортных данных, телефонов и слежки.
          </p>
        </div>

        {/* Regular Login Link */}
        <div className="text-center text-xs text-[#9FB3C4]">
          <span>Есть пароль от аккаунта? </span>
          <Link href="/login" onClick={onClose} className="text-amber-300 font-bold hover:underline">
            Войти с паролем
          </Link>
        </div>
      </div>

      <OAuthDialog
        isOpen={Boolean(activeOAuthProvider)}
        provider={activeOAuthProvider}
        isLoading={isLoading}
        onClose={() => setActiveOAuthProvider(null)}
        onConfirm={handleOAuthConfirm}
      />
    </div>
  );
}
