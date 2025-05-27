import formulas from './formulas';
import formulasData from '@/appdata/formulas.json';
import { FormulasSchema } from '@/appdata/formulas.zod';

describe('formulas', () => {
  it('should not be empty', () => {
    expect(formulas.length).toBeGreaterThan(0);
  });

  it('should have the same number of elements as the raw data', () => {
    const parsedRawData = FormulasSchema.parse(formulasData);
    expect(formulas.length).toBe(parsedRawData.length);
  });

  it('should have unique IDs for all formulas', () => {
    const names = formulas.map(f => f.name);
    const uniqueNames = new Set(names);
    expect(names.length).toBe(uniqueNames.size);
  });
});
