import React, { useEffect } from 'react';
import UserInputs from '@/components/UserInputs';
import { type InputItemType as FormulaInputSchema } from '@/appdata/formulas.zod';

const DEFAULT_INPUT_VALUES: { [key: string]: string | boolean } = {
  "age": "5", // years
  "IgE": "100", // IU/mL
  "sIgE": "1.0", // kUA/L
  "proteindose": "100.0", // protein dose [mg]
  "boolean": false,
  "sex": false, // Default for 'sex', male = true, female = false
};

export function getInitialFactorStates(inputs: FormulaInputSchema[]): { [key: string]: any } {
  const states: { [key: string]: any } = {};

  inputs.forEach(input => {
    if (DEFAULT_INPUT_VALUES.hasOwnProperty(input.type)) {
      states[input.name] = DEFAULT_INPUT_VALUES[input.type];
    } else {
      console.warn(`Unknown default value for input type: ${input.type} (name: ${input.name}). Defaulting to empty string.`);
      states[input.name] = ""; // Fallback to empty string for robustness.
    }
  });
  return states;
}

interface FactorInputControllerProps {
  modelInputs: FormulaInputSchema[];
  setFactorValuesState: (values: { [key: string]: any }) => void;
  onFactorValueChange: (name: string, value: any) => void;
  currentFactorValues: { [key: string]: any };
}

export default function FactorInputController({
  modelInputs,
  setFactorValuesState,
  onFactorValueChange,
  currentFactorValues,
}: FactorInputControllerProps) {
  
  useEffect(() => {
    if (modelInputs && modelInputs.length > 0) {
      const initialValues = getInitialFactorStates(modelInputs);
      setFactorValuesState(initialValues);
    }
  }, [modelInputs, setFactorValuesState]);

  if (!modelInputs || modelInputs.length === 0) return null;
  
  return (
    <UserInputs
      inputs={modelInputs}
      currentValues={currentFactorValues}
      onValueChange={onFactorValueChange}
    />
  );
}
