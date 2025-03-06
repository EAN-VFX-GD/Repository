import { ar } from "./ar";
import { en } from "./en";

export const locales = {
  ar,
  en,
};

export type LocaleKey = keyof typeof ar;

export const currentLocale = "ar";

export function t(
  key: LocaleKey,
  params?: Record<string, string | number>,
): string {
  let text = locales[currentLocale][key] || key;

  if (params) {
    Object.entries(params).forEach(([paramKey, paramValue]) => {
      text = text.replace(`{${paramKey}}`, paramValue.toString());
    });
  }

  return text;
}
