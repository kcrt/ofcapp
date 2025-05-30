import { type Formula } from '@/utils/formulas';
import { evaluateCalcExpression } from '@/utils/expressions';
import { type InputItemType as FormulaInputSchema } from '@/appdata/formulas.zod';
import { be } from 'zod/v4/locales';

const DEFAULT_AGE = 5; // years
const DEFAULT_TOTAL_IGE = 100; // IU/mL
const MIN_LOG_SIGE = -2; // Log10(0.01)


/**
 * Calculates the adjusted intercept based on model inputs, calc items, and beta coefficients.
 */
export function calculateAdjustedIntercept( model: Formula, factorValues: { [key: string]: any }): number{
    const variables: Record<string, number> = {};
    const primaryKey = model.inputs.find(input => input.type === "sIgE" && input.mode === "primary")?.name || "";

    // 1. Store values of inputs
    model.inputs.forEach(input => {
        const rawValue = factorValues[input.name];
        variables[input.name] = rawValue;
        if(input.type === "IgE" || input.type === "sIgE" || input.type === "proteindose") {
            variables[`Log${input.name}`] = Math.log10(variables[input.name]);
        }else if(input.type === "sex"){
            variables["male"] = rawValue !== true ? 1 : 0; //
            variables["female"] = rawValue === true ? 1 : 0; //
        }
    });

    // 2. Process calc items
    if (model.calc && model.calc.length > 0) {
        model.calc.forEach(calcItem => {
            const calculatedValue = evaluateCalcExpression(calcItem.expression, variables);
            if (isFinite(calculatedValue)) {
                variables[calcItem.name] = calculatedValue;
            } else {
                console.warn(`Calc item "${calcItem.name}" (expression: "${calcItem.expression}") result is not a finite number: ${calculatedValue}. Setting to 0 in scope.`);
                variables[calcItem.name] = 0; // fallback
            }
        });
    }
    
    // 3. Calculate intercept adjustments based on betaCoefficients
    const betaCoefficients = model.output.result.beta as Record<string, number>;
    let adjustedIntercept = model.output.result.intercept;
    for (const betaKey in betaCoefficients) {
        if (!betaCoefficients.hasOwnProperty(betaKey)) continue; // Skip if not a direct property
        if (betaKey === primaryKey || betaKey === `Log${primaryKey}`) continue; // Skip primary sIgE key, handled separately
        const coefficient = betaCoefficients[betaKey];
        if (variables.hasOwnProperty(betaKey)) {
            adjustedIntercept += coefficient * variables[betaKey];
        }else{
            console.warn(`Beta coefficient "${betaKey}" not found in input values or calc items. Skipping adjustment.`);
            // skip
        }
    }

    return adjustedIntercept;
}
