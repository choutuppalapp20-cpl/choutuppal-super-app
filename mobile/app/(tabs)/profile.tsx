import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { palette } from '@/constants/colors';
import { t } from '@/lib/language';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/lib/LanguageContext';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const { lang, updateLanguage } = useLanguage();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }
      setUser(user);

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) setProfile(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/(auth)/login');
  };

  const menuItems = [
    { id: 'lang', icon: 'language', label: lang === 'english' ? 'Switch to Telugu' : 'English లోకి మారండి', action: () => updateLanguage(lang === 'english' ? 'telugu' : 'english') },
    { id: 'subs', icon: 'diamond-outline', label: 'Subscription Plans', action: () => Alert.alert('Premium', 'Upgrade functionality coming soon!') },
    { id: 'support', icon: 'help-circle-outline', label: 'Help & Support', action: () => {} },
    { id: 'about', icon: 'information-circle-outline', label: 'About App', action: () => {} },
  ];

  if (!user && !loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <View style={styles.guestIcon}>
            <Ionicons name="person-outline" size={48} color={palette.gray700} />
          </View>
          <Text style={styles.guestTitle}>Welcome to Choutuppal</Text>
          <Text style={styles.guestSubtitle}>Sign in to manage your listings and leads</Text>
          <TouchableOpacity style={styles.primaryButton} onPress={() => router.push('/(auth)/login')}>
            <Text style={styles.buttonText}>Sign In / Register</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: `https://i.pravatar.cc/200?u=${user?.id}` }} 
              style={styles.avatar}
            />
            {profile?.subscription_tier === 'premium' && (
              <View style={styles.premiumBadge}>
                <Ionicons name="star" size={12} color="#FCD34D" />
              </View>
            )}
          </View>
          <Text style={styles.userName}>{profile?.full_name || 'Valued Resident'}</Text>
          <Text style={styles.userTier}>{profile?.subscription_tier?.toUpperCase() || 'BASIC'} MEMBER</Text>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
           <View style={styles.statBox}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Listings</Text>
           </View>
           <View style={styles.divider} />
           <View style={styles.statBox}>
              <Text style={styles.statValue}>4</Text>
              <Text style={styles.statLabel}>Stories</Text>
           </View>
           <View style={styles.divider} />
           <View style={styles.statBox}>
              <Text style={styles.statValue}>Premium</Text>
              <Text style={styles.statLabel}>Tier</Text>
           </View>
        </View>

        {/* Menu Section */}
        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity key={item.id} style={styles.menuItem} onPress={item.action}>
               <BlurView intensity={5} tint="dark" style={styles.menuGlass}>
                 <View style={styles.menuRow}>
                   <View style={styles.iconBox}>
                     <Ionicons name={item.icon as any} size={20} color={palette.primary} />
                   </View>
                   <Text style={styles.menuLabel}>{item.label}</Text>
                   <Ionicons name="chevron-forward" size={18} color={palette.gray700} />
                 </View>
               </BlurView>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
        
        <Text style={styles.versionText}>Version 2.0.4 • Lumina Local Engine</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.gray950,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  guestIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: palette.gray900,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  guestTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: palette.white,
    marginBottom: 8,
  },
  guestSubtitle: {
    fontSize: 14,
    color: palette.gray500,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
  primaryButton: {
    backgroundColor: palette.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: palette.primary,
  },
  premiumBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: palette.gray900,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: palette.gray950,
  },
  userName: {
    fontSize: 24,
    fontWeight: '900',
    color: palette.white,
    letterSpacing: -0.5,
  },
  userTier: {
    fontSize: 10,
    color: palette.primary,
    fontWeight: '800',
    letterSpacing: 2,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: palette.gray900,
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: palette.gray800,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: palette.white,
  },
  statLabel: {
    fontSize: 11,
    color: palette.gray500,
    fontWeight: '600',
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: palette.gray800,
  },
  menuContainer: {
    paddingHorizontal: 20,
    marginTop: 32,
    gap: 12,
  },
  menuItem: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  menuGlass: {
    padding: 18,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(45, 212, 191, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  menuLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: palette.gray200,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    gap: 10,
  },
  logoutText: {
    color: '#EF4444',
    fontSize: 15,
    fontWeight: '800',
  },
  versionText: {
    textAlign: 'center',
    color: palette.gray700,
    fontSize: 10,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 40,
  },
  buttonText: {
    color: palette.gray950,
    fontWeight: '900',
    fontSize: 16,
  }
});
