
import { z } from 'zod';
export const MultilangStringSchema = z.union([
  z.string(),
  z.object({
    en: z.string(),
  })
]);
export type MultilangStringType = z.infer<typeof MultilangStringSchema>;


export function getDisplayString (text: MultilangStringType | undefined): string{
  if (text === undefined) {
    return '';
  } else if (typeof text === 'string') {
    return text;
  } else if (typeof text === 'object' && text !== null && 'en' in text) {
    return text.en;
  }
  return '';
};
