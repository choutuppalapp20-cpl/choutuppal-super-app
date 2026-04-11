import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { palette } from '@/constants/colors';
import { t, Language, getStoredLanguage } from '@/lib/language';
import { supabase } from '@/lib/supabase';
import ConnectViaAppButton from '@/components/connect-via-app-button';

import { useLanguage } from '@/lib/LanguageContext';

const { height } = Dimensions.get('window');

export default function ListingDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const { lang } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [listing, setListing] = useState<any>(null);

  useEffect(() => {
    fetchListingDetails();
  }, [id]);

  const fetchListingDetails = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('real_estate_listings')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      setListing(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={palette.primary} />
      </View>
    );
  }

  if (!listing) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={{color: palette.gray500}}>{lang === 'telugu' ? 'జాబితా కనుగొనబడలేదు' : 'Listing not found'}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: listing.image_urls?.[0] ?? 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600' }}
            style={styles.image}
            contentFit="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(10, 15, 26, 0.9)']}
            style={styles.imageGradient}
          />
        </View>
        
        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.price}>₹{listing.price?.toLocaleString('en-IN')}</Text>
          <Text style={styles.title}>{listing.title}</Text>
          
          <View style={styles.tag}>
            <Text style={styles.tagText}>{listing.property_type}</Text>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{lang === 'telugu' ? 'వివరణ' : 'Description'}</Text>
            <Text style={styles.description}>{listing.description}</Text>
          </View>

          <View style={styles.privacyNoticeRow}>
            <Text style={styles.privacyIcon}>🔒</Text>
            <Text style={styles.privacyNotice}>
              {lang === 'telugu' ? 'భద్రత కోసం ఫోన్ నంబర్లు నిలిపివేయబడ్డాయి.' : 'Contact numbers are hidden for privacy.'}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Connect Button Component */}
      <ConnectViaAppButton listingId={id as string} lang={lang} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.gray950,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 120, // leave space for absolute connect button
  },
  imageContainer: {
    width: '100%',
    height: height * 0.4,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  content: {
    padding: 16,
    marginTop: -20, // slight overlap with gradient
  },
  price: {
    fontSize: 28,
    fontWeight: '800',
    color: palette.accentLight,
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: palette.white,
    marginBottom: 12,
  },
  tag: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(6, 182, 212, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 24,
  },
  tagText: {
    fontSize: 14,
    color: palette.primaryLight,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: palette.white,
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: palette.gray400,
    lineHeight: 24,
  },
  privacyNoticeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 12,
    borderRadius: 12,
    gap: 12,
  },
  privacyIcon: {
    fontSize: 20,
  },
  privacyNotice: {
    flex: 1,
    color: palette.gray400,
    fontSize: 14,
  }
});
