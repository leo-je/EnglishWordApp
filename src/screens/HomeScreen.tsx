import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { useWordManager } from '../hooks/useWordManager';
import { categories } from '../types';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

export function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { words, getMasteredWords } = useWordManager();
  const masteredCount = getMasteredWords().length;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.title}>背单词</Text>
          <Text style={styles.subtitle}>已掌握 {masteredCount} / {words.length} 个单词</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.progressContainer}>
          <LinearGradient
            colors={['#4facfe', '#00f2fe']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.startButton}
          >
            <TouchableOpacity onPress={() => navigation.navigate('Learn')}>
              <View style={styles.buttonContent}>
                <Text style={styles.startButtonText}>开始学习</Text>
                <Text style={styles.startButtonSubtext}>今日新词</Text>
              </View>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        <Text style={styles.categoryTitle}>选择分类</Text>
        <View style={styles.categoriesContainer}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[styles.categoryCard, { borderLeftWidth: 4, borderLeftColor: category.color }]}
              onPress={() => navigation.navigate('WordList', { category: category.id })}
            >
              <View style={styles.categoryContent}>
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.categoryCount}>
                  {words.filter(w => w.category === category.id).length} 个单词
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.masteredCard}
          onPress={() => navigation.navigate('Mastered')}
        >
          <LinearGradient
            colors={['#f093fb', '#f5576c']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.masteredGradient}
          >
            <View style={styles.buttonContent}>
              <Text style={styles.masteredTitle}>已掌握</Text>
              <Text style={styles.masteredCount}>{masteredCount} 个单词</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
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
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  headerContent: {
    marginTop: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  progressContainer: {
    marginTop: -30,
    marginBottom: 30,
  },
  startButton: {
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonContent: {
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  startButtonSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  categoriesContainer: {
    marginBottom: 24,
  },
  categoryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  categoryCount: {
    fontSize: 14,
    color: '#999',
  },
  masteredCard: {
    borderRadius: 16,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  masteredGradient: {
    borderRadius: 16,
    padding: 24,
  },
  masteredTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  masteredCount: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
});
