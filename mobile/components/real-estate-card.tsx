import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { palette } from '@/constants/colors';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 32;

export interface RealEstateListing {
  id: string;
  title: string;
  description: string;
  propertyType: string;
  price: number;
  imageUrls: string[];
  ownerName?: string;
  isPremium?: boolean;
}

interface ListingCardProps {
  listing: RealEstateListing;
  index: number;
  onPress: (listing: RealEstateListing) => void;
  lang: 'english' | 'telugu';
}

export default function RealEstateCard({
  listing,
  index,
  onPress,
  lang,
}: ListingCardProps) {
  const formatPrice = (price: number) =>
    '₹' + price.toLocaleString('en-IN');

  const propertyLabel = lang === 'telugu' ? 'ఆస్తి రకం' : 'Property';

  return (
    <Animated.View entering={FadeInUp.delay(index * 100).springify()}>
      <TouchableOpacity
        activeOpacity={0.85}
        style={[styles.card, listing.isPremium && styles.premiumCard]}
        onPress={() => onPress(listing)}
      >
        {/* Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri:
                listing.imageUrls?.[0] ??
                'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600',
            }}
            style={styles.image}
            contentFit="cover"
            placeholder="L5H2EC=PM+yV0g-mq.wG9c010J}I"
            transition={300}
          />

          {/* Premium badge */}
          {listing.isPremium && (
            <View style={styles.premiumBadgeWrapper}>
              <BlurView intensity={70} tint="dark" style={styles.premiumBadge}>
                <Text style={styles.premiumBadgeText}>⭐ Premium</Text>
              </BlurView>
            </View>
          )}

          {/* Price overlay */}
          <View style={styles.priceOverlay}>
            <BlurView intensity={listing.isPremium ? 80 : 40} tint="dark" style={styles.priceBlur}>
              <Text style={styles.priceText}>{formatPrice(listing.price)}</Text>
            </BlurView>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>
            {listing.title}
          </Text>

          <View style={styles.metaRow}>
            <View style={[styles.tag, listing.isPremium && styles.premiumTag]}>
              <Text style={[styles.tagText, listing.isPremium && styles.premiumTagText]}>
                {propertyLabel}: {listing.propertyType}
              </Text>
            </View>
          </View>

          {listing.description ? (
            <Text style={styles.description} numberOfLines={2}>
              {listing.description}
            </Text>
          ) : null}
        </View>

        {/* Heavy Glassmorphism effects ONLY for premium */}
        {listing.isPremium && (
          <View style={styles.premiumGlassEffect} pointerEvents="none">
            <LinearGradient
              colors={['rgba(255,255,255,0.08)', 'transparent']}
              style={StyleSheet.absoluteFill}
            />
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: palette.gray950,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: palette.gray800,
    // Subtle shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
  premiumCard: {
    borderColor: 'rgba(99, 102, 241, 0.4)', // Indigo border for premium
    backgroundColor: palette.gray900,
  },
  imageContainer: {
    width: '100%',
    height: 220,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  premiumBadgeWrapper: {
    position: 'absolute',
    top: 12,
    left: 12,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  premiumBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  premiumBadgeText: {
    color: '#FCD34D',
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  priceOverlay: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  priceBlur: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  priceText: {
    color: palette.white,
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 19,
    fontWeight: '800',
    color: palette.white,
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  tag: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  premiumTag: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderColor: 'rgba(99, 102, 241, 0.2)',
  },
  tagText: {
    fontSize: 11,
    color: palette.gray400,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  premiumTagText: {
    color: palette.accentLight,
  },
  description: {
    fontSize: 14,
    color: palette.gray400,
    lineHeight: 22,
  },
  premiumGlassEffect: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.5,
  },
});
