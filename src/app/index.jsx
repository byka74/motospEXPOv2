import React, { useEffect, useState, useRef, useCallback } from 'react';
import { ScrollView, Pressable } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Appearance } from 'react-native';
import { useRouter } from 'expo-router';

import { Text } from '../components/Text';
import { TextInput } from '../components/TextInput';
import { View } from '../components/View';
import {
  useUserStore,
  useThemeStore,
  useGlobalState,
} from '../zustand/context';
import Navigator from '../components/Navigator';
import AdsScreen from './AdsScreen';
import LoginScreen from './LoginScreen';
import { BlurTargetView } from 'expo-blur';
import ProfileScreen from './ProfileScreen';

export default function index() {
  const user = useUserStore((state) => state.user);

  const isLight = useThemeStore((state) => state.isLight);
  const setLight = useThemeStore((state) => state.setLight);
  const isUserLoggedIn = useUserStore((state) => state.isUserLoggedIn);

  const setIndex = useGlobalState((state) => state.setIndex);
  const index = useGlobalState((state) => state.index);
  const setNavigatorIndex = useGlobalState((state) => state.setNavigatorIndex);

  const initInsets = useSafeAreaInsets();

  const [animState, setAnimState] = useState(false);
  const scrollRef = useRef(null);

  const scrollWidthRef = useRef(0);
  const scrollIndexPrev = useRef(0);
  const scrollIsDragged = useRef(false);
  const scrollNavigatorIndexPrev = useRef(0);
  const scrollBlurTargetRef = useRef(null);

  useEffect(() => {
    setNavigatorIndex(0);
    setIndex(0);
    const colorsSchemeSub = Appearance.addChangeListener(({ colorScheme }) => {
      setLight(colorScheme === 'light' ? true : false);
    });
    return () => {
      colorsSchemeSub.remove();
    };
  }, []);

  useEffect(() => {
    scrollRef.current.scrollTo({
      x: scrollWidthRef.current * index,
      animated: false,
      deprecatedAnimated: false,
    });
    setNavigatorIndex(index);
    scrollIsDragged.current = false;
    scrollNavigatorIndexPrev.current = index;
  }, [index]);

  return (
    <View
      style={{
        flex: 1,
      }}
      syncLight
    >
      <StatusBar style={isLight ? 'dark' : 'light'} animated={true}></StatusBar>
      <BlurTargetView style={{ flex: 1 }} ref={scrollBlurTargetRef}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ScrollView
            onLayout={(e) => {
              scrollWidthRef.current = e.nativeEvent.layout.width;
            }}
            ref={scrollRef}
            bounces={false}
            overScrollMode="never"
            horizontal={true}
            pagingEnabled={true}
            decelerationRate={'fast'}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={16}
            keyboardDismissMode="on-drag"
            onMomentumScrollBegin={() => {
              scrollIsDragged.current = true;
            }}
            onScroll={(e) => {
              const offsetX = e.nativeEvent.contentOffset.x;
              const totalWidth = e.nativeEvent.layoutMeasurement.width;
              const innerIndex = parseInt(
                (offsetX + totalWidth / 2) / totalWidth,
              );

              if (innerIndex != scrollNavigatorIndexPrev.current) {
                setNavigatorIndex(innerIndex);
              }
              scrollNavigatorIndexPrev.current = innerIndex;
            }}
            onMomentumScrollEnd={(e) => {
              const offsetX = e.nativeEvent.contentOffset.x;
              const totalWidth = e.nativeEvent.layoutMeasurement.width;
              const innerIndex = parseInt(
                (offsetX + totalWidth / 2) / totalWidth,
              );

              setIndex(innerIndex);
            }}
            contentContainerStyle={{
              height: '100%',
              width: '500%'
            }}
          >
            <View
              style={{
                height: '100%',
                width: '20%'
              }}
            >
              <AdsScreen />
            </View>
            <View
              style={{
                height: '100%',
                width: '20%',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text animate syncLight duration={10000}>
                2
              </Text>
            </View>
            <View
              style={{
                height: '100%',
                width: '20%',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text syncLight>3</Text>
            </View>
            <View
              style={{
                height: '100%',
                width: '20%',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text syncLight>4</Text>
            </View>
            <View
              style={{
                height: '100%',
                width: '20%',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {isUserLoggedIn ? (
                <ProfileScreen></ProfileScreen>
              ) : (
                <LoginScreen></LoginScreen>
              )}
            </View>
          </ScrollView>
        </View>
      </BlurTargetView>
      <Navigator scrollBlurTargetRef={scrollBlurTargetRef}></Navigator>
    </View>
  );
}
