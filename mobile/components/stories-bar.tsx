import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import Animated, { FadeIn } from 'react-native-reanimated';
import { palette } from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';

const STORY_SIZE = 72;
const RING_SIZE = STORY_SIZE + 6;

export interface StoryItem {
  id: string;
  userName: string;
  avatarUrl: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  isViewed?: boolean;
}

interface StoriesBarProps {
  stories: StoryItem[];
  onStoryPress: (story: StoryItem) => void;
  onAddPress?: () => void;
  addLabel?: string;
}

export default function StoriesBar({
  stories,
  onStoryPress,
  onAddPress,
  addLabel = 'Add',
}: StoriesBarProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
      style={styles.container}
    >
      {/* Add Story button */}
      {onAddPress && (
        <Animated.View entering={FadeIn.delay(100)} style={styles.storyWrapper}>
          <TouchableOpacity
            onPress={onAddPress}
            activeOpacity={0.8}
            style={styles.addButton}
          >
            <View style={styles.addIconContainer}>
              <Text style={styles.addIcon}>＋</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.storyName} numberOfLines={1}>
            {addLabel}
          </Text>
        </Animated.View>
      )}

      {/* Story items */}
      {stories.map((story, index) => (
        <Animated.View
          key={story.id}
          entering={FadeIn.delay(150 + index * 60)}
          style={styles.storyWrapper}
        >
          <TouchableOpacity
            onPress={() => onStoryPress(story)}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={
                story.isViewed
                  ? [palette.gray400, palette.gray300]
                  : [palette.accent, palette.primary, palette.primaryDark]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.storyRing}
            >
              <View style={styles.storyAvatarBorder}>
                <Image
                  source={{ uri: story.avatarUrl }}
                  style={styles.storyAvatar}
                  contentFit="cover"
                  placeholder="L5H2EC=PM+yV0g-mq.wG9c010J}I"
                  transition={200}
                />
              </View>
            </LinearGradient>
          </TouchableOpacity>
          <Text style={styles.storyName} numberOfLines={1}>
            {story.userName}
          </Text>
        </Animated.View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 14,
  },
  storyWrapper: {
    alignItems: 'center',
    width: RING_SIZE + 8,
  },
  storyRing: {
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: RING_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  storyAvatarBorder: {
    width: STORY_SIZE,
    height: STORY_SIZE,
    borderRadius: STORY_SIZE / 2,
    borderWidth: 3,
    borderColor: palette.gray950,
    overflow: 'hidden',
  },
  storyAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: STORY_SIZE / 2,
  },
  storyName: {
    fontSize: 11,
    color: palette.gray400,
    marginTop: 6,
    textAlign: 'center',
  },
  addButton: {
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: RING_SIZE / 2,
    borderWidth: 2,
    borderColor: palette.primary,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(6, 182, 212, 0.08)',
  },
  addIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addIcon: {
    fontSize: 18,
    color: palette.white,
    fontWeight: '700',
    lineHeight: 22,
  },
});
