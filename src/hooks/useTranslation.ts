
import { en, TranslationKey } from '@/i18n/en';

export function useTranslation() {
  const t = (key: TranslationKey): string => {
    return en[key] || key;
  };

  return { t };
}
