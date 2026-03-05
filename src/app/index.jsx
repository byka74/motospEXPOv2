import React, { useEffect, useState, useCallback } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useUserStore, useThemeStore } from '../zustand/context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Appearance } from 'react-native';

import { Text } from '../components/Text';
import { TextInput } from '../components/TextInput';

export default function Index() {
  const user = useUserStore((state) => state.user);
  const isLight = useThemeStore((state) => state.isLight);
  const setLight = useThemeStore((state) => state.setLight);
  const initInsets = useSafeAreaInsets();

  const [animState, setAnimState] = useState(false);

  useEffect(() => {
    const colorsSchemeSub = Appearance.addChangeListener(({ colorScheme }) => {
      setLight(colorScheme === 'light' ? true : false);
    });
    return () => {
      colorsSchemeSub.remove();
    };
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isLight ? 'rgb(255,255,255)' : 'rgb(50,50,50)',
      }}
    >
      <StatusBar style={isLight ? 'dark' : 'light'} animated={true}></StatusBar>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingBottom: initInsets.bottom,
          paddingTop: initInsets.top,
        }}
      >
        <ScrollView
          bounces={false}
          overScrollMode="never"
          horizontal={true}
          pagingEnabled={true}
          decelerationRate={'fast'}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="on-drag"
          contentContainerStyle={{ width: '500%', overflow: 'visible' }}
        >
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            <Text
              animate={{
                transformOrigin: 'bottom center',
                transform: [{ scale: animState ? 5 : 1 }],
                opacity: animState ? 1 : 0,
              }}
              duration={3000}
              syncLight
            >
              {'Хэл бол ус\nХөл бол чулуу'}
            </Text>
            <TextInput
              onFocus={() => {
                console.log('Hello!');
              }}
              onChangeText={(text) => {
                console.log(text);
              }}
              placeholder="Имэйл хаяг"
            ></TextInput>
            <Pressable
              onPress={() => {
                setAnimState((prev) => !prev);
              }}
              style={{ padding: 10, backgroundColor: '#ff1119' }}
            >
              <Text>Press here!</Text>
            </Pressable>
          </View>
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            <Text animate syncLight duration={10000}>
              2
            </Text>
          </View>
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            <Text>3</Text>
          </View>
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            <Text>4</Text>
          </View>
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            <Text>5</Text>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
