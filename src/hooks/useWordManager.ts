import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Word } from '../types';
import { sampleWords } from '../data/words';

const STORAGE_KEY = '@english_words';

export function useWordManager() {
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWords();
  }, []);

  const loadWords = async () => {
    try {
      const storedWords = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedWords) {
        setWords(JSON.parse(storedWords));
      } else {
        setWords(sampleWords);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sampleWords));
      }
    } catch (error) {
      console.error('Error loading words:', error);
      setWords(sampleWords);
    } finally {
      setLoading(false);
    }
  };

  const saveWords = async (updatedWords: Word[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedWords));
      setWords(updatedWords);
    } catch (error) {
      console.error('Error saving words:', error);
    }
  };

  const markMastered = (wordId: string) => {
    const updatedWords = words.map(word =>
      word.id === wordId ? { ...word, mastered: true } : word
    );
    saveWords(updatedWords);
  };

  const incrementReviewCount = (wordId: string) => {
    const updatedWords = words.map(word =>
      word.id === wordId
        ? { ...word, reviewCount: word.reviewCount + 1 }
        : word
    );
    saveWords(updatedWords);
  };

  const getWordsByCategory = (category: string) => {
    return words.filter(word => word.category === category);
  };

  const getMasteredWords = () => {
    return words.filter(word => word.mastered);
  };

  const getUnmasteredWords = () => {
    return words.filter(word => !word.mastered);
  };

  return {
    words,
    loading,
    markMastered,
    incrementReviewCount,
    getWordsByCategory,
    getMasteredWords,
    getUnmasteredWords,
  };
}
