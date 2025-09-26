
import { z } from 'zod';
import {getLocales} from 'expo-localization';
import translationsData from '@/appdata/translations.json';

export const MultilangStringSchema = z.union([
  z.string(),
  z.object({
    en: z.string(),    // require at least English
  }).catchall(z.string()),
]);
export type MultilangString = z.infer<typeof MultilangStringSchema>;

const TranslationsSchema = z.record( z.string().startsWith('@'), z.object({}).catchall(z.string()) );
export const translations = TranslationsSchema.parse(translationsData);

let currentLanguage: string | undefined = undefined;

// Initialize language based on system locale
function initializeLanguage() {
  if (currentLanguage) return; // Already initialized
  const systemLocale = getLocales()[0];
  currentLanguage = systemLocale?.languageTag || 'en';
}

// Initialize on module load
initializeLanguage();

export function setDisplayLanguage (lang: string) {
  currentLanguage = lang || 'en';
}
export function getDisplayLanguage (): string {
  return currentLanguage || 'en';
}
export function getSupportedLanguages(): string[] {
  return Object.keys(translations['@LanguageName'] || {"en": ""});
}

export function getDisplayString (text: MultilangString | undefined, language?: string): string {
  const targetLanguage = language || currentLanguage || 'en';
  const baseLanguage = targetLanguage.split('-')[0];

  if (text === undefined) {
    return '';
  } else if (typeof text === 'string') {
    // Check if it's a translation key (starts with @)
    if (text.startsWith('@') && text in translations) {
      const translation = translations[text as keyof typeof translations];
      if (targetLanguage in translation) {
        return translation[targetLanguage as keyof typeof translation];
      } else if (baseLanguage in translation) {
        return translation[baseLanguage as keyof typeof translation];
      } else {
        if ('en' in translation) {
          return translation['en'];
        } else {
          // return the key without '@' if English translation is not available
          return text.substring(1);
        }
      }
    } else {
      // Not a valid translation key, warn and return as is
      console.warn(`Translation key "${text}" not found.`);
      return text;
    }
  } else if (text === null) {
    return '';
  } else if (typeof text === 'object') {
    // First try exact match
    if (targetLanguage in text) {
      return text[targetLanguage as keyof typeof text];
    } else if (baseLanguage in text) {
      return text[baseLanguage as keyof typeof text];
    } else {
      return text['en'];
    }
  }
  return '';
};
