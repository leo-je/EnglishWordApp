import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../navigation/types';
import { useWordManager } from '../hooks/useWordManager';
import { Word } from '../types';

type WordDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'WordDetail'>;
type WordDetailScreenRouteProp = RouteProp<RootStackParamList, 'WordDetail'>;

export function WordDetailScreen() {
  const navigation = useNavigation<WordDetailScreenNavigationProp>();
  const route = useRoute<WordDetailScreenRouteProp>();
  const insets = useSafeAreaInsets();
  const { wordId } = route.params;
  const { words, markMastered } = useWordManager();
  
  const word = words.find(w => w.id === wordId);
  const [showExample, setShowExample] = useState(false);
  
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const handleToggleMastered = () => {
    if (word) {
      if (!word.mastered) {
        markMastered(word.id);
      }
    }
  };

  if (!word) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + 20 }]}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← 返回</Text>
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.wordCard}>
          <Text style={styles.word}>{word.word}</Text>
          <Text style={styles.pronunciation}>{word.pronunciation}</Text>
          
          <View style={styles.divider} />
          
          <Text style={styles.label}>释义</Text>
          <Text style={styles.meaning}>{word.meaning}</Text>
          
          <View style={styles.divider} />
          
          <Text style={styles.label}>例句</Text>
          <TouchableOpacity
            onPress={() => setShowExample(!showExample)}
            style={styles.exampleToggle}
          >
            <Text style={styles.example}>
              {word.example}
            </Text>
            <Text style={styles.toggleHint}>
              {showExample ? '▲ 收起' : '▼ 展开'}
            </Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <Text style={styles.label}>学习进度</Text>
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              已复习 {word.reviewCount} 次
            </Text>
            <Text style={[styles.progressStatus, word.mastered && styles.mastered]}>
              {word.mastered ? '✓ 已掌握' : '○ 学习中'}
            </Text>
          </View>
        </View>

        {!word.mastered && (
          <Animated.View style={[animatedStyle]}>
            <TouchableOpacity
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              onPress={handleToggleMastered}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={['#f093fb', '#f5576c']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.masterButton}
              >
                <Text style={styles.masterButtonText}>标记为已掌握</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingBottom: 32,
    paddingHorizontal: 20,
  },
  backButton: {
    marginBottom: 8,
  },
  backText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  wordCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    marginTop: 10,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  word: {
    fontSize: 36,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  pronunciation: {
    fontSize: 18,
    color: '#999',
    marginBottom: 24,
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 16,
  },
  label: {
    fontSize: 14,
    color: '#999',
    marginBottom: 8,
    fontWeight: '600',
  },
  meaning: {
    fontSize: 20,
    color: '#333',
    lineHeight: 28,
  },
  exampleToggle: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 16,
  },
  example: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  toggleHint: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  progressContainer: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 16,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  progressStatus: {
    fontSize: 16,
    color: '#999',
    fontWeight: '600',
  },
  mastered: {
    color: '#4ECDC4',
  },
  masterButton: {
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 24,
  },
  masterButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
});
