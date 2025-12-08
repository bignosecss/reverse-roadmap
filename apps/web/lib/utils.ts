import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date to Chinese format: 2025年12月8日 星期一 18:36
 * Uses Intl.DateTimeFormat for proper localization, zero-padding, and timezone handling
 */
export function formatDate(date: Date | string | number): string {
  const formatter = new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long", // "12月"
    day: "numeric",
    weekday: "long", // "星期一"
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const now = new Date(date);
  const formatted = formatter.format(now);

  return formatted;
}
