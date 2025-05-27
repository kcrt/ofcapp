import { evaluateCalcExpression } from './expressions';

describe('evaluateCalcExpression', () => {
  it('should evaluate a valid expression correctly', () => {
    const expression = 'a + b * c';
    const scope = { a: 1, b: 2, c: 3 };
    expect(evaluateCalcExpression(expression, scope)).toBe(7);
  });

  it('should return 0 for expressions resulting in Infinity', () => {
    const expression = '1 / 0';
    const scope = {};
    // Suppress console.warn for this specific test case
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    expect(evaluateCalcExpression(expression, scope)).toBe(0);
    expect(consoleWarnSpy).toHaveBeenCalledWith('Expression "1 / 0" did not evaluate to a finite number. Result: Infinity');
    consoleWarnSpy.mockRestore();
  });

  it('should handle missing variables in scope gracefully', () => {
    const expression = 'x + y';
    const scope = { x: 1 }; // y is missing
    // Suppress console.error for this specific test case
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(evaluateCalcExpression(expression, scope)).toBe(0);
    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });
});
