import { Stack } from 'expo-router';

export default function RootLayout() {
  return <Stack 
    screenOptions={{
      headerStyle: {
        backgroundColor: '#00b0f6'
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}
  />;
}
