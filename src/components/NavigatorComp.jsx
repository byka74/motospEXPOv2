import { Pressable } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  ReduceMotion,
  useSharedValue,
  cubicBezier,
  withTiming,
} from 'react-native-reanimated';
import { useEffect, useState, useRef, useMemo, memo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';

import {
  useGlobalState,
  useUserStore,
  useThemeStore,
} from '../zustand/context';
import { Text } from './Text';
import { View } from './View';

import axios from 'axios';

const NavigatorComp = memo((props) => {
  const index = useGlobalState((state) => state.index);
  const setIndex = useGlobalState((state) => state.setIndex);
  const navigatorIndex = useGlobalState((state) => state.navigatorIndex);
  const setNavigatorIndex = useGlobalState((state) => state.setNavigatorIndex);
  const isUserLoggedIn = useUserStore((state) => state.isUserLoggedIn);
  const isLight = useThemeStore((state) => state.isLight);
  const initInsets = useSafeAreaInsets();

  const progress = useSharedValue((index * 100).toString() + '%');
  const isAnimating = useSharedValue(false);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withTiming(
          progress.value,
          {
            easing: Easing.bezier(0.2, 0.7, 0.3, 1),
            duration: 500,
            reduceMotion: ReduceMotion.Never,
          },
          (finished) => {
            if (finished) isAnimating.value = false;
          },
        ),
      },
      {
        scaleX: withTiming(isAnimating.value ? 0.5 : 1, {
          easing: Easing.bezier(0.2, 0.7, 0.3, 1),
          duration: 500,
          reduceMotion: ReduceMotion.Never,
        }),
      },
    ],
  }));

  useEffect(() => {
    progress.value = (navigatorIndex * 100).toString() + '%';
    isAnimating.value = true;
  }, [navigatorIndex]);

  return (
    <View
      style={{
        backgroundColor: 'rgba(80,80,80, 0.5)',
        position: 'absolute',
        top: 'auto',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        minHeight: 100,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: initInsets.bottom + 10,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View
        style={{
          height: 2,
          top: 0,
          left: 0,
          right: 0,
          paddingHorizontal: 20,
          position: 'absolute',
        }}
      >
        <Animated.View
          style={[
            {
              backgroundColor: 'red',
              width: '20%',
              height: '100%',
              transformOrigin: 'center top',
            },
            animatedStyle,
          ]}
        ></Animated.View>
      </View>
      <Pressable
        hitSlop={8}
        onPress={() => {
          setIndex(0);
        }}
        style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}
      >
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          animate={{ transform: [{ scale: navigatorIndex === 0 ? 1 : 0.8 }] }}
          duration={500}
        >
          <Image
            style={{ height: 35, width: 35 }}
            tintColor={
              navigatorIndex === 0 ? '#ff1119' : isLight ? '#fff' : '#000'
            }
            source={require('../assets/navigator/1.png')}
          />
        </View>
      </Pressable>
      <Pressable
        hitSlop={8}
        onPress={() => {
          setIndex(1);
        }}
        style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}
      >
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          animate={{ transform: [{ scale: navigatorIndex === 1 ? 1 : 0.8 }] }}
          duration={500}
        >
          <Image
            style={{ height: 35, width: 35 }}
            tintColor={
              navigatorIndex === 1 ? '#ff1119' : isLight ? '#fff' : '#000'
            }
            source={require('../assets/navigator/2.png')}
          />
        </View>
      </Pressable>
      <Pressable
        hitSlop={8}
        onPress={() => {
          setIndex(2);
        }}
        style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}
      >
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          animate={{ transform: [{ scale: navigatorIndex === 2 ? 1 : 0.8 }] }}
          duration={500}
        >
          <Image
            style={{ height: 35, width: 35 }}
            tintColor={
              navigatorIndex === 2 ? '#ff1119' : isLight ? '#fff' : '#000'
            }
            source={require('../assets/navigator/3.png')}
          />
        </View>
      </Pressable>
      <Pressable
        hitSlop={8}
        onPress={() => {
          setIndex(3);
        }}
        style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}
      >
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          animate={{ transform: [{ scale: navigatorIndex === 3 ? 1 : 0.8 }] }}
          duration={500}
        >
          <Image
            style={{ height: 35, width: 35 }}
            tintColor={
              navigatorIndex === 3 ? '#ff1119' : isLight ? '#fff' : '#000'
            }
            source={require('../assets/navigator/4.png')}
          />
        </View>
      </Pressable>
      <Pressable
        hitSlop={8}
        onPress={() => {
          setIndex(4);
        }}
        style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}
      >
        {!isUserLoggedIn ? (
          <UserCircleComponent />
        ) : (
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
            animate={{ transform: [{ scale: navigatorIndex === 4 ? 1 : 0.8 }] }}
            duration={500}
          >
            <Image
              style={{ height: 35, width: 35 }}
              tintColor={
                navigatorIndex === 4 ? '#ff1119' : isLight ? '#fff' : '#000'
              }
              source={require('../assets/navigator/5.png')}
            />
          </View>
        )}
      </Pressable>
    </View>
  );
});

const UserCircleComponent = () => {
  const index = useGlobalState((state) => state.index);
  const navigatorIndex = useGlobalState((state) => state.navigatorIndex);

  const [isLoading, setLoading] = useState(false);
  useEffect(() => {
    const fetchFunction = async () => {
      try {
        setLoading(true);
        const url = `${process.env.EXPO_PUBLIC_APIURL}/`;
        /* const response = await axios.post(process.env.EXPO_PUBLIC_APIURL); */
        console.log(process.env.EXPO_PUBLIC_APIURL);
      } catch (e) {
      } finally {
        setLoading(false);
      }
    };
    fetchFunction();
  }, []);

  return (
    <View
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      animate={{ transform: [{ scale: navigatorIndex === 4 ? 1 : 0.8 }] }}
      duration={500}
    >
      {isLoading ? (
        <ActivityIndicator color={'#ff1119'} size={'small'} />
      ) : (
        <View
          style={{
            overflow: 'hidden',
            borderRadius: 30,
            borderColor: '#ff1119',
          }}
          duration={500}
        >
          <Image
            style={{
              width: 40,
              height: 40,
              backgroundColor: '#fff',
              objectFit: 'cover',
            }}
            source={
              'https://t4.ftcdn.net/jpg/04/31/64/75/360_F_431647519_usrbQ8Z983hTYe8zgA7t1XVc5fEtqcpa.jpg'
            }
          />
        </View>
      )}
    </View>
  );
};

export default NavigatorComp;
