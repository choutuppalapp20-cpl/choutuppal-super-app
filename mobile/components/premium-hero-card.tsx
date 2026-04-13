import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { palette } from '@/constants/colors';

const { width } = Dimensions.get('window');
const HERO_WIDTH = width - 32;

interface PremiumHeroCardProps {
  title: string;
  subtitle: string;
  price: string;
  imageUrl: string;
  isPremium: boolean;
  onPress: () => void;
}

export default function PremiumHeroCard({
  title,
  subtitle,
  price,
  imageUrl,
  isPremium,
  onPress,
}: PremiumHeroCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={[styles.container, isPremium && styles.premiumContainer]}
      onPress={onPress}
    >
      <Image
        source={{ uri: imageUrl }}
        style={styles.backgroundImage}
        contentFit="cover"
        transition={400}
      />
      
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.gradient}
      />

      <View style={styles.content}>
        <View style={styles.topRow}>
          {isPremium && (
            <BlurView intensity={60} tint="dark" style={styles.badge}>
              <Text style={styles.badgeText}>ELITE PROPERTY</Text>
            </BlurView>
          )}
        </View>

        <View style={styles.bottomSection}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>

          {isPremium ? (
            <BlurView intensity={80} tint="light" style={styles.priceGlass}>
              <Text style={styles.priceText}>{price}</Text>
            </BlurView>
          ) : (
            <View style={styles.priceStandard}>
              <Text style={styles.priceText}>{price}</Text>
            </View>
          )}
        </View>
      </View>

      {isPremium && (
        <View style={styles.premiumOverlay} pointerEvents="none">
          <LinearGradient
            colors={['rgba(255,255,255,0.1)', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: HERO_WIDTH,
    height: 240,
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: palette.gray900,
    marginHorizontal: 16,
    marginBottom: 24,
    // Standard shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 10,
  },
  premiumContainer: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  badgeText: {
    color: '#FCD34D',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  bottomSection: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    color: palette.white,
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
  priceGlass: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  priceStandard: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  priceText: {
    color: palette.white,
    fontSize: 18,
    fontWeight: '800',
  },
  premiumOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
});
