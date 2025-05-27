import { evaluate } from 'mathjs';

// Helper function to evaluate expressions safely
export function evaluateCalcExpression(expression: string, scope: Record<string, number>): number {
  try {
    const result = evaluate(expression, scope);
    if (typeof result === 'number' && isFinite(result)) {
      return result;
    }
    console.warn(`Expression "${expression}" did not evaluate to a finite number. Result: ${result}`);
    return 0; // Fallback value
  } catch (error) {
    console.error(`Error evaluating expression "${expression}":`, error);
    return 0; // Fallback value
  }
}
