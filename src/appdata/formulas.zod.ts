import { z } from 'zod';
import { MultilangStringSchema } from '@/utils/i18n';

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
  caption: MultilangStringSchema
});
const InputItemTotalIgESchema = z.object({
  name: z.string(),
  type: z.literal("IgE"),
});
const InputItemSpecificIgESchema = z.object({
  name: z.string(),
  type: z.literal("sIgE"),
  caption: MultilangStringSchema,
  mode: z.literal("primary").optional(),
});
const InputItemProteinDoseSchema = z.object({
  name: z.string(),
  type: z.literal("proteindose"),
  caption: MultilangStringSchema,
  items: z.array(z.tuple([z.string(), z.number()]))
});
const InputItemNumeric = z.object({
  name: z.string(),
  type: z.literal("numeric"),
  caption: MultilangStringSchema,
  unit: MultilangStringSchema.optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  step: z.number().optional(),
});

const InputItemSchema = z.union([
  InputItemSexSchema,
  InputItemAgeSchema,
  InputItemBooleanSchema,
  InputItemTotalIgESchema,
  InputItemSpecificIgESchema,
  InputItemProteinDoseSchema,
  InputItemNumeric
]);

export type InputItemType = z.infer<typeof InputItemSchema>;

const CalcItemSchema = z.object({
  name: z.string(),
  expression: z.string(),
});

const ResultSchema = z.object({
  mode: z.string(),
  graph: z.literal("hide").optional(),
  intercept: z.number(),
  beta: z.record(z.string(), z.number()),
});

const OutputSchema = z.object({
  mode: z.enum(["ofc", "ed", "formula"]),
  result: ResultSchema,
});

const FormulaSchema = z.object({
  name: z.string(),
  title: MultilangStringSchema,
  shorttitle: MultilangStringSchema,
  info: z.string().optional(),
  note: MultilangStringSchema.optional(),
  foodtype: FoodTypeSchema,
  references: z.record(z.string(), z.string()),
  inputs: z.array(InputItemSchema),
  calc: z.array(CalcItemSchema).optional(),
  output: OutputSchema,
});

export const FormulasSchema = z.array(FormulaSchema);
