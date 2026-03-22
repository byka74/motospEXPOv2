import { View } from '../components/View';
import { Text } from '../components/Text';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  useThemeStore,
  useUserStore,
  useGlobalState,
} from '../zustand/context';
import { Image } from 'expo-image';
import { useEffect } from 'react';
import axios from 'axios';
import { Button } from '../components/Button';
import * as SecureStore from 'expo-secure-store';

function ProfileScreen(props, ref) {
  const insets = useSafeAreaInsets();
  const navigatorHeight = useThemeStore((data) => data.navigatorHeight);
  const user = useUserStore((data) => data.user);
  const setUser = useUserStore((data) => data.setUser);
  const setUserLoggedIn = useUserStore((data) => data.setUserLoggedIn);
  const isUserLoggedIn = useUserStore((data) => data.isUserLoggedIn);
  const apiurl = useGlobalState((data) => data.apiurl);
  useEffect(() => {}, [isUserLoggedIn, user]);
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        width: '100%',
        minHeight: '100%',
      }}
    >
      <View
        style={{
          flex: 1,
          paddingBottom: insets.bottom + navigatorHeight,
          paddingTop: insets.top,
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}
      >
        <Text syncLight></Text>
        <Image></Image>
        <Button
          onPress={() => {
            setUserLoggedIn(false);
            setUser(null);
          }}
        >
          <Text>Гарах</Text>
        </Button>
      </View>
    </ScrollView>
  );
}

export default ProfileScreen;
