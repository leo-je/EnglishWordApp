import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../navigation/types';
import { useWordManager } from '../hooks/useWordManager';
import { Word } from '../types';

type LearnScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Learn'>;
type LearnScreenRouteProp = RouteProp<RootStackParamList, 'Learn'>;

const { width } = Dimensions.get('window');

export function LearnScreen() {
  const navigation = useNavigation<LearnScreenNavigationProp>();
  const route = useRoute<LearnScreenRouteProp>();
  const insets = useSafeAreaInsets();
  const { words, markMastered, incrementReviewCount } = useWordManager();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const unmasteredWords = words.filter(w => !w.mastered);
  const currentWord = unmasteredWords[currentIndex];

  const rotateY = useSharedValue(0);
  const opacity = useSharedValue(1);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ rotateY: `${rotateY.value}deg` }],
    opacity: opacity.value,
  }));

  const handleNextWord = () => {
    if (currentIndex < unmasteredWords.length - 1) {
      opacity.value = 0;
      cardScale.value = 0.8;
      
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        setShowAnswer(false);
        opacity.value = withTiming(1);
        cardScale.value = withSpring(1);
      }, 200);
    } else {
      navigation.goBack();
    }
  };

  const handleFlip = () => {
    if (showAnswer) {
      incrementReviewCount(currentWord.id);
    }
    
    const isShowingAnswer = !showAnswer;
    const targetRotation = isShowingAnswer ? 180 : 360;
    
    rotateY.value = withSpring(targetRotation, {
      damping: 15,
    });
    
    setTimeout(() => {
      setShowAnswer(isShowingAnswer);
    }, 150);
  };

  const handleMarkMastered = () => {
    markMastered(currentWord.id);
    handleNextWord();
  };

  const handlePressIn = () => {
    cardScale.value = withSpring(0.97);
  };

  const handlePressOut = () => {
    cardScale.value = withSpring(1);
  };

  if (!currentWord) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>太棒了！</Text>
          <Text style={styles.emptySubtext}>你已经掌握了所有单词</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>返回首页</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← 返回</Text>
        </TouchableOpacity>
        <Text style={styles.progress}>
          {currentIndex + 1} / {unmasteredWords.length}
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.cardContainer}>
          <Animated.View
            style={cardStyle}
          >
            <TouchableOpacity
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handleFlip}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={showAnswer ? ['#f093fb', '#f5576c'] : ['#667eea', '#764ba2']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.card}
            >
              <View style={styles.cardContent}>
                {!showAnswer ? (
                  <View style={styles.wordContainer}>
                    <Text style={styles.word}>{currentWord.word}</Text>
                    <Text style={styles.pronunciation}>
                      {currentWord.pronunciation}
                    </Text>
                    <Text style={styles.hint}>点击卡片查看释义</Text>
                  </View>
                ) : (
                  <View style={styles.meaningContainer}>
                    <Text style={styles.meaning}>{currentWord.meaning}</Text>
                    <View style={styles.exampleContainer}>
                      <Text style={styles.exampleLabel}>例句：</Text>
                      <Text style={styles.example}>{currentWord.example}</Text>
                    </View>
                  </View>
                )}
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
        </View>

        {showAnswer && (
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[styles.actionButton, styles.nextButton]}
              onPress={handleNextWord}
            >
              <LinearGradient
                colors={['#4facfe', '#00f2fe']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>下个单词</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.masteredButton]}
              onPress={handleMarkMastered}
            >
              <LinearGradient
                colors={['#f093fb', '#f5576c']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>已掌握</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backText: {
    fontSize: 16,
    color: '#667eea',
    fontWeight: '600',
  },
  progress: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  cardContainer: {
    width: width - 40,
    perspective: 1000,
  },
  card: {
    borderRadius: 20,
    padding: 32,
    minHeight: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
    backfaceVisibility: 'hidden',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wordContainer: {
    alignItems: 'center',
  },
  word: {
    fontSize: 36,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
  },
  pronunciation: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 24,
  },
  hint: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  meaningContainer: {
    alignItems: 'center',
  },
  meaning: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 24,
  },
  exampleContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: 16,
    borderRadius: 12,
  },
  exampleLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  example: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 32,
    width: width - 40,
  },
  actionButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  nextButton: {
    width: (width - 60) / 2,
  },
  masteredButton: {
    width: (width - 60) / 2,
  },
  buttonGradient: {
    padding: 16,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#667eea',
    marginBottom: 12,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
