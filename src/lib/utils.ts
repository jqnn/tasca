import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { sha256 } from "js-sha256";
import { toast } from "sonner";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function hashPassword(password: string) {
  return sha256(password);
}

export function escapeLDAPSearchFilter(value: string): string {
  return value
    .replace(/\\/g, "\\5c")
    .replace(/\*/g, "\\2a")
    .replace(/\(/g, "\\28")
    .replace(/\)/g, "\\29")
    .replace(/\0/g, "\\00");
}

export function showToast(title: string, description: string | null = null) {
  toast(title, {
    description: description ?? null,
    duration: 2500,
  });
}

export function showErrorToast() {
  showToast(
    "Unerwarteter Fehler",
    "Bitte versuche es später erneut oder kontaktiere einen Administrator.",
  );
}
