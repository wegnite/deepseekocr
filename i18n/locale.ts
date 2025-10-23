import { Pathnames } from "next-intl/routing";

export const locales = ["en", "zh", "ko", "es"];

export const localeNames: any = {
  en: "English",
  zh: "中文",
  ko: "한국어",
  es: "Español",
};

export const defaultLocale = "en";

export const localePrefix = "as-needed";

export const localeDetection =
  process.env.NEXT_PUBLIC_LOCALE_DETECTION === "true";

export const pathnames = {
  en: {
    "privacy-policy": "/privacy-policy",
    "terms-of-service": "/terms-of-service",
  },
} satisfies Pathnames<typeof locales>;
