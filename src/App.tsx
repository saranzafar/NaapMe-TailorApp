import React from 'react';
import { PaperProvider, MD3LightTheme as DefaultTheme } from 'react-native-paper';
import Navigation from './navigation/Navigation';

// Define custom purple theme
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#673AB7', // Deep Purple
    accent: '#9575CD', // Soft Purple
    background: '#F3E5F5', // Light Lavender
    surface: '#FFFFFF',
    text: '#212121',
    onSurface: '#000000',
  },
};

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <Navigation />
    </PaperProvider>
  );
}
