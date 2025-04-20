import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { sha256 } from "js-sha256";
import { toast } from "sonner";
import type { InstanceStatus, Role } from "@prisma/client";

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

export function showErrorToast(message?: string) {
  showToast(
    "Unerwarteter Fehler",
    message ?? "Bitte versuche es später erneut oder kontaktiere einen Administrator.",
  );
}

export function beautifyInstanceStatus(status: InstanceStatus) {
  if (status == "COMPLETED") return "Abgeschlossen";
  return "Offen";
}

export function beautifyRole(role: Role) {
  if (role == "OPERATOR") return "Operator";
  if (role == "ADMINISTRATOR") return "Administrator";
  return "Benutzer";
}
