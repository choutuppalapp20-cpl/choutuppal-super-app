import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, SafeAreaView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { palette } from '@/constants/colors';
import { t, Language, getStoredLanguage } from '@/lib/language';
import { supabase } from '@/lib/supabase';
import RealEstateCard, { RealEstateListing } from '@/components/real-estate-card';

import { useLanguage } from '@/lib/LanguageContext';

export default function RealEstateScreen() {
  const { lang } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState<RealEstateListing[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('real_estate_listings')
        .select(`
          id, title, description, property_type, price, image_urls, owner_id
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.warn(error);
        return;
      }

      if (data) {
        // Find if premium randomly or by users plan for now mock premium dynamically 
        // real PRD says based on user subscription, but we'll fetch that later or mock
        const mapped = data.map((d: any, index: number) => ({
          id: d.id,
          title: d.title,
          description: d.description,
          propertyType: d.property_type,
          price: d.price,
          imageUrls: d.image_urls || [],
          isPremium: index % 3 === 0, // Mocking premium for 'first/top' effect visually per PRD
        }));
        setListings(mapped);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handlePress = (listing: RealEstateListing) => {
    router.push({ pathname: '/listing/[id]', params: { id: listing.id } });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('realestate.title', lang)}</Text>
      </View>
      
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={palette.primary} />
        </View>
      ) : (
        <FlatList
          data={listings}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item, index }) => (
            <RealEstateCard 
              listing={item} 
              index={index} 
              onPress={handlePress} 
              lang={lang} 
            />
          )}
          ListEmptyComponent={
            <Text style={{color: palette.gray500, textAlign: 'center', marginTop: 40}}>
              {lang === 'telugu' ? 'జాబితాలు కనుగొనబడలేదు.' : 'No listings found.'}
            </Text>
          }
        />
      )}
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
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  center: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center'
  }
});
