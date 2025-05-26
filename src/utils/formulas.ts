import { z } from 'zod';
import formulasData from '@/appdata/formulas.json';
import { FormulasSchema } from '@/appdata/formulas.zod';

export type Formula = z.infer<typeof FormulasSchema>[number];

// Validate and parse the data
let parsedFormulas: Formula[] = [];
try {
  parsedFormulas = FormulasSchema.parse(formulasData);
} catch (error) {
  console.error("Error parsing formulas.json in formulas.ts:", error);
}

const formulas: Formula[] = parsedFormulas;
export default formulas;