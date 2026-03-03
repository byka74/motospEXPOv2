import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import StartLayout from "./src/layout/StartLayout";
import {useColorScheme} from "react-native";
import { useState, useEffect } from "react";
import {useFonts} from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";
import * as SystemUI from "expo-system-ui";

SplashScreen.setOptions({duration: 600, fade: true});
SplashScreen.preventAutoHideAsync();

export default function App() {
  const color = useColorScheme();
  SystemUI.setBackgroundColorAsync(
    color === "light"
      ? "#ff1119"
      : color === "dark"
        ? "rgb(50,50,50)"
        : "#ff1119",
  );
  const [loaded, error] = useFonts({
    "Font-Regular": require("./src/assets/fonts/Commissioner-Regular.ttf"),
    "Font-Thin": require("./src/assets/fonts/Commissioner-Thin.ttf"),
    "Font-Light": require("./src/assets/fonts/Commissioner-Light.ttf"),
    "Font-ExtraLight": require("./src/assets/fonts/Commissioner-ExtraLight.ttf"),
    "Font-Medium": require("./src/assets/fonts/Commissioner-Medium.ttf"),
    "Font-SemiBold": require("./src/assets/fonts/Commissioner-SemiBold.ttf"),
    "Font-ExtraBold": require("./src/assets/fonts/Commissioner-ExtraBold.ttf"),
    "Font-Bold": require("./src/assets/fonts/Commissioner-Bold.ttf"),
    "Font-Black": require("./src/assets/fonts/Commissioner-Black.ttf"),
  });

  const [isFontLoad, setIsFontLoad] = useState(false);

  useEffect(() => {
    if (loaded || error) {
      setIsFontLoad(true);
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }
  return (
    <SafeAreaProvider>
        <StartLayout isFontLoad={isFontLoad} />
    </SafeAreaProvider>
  );
}
