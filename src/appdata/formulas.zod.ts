import { z } from 'zod';

const MultilangStringSchema = z.union([
  z.string(),
  z.object({
    en: z.string(),
  })
]);

const FoodTypeSchema = z.enum([
  "egg",
  "milk",
  "wheat",
  "peanut",
  "soy",
  "walnut",
  "hazelnut",
  "almond",
  "cashew",
  "pistachio",
  "fish",
  "sesame",
  "shellfish",
  "legume",
  "other"
]);

const InputItemSchema = z.tuple([z.string(), z.number()]);

const InputItemSexSchema = z.object({
  name: z.string(),
  type: z.literal("sex")
});
const InputItemAgeSchema = z.object({
  name: z.string(),
  type: z.literal("age"),
  min: z.number().optional(),
  max: z.number().optional()
});
const InputItemBooleanSchema = z.object({
  name: z.string(),
  type: z.literal("boolean"),
  caption: z.string()
});
const InputItemTotalIgESchema = z.object({
  name: z.string(),
  type: z.literal("IgE"),
});
const InputItemSpecificIgESchema = z.object({
  name: z.string(),
  type: z.literal("sIgE"),
  caption: z.string(),
  mode: z.literal("primary").optional(),
});

const InputSchema = z.union([
  InputItemSexSchema,
  InputItemAgeSchema,
  InputItemBooleanSchema,
  InputItemTotalIgESchema,
  InputItemSpecificIgESchema
]);

const ResultSchema = z.object({
  mode: z.string(),
  intercept: z.number(),
  beta: z.record(z.string(), z.number()),
});

const OutputSchema = z.object({
  mode: z.string(),
  result: ResultSchema,
});

const FormulaSchema = z.object({
  name: z.string(),
  title: MultilangStringSchema,
  shorttitle: z.string(),
  info: z.string(),
  foodtype: FoodTypeSchema,
  references: z.array(z.string()),
  inputs: z.array(InputSchema),
  output: OutputSchema,
});

export const FormulasSchema = z.array(FormulaSchema);

// Example usage (optional, for testing or demonstration):
/*
import formulasData from './formulas.json';

try {
  const parsedFormulas = FormulasSchema.parse(formulasData);
  console.log("Successfully parsed formulas:", parsedFormulas);
} catch (error) {
  console.error("Error parsing formulas.json:", error);
}
*/
