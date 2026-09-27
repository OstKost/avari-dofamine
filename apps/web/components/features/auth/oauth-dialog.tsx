"use client";

import React, { useState } from "react";
import { X, Check, Shield, User, ArrowRight, Sparkles, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export type OAuthProvider = "google" | "yandex" | "apple";

interface OAuthDialogProps {
  isOpen: boolean;
  provider: OAuthProvider | null;
  onClose: () => void;
  onConfirm: (email: string, nickname: string, provider: OAuthProvider) => void;
  isLoading?: boolean;
}

export function OAuthDialog({
  isOpen,
  provider,
  onClose,
  onConfirm,
  isLoading = false,
}: OAuthDialogProps) {
  const [customEmail, setCustomEmail] = useState("");
  const [customName, setCustomName] = useState("");
  const [useCustom, setUseCustom] = useState(false);

  if (!isOpen || !provider) return null;

  const getProviderConfig = () => {
    switch (provider) {
      case "google":
        return {
          title: "Вход с помощью Google",
          subtitle: "Выберите аккаунт для перехода в Dofamine Market",
          brandColor: "from-blue-600 to-indigo-600",
          logo: (
            <svg className="h-6 w-6" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.3 8.9 5 12 5z" />
              <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z" />
              <path fill="#FBBC05" d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.7 0-1.1.2-1.9.4-2.7L1.6 6.4C.6 8.3 0 10.6 0 12s.6 3.7 1.6 5.6l3.7-2.9z" />
              <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.3-6.7-5.3L1.6 15.9C3.5 19.7 7.4 23 12 23z" />
            </svg>
          ),
          defaultAccounts: [
            { name: "Алексей Смирнов", email: "alex.smirnov@gmail.com", avatarBg: "bg-blue-500" },
            { name: "Dofamine Tester", email: "tester.dofamine@gmail.com", avatarBg: "bg-emerald-500" },
          ],
          defaultDomain: "@gmail.com",
        };
      case "yandex":
        return {
          title: "Яндекс ID",
          subtitle: "Разрешить доступ приложению Dofamine Market",
          brandColor: "from-red-600 to-amber-600",
          logo: (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FC3F1D] text-white font-black text-xs">
              Я
            </div>
          ),
          defaultAccounts: [
            { name: "Иван Иванов", email: "ivan.ivanov@yandex.ru", avatarBg: "bg-red-500" },
            { name: "Cyber Shopper", email: "cyber.shopper@yandex.ru", avatarBg: "bg-amber-500" },
          ],
          defaultDomain: "@yandex.ru",
        };
      case "apple":
        return {
          title: "Sign in with Apple",
          subtitle: "Используйте Apple ID для быстрого и безопасного входа",
          brandColor: "from-slate-700 to-slate-900",
          logo: (
            <svg className="h-6 w-6 fill-current text-white" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.77 1.05-1.83.93-2.9-.91.04-2 .6-2.65 1.37-.57.65-1.06 1.73-.93 2.77 1.02.08 2.03-.48 2.65-1.24z" />
            </svg>
          ),
          defaultAccounts: [
            { name: "Apple User (Private Relay)", email: "alex.apple@privaterelay.appleid.com", avatarBg: "bg-slate-500" },
            { name: "Avari Customer", email: "customer.apple@privaterelay.appleid.com", avatarBg: "bg-indigo-500" },
          ],
          defaultDomain: "@privaterelay.appleid.com",
        };
    }
  };

  const config = getProviderConfig();

  const handleSelectAccount = (email: string, name: string) => {
    onConfirm(email, name, provider);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail.trim()) return;
    let fullEmail = customEmail.trim();
    if (!fullEmail.includes("@")) {
      fullEmail += config.defaultDomain;
    }
    const name = customName.trim() || fullEmail.split("@")[0];
    onConfirm(fullEmail, name, provider);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-md rounded-3xl bg-[#0F172A] border border-slate-700 shadow-2xl overflow-hidden">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0B1120]">
          <div className="flex items-center gap-2.5">
            {config.logo}
            <span className="font-bold text-sm text-slate-200">{config.title}</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          <div className="text-center space-y-1">
            <h4 className="text-base font-bold text-white tracking-tight">
              {config.title}
            </h4>
            <p className="text-xs text-slate-400">
              {config.subtitle}
            </p>
          </div>

          {!useCustom ? (
            <div className="space-y-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-1">
                Выберите аккаунт для быстрого входа
              </span>
              
              <div className="space-y-2">
                {config.defaultAccounts.map((acc) => (
                  <button
                    key={acc.email}
                    disabled={isLoading}
                    onClick={() => handleSelectAccount(acc.email, acc.name)}
                    className="w-full flex items-center gap-3 p-3 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700 hover:border-amber-400/50 transition-all text-left group disabled:opacity-50"
                  >
                    <div className={`h-9 w-9 rounded-full ${acc.avatarBg} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                      {acc.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors truncate">
                        {acc.name}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">
                        {acc.email}
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setUseCustom(true)}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl bg-slate-900/40 hover:bg-slate-800/40 border border-dashed border-slate-700 hover:border-slate-500 transition-all text-left text-xs font-semibold text-slate-300 hover:text-white"
                >
                  <div className="h-9 w-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                    <User className="h-4 w-4" />
                  </div>
                  <span>Использовать другой аккаунт {provider === "google" ? "Google" : provider === "yandex" ? "Яндекс" : "Apple"}...</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleCustomSubmit} className="space-y-4">
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">
                    Email аккаунта ({config.defaultDomain})
                  </label>
                  <input
                    type="text"
                    required
                    autoFocus
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    placeholder={`myaccount${config.defaultDomain}`}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">
                    Ваше имя или никнейм
                  </label>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="Алексей"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setUseCustom(false)}
                  className="flex-1 rounded-xl text-xs"
                >
                  Назад
                </Button>
                <Button
                  type="submit"
                  variant="gold"
                  size="sm"
                  isLoading={isLoading}
                  className="flex-1 rounded-xl text-xs font-bold"
                >
                  Войти
                </Button>
              </div>
            </form>
          )}

          {/* Privacy note */}
          <div className="pt-2 border-t border-slate-800 flex items-center gap-2 text-[10px] text-slate-400">
            <Shield className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
            <span>
              Безопасная авторизация OAuth 2.0. Доступ запрашивается только к базовому профилю.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
