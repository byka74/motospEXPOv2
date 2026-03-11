import { Pressable, Image as ReactImage } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  ReduceMotion,
  useSharedValue,
  cubicBezier,
  withTiming,
  createAnimatedComponent,
  useAnimatedProps,
  interpolateColor,
  useDerivedValue,
} from 'react-native-reanimated';
import { useEffect, useState, useRef, useMemo, memo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ActivityIndicator } from 'react-native';
import { Image as ExpoImage } from 'expo-image';

import {
  useGlobalState,
  useUserStore,
  useThemeStore,
} from '../zustand/context';
import { Text } from './Text';
import { View } from './View';

import axios from 'axios';

const AnimatedExpoImage = Animated.createAnimatedComponent(ExpoImage);

/**
 * @typedef {import('expo-image').ImageProps} ExpoImageProps
 */
const AnimtedImage = memo(
  /**
   * @typedef {ExpoImageProps} AnimatedImage
   * @param {AnimatedImage} props
   * @param {import('react').RefObject} ref
   */
  (props, ref) => {
    const { style, indexValue = 99, ...restProps } = props;
    const navigatorIndex = useGlobalState((state) => state.navigatorIndex);
    const progress = useSharedValue(0);

    // 1. Өнгийг тусад нь "Derived Value" болгож авна
    const derivedColor = useDerivedValue(() => {
      return interpolateColor(progress.value, [0, 1], ['#ffffff', '#FF1119']);
    });

    // 2. Animated Props дотор Derived Value-г дамжуулна
    const animatedProps = useAnimatedProps(() => {
      if (indexValue === 99) return {};
      return {
        tintColor: derivedColor.value,
      };
    });

    useEffect(() => {
      const targetValue = navigatorIndex === indexValue ? 1 : 0;
      progress.value = withTiming(targetValue, {
        duration: 300,
        easing: Easing.bezier(0.2, 0.7, 0.3, 1),
      });
    }, [navigatorIndex, indexValue]);

    return (
      <AnimatedExpoImage
        ref={ref}
        {...restProps}
        // style дотор tintColor байхгүй байгаа эсэхийг шалгаарай
        style={[style]}
        animatedProps={animatedProps}
      />
    );
  },
);

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
          <AnimtedImage
            style={{ height: 35, width: 35 }}
            source={require('../assets/navigator/1.png')}
            indexValue={0}
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
          <AnimtedImage
            style={{ height: 35, width: 35 }}
            source={require('../assets/navigator/2.png')}
            indexValue={1}
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
          <AnimtedImage
            style={{ height: 35, width: 35 }}
            source={require('../assets/navigator/3.png')}
            indexValue={2}
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
          <AnimtedImage
            style={{ height: 35, width: 35 }}
            source={require('../assets/navigator/4.png')}
            indexValue={3}
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
            <AnimtedImage
              style={{ height: 35, width: 35 }}
              source={require('../assets/navigator/5.png')}
              indexValue={4}
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

  const reloadRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    const fetchFunction = async () => {
      try {
        const url = `${process.env.EXPO_PUBLIC_APIURL}/`;
        /* const response = await axios.post(process.env.EXPO_PUBLIC_APIURL); */
        console.log(process.env.EXPO_PUBLIC_APIURL);
      } catch (e) {}
    };
    fetchFunction();
  }, []);

  return (
    <View
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      animate={{ transform: [{ scale: navigatorIndex === 4 ? 1 : 0.8 }] }}
      duration={500}
    >
      <View
        style={{
          overflow: 'hidden',
          borderRadius: 30,
        }}
        duration={500}
      >
        <AnimtedImage
          ref={reloadRef}
          style={{
            width: 40,
            height: 40,
          }}
          contentFit="cover"
          contentPosition={'center'}
          source={{
            uri: 'https://www.catholicsingles.com/wp-content/uploads/2020/06/blog-header-3.png',
          }}
          onLoadStart={() => {
            setLoading(true);
            console.log('Zurag achaalj bn.');
          }}
          onError={() => {
            console.log('Zurag achaalj chadsangui.');
            reloadRef.current.reloadAsync();
          }}
          loading="lazy"
          transition={300}
          cachePolicy="none"
          priority="high"
          onProgress={(e) => {
            const per = parseInt((e.loaded / e.total) * 100);
            if (per >= 100) {
              setLoading(false);
            }
            console.log(per+'%');
          }}
        />
      </View>
      {isLoading ? (
        <ActivityIndicator
          style={{ position: 'absolute' }}
          color={'#ff1119'}
          size={'small'}
        />
      ) : null}
    </View>
  );
};

export default NavigatorComp;
