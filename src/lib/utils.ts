import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { sha256 } from "js-sha256";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function hashPassword(password: string) {
  return sha256(password);
}
