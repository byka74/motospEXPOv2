import React, { useEffect, useState, useRef, useCallback } from 'react';
import { FlatList, Pressable } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Appearance } from 'react-native';

import { Text } from '../components/Text';
import { TextInput } from '../components/TextInput';
import { View } from '../components/View';
import {
  useUserStore,
  useThemeStore,
  useGlobalState,
} from '../zustand/context';
import NavigatorComp from '../components/NavigatorComp';

export default function AdsScreen(props) {
  const data = [{ a: 1 }, { a: 1 }, { a: 1 }, { a: 1 }, { a: 1 }, { a: 1 }];
  return (
    <FlatList
      data={data}
      horizontal={false}
      nestedScrollEnabled
      keyExtractor={(_, index) => index.toString()}
      renderItem={({ item, index }) => (
        <View key={index} style={{ }}>
          <Text>Helloaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</Text>
        </View>
      )}
    />
  );
}
