"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type Currency = "RUB" | "USD";

interface CurrencyContextValue {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  toggleCurrency: () => void;
  formatPrice: (priceRub: string | number) => string;
  rate: number; // 1 RUB = 0.01 USD
}

const CurrencyContext = createContext<CurrencyContextValue | undefined>(undefined);

const USD_RATE = 0.01; // 100 RUB = 1 USD

export function formatCurrencyValue(priceRub: string | number, currency: Currency): string {
  const num = typeof priceRub === "string" ? parseFloat(priceRub) : priceRub;
  if (isNaN(num)) {
    return currency === "RUB" ? "0 ₽" : "$0.00";
  }

  if (currency === "USD") {
    const usdAmount = num * USD_RATE;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(usdAmount);
  }

  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("RUB");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("dofamine_currency") as Currency | null;
      if (saved === "RUB" || saved === "USD") {
        setCurrencyState(saved);
      }
    } catch {
      // Ignore localStorage errors in SSR / private mode
    }
  }, []);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    try {
      localStorage.setItem("dofamine_currency", c);
    } catch {
      // Ignore
    }
  };

  const toggleCurrency = () => {
    setCurrency(currency === "RUB" ? "USD" : "RUB");
  };

  const formatPrice = (priceRub: string | number) => {
    return formatCurrencyValue(priceRub, currency);
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        toggleCurrency,
        formatPrice,
        rate: currency === "USD" ? USD_RATE : 1,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency(): CurrencyContextValue {
  const context = useContext(CurrencyContext);
  if (!context) {
    // Fallback for SSR or usage outside provider
    return {
      currency: "RUB",
      setCurrency: () => {},
      toggleCurrency: () => {},
      formatPrice: (val) => formatCurrencyValue(val, "RUB"),
      rate: 1,
    };
  }
  return context;
}
