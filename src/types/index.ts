export interface Word {
  id: string;
  word: string;
  pronunciation: string;
  meaning: string;
  example: string;
  category: string;
  mastered: boolean;
  reviewCount: number;
}

export const categories = [
  { id: 'daily', name: '日常生活', color: '#FF6B6B' },
  { id: 'work', name: '工作学习', color: '#4ECDC4' },
  { id: 'travel', name: '旅行出行', color: '#45B7D1' },
  { id: 'food', name: '饮食', color: '#96CEB4' },
];
