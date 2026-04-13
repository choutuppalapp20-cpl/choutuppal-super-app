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
    <BlurView intensity={80} tint="dark" style={[styles.container, { paddingBottom: Math.max(insets.bottom, 16) + 12 }]}>
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
          <ActivityIndicator color={palette.gray950} size="small" />
        ) : sent ? (
          <>
            <Ionicons name="checkmark-circle" size={20} color={palette.white} />
            <Text style={styles.buttonText}>
              {t('realestate.lead_sent', lang)}
            </Text>
          </>
        ) : (
          <>
            <Ionicons name="chatbubbles" size={20} color={palette.gray950} />
            <Text style={styles.buttonText}>
              {t('realestate.connect', lang)}
            </Text>
          </>
        )}
      </AnimatedTouchable>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    overflow: 'hidden',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.primary,
    height: 60,
    borderRadius: 20,
    gap: 10,
    // Premium soft shadow
    shadowColor: palette.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  buttonSent: {
    backgroundColor: '#10B981',
    shadowColor: '#10B981',
  },
  buttonText: {
    color: palette.gray950,
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: -0.2,
  },
});
