# OFC App

**An app for Oral Food Challenge (OFC) probability prediction**

## Overview

OFC App is a React Native mobile application built with Expo that helps healthcare professionals calculate the probability of failure in Oral Food Challenge (OFC) tests. The app provides probability curves based on various research-backed formulas for different food allergens, helping clinicians make informed decisions about food allergy management.

### Key Features

- **Probability Curve Visualization**: Interactive graphs showing OFC failure probability based on patient parameters
- **Multiple Food Allergens**: Support for various allergens including egg, milk, wheat, peanuts, tree nuts, fish, shellfish, and more
- **Research-Based Models**: Implements formulas from peer-reviewed medical literature
- **Multi-language Support**: Interface available in English and Japanese (for now)
- **Real-time Calculations**: Dynamic probability updates as parameters are adjusted
- **Cross-platform**: Runs on iOS, Android, and web platforms

## Technology Stack

- **Framework**: React Native with Expo
- **Navigation**: Expo Router
- **Language**: TypeScript
- **JSON Validation**: Zod
- **UI Components**: Expo UI, React Native SVG
- **Testing**: Jest with Jest-Expo

## Development

### Prerequisites

- Node.js (latest LTS version recommended)
- npm or yarn package manager
- Expo CLI (installed globally or via npx)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd ofcapp

# Install dependencies
npm install
```

### Running the App

```bash
# Start the development server
npx expo start

# Or use npm scripts
npm run start        # Start development server
npm run android      # Run on Android device/emulator
npm run ios          # Run on iOS device/simulator
npm run web          # Run in web browser
```

### Testing

```bash
npm test
```

### Code Style Guidelines

- Use `export default function` style for components, not arrow functions.
- Utilize `@/*` alias for `src` directory imports
- Place reusable code in `@/utils` directory


## References

All medical formulas implemented in this app are based on peer-reviewed research. Individual references are available within each model's information section in the app.

## License

This project is currently private and not intended for medical professional use.

---

*For technical preview purposes only. This app is designed to assist healthcare professionals in clinical decision-making and should not replace professional medical judgment.*