import { Stack, SplashScreen } from 'expo-router';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { useEffect, useState } from 'react';
import { PortalHost } from '@rn-primitives/portal';
import 'react-native-reanimated';
import { Dimensions, Keyboard, Platform } from 'react-native';
import { useThemeStore } from '../zustand/context';
import { View } from '../components/View';
import * as SystemUI from 'expo-system-ui';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [keyboardShow, setKeyboardShow] = useState(false);

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

  const [platformKeyboardView, setPlatformKeyboardView] = useState({
    paddingBottom: 0,
    height: 0,
  });

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

  useEffect(() => {
    const keyboardSubDidShow = Keyboard.addListener('keyboardDidShow', (e) => {
      setKeyboardHeight(e.endCoordinates.height);
      setKeyboardShow(true);
      setPlatformKeyboardView((prev) => ({
        ...prev,
        height: e.endCoordinates.height + insets.bottom,
      }));
    });
    const keyboardSubDidHide = Keyboard.addListener('keyboardDidHide', (e) => {
      setKeyboardHeight(0);
      setKeyboardShow(false);
      setPlatformKeyboardView((prev) => ({ ...prev, height: 0 }));
    });

    const keyboardSubWillShow = Keyboard.addListener(
      'keyboardWillShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
        setKeyboardShow(true);
        setPlatformKeyboardView((prev) => ({
          ...prev,
          paddingBottom: e.endCoordinates.height + insets.bottom,
        }));
      },
    );
    const keyboardSubWillHide = Keyboard.addListener(
      'keyboardWillShow',
      (e) => {
        setKeyboardHeight(0);
        setKeyboardShow(false);
        setPlatformKeyboardView((prev) => ({ ...prev, paddingBottom: 0 }));
      },
    );

    const keyboardSubDidChangeFrame = Keyboard.addListener(
      'keyboardDidChangeFrame',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
      },
    );
    const keyboardSubWillChangeFrame = Keyboard.addListener(
      'keyboardWillChangeFrame',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
      },
    );

    return () => {
      keyboardSubDidShow.remove();
      keyboardSubDidHide.remove();

      keyboardSubWillShow.remove();
      keyboardSubWillHide.remove();

      keyboardSubDidChangeFrame.remove();
      keyboardSubWillChangeFrame.remove();
    };
  }, []);

  if (!loaded && !error) {
    return null;
  }

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="index" />
        </Stack>
        <View animate={platformKeyboardView} duration={200}></View>
      </SafeAreaProvider>
    </View>
  );
}
