import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator,
  TextInput,
  Modal,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../navigation/types';
import { useWordManager } from '../hooks/useWordManager';
import { Word, categories } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ImportScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Import'>;

const STORAGE_KEY = '@english_words';

const importMethods = [
  {
    id: 'demo',
    name: '导入示例数据',
    description: '导入内置的示例单词数据',
    icon: '📝',
    color: ['#f093fb', '#f5576c'],
    available: true,
  },
  {
    id: 'api',
    name: '在线API',
    description: '从在线API获取最新单词数据',
    icon: '🌐',
    color: ['#4facfe', '#00f2fe'],
    available: true,
  },
  {
    id: 'local',
    name: '本地JSON文件',
    description: '从本地导入JSON格式的单词数据（暂不可用）',
    icon: '📁',
    color: ['#667eea', '#764ba2'],
    available: false,
  },
  {
    id: 'cloud',
    name: '云存储同步',
    description: '从云存储同步和备份数据',
    icon: '☁️',
    color: ['#43e97b', '#38f9d7'],
    available: false,
  },
  {
    id: 'excel',
    name: 'Excel文件',
    description: '导入Excel或CSV格式的单词表（开发中）',
    icon: '📊',
    color: ['#fa709a', '#fee140'],
    available: false,
  },
];

const demoData = {
  categories: [
    { id: 'business', name: '商务英语', color: '#FF6B6B' },
    { id: 'technology', name: '科技', color: '#4ECDC4' },
  ],
  words: [
    {
      id: '101',
      word: 'negotiate',
      pronunciation: '/nɪˈɡoʊʃieɪt/',
      meaning: '谈判，协商',
      example: 'We need to negotiate a better price.',
      category: 'business',
      mastered: false,
      reviewCount: 0,
    },
    {
      id: '102',
      word: 'algorithm',
      pronunciation: '/ˈælɡərɪðəm/',
      meaning: '算法',
      example: 'The algorithm processes data efficiently.',
      category: 'technology',
      mastered: false,
      reviewCount: 0,
    },
    {
      id: '103',
      word: 'innovative',
      pronunciation: '/ˈɪnəveɪtɪv/',
      meaning: '创新的',
      example: 'The company is known for its innovative products.',
      category: 'technology',
      mastered: false,
      reviewCount: 0,
    },
    {
      id: '104',
      word: 'strategic',
      pronunciation: '/strəˈtiːdʒɪk/',
      meaning: '战略性的',
      example: 'We need a strategic plan for growth.',
      category: 'business',
      mastered: false,
      reviewCount: 0,
    },
  ],
};

export function ImportScreen() {
  const navigation = useNavigation<ImportScreenNavigationProp>();
  const insets = useSafeAreaInsets();
  const { words, setWords } = useWordManager();
  const [loading, setLoading] = useState(false);
  const [loadingMethod, setLoadingMethod] = useState<string | null>(null);
  const [showApiModal, setShowApiModal] = useState(false);
  const [apiUrl, setApiUrl] = useState('');

  const handleImportFromAPI = async () => {
    if (!apiUrl.trim()) {
      Alert.alert('提示', '请输入API地址');
      return;
    }

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`API请求失败: ${response.status}`);
      }
      const data = await response.json();
      await processImportedData(data, 'api');
    } catch (error) {
      throw new Error('从API获取数据失败：' + (error instanceof Error ? error.message : '未知错误'));
    }
  };

  const handleImportDemo = async () => {
    await processImportedData(demoData, 'demo');
  };

  const processImportedData = async (data: any, _source: string) => {
    try {
      if (!data.categories || !data.words) {
        throw new Error('数据格式错误：缺少 categories 或 words 字段');
      }

      const existingWords = await AsyncStorage.getItem(STORAGE_KEY);
      const parsedExistingWords = existingWords ? JSON.parse(existingWords) : [];

      const newWords = data.words.filter((newWord: Word) => 
        !parsedExistingWords.some((existingWord: Word) => existingWord.word === newWord.word)
      );

      const mergedWords = [...parsedExistingWords, ...newWords];

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(mergedWords));
      setWords(mergedWords);

      Alert.alert(
        '导入成功',
        `成功导入 ${newWords.length} 个新单词\n总计 ${mergedWords.length} 个单词`,
        [{ text: '确定', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      throw new Error('处理导入数据失败：' + (error instanceof Error ? error.message : '未知错误'));
    }
  };

  const handleImport = async (method: string) => {
    if (method === 'cloud' || method === 'excel') {
      Alert.alert(
        '功能开发中',
        '该功能正在开发中，请稍后再试',
        [{ text: '确定' }]
      );
      return;
    }

    setLoading(true);
    setLoadingMethod(method);

    try {
      switch (method) {
        case 'api':
          setShowApiModal(true);
          break;
        case 'demo':
          await handleImportDemo();
          break;
        case 'local':
        case 'cloud':
        case 'excel':
          Alert.alert(
            '功能不可用',
            '该功能暂不可用，请使用其他导入方式',
            [{ text: '确定' }]
          );
          break;
        default:
          throw new Error('未知的导入方式');
      }
    } catch (error) {
      Alert.alert(
        '导入失败',
        error instanceof Error ? error.message : '未知错误',
        [{ text: '确定' }]
      );
    } finally {
      if (method !== 'api') {
        setLoading(false);
        setLoadingMethod(null);
      }
    }
  };

  const renderImportMethod = (method: any) => (
    <TouchableOpacity
      key={method.id}
      style={styles.importCard}
      onPress={() => !loading && handleImport(method.id)}
      disabled={loading || !method.available}
      activeOpacity={method.available ? 0.7 : 1}
    >
      <LinearGradient
        colors={method.available ? method.color : ['#cccccc', '#999999']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.importCardGradient}
      >
        <View style={styles.importCardHeader}>
          <Text style={styles.importIcon}>{method.icon}</Text>
          {loading && loadingMethod === method.id ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.importArrow}>
              {method.available ? '→' : '🔒'}
            </Text>
          )}
        </View>
        <Text style={styles.importName}>{method.name}</Text>
        <Text style={styles.importDescription}>{method.description}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + 20 }]}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← 返回</Text>
        </TouchableOpacity>
        <Text style={styles.title}>导入数据</Text>
        <Text style={styles.subtitle}>选择数据导入方式</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.currentData}>
          <Text style={styles.currentDataTitle}>当前数据</Text>
          <View style={styles.currentDataCard}>
            <Text style={styles.currentDataCount}>{words.length} 个单词</Text>
            <Text style={styles.currentDataCategories}>{categories.length} 个分类</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>选择导入方式</Text>
        <View style={styles.importMethods}>
          {importMethods.map(renderImportMethod)}
        </View>

        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>💡 使用提示</Text>
          <Text style={styles.tipText}>• 支持批量导入，可多次叠加数据</Text>
          <Text style={styles.tipText}>• 导入前会检查数据格式和重复项</Text>
          <Text style={styles.tipText}>• 建议定期备份到云存储</Text>
        </View>
      </ScrollView>

      <Modal
        visible={showApiModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowApiModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>输入API地址</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="https://example.com/api/words"
              value={apiUrl}
              onChangeText={setApiUrl}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButtonCancel}
                onPress={() => {
                  setShowApiModal(false);
                  setLoading(false);
                }}
              >
                <Text style={styles.modalButtonTextCancel}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButtonConfirm}
                onPress={async () => {
                  setShowApiModal(false);
                  await handleImportFromAPI();
                  setLoading(false);
                  setLoadingMethod(null);
                }}
              >
                <Text style={styles.modalButtonTextConfirm}>确认</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  backText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 8,
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  currentData: {
    marginBottom: 24,
  },
  currentDataTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 12,
  },
  currentDataCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  currentDataCount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  currentDataCategories: {
    fontSize: 14,
    color: '#999',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  importMethods: {
    marginBottom: 24,
  },
  importCard: {
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  importCardGradient: {
    padding: 20,
  },
  importCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  importIcon: {
    fontSize: 32,
  },
  importArrow: {
    fontSize: 24,
    color: '#fff',
  },
  importName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  importDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  tipCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  tipText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#f5f5f5',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButtonCancel: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    marginRight: 8,
    alignItems: 'center',
  },
  modalButtonConfirm: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#667eea',
    marginLeft: 8,
    alignItems: 'center',
  },
  modalButtonTextCancel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  modalButtonTextConfirm: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
