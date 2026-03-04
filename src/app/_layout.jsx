import {Stack} from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import {SafeAreaProvider} from "react-native-safe-area-context";
import 'react-native-reanimated';

SplashScreen.setOptions({duration: 1000, fade: true});

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack screenOptions={{headerShown: false}}>
        <Stack.Screen name="index" />
      </Stack>
    </SafeAreaProvider>
  );
}
