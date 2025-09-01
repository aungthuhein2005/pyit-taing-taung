import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import 'react-native-reanimated';

import { PreferencesProvider, usePreferences } from '@/contexts/PreferencesContext';
import { useColorScheme } from '@/hooks/useColorScheme';

function RootNavigator() {
  const systemScheme = useColorScheme();
  const { isHydrated, onboarded, theme } = usePreferences();

  if (!isHydrated) return null;

  const themeValue = theme === 'system'
    ? (systemScheme === 'dark' ? DarkTheme : DefaultTheme)
    : (theme === 'dark' ? DarkTheme : DefaultTheme);

  return (
    <ThemeProvider value={themeValue}>
      <Stack>
        {!onboarded ? (
          <Stack.Screen name="welcome" options={{ headerShown: false }} />
        ) : (
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        )}
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <PreferencesProvider>
      <RootNavigator />
    </PreferencesProvider>
  );
}
