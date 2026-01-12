import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from './types';
import { HomeScreen } from '../screens/HomeScreen';
import { LearnScreen } from '../screens/LearnScreen';
import { WordListScreen } from '../screens/WordListScreen';
import { WordDetailScreen } from '../screens/WordDetailScreen';
import { MasteredScreen } from '../screens/MasteredScreen';

const Stack = createStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#f5f5f5' },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Learn" component={LearnScreen} />
        <Stack.Screen name="WordList" component={WordListScreen} />
        <Stack.Screen name="WordDetail" component={WordDetailScreen} />
        <Stack.Screen name="Mastered" component={MasteredScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
