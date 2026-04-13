import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { palette } from '@/constants/colors';
import { t } from '@/lib/language';
import StoriesBar, { StoryItem } from '@/components/stories-bar';
import PremiumHeroCard from '@/components/premium-hero-card';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/lib/LanguageContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function HomeScreen() {
  const { lang } = useLanguage();
  const [stories, setStories] = useState<StoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('stories')
        .select(`
          id, media_url, media_type,
          users:user_id (id, full_name)
        `)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (error) {
        console.warn(error);
        return;
      }
      
      if (data) {
        const mappedStories: StoryItem[] = data.map((s: any) => ({
          id: s.id,
          userName: s.users?.full_name || 'User',
          avatarUrl: 'https://i.pravatar.cc/100?u=' + s.id, 
          mediaUrl: s.media_url,
          mediaType: s.media_type,
        }));
        setStories(mappedStories);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navbar}>
        <View>
          <Text style={styles.navBrand}>CHOUTUPPAL</Text>
          <Text style={styles.navSubtitle}>Lumina Local • {new Date().toLocaleDateString(lang === 'telugu' ? 'te-IN' : 'en-IN', { weekday: 'long' })}</Text>
        </View>
        <TouchableOpacity style={styles.profileButton} onPress={() => router.push('/profile')}>
          <Ionicons name="person-circle-outline" size={32} color={palette.gray400} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Stories Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{lang === 'telugu' ? 'కథలు' : 'Local Stories'}</Text>
        </View>
        {loading ? (
          <ActivityIndicator size="small" color={palette.primary} style={{ marginVertical: 20 }} />
        ) : (
          <StoriesBar 
            stories={stories} 
            onStoryPress={(s) => Alert.alert("View Story", s.userName)} 
            onAddPress={() => Alert.alert("Add Story", "Feature coming soon!")}
            addLabel={t('stories.add', lang)} 
          />
        )}

        {/* Hero Section */}
        <View style={styles.heroSpacing}>
          <PremiumHeroCard
            title="Elite Residency"
            subtitle="Premium 3BHK Villas • Near Highway"
            price="₹2.4 Cr"
            imageUrl="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800"
            isPremium={true}
            onPress={() => router.push('/listing/elite-residency')}
          />
        </View>

        {/* Discovery Sectors */}
        <View style={styles.content}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{lang === 'telugu' ? 'అన్వేషించండి' : 'Discover Local'}</Text>
          </View>
          
          <View style={styles.grid}>
            {[
              { id: 'real', icon: 'business', label: lang === 'telugu' ? 'రియల్ ఎస్టేట్' : 'Real Estate', color: palette.accent },
              { id: 'jobs', icon: 'briefcase', label: lang === 'telugu' ? 'ఉద్యోగాలు' : 'Jobs', color: '#10B981' },
              { id: 'news', icon: 'newspaper', label: lang === 'telugu' ? 'వార్తలు' : 'News', color: '#F59E0B' },
              { id: 'more', icon: 'grid', label: lang === 'telugu' ? 'మరిన్ని' : 'Services', color: palette.primary },
            ].map((item) => (
              <TouchableOpacity key={item.id} style={styles.sectorCard}>
                <View style={[styles.iconBox, { backgroundColor: `${item.color}15` }]}>
                  <Ionicons name={item.icon as any} size={24} color={item.color} />
                </View>
                <Text style={styles.sectorLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Featured Listings Placeholder */}
        <View style={[styles.content, { marginTop: 10 }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{lang === 'telugu' ? 'ఫీచర్ చేసినవి' : 'Featured Now'}</Text>
            <TouchableOpacity><Text style={styles.seeAll}>{lang === 'telugu' ? 'అన్నీ చూడండి' : 'See all'}</Text></TouchableOpacity>
          </View>
          <View style={styles.placeholderCard}>
             <Ionicons name="sparkles-outline" size={24} color={palette.gray700} />
             <Text style={styles.placeholderText}>New listings being curated for you...</Text>
          </View>
        </View>
      </ScrollView>
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
    borderBottomWidth: 1,
    borderColor: palette.gray900,
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
    color: palette.primary,
    textTransform: 'uppercase',
    marginTop: 2,
    letterSpacing: 0.5,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: palette.white,
    letterSpacing: -0.2,
  },
  seeAll: {
    fontSize: 12,
    fontWeight: '700',
    color: palette.primary,
  },
  heroSpacing: {
    marginTop: 10,
  },
  content: {
    paddingHorizontal: 0,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
    rowGap: 10,
  },
  sectorCard: {
    width: '25%',
    alignItems: 'center',
    paddingVertical: 10,
  },
  iconBox: {
    width: 54,
    height: 54,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  sectorLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: palette.gray400,
    textAlign: 'center',
  },
  placeholderCard: {
    marginHorizontal: 20,
    padding: 30,
    borderRadius: 24,
    backgroundColor: palette.gray900,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: palette.gray800,
  },
  placeholderText: {
    color: palette.gray600,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 12,
    textAlign: 'center',
  }
});
