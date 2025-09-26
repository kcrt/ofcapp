# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Start development server (opens Expo DevTools)
npm run start
# or
npx expo start

# Platform-specific development
npm run android    # Run on Android device/emulator
npm run ios        # Run on iOS device/simulator
npm run web        # Run in web browser

# Testing
npm test           # Run Jest tests with jest-expo preset
```

## Architecture Overview

This is a React Native/Expo app for Oral Food Challenge (OFC) probability prediction in healthcare settings.

### Core Architecture

- **Framework**: React Native with Expo Router for navigation
- **Data Validation**: Zod schemas for runtime type checking
- **Internationalization**: Custom i18n system with `MultilangString` type supporting English/Japanese
- **Medical Formulas**: JSON-based formula definitions with TypeScript validation

### Key Directories

- `src/app/` - Expo Router pages (file-based routing)
- `src/components/` - Reusable UI components
- `src/utils/` - Utility functions and helpers
- `src/appdata/` - Medical formula data and Zod schemas

### Medical Formula System

The app's core functionality revolves around medical formulas stored in `src/appdata/formulas.json`:

1. **Formula Structure**: Each formula contains:
   - Metadata (name, title, references)
   - Input definitions (age, sex, sIgE values, etc.)
   - Logistic regression parameters (intercept, beta coefficients)
   - Output mode (OFC probability vs ED dose)

2. **Type Safety**: `src/appdata/formulas.zod.ts` defines comprehensive Zod schemas
3. **Runtime Validation**: Formulas are validated on import in `src/utils/formulas.ts`

### Component Patterns

- Use `export default function` for components (not arrow functions)
- Import paths use `@/*` alias for `src` directory
- Reusable code goes in `src/utils/`
- Components follow React Native StyleSheet patterns

### Input Types

The app handles specialized medical input types:
- `sex` - Male/female selection
- `age` - Age in years
- `sIgE` - Specific IgE values with logarithmic transformations
- `IgE` - Total IgE values
- `boolean` - Yes/no medical conditions
- `proteindose` - Predefined protein dose options

### Calculation Flow

1. User inputs are collected via `FactorInputController` components
2. Values are processed through mathematical expressions (`src/utils/expressions.ts`)
3. Logistic regression calculations in `src/utils/calculationHelpers.ts`
4. Results displayed as probability curves in `GraphArea` component

### Internationalization

- Uses custom `MultilangString` type (string | object with 'en'/'ja' keys)
- `getDisplayString()` utility handles language resolution
- Medical terminology requires precise translation handling