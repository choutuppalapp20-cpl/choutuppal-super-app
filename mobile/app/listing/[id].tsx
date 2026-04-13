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
        <ActivityIndicator size="small" color={palette.primary} />
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
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Gallery / Image Section */}
        <View style={styles.imageHeader}>
          <Image
            source={{ uri: listing.image_urls?.[0] ?? 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800' }}
            style={styles.image}
            contentFit="cover"
            transition={300}
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.6)', 'transparent', 'rgba(10, 15, 26, 1)']}
            style={StyleSheet.absoluteFill}
          />
          
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <BlurView intensity={70} tint="dark" style={styles.circleBlur}>
              <Ionicons name="arrow-back" size={20} color={palette.white} />
            </BlurView>
          </TouchableOpacity>

          <View style={styles.priceContainer}>
            <BlurView intensity={90} tint="light" style={styles.priceGlass}>
               <Text style={styles.priceText}>₹{listing.price?.toLocaleString('en-IN')}</Text>
            </BlurView>
          </View>
        </View>
        
        {/* Detailed Info */}
        <View style={styles.content}>
          <View style={styles.headerInfo}>
             <View style={styles.typeBadge}>
                <Text style={styles.typeText}>{listing.property_type}</Text>
             </View>
             <Text style={styles.title}>{listing.title}</Text>
             <View style={styles.locationRow}>
                <Ionicons name="location-outline" size={16} color={palette.primary} />
                <Text style={styles.locationText}>Choutuppal, Nalgonda District</Text>
             </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{lang === 'telugu' ? 'వివరణ' : 'Property Overview'}</Text>
            <Text style={styles.description}>{listing.description}</Text>
          </View>

          {/* Quick Stats Grid */}
          <View style={styles.statsGrid}>
             {[
               { icon: 'resize-outline', label: 'Sq. Ft', value: '1850' },
               { icon: 'bed-outline', label: 'Beds', value: '3' },
               { icon: 'water-outline', label: 'Bath', value: '3' },
               { icon: 'compass-outline', label: 'Facing', value: 'East' },
             ].map((stat, i) => (
               <View key={i} style={styles.statItem}>
                 <BlurView intensity={10} tint="dark" style={styles.statGlass}>
                   <Ionicons name={stat.icon as any} size={20} color={palette.gray400} />
                   <Text style={styles.statValue}>{stat.value}</Text>
                   <Text style={styles.statLabel}>{stat.label}</Text>
                 </BlurView>
               </View>
             ))}
          </View>

          <View style={styles.safetyCard}>
            <View style={styles.safetyIconContainer}>
               <Ionicons name="shield-checkmark" size={24} color={palette.primary} />
            </View>
            <View style={styles.safetyTextContent}>
              <Text style={styles.safetyTitle}>Verified Property</Text>
              <Text style={styles.safetyNotice}>
                {lang === 'telugu' ? 'భద్రత కోసం ఫోన్ నంబర్లు నిలిపివేయబడ్డాయి.' : 'Phone numbers are hidden to protect privacy. Connect via the app for direct broker verification.'}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Connect Button */}
      <View style={styles.footer}>
         <ConnectViaAppButton listingId={id as string} lang={lang} />
      </View>
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
    paddingBottom: 120,
  },
  imageHeader: {
    width: '100%',
    height: height * 0.45,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  circleBlur: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  priceContainer: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  priceGlass: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  priceText: {
    fontSize: 26,
    fontWeight: '900',
    color: palette.gray950,
  },
  content: {
    padding: 24,
    marginTop: -10,
  },
  headerInfo: {
    marginBottom: 24,
  },
  typeBadge: {
    backgroundColor: 'rgba(45, 212, 191, 0.1)',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(45, 212, 191, 0.2)',
    marginBottom: 12,
  },
  typeText: {
    color: palette.primary,
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: palette.white,
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationText: {
    fontSize: 13,
    color: palette.gray500,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: palette.gray900,
    marginBottom: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: palette.white,
    marginBottom: 12,
    letterSpacing: -0.2,
  },
  description: {
    fontSize: 15,
    color: palette.gray400,
    lineHeight: 25,
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
  },
  statItem: {
    width: '48%',
  },
  statGlass: {
    padding: 16,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '800',
    color: palette.white,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 10,
    color: palette.gray500,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginTop: 2,
  },
  safetyCard: {
    flexDirection: 'row',
    backgroundColor: palette.gray900,
    padding: 20,
    borderRadius: 24,
    gap: 16,
    borderWidth: 1,
    borderColor: palette.gray800,
  },
  safetyIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(45, 212, 191, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  safetyTextContent: {
    flex: 1,
  },
  safetyTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: palette.white,
    marginBottom: 4,
  },
  safetyNotice: {
    color: palette.gray500,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '500',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  }
});
