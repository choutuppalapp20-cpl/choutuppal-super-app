import AsyncStorage from '@react-native-async-storage/async-storage';

const LANGUAGE_KEY = '@choutuppal_language';
const ONBOARDING_KEY = '@choutuppal_onboarded';

export type Language = 'english' | 'telugu';

export async function getStoredLanguage(): Promise<Language | null> {
  try {
    const lang = await AsyncStorage.getItem(LANGUAGE_KEY);
    return lang as Language | null;
  } catch {
    return null;
  }
}

export async function setStoredLanguage(lang: Language): Promise<void> {
  await AsyncStorage.setItem(LANGUAGE_KEY, lang);
  await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
}

export async function hasCompletedOnboarding(): Promise<boolean> {
  try {
    const val = await AsyncStorage.getItem(ONBOARDING_KEY);
    return val === 'true';
  } catch {
    return false;
  }
}

/**
 * Simple translation map. Can be expanded.
 */
const translations: Record<string, Record<Language, string>> = {
  'app.name': { english: 'Choutuppal', telugu: 'చౌటుప్పల్' },
  'home.title': { english: 'Home', telugu: 'హోమ్' },
  'home.stories': { english: 'Stories', telugu: 'కథలు' },
  'home.welcome': { english: 'Welcome to Choutuppal', telugu: 'చౌటుప్పల్‌కు స్వాగతం' },
  'realestate.title': { english: 'Real Estate', telugu: 'రియల్ ఎస్టేట్' },
  'realestate.connect': { english: 'Connect via App', telugu: 'యాప్ ద్వారా కనెక్ట్ చేయండి' },
  'realestate.lead_sent': { english: 'Lead sent! We\'ll connect you.', telugu: 'లీడ్ పంపబడింది! మేము మిమ్మల్ని కనెక్ట్ చేస్తాము.' },
  'listings.title': { english: 'Listings', telugu: 'లిస్టింగ్‌లు' },
  'profile.title': { english: 'Profile', telugu: 'ప్రొఫైల్' },
  'stories.add': { english: 'Add Story', telugu: 'కథ జోడించండి' },
  'common.search': { english: 'Search...', telugu: 'వెతకండి...' },
  'common.loading': { english: 'Loading...', telugu: 'లోడ్ అవుతోంది...' },
  'common.error': { english: 'Something went wrong', telugu: 'ఏదో తప్పు జరిగింది' },
};

export function t(key: string, lang: Language): string {
  return translations[key]?.[lang] ?? key;
}
