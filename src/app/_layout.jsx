import { Stack, SplashScreen } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import 'react-native-reanimated';

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

  useEffect(() => {
    if (loaded || error) {
      // Фонт ачаалагдаж дууссан эсвэл алдаа гарсан бол Сплаш-ийг нууна
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        <Stack.Screen name="index" />
      </Stack>
    </SafeAreaProvider>
  );
}
