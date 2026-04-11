import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { palette } from '@/constants/colors';
import { supabase } from '@/lib/supabase';
import { t, Language } from '@/lib/language';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface ConnectButtonProps {
  listingId: string;
  lang: Language;
}

export default function ConnectViaAppButton({ listingId, lang }: ConnectButtonProps) {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const scale = useSharedValue(1);
  const insets = useSafeAreaInsets();

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleConnect = async () => {
    if (sent || loading) return;

    // Bounce animation
    scale.value = withSequence(
      withTiming(0.92, { duration: 100 }),
      withSpring(1, { damping: 4, stiffness: 200 })
    );

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        Alert.alert(
          lang === 'telugu' ? 'లాగిన్ అవసరం' : 'Login Required',
          lang === 'telugu'
            ? 'దయచేసి మొదట లాగిన్ అవ్వండి'
            : 'Please log in first to connect with listing owners.'
        );
        setLoading(false);
        return;
      }

      const { error } = await supabase.from('real_estate_leads').insert({
        listing_id: listingId,
        lead_user_id: user.id,
        status: 'pending',
      });

      if (error) throw error;

      setSent(true);
    } catch (err: any) {
      Alert.alert(
        t('common.error', lang),
        err?.message ?? 'Unknown error occurred'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 16) + 16 }]}>
      <AnimatedTouchable
        style={[
          styles.button,
          sent && styles.buttonSent,
          animatedStyle,
        ]}
        onPress={handleConnect}
        activeOpacity={0.85}
        disabled={sent || loading}
      >
        {loading ? (
          <ActivityIndicator color={palette.white} size="small" />
        ) : sent ? (
          <>
            <Text style={styles.checkmark}>✓</Text>
            <Text style={styles.buttonText}>
              {t('realestate.lead_sent', lang)}
            </Text>
          </>
        ) : (
          <>
            <Text style={styles.phoneIcon}>📲</Text>
            <Text style={styles.buttonText}>
              {t('realestate.connect', lang)}
            </Text>
          </>
        )}
      </AnimatedTouchable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: 32,
    paddingTop: 16,
    backgroundColor: 'rgba(10, 15, 26, 0.95)',
    borderTopWidth: 1,
    borderTopColor: palette.gray800,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.primary,
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
    // Shadow
    shadowColor: palette.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonSent: {
    backgroundColor: palette.success,
    shadowColor: palette.success,
  },
  buttonText: {
    color: palette.white,
    fontSize: 16,
    fontWeight: '700',
  },
  phoneIcon: {
    fontSize: 20,
  },
  checkmark: {
    fontSize: 20,
    color: palette.white,
    fontWeight: '700',
  },
});
