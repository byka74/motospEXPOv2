import { Stack, SplashScreen } from 'expo-router';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { Dimensions, Keyboard, Platform, View as RNView } from 'react-native';
import { useThemeStore } from '../zustand/context';
import { View } from '../components/View';
import * as SystemUI from 'expo-system-ui';
import {
  useKeyboardHandler,
  KeyboardProvider,
  KeyboardAvoidingView,
  KeyboardGestureArea,
} from 'react-native-keyboard-controller';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  ReduceMotion,
  Easing,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Regular: require('../assets/fonts/GoogleSans-Regular.ttf'),
    Medium: require('../assets/fonts/GoogleSans-Medium.ttf'),
    SemiBold: require('../assets/fonts/GoogleSans-SemiBold.ttf'),
    Bold: require('../assets/fonts/GoogleSans-Bold.ttf'),
    regular: require('../assets/fonts/GoogleSans-Regular.ttf'),
    medium: require('../assets/fonts/GoogleSans-Medium.ttf'),
    semibold: require('../assets/fonts/GoogleSans-SemiBold.ttf'),
    bold: require('../assets/fonts/GoogleSans-Bold.ttf'),
    // app.config.js дээр заасан нэртэйгээ ижил байх ёстой
  });

  const setNavigatorheight = useThemeStore((data) => data.setNavigatorheight);
  const isLight = useThemeStore((data) => data.isLight);

  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (loaded || error) {
      // Фонт ачаалагдаж дууссан эсвэл алдаа гарсан бол Сплаш-ийг нууна
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(isLight ? '#ffffff' : '#323232');
  }, [isLight]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <KeyboardProvider>
      <View style={{ flex: 1 }}>
        <SafeAreaProvider>
          <StackComponent></StackComponent>
        </SafeAreaProvider>
      </View>
    </KeyboardProvider>
  );
}

function StackComponent() {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [keyboardShow, setKeyboardShow] = useState(false);

  const heightValue = useSharedValue(0);
  const paddingValue = useSharedValue(0);
  const otherComponentKeyboardEffect = () => {
    console.log('runing on RN');
  };

  useKeyboardHandler(
    {
      onMove: (e) => {
        'worklet';
        // Дуудах болгондоо withTiming бичихгүйгээр утгыг нь шууд оноож болно
        // Гэхдээ илүү smooth болгохын тулд duration-ийг e.duration-оос авсан нь дээр
        if (e.progress === 1 || e.progress === 0) {
          heightValue.value = e.height;
          paddingValue.value = e.height;
        }
      },
    },
    [],
  );

  // 1. Animated Style үүсгэх (Энэ нь хамгийн чухал)
  const animatedHeight = useAnimatedStyle(() => {
    return {
      flex: 1,
      transform: [{ translateY: -heightValue.value }],
    };
  });

  return (
    <KeyboardProvider>
      <Animated.View style={animatedHeight}>
        <Animated.View style={{ height: paddingValue }}></Animated.View>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'simple_push',
            keyboardHandlingEnabled: true,
          }}
        ></Stack>
      </Animated.View>
    </KeyboardProvider>
  );
}
