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
              <BlurView intensity={40} tint="dark" style={styles.premiumBadge}>
                <Text style={styles.premiumBadgeText}>⭐ Premium</Text>
              </BlurView>
            </View>
          )}

          {/* Price overlay */}
          <View style={styles.priceOverlay}>
            <BlurView intensity={60} tint="dark" style={styles.priceBlur}>
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
            <View style={styles.tag}>
              <Text style={styles.tagText}>
                {propertyLabel}: {listing.propertyType}
              </Text>
            </View>
          </View>

          {listing.description ? (
            <Text style={styles.description} numberOfLines={2}>
              {listing.description}
            </Text>
          ) : null}

          {/* NO phone number displayed — per PRD requirement */}
          {/* Contact via "Connect via App" only */}
        </View>

        {/* Glassmorphism overlay for premium */}
        {listing.isPremium && (
          <View style={styles.glassOverlay} pointerEvents="none">
            <View style={styles.glassShine} />
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: palette.gray900,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: palette.gray800,
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  premiumCard: {
    borderColor: 'rgba(245, 158, 11, 0.4)',
    shadowColor: palette.accent,
    shadowOpacity: 0.2,
  },
  imageContainer: {
    width: '100%',
    height: 200,
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
  },
  premiumBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  premiumBadgeText: {
    color: palette.accentLight,
    fontSize: 12,
    fontWeight: '700',
  },
  priceOverlay: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  priceBlur: {
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  priceText: {
    color: palette.white,
    fontSize: 18,
    fontWeight: '800',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: palette.white,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  tag: {
    backgroundColor: 'rgba(6, 182, 212, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 12,
    color: palette.primaryLight,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: palette.gray400,
    lineHeight: 20,
  },
  glassOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
    overflow: 'hidden',
  },
  glassShine: {
    position: 'absolute',
    top: -60,
    left: -40,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
});
