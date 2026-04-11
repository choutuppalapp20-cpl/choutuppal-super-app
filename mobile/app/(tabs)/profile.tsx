import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { palette } from '@/constants/colors';
import { t, Language, getStoredLanguage, setStoredLanguage } from '@/lib/language';
import { supabase } from '@/lib/supabase';

import { useLanguage } from '@/lib/LanguageContext';

export default function ProfileScreen() {
  const { lang, updateLanguage } = useLanguage();

  const handleLanguageToggle = async () => {
    const newLang = lang === 'english' ? 'telugu' : 'english';
    await updateLanguage(newLang);
    Alert.alert('Language Updated', newLang === 'english' ? 'Switched to English' : 'తెలుగుకు మార్చబడింది');
  };

  const handleAuthDummy = () => {
    Alert.alert('Auth', 'Login Flow Under Construction');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('profile.title', lang)}</Text>
      </View>
      
      <View style={styles.content}>
        <TouchableOpacity style={styles.button} onPress={handleAuthDummy}>
          <Text style={styles.buttonText}>{lang === 'english' ? 'Sign In / Register' : 'సైన్ ఇన్ / రిజిస్టర్'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonAlt} onPress={handleLanguageToggle}>
          <Text style={styles.buttonAltText}>
            {lang === 'english' ? 'గంగావతరణం తెలుగుకి (Switch to Telugu)' : 'Switch to English'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.gray950,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: palette.white,
  },
  content: {
    padding: 16,
    gap: 16,
  },
  button: {
    backgroundColor: palette.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: palette.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonAlt: {
    backgroundColor: 'transparent',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.primary,
    alignItems: 'center',
  },
  buttonAltText: {
    color: palette.primary,
    fontWeight: 'bold',
    fontSize: 16,
  }
});
