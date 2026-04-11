import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import LanguageSelector from '@/components/language-selector';
import {
  hasCompletedOnboarding,
  setStoredLanguage,
  getStoredLanguage,
  Language,
} from '@/lib/language';
import { palette } from '@/constants/colors';

import { LanguageProvider } from '@/lib/LanguageContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isReady, setIsReady] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    checkOnboarding();
  }, []);

  async function checkOnboarding() {
    const completed = await hasCompletedOnboarding();
    setShowOnboarding(!completed);
    setIsReady(true);
  }

  async function handleLanguageSelected(lang: Language) {
    await setStoredLanguage(lang);
    setShowOnboarding(false);
  }

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={palette.primary} />
      </View>
    );
  }

  if (showOnboarding) {
    return <LanguageSelector onSelect={handleLanguageSelected} />;
  }

  return (
    <LanguageProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="listing/[id]"
            options={{
              headerShown: false,
              presentation: 'card',
            }}
          />
        </Stack>
        <StatusBar style="light" />
      </ThemeProvider>
    </LanguageProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.gray950,
  },
});
