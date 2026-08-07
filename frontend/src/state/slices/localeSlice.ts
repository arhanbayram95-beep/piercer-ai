import { StateCreator } from 'zustand';

export interface LanguageOption {
  code: string;
  englishName: string;
  nativeName: string;
  // A single representative country flag per language, purely as a visual
  // aid in the picker — languages don't map 1:1 to countries (Arabic,
  // Spanish, Portuguese especially), so this is a convention, not a claim
  // about where a language "belongs."
  flag: string;
}

// The 10 most-spoken languages worldwide by native speakers. This only
// controls the stored preference and the label shown in Settings — the
// app's UI copy itself is not yet translated (see AGENTS note in the
// LanguagePickerModal for scope).
export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', englishName: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'zh', englishName: 'Mandarin Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'hi', englishName: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'es', englishName: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', englishName: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'ar', englishName: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'bn', englishName: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩' },
  { code: 'pt', englishName: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'ru', englishName: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'ur', englishName: 'Urdu', nativeName: 'اردو', flag: '🇵🇰' },
];

export interface LocaleSlice {
  languageCode: string;
  setLanguageCode: (code: string) => void;
}

export const createLocaleSlice: StateCreator<LocaleSlice> = (set) => ({
  languageCode: 'en',
  setLanguageCode: (code) => set({ languageCode: code }),
});
