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
                  : [palette.primary, palette.accent]
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
    backgroundColor: 'transparent',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 4,
    gap: 12,
  },
  storyWrapper: {
    alignItems: 'center',
    width: RING_SIZE + 4,
  },
  storyRing: {
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: RING_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  storyAvatarBorder: {
    width: RING_SIZE - 4,
    height: RING_SIZE - 4,
    borderRadius: (RING_SIZE - 4) / 2,
    borderWidth: 2,
    borderColor: palette.gray950,
    overflow: 'hidden',
    backgroundColor: palette.gray900,
  },
  storyAvatar: {
    width: '100%',
    height: '100%',
  },
  storyName: {
    fontSize: 10,
    fontWeight: '500',
    color: palette.gray300,
    marginTop: 6,
    textAlign: 'center',
  },
  addButton: {
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: RING_SIZE / 2,
    backgroundColor: 'rgba(45, 212, 191, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(45, 212, 191, 0.3)',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addIcon: {
    fontSize: 16,
    color: palette.white,
    fontWeight: 'bold',
  },
});
