import React, { useEffect } from 'react';
import { PaperProvider, MD3LightTheme as DefaultTheme } from 'react-native-paper';
import Navigation from './navigation/Navigation';
import { initDatabase } from './databases/database';

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
  useEffect(() => {
    initDatabase()
      .then(() => console.log('Database initialized successfully'))
      .catch(error => console.error('Database initialization failed:', error));
  }, []);
  return (
    <PaperProvider theme={theme}>
      <Navigation />
    </PaperProvider>
  );
}
