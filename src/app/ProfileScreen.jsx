import { View } from '../components/View';
import { Text } from '../components/Text';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeStore, useUserStore } from '../zustand/context';
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
  useEffect(() => {
    async function run() {
      try {
        const tokens = await SecureStore.getItemAsync('user_token');
        if (tokens != null) {
          const accessToken =
            'Bearer ' + JSON.stringify(JSON.parse(tokens).accessToken);
          const getme = await axios.get('http://192.168.1.45:3099/api/v1/me', {
            headers: {
              Authorization: accessToken,
            },
          });
          if (getme.status === 200) {
            console.log('from Profile: ', getme.data);
          }
        } else {
          setUserLoggedIn(false);
          setUser(null);
        }
      } catch (e) {
        console.log(e);
      }
    }
    run();
  }, [isUserLoggedIn, user]);
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        minWidth: '100%',
        maxWidth: '100%',
        minHeight: '100%',
      }}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: '#ff1119',
          paddingBottom: insets.bottom + navigatorHeight,
          paddingTop: insets.top,
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}
      >
        <Text syncLight>
          <Image></Image>
          <Button
            onPress={() => {
              setUserLoggedIn(false);
              setUser(null);
            }}
          >
            <Text>Гарах</Text>
          </Button>
        </Text>
      </View>
    </ScrollView>
  );
}

export default ProfileScreen;
