import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getLocalDateTimeInputValue = (date: Date) => {
  const yearStr = date.getFullYear().toString();
  const monthStr = (date.getMonth() + 1).toString().padStart(2, "0");
  const dateStr = date.getDate().toString().padStart(2, "0");
  const hourStr = date.getHours().toString().padStart(2, "0");
  const minStr = date.getMinutes().toString().padStart(2, "0");

  return `${yearStr}-${monthStr}-${dateStr}T${hourStr}:${minStr}`;
};
