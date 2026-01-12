import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../navigation/types';
import { useWordManager } from '../hooks/useWordManager';
import { Word } from '../types';

type MasteredScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Mastered'>;

export function MasteredScreen() {
  const navigation = useNavigation<MasteredScreenNavigationProp>();
  const insets = useSafeAreaInsets();
  const { getMasteredWords } = useWordManager();
  
  const words = getMasteredWords();

  const renderWord = ({ item }: { item: Word }) => (
    <TouchableOpacity
      style={styles.wordCard}
      onPress={() => navigation.navigate('WordDetail', { wordId: item.id })}
    >
      <View style={styles.wordHeader}>
        <Text style={styles.word}>{item.word}</Text>
        <View style={styles.masteredBadge}>
          <Text style={styles.masteredText}>✓</Text>
        </View>
      </View>
      <Text style={styles.pronunciation}>{item.pronunciation}</Text>
      <Text style={styles.meaning}>{item.meaning}</Text>
      <Text style={styles.reviewCount}>已复习 {item.reviewCount} 次</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#f093fb', '#f5576c']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + 20 }]}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← 返回</Text>
        </TouchableOpacity>
        <Text style={styles.title}>已掌握</Text>
        <Text style={styles.subtitle}>{words.length} 个单词</Text>
      </LinearGradient>

      {words.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>还没有掌握的单词</Text>
          <Text style={styles.emptySubtext}>快去学习吧！</Text>
        </View>
      ) : (
        <FlatList
          data={words}
          renderItem={renderWord}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  list: {
    padding: 20,
  },
  wordCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  wordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  word: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
  },
  masteredBadge: {
    backgroundColor: '#4ECDC4',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  masteredText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  pronunciation: {
    fontSize: 14,
    color: '#999',
    marginBottom: 8,
  },
  meaning: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  reviewCount: {
    fontSize: 12,
    color: '#4ECDC4',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
});
