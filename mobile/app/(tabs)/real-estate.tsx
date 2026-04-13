import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, SafeAreaView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { palette } from '@/constants/colors';
import { t } from '@/lib/language';
import { supabase } from '@/lib/supabase';
import RealEstateCard, { RealEstateListing } from '@/components/real-estate-card';
import { useLanguage } from '@/lib/LanguageContext';
import { Ionicons } from '@expo/vector-icons';

export default function RealEstateScreen() {
  const { lang } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState<RealEstateListing[]>([]);
  const [activeType, setActiveType] = useState('All');

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('real_estate_listings')
        .select(`
          id, title, description, property_type, price, image_urls, owner_id, status
        `)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn(error);
        return;
      }

      if (data) {
        // Fetch users to determine premium status (for now mock based on owner ID or index)
        const mapped = data.map((d: any, index: number) => ({
          id: d.id,
          title: d.title,
          description: d.description,
          propertyType: d.property_type,
          price: d.price,
          imageUrls: d.image_urls || [],
          isPremium: index % 4 === 0, // Mocking premium logic for showcase
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

  const filteredListings = activeType === 'All' 
    ? listings 
    : listings.filter(l => l.propertyType === activeType);

  const filterTypes = ['All', 'Villa', 'Plot', 'Apartment', 'Commercial'];

  return (
    <SafeAreaView style={styles.container}>
      {/* Brand Header */}
      <View style={styles.navbar}>
        <View>
          <Text style={styles.navBrand}>REAL ESTATE</Text>
          <Text style={styles.navSubtitle}>Choutuppal Prime • Verified Properties</Text>
        </View>
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search" size={24} color={palette.gray400} />
        </TouchableOpacity>
      </View>

      {/* Filter Pills */}
      <View>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={filterTypes}
          keyExtractor={item => item}
          contentContainerStyle={styles.filterBar}
          renderItem={({ item }) => (
            <TouchableOpacity 
              onPress={() => setActiveType(item)}
              style={[styles.filterPill, activeType === item && styles.activePill]}
            >
              <Text style={[styles.pillText, activeType === item && styles.activePillText]}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
      
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="small" color={palette.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredListings}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <RealEstateCard 
              listing={item} 
              index={index} 
              onPress={handlePress} 
              lang={lang} 
            />
          )}
          ListHeaderComponent={
             <View style={styles.summaryBox}>
                <Text style={styles.summaryText}>
                   Showing {filteredListings.length} premium opportunities in the Choutuppal region.
                </Text>
             </View>
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
               <Ionicons name="business-outline" size={48} color={palette.gray800} />
               <Text style={styles.emptyText}>
                  {lang === 'telugu' ? 'జాబితాలు కనుగొనబడలేదు.' : 'No active listings in this category.'}
               </Text>
            </View>
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
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  navBrand: {
    fontSize: 18,
    fontWeight: '900',
    color: palette.white,
    letterSpacing: 2,
  },
  navSubtitle: {
    fontSize: 10,
    fontWeight: '700',
    color: palette.accent,
    textTransform: 'uppercase',
    marginTop: 2,
    letterSpacing: 0.5,
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.gray900,
  },
  filterBar: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: palette.gray900,
    borderWidth: 1,
    borderColor: palette.gray800,
  },
  activePill: {
    backgroundColor: palette.primary,
    borderColor: palette.primary,
  },
  pillText: {
    color: palette.gray400,
    fontSize: 12,
    fontWeight: '700',
  },
  activePillText: {
    color: palette.gray950,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  summaryBox: {
     marginBottom: 16,
     paddingHorizontal: 4,
  },
  summaryText: {
     fontSize: 12,
     color: palette.gray500,
     fontWeight: '500',
  },
  center: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  emptyContainer: {
    marginTop: 60,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  emptyText: {
    color: palette.gray500,
    fontSize: 14,
    fontWeight: '600',
  }
});
