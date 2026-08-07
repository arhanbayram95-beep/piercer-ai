import { useAppStore } from '../state/useAppStore';
import { translate, TranslationKey } from './translations';

export function useTranslation() {
  const languageCode = useAppStore((s) => s.languageCode);
  return (key: TranslationKey, vars?: Record<string, string | number>) => translate(key, languageCode, vars);
}
