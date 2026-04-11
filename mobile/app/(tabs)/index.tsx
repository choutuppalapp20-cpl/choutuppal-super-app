import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { palette } from '@/constants/colors';
import { t, Language, getStoredLanguage } from '@/lib/language';
import StoriesBar, { StoryItem } from '@/components/stories-bar';
import { supabase } from '@/lib/supabase';

import { useLanguage } from '@/lib/LanguageContext';

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
      // We will pretend we have stories fetching. Let's make sure it handles data dynamically.
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

  const handleStoryPress = (story: StoryItem) => {
    Alert.alert("Story viewed", story.mediaUrl);
  };

  const handleAddStory = () => {
    Alert.alert("Add Story", "Under construction - Upload coming soon!");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('home.welcome', lang)}</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={palette.primary} style={{ marginTop: 40 }} />
        ) : (
          <StoriesBar 
            stories={stories} 
            onStoryPress={handleStoryPress} 
            onAddPress={handleAddStory}
            addLabel={t('stories.add', lang)} 
          />
        )}
        
        <View style={styles.content}>
          <Text style={styles.subtitle}>
            {lang === 'telugu' ? 'తాజా జాబితాలు' : 'Latest Listings'}
          </Text>
          <Text style={{ color: palette.gray500, marginTop: 10 }}>
            {lang === 'telugu' ? 'త్వరలో రాబోతోంది!' : 'Coming soon!'}
          </Text>
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
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: palette.white,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 20,
  }
});
