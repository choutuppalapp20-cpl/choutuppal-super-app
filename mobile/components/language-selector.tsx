import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { palette } from '@/constants/colors';

const { width, height } = Dimensions.get('window');

interface LanguageSelectorProps {
  onSelect: (lang: 'english' | 'telugu') => void;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function LanguageSelector({ onSelect }: LanguageSelectorProps) {
  const englishScale = useSharedValue(1);
  const teluguScale = useSharedValue(1);
  const englishSelected = useSharedValue(0);
  const teluguSelected = useSharedValue(0);

  const englishStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(englishScale.value) }],
    borderColor: interpolateColor(
      englishSelected.value,
      [0, 1],
      ['rgba(255,255,255,0.15)', palette.primaryLight]
    ),
    borderWidth: 2,
  }));

  const teluguStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(teluguScale.value) }],
    borderColor: interpolateColor(
      teluguSelected.value,
      [0, 1],
      ['rgba(255,255,255,0.15)', palette.accentLight]
    ),
    borderWidth: 2,
  }));

  const handleSelect = (lang: 'english' | 'telugu') => {
    if (lang === 'english') {
      englishSelected.value = withTiming(1, { duration: 200 });
      teluguSelected.value = withTiming(0, { duration: 200 });
    } else {
      teluguSelected.value = withTiming(1, { duration: 200 });
      englishSelected.value = withTiming(0, { duration: 200 });
    }
    // Small delay for visual feedback before navigating
    setTimeout(() => onSelect(lang), 400);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <LinearGradient
        colors={['#0F172A', '#1E293B', '#0F172A']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Decorative blobs */}
      <View style={[styles.blob, styles.blob1]} />
      <View style={[styles.blob, styles.blob2]} />

      {/* Header */}
      <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.header}>
        <Text style={styles.brandName}>చౌటుప్పల్</Text>
        <Text style={styles.brandSubtitle}>CHOUTUPPAL</Text>
        <View style={styles.divider} />
        <Text style={styles.tagline}>Your Local Super App</Text>
      </Animated.View>

      {/* Language selection */}
      <Animated.View entering={FadeInDown.delay(500).springify()} style={styles.selectionArea}>
        <Text style={styles.chooseText}>Choose Your Language</Text>
        <Text style={styles.chooseSubtext}>మీ భాషను ఎంచుకోండి</Text>

        <View style={styles.cardRow}>
          {/* English Card */}
          <AnimatedTouchable
            style={[styles.langCard, englishStyle]}
            activeOpacity={0.8}
            onPressIn={() => { englishScale.value = 0.95; }}
            onPressOut={() => { englishScale.value = 1; }}
            onPress={() => handleSelect('english')}
          >
            <Text style={styles.langEmoji}>🇬🇧</Text>
            <Text style={styles.langTitle}>English</Text>
            <Text style={styles.langNative}>English</Text>
          </AnimatedTouchable>

          {/* Telugu Card */}
          <AnimatedTouchable
            style={[styles.langCard, teluguStyle]}
            activeOpacity={0.8}
            onPressIn={() => { teluguScale.value = 0.95; }}
            onPressOut={() => { teluguScale.value = 1; }}
            onPress={() => handleSelect('telugu')}
          >
            <Text style={styles.langEmoji}>🇮🇳</Text>
            <Text style={styles.langTitle}>తెలుగు</Text>
            <Text style={styles.langNative}>Telugu</Text>
          </AnimatedTouchable>
        </View>
      </Animated.View>

      {/* Footer */}
      <Animated.View entering={FadeInDown.delay(800).springify()} style={styles.footer}>
        <Text style={styles.footerText}>Built for Choutuppal, by Choutuppal ❤️</Text>
      </Animated.View>
    </View>
  );
}

const CARD_WIDTH = (width - 64) / 2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  blob: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.15,
  },
  blob1: {
    width: 300,
    height: 300,
    backgroundColor: palette.primary,
    top: -80,
    right: -60,
  },
  blob2: {
    width: 250,
    height: 250,
    backgroundColor: palette.accent,
    bottom: -50,
    left: -60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  brandName: {
    fontSize: 42,
    fontWeight: '800',
    color: palette.white,
    letterSpacing: 2,
  },
  brandSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.primaryLight,
    letterSpacing: 8,
    marginTop: 4,
  },
  divider: {
    width: 60,
    height: 3,
    backgroundColor: palette.primary,
    borderRadius: 2,
    marginTop: 16,
    marginBottom: 12,
  },
  tagline: {
    fontSize: 16,
    color: palette.gray400,
    fontWeight: '400',
  },
  selectionArea: {
    alignItems: 'center',
  },
  chooseText: {
    fontSize: 22,
    fontWeight: '700',
    color: palette.white,
    marginBottom: 4,
  },
  chooseSubtext: {
    fontSize: 16,
    color: palette.gray400,
    marginBottom: 28,
  },
  cardRow: {
    flexDirection: 'row',
    gap: 16,
  },
  langCard: {
    width: CARD_WIDTH,
    paddingVertical: 32,
    borderRadius: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    // subtle shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  langEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  langTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: palette.white,
    marginBottom: 4,
  },
  langNative: {
    fontSize: 14,
    color: palette.gray400,
  },
  footer: {
    position: 'absolute',
    bottom: 48,
  },
  footerText: {
    fontSize: 13,
    color: palette.gray500,
  },
});
