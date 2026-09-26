import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type Currency = "RUB" | "USD";

export function formatCurrency(
  amountRub: string | number,
  currency: Currency = "RUB"
): string {
  const num = typeof amountRub === "string" ? parseFloat(amountRub) : amountRub;
  if (isNaN(num)) return currency === "RUB" ? "0 ₽" : "$0.00";

  if (currency === "USD") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num * 0.01);
  }

  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

export function formatPrice(
  priceRub: string | number,
  currency: Currency = "RUB"
): string {
  return formatCurrency(priceRub, currency);
}

