/* eslint-disable */

import { getRequestConfig } from "next-intl/server";
import { headers } from "next/headers";

export const locales = ["en-US", "de-DE"] as const;
export const defaultLocale = "en-US";

export default getRequestConfig(async () => {
  const preferredLanguage = (await headers()).get("accept-language");
  const userLocale = preferredLanguage
    ? preferredLanguage.split(",")[0]
    : "en-US";
  const findLocale =
    locales.find((value) => value == userLocale) ?? defaultLocale;
  const locale = String(findLocale);

  return {
    locale,
    messages: (await import(`~/messages/${locale}/index.ts`)).default,
  };
});
