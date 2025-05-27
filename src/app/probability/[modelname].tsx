import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, TextInput, Switch, TouchableOpacity } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';

// Define a maximum width for the page content
const PAGE_MAX_WIDTH = 600;
// Svg, Path, Line, Text as SvgText are no longer directly used here
import formulas, { type Formula } from '@/utils/formulas';
import ErrorMessagePage from '@/components/ErrorMessagePage';
import GraphArea from '@/components/GraphArea'; // Import the new component
import UserInputs from '@/components/UserInputs'; // Import the new UserInputs component
import { type InputItemType as FormulaInputSchema } from '@/appdata/formulas.zod';
import { getDisplayString } from '@/utils/i18n';
import { parseReferenceLink, openLink } from '@/utils/links';
import { calculateAdjustedIntercept } from '@/utils/calculationHelpers'; // Import the new helper

// Logistic function
function logistic (intercept: number, beta: number, x: number): number{
  return 1 / (1 + Math.exp(-(intercept + beta * x)));
};

const DEFAULT_AGE = 5; // years
const DEFAULT_TOTAL_IGE = 100; // IU/mL
const DEFAULT_SIGE = 1.0; // kUA/L

function getInitialFactorStates(inputs: FormulaInputSchema[]): { [key: string]: any } {
  const states: { [key: string]: any } = {};
  const defaultValues = {
    "boolean": false,
    "age": DEFAULT_AGE.toString(),
    "IgE": DEFAULT_TOTAL_IGE.toString(),
    "sIgE": DEFAULT_SIGE.toString(),
    "sex": false
  }
  inputs.forEach(input => {
    if(input.type === "sIgE" && input.mode === "primary") {
      // skip
    }else {
      if(defaultValues.hasOwnProperty(input.type)) {
        states[input.name] = defaultValues[input.type];
      }else{
        console.warn(`Unknown default value for ${input.type}`)
      }
    }
  });
  return states;
};


export default function ProbabilityCurvePage() {
  const { modelname } = useLocalSearchParams<{ modelname: string }>();
  const model = formulas.find(f => f.name === modelname);

  const [factorValues, setFactorValues] = useState<{[key: string]: any}>({});
  const [primarySIgEInputValue, setPrimarySIgEInputValue] = useState<string>(DEFAULT_SIGE.toString()); // Default sIgE value
  const [calculatedPoint, setCalculatedPoint] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (model) {
      setFactorValues(getInitialFactorStates(model.inputs));
      setPrimarySIgEInputValue('1.0');
    }
  }, [model]);

  if (!model) {
    return (
      <ErrorMessagePage
        title="Model Not Found"
        message={`Model not found: ${modelname}`}
      />
    );
  }
  const displayModelTitle = getDisplayString(model.shorttitle);
  const primarySIgEInput = model.inputs.find(input => input.type === 'sIgE' && input.mode === 'primary');

  if (!primarySIgEInput || primarySIgEInput.type !== 'sIgE') {
    return (
      <ErrorMessagePage
        title="Configuration Error"
        message={`Primary sIgE input not found or invalid for model: ${displayModelTitle}`}
        iconName="alert-circle-outline"
      />
    );
  }
  
  const primarySIgECaption = getDisplayString(primarySIgEInput.caption);
  const primaryBetaKey = `Log${primarySIgEInput.name}`;
  const primarySIgEBetaValue = model.output.result.beta[primaryBetaKey];

  if (typeof primarySIgEBetaValue !== 'number') {
    return (
      <ErrorMessagePage
        title="Configuration Error"
        message={`Beta value for ${primaryBetaKey} not found or invalid in model: ${displayModelTitle}`}
        iconName="alert-circle-outline"
      />
    );
  }

  const handleFactorChange = (name: string, value: any) => {
    setFactorValues(prev => ({ ...prev, [name]: value }));
  };
  
  const minLogSIgE = -2; // Log10(0.01)
  const maxLogSIgE = 3;  // Log10(1000)

  // Calculate adjustedIntercept using the new helper function
  const adjustedIntercept = useMemo(() => {
    if (!model || !factorValues || Object.keys(factorValues).length === 0) { return 0; /* not loaded yet */ }
    return calculateAdjustedIntercept(model, factorValues);
  }, [model, factorValues]);
  useEffect(() => {
    handleFactorChange(primarySIgEInput.name, primarySIgEInputValue);
  }, [primarySIgEInputValue])


  useEffect(() => {
    const parsedSIgE = parseFloat(primarySIgEInputValue);
    if (!isNaN(parsedSIgE) && parsedSIgE > 0 && isFinite(primarySIgEBetaValue) && isFinite(adjustedIntercept)) {
      const logSIgEValue = Math.log10(parsedSIgE);
      const probability = logistic(adjustedIntercept, primarySIgEBetaValue, logSIgEValue);
      setCalculatedPoint({ x: logSIgEValue, y: probability });
    } else {
      setCalculatedPoint(null);
    }
  }, [primarySIgEInputValue, adjustedIntercept, primarySIgEBetaValue, minLogSIgE, maxLogSIgE]);

  const points = useMemo(() => {
    const pts = [];
    const numPoints = 50; // 50 is enough
    for (let i = 0; i <= numPoints; i++) {
      const logSIgE_primary = minLogSIgE + (i / numPoints) * (maxLogSIgE - minLogSIgE);
      const probability = logistic(adjustedIntercept, primarySIgEBetaValue, logSIgE_primary);
      pts.push({ x: logSIgE_primary, y: probability });
    }
    return pts;
  }, [adjustedIntercept, primarySIgEBetaValue, minLogSIgE, maxLogSIgE]);

  const chartHeight = 300;
  const chartPadding = 50;
  const actualDeviceWidth = Dimensions.get('window').width;
  const screenWidthForGraph = Math.min(actualDeviceWidth, PAGE_MAX_WIDTH) - (2 * 10);

  // Filter out the primary sIgE input for UserInputs component
  const otherFactorInputs = model.inputs.filter(
    input => !(input.type === 'sIgE' && input.mode === 'primary')
  );

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContentContainer}>
      <Stack.Screen options={{ title: displayModelTitle }} />
      
      {model.output.result.graph !== "hide" && (
      <GraphArea
        points={points}
        minLogSIgE={minLogSIgE}
        maxLogSIgE={maxLogSIgE}
        highlightPoint={calculatedPoint}
        chartHeight={chartHeight}
        chartPadding={chartPadding}
        screenWidth={screenWidthForGraph}
      />
      )}

      {/* Primary sIgE Input */}
      <View style={styles.primarySIgEContainer}>
        <Text style={styles.factorLabel}>{primarySIgECaption || primarySIgEInput.name} (UA/mL):</Text>
        <TextInput
          style={styles.factorInput}
          value={primarySIgEInputValue}
          onChangeText={setPrimarySIgEInputValue}
          keyboardType="numeric"
          placeholder="e.g. 5.0"
        />
      </View>

      {calculatedPoint && (
        <Text style={styles.probabilityText}>
          Probability of failing OFC is: {(calculatedPoint.y * 100).toFixed(1)}%
        </Text>
      )}
      
      {otherFactorInputs.length > 0 && (
        <View style={styles.controlsContainer}>
          <Text style={styles.subTitle}>Adjust other factors:</Text>
          <UserInputs
            inputs={otherFactorInputs}
            currentValues={factorValues}
            onValueChange={handleFactorChange}
          />
         <Text style={styles.subTitleNote}>Curve adjusted for the factors set above.</Text>
        </View>
      )}
      
      {model.note && (
        <View style={styles.infoSection}>
          <Text style={styles.subTitle}>Note</Text>
          <Text style={styles.infoText}>{getDisplayString(model.note)}</Text>
        </View>
      )}

      {Object.keys(model.references).length > 0 && (
        <View style={styles.infoSection}>
          <Text style={styles.subTitle}>References</Text>
          {Object.entries(model.references).map(([key, value]) => {
            const url = parseReferenceLink(value);
            return (
              <TouchableOpacity key={key} onPress={() => openLink(url)}>
                <Text style={styles.linkText}>
                  {key}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContentContainer: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 10,
    maxWidth: PAGE_MAX_WIDTH,
    width: '100%',
    alignSelf: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  subTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  probabilityText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 15,
    color: '#007AFF',
  },
  primarySIgEContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 10,
    width: '100%',
    maxWidth: 500,
  },
  subTitleNote: {
    fontSize: 12,
    marginBottom: 15,
    textAlign: 'center',
    color: 'dimgray',
  },
  controlsContainer: {
    width: '100%',
    maxWidth: 500,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  factorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  factorLabel: {
    fontSize: 15,
    flex: 1,
    marginRight: 10,
  },
  factorInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 5,
    minWidth: 80,
    fontSize: 15,
    textAlign: 'right',
  },
  sexButton: {
    padding: 8,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 50,
  },
  infoSection: {
    width: '100%',
    maxWidth: 500,
    paddingHorizontal: 15,
    marginTop: 20,
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'left',
    color: '#333',
  },
  referenceText: {
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'left',
    color: '#555',
    marginBottom: 5,
  },
  linkText: {
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'left',
    color: '#007AFF',
    textDecorationLine: 'underline',
    marginBottom: 5,
  }
});
