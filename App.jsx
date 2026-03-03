import React, { useEffect, useState, useCallback } from 'react';
import { View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import * as SystemUI from 'expo-system-ui'; // Импортлох шаардлагатай

// Splash-ийг барьж үлдэх (Global scope-д байх нь илүү найдвартай)
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Native түвшний арын өнгийг улаан болгох (Харлахаас сэргийлнэ)
        await SystemUI.setBackgroundColorAsync("#ff1119");
        
        // 5 секунд хүлээх
        await new Promise(resolve => setTimeout(resolve, 5000));
      } catch (e) {
        console.warn(e);
      } finally {
        setIsReady(true);
      }
    }
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (isReady) {
      // Апп-ын Layout бэлэн болмогц нуух
      await SplashScreen.hideAsync();
    }
  }, [isReady]);

  if (!isReady) {
    //null буцаахын оронд ижил өнгөтэй View буцаавал харлахгүй
    return <View style={{ flex: 1, backgroundColor: "#ff1119" }} />;
  }

  return (
    <View 
      style={{ flex: 1, backgroundColor: "#fff" }} 
      onLayout={onLayoutRootView}
    >
      {/* StartLayout-аа энд дуудна */}
    </View>
  );
}