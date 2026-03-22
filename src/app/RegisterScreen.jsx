import { useThemeStore } from '../zustand/context';
import { Text } from '../components/Text';
import { View } from '../components/View';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import { TextInput } from '../components/TextInput';
import * as SystemUI from 'expo-system-ui';
import { useEffect, useRef, useState } from 'react';
import { Button } from '../components/Button';
import { router, usePathname } from 'expo-router';

export default function RegisterScreen() {
  const navigatorHeight = useThemeStore((state) => state.navigatorHeight);
  const isLight = useThemeStore((state) => state.isLight);
  const insets = useSafeAreaInsets();
  const testRef = useRef(null);
  const testValue = useRef('');
  const [isVisit, setVisit] = useState(false);

  const pathnameIs = usePathname();

  useEffect(() => {
    setVisit(true);
  }, []);

  return (
    <View style={{ backgroundColor: '#ff1119' }}>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="interactive"
        contentContainerStyle={{ minHeight: '100%' }}
      >
        <View
          style={{
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
            paddingHorizontal: 20,
            gap: 20,
            minHeight: '100%',
          }}
          syncLight
        >
          <Text
            style={{
              fontSize: 48,
              textAlign: 'center',
              fontWeight: 'bold',
              paddingVertical: 80,
            }}
            animate={{
              filter: [{ blur: isVisit ? 0 : 20 }],
              opacity: isVisit ? 1 : 0,
              transform: [{ translateY: isVisit ? 0 : -75 }],
            }}
            duration={1000}
            syncLight
          >
            Бүртгэл
          </Text>
          <TextInput
            ref={testRef}
            style={{ borderRadius: 5 }}
            syncLight
            placeholder="Имэйл хаяг"
          ></TextInput>
          <Button
            onPress={() => {
              testRef.current.clear();
            }}
            syncLight
          >
            <Text syncLight>Дарах</Text>
          </Button>
        </View>
      </ScrollView>
      <Button
        style={{ position: 'absolute', top: 20 + insets.top, left: 20 }}
        onPress={() => {
          router.back();
          setVisit(false);
        }}
      >
        <Text style={{ fontSize: 18 }} syncLight>
          {'< Back'}
        </Text>
      </Button>
    </View>
  );
}
