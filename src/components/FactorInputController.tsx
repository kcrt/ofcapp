import React, { useEffect } from 'react';
import UserInputs from '@/components/UserInputs'; // Assuming UserInputs is correctly handling various input types
import { type InputItemType as FormulaInputSchema } from '@/appdata/formulas.zod';

// Default values for various input types.
// These are used to provide initial sensible values for the form factors.
const DEFAULT_INPUT_VALUES: { [key: string]: string | boolean } = {
  "age": "5", // years
  "IgE": "100", // IU/mL
  "sIgE": "1.0", // kUA/L
  "proteindose": "100.0", // protein dose [mg]
  "boolean": false,
  "sex": false, // Default for 'sex', male = true, female = false
};

// Generates initial states for input factors based on their types.
// This function is crucial for setting up the form with default or sensible starting values.
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
  // Schema for the input factors, derived from the model.
  modelInputs: FormulaInputSchema[];
  // Callback to update the parent component's state with the fully initialized factor values.
  setFactorValuesState: (values: { [key: string]: any }) => void;
  // Callback to handle changes in individual factor values, passed to UserInputs.
  onFactorValueChange: (name: string, value: any) => void;
  // Current values of all factors, managed by the parent and passed to UserInputs.
  currentFactorValues: { [key: string]: any };
}

// Component to manage the initialization of factor input states and render UserInputs.
// It centralizes the logic for setting up input controls based on a model's input schema.
export default function FactorInputController({
  modelInputs,
  setFactorValuesState,
  onFactorValueChange,
  currentFactorValues,
}: FactorInputControllerProps) {
  
  // Effect to initialize factor values when modelInputs are available or change.
  // It calculates the initial states and updates the parent component's state.
  useEffect(() => {
    if (modelInputs && modelInputs.length > 0) {
      const initialValues = getInitialFactorStates(modelInputs);
      setFactorValuesState(initialValues);
    }
    // Dependency array ensures this effect runs when modelInputs changes.
    // setFactorValuesState is expected to be a stable setter from useState.
  }, [modelInputs, setFactorValuesState]);

  // Renders the UserInputs component, delegating the actual input field UI.
  // It passes the necessary data (input schema, current values) and handlers.
  if (!modelInputs || modelInputs.length === 0) {
    // Avoid rendering UserInputs if modelInputs is not yet available or empty,
    // as UserInputs might expect a non-empty inputs array.
    return null;
  }
  
  return (
    <UserInputs
      inputs={modelInputs}
      currentValues={currentFactorValues}
      onValueChange={onFactorValueChange}
    />
  );
}
