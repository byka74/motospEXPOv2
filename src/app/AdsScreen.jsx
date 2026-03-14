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

export default function AdsScreen(props) {
  const data = [{ a: 1 }, { a: 1 }, { a: 1 }, { a: 1 }, { a: 1 }, { a: 1 }];
  const insets = useSafeAreaInsets();
  const navigatorHeight = useThemeStore((data) => data.navigatorHeight);
  return (
    <FlatList
      data={[1]}
      horizontal={false}
      nestedScrollEnabled
      keyExtractor={(_, index) => index.toString()}
      renderItem={({ item, index }) => (
        <View
          style={{
            paddingBottom: insets.bottom + navigatorHeight,
            paddingTop: insets.top,
          }}
        >
          {data.map((mapItem, mapIndex) => (
            <View
              key={mapIndex}
              style={{
                minHeight: 500,
                marginBottom: 20,
                backgroundColor: 'rgb(200,200,200)',
              }}
            >
              <Text>Helloaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</Text>
            </View>
          ))}
        </View>
      )}
    />
  );
}
