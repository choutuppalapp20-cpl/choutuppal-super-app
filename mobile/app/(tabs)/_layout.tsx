import { Tabs } from 'expo-router';
import React, { useEffect, useState } from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { palette } from '@/constants/colors';
import { getStoredLanguage, Language, t } from '@/lib/language';

export default function TabLayout() {
  const [lang, setLang] = useState<Language>('english');

  useEffect(() => {
    getStoredLanguage().then((stored) => {
      if (stored) setLang(stored);
    });
  }, []);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: palette.primary,
        tabBarInactiveTintColor: palette.gray500,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: palette.gray950,
          borderTopColor: palette.gray800,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('home.title', lang),
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="real-estate"
        options={{
          title: t('realestate.title', lang),
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="building.2.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('profile.title', lang),
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
