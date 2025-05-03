"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useTranslations } from "next-intl";

export default function NotFoundPage() {
  const t = useTranslations("errors.404");
  const router = useRouter();
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex h-screen flex-col items-center justify-center text-center">
      <h1 className="mb-4 text-7xl font-bold">404</h1>
      <h2 className="mb-6 text-xl font-medium opacity-75">{t("message")}</h2>
      <p className="text-lg opacity-50">{t("message-redirect")}</p>
    </div>
  );
}
