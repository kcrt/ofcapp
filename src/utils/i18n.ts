export function getDisplayString (text: string | { en: string } | undefined): string{
  if (typeof text === 'string') {
    return text;
  }
  if (typeof text === 'object' && text !== null && 'en' in text) {
    return text.en;
  }
  return '';
};
