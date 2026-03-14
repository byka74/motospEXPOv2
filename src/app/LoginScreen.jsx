import { Button } from '../components/Button';
import { View } from '../components/View';
import { TextInput } from '../components/TextInput';
import { Text } from '../components/Text';
import { useGlobalState, useThemeStore } from '../zustand/context';
import { Keyboard, Pressable, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

export default function LoginScreen(props, ref) {
  const navigatorIndex = useGlobalState((data) => data.navigatorIndex);
  const isLight = useThemeStore((data) => data.isLight);
  const navigatorHeight = useThemeStore((data) => data.navigatorHeight);
  const insets = useSafeAreaInsets();
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');

  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const [loginButtonDisabled, setLoginButtonDisabled] = useState(true);

  const passwordInputRef = useRef(null);

  const [biometricStatus, setBiometricStatus] = useState(false);
  const [saveBiometric, setSaveBiometric] = useState(false);

  useEffect(() => {
    function run() {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

      let emailErrorChecker = false;
      let passwordErrorChecker = false;

      if (emailRegex.test(emailValue) && emailValue.length > 0) {
        emailErrorChecker = false;
      } else {
        if (emailValue.length === 0) {
          emailErrorChecker = false;
        } else {
          emailErrorChecker = true;
        }
      }

      if (passwordRegex.test(passwordValue) && passwordValue.length > 0) {
        passwordErrorChecker = false;
      } else {
        if (passwordValue.length === 0) {
          passwordErrorChecker = false;
        } else {
          passwordErrorChecker = true;
        }
      }

      setEmailError(emailErrorChecker);
      setPasswordError(passwordErrorChecker);

      if (passwordRegex.test(passwordValue) && emailRegex.test(emailValue)) {
        setLoginButtonDisabled(false);
      } else {
        setLoginButtonDisabled(true);
      }
    }
    run();
  }, [passwordValue, emailValue]);

  useEffect(() => {
    const isAvailable = SecureStore.isAvailableAsync();
    if (isAvailable) {
      setBiometricStatus(true);
    } else {
      setBiometricStatus(false);
    }
  }, [navigatorIndex]);

  const loginHandler = async () => {
    try {
      const res = await axios.post(
        'http://192.168.1.45:3099/api/v1/login',
        { identifier: emailValue, password: passwordValue },
        { withCredentials: false },
      );
      if (res.status === 200) {
        const data = res.data;
        const isBiometric =
          SecureStore.canUseBiometricAuthentication() &&
          SecureStore.isAvailableAsync();
        const isDone = await SecureStore.setItemAsync(
          'user_token',
          JSON.stringify(data),
          {
            requireAuthentication: false,
            authenticationPrompt: 'Та өөрийгөө баталгаажуулна уу',
          },
        );
        console.log(isDone);
        const getDataStore = await SecureStore.getItemAsync('user_token');
        if (isDone) {
          console.log('Амжилттай хадгаллаа', getDataStore);
        } else {
          console.log('Амжилтгүй оролдлого', getDataStore);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <ScrollView
      horizontal={false}
      nestedScrollEnabled
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ minWidth: '100%' }}
    >
      <View
        style={{
          paddingBottom: insets.bottom + navigatorHeight,
          paddingTop: insets.top,
          minWidth: '100%',
          maxWidth: '100%',
          minHeight: '100%',
          gap: 40,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View
          style={{
            minWidth: '100%',
            maxWidth: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 20,
          }}
        >
          <Text
            style={{ fontSize: 48, fontFamily: 'bold', paddingVertical: 60 }}
            animate={{
              opacity: navigatorIndex === 4 ? 1 : 0,
              transform: [{ translateY: navigatorIndex === 4 ? 0 : -50 }],
              filter: [{ blur: navigatorIndex === 4 ? 0 : 10 }],
            }}
            duration={1000}
            syncLight
          >
            {'Нэвтрэх'}
          </Text>
          <View
            style={{
              width: '80%',
              borderRadius: 5,
              borderWidth: 1,
              overflow: 'hidden',
              borderColor: '#ff111900',
            }}
            animate={{
              borderColor: emailError ? '#ff1119' : '#ff111900',
            }}
            duration={500}
          >
            <TextInput
              syncLight
              onChangeText={(text) => {
                setEmailValue(text);
              }}
              value={emailValue}
              placeholder="Имэйл хаяг"
              secureTextEntry={false}
              autoComplete="email"
              inputMode="email"
              keyboardType="email-address"
              returnKeyType="next"
              enterKeyHint="next"
              textContentType="emailAddress"
              onSubmitEditing={(e) => {
                if (emailError === false && emailValue.length > 0) {
                  passwordInputRef.current.focus();
                }
              }}
            ></TextInput>
          </View>
          <View
            style={{
              width: '80%',
              borderRadius: 5,
              borderWidth: 1,
              overflow: 'hidden',
              borderColor: '#ff111900',
            }}
            animate={{
              borderColor: passwordError ? '#ff1119' : '#ff111900',
            }}
            duration={500}
          >
            <TextInput
              ref={passwordInputRef}
              syncLight
              onChangeText={(text) => {
                setPasswordValue(text);
              }}
              value={passwordValue}
              placeholder="Нууц үг"
              secureTextEntry
              autoComplete="password"
              inputMode="text"
              keyboardType="default"
              returnKeyType="done"
              enterKeyHint="done"
              textContentType="password"
            ></TextInput>
          </View>
          <View
            style={{
              minWidth: '80%',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <Button
              onPress={() => {
                console.log(true);
              }}
            >
              <Text syncLight>Сануулах</Text>
            </Button>
            <Button
              onPress={() => {
                console.log(true);
              }}
            >
              <Text syncLight>Нууц үгээ мартсан уу?</Text>
            </Button>
          </View>

          <View
            style={{
              minWidth: '80%',
              maxWidth: '80%',
              flexDirection: 'row',
              gap: '5%',
            }}
          >
            <Button
              onPress={() => {
                if (loginButtonDisabled === false) {
                  console.log(true);
                  loginHandler();
                }
              }}
              style={{
                padding: 20,
                width: biometricStatus ? '75%' : '100%',
                borderRadius: 5,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              animate={{
                backgroundColor:
                  loginButtonDisabled === true
                    ? isLight
                      ? 'rgb(200,200,200)'
                      : 'rgb(80,80,80)'
                    : '#ff1119',
              }}
              duration={500}
            >
              <Text
                style={{
                  textAlign: 'center',
                }}
                animate={{
                  color:
                    loginButtonDisabled === true
                      ? isLight
                        ? 'rgb(120,120,120)'
                        : 'rgb(200,200,200)'
                      : '#fff',
                }}
                duration={500}
              >
                Нэвтрэх
              </Text>
            </Button>
            {biometricStatus ? (
              <Button
                style={{
                  width: '20%',
                  padding: 20,
                  borderRadius: 5,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                animate={{
                  backgroundColor: saveBiometric
                    ? '#ff1119'
                    : isLight
                      ? 'rgb(240,240,240)'
                      : 'rgb(80,80,80)',
                }}
                duration={500}
                onPress={() => {
                  setSaveBiometric((prev) => (!prev ? true : false));
                }}
              >
                <Image
                  style={{ width: '100%', aspectRatio: '1 / 1' }}
                  tintColor={
                    saveBiometric
                      ? '#ffffff'
                      : isLight
                        ? 'rgb(80,80,80)'
                        : 'rgb(200,200,200)'
                  }
                  source={require('../assets/fingerprint-identification.png')}
                ></Image>
              </Button>
            ) : (
              <></>
            )}
          </View>
        </View>

        <View
          style={{ width: '80%', flexDirection: 'row', alignItems: 'center' }}
        >
          <View
            style={{
              height: 1,
              flex: 1,
              backgroundColor: isLight
                ? 'rgb(220,220,220)'
                : 'rgb(100,100,100)',
            }}
          ></View>
          <Text
            style={{
              paddingHorizontal: 20,
              color: isLight ? 'rgb(120,120,120)' : 'rgb(180,180,180)',
            }}
          >
            эсвэл
          </Text>
          <View
            style={{
              height: 1,
              flex: 1,
              backgroundColor: isLight
                ? 'rgb(220,220,220)'
                : 'rgb(100,100,100)',
            }}
          ></View>
        </View>
        <Button
          onPress={() => {
            console.log(true);
          }}
          style={{
            padding: 20,
            width: '80%',
            borderRadius: 5,
          }}
          syncLight
        >
          <Text style={{ textAlign: 'center' }} syncLight onPress={() => {}}>
            Бүртгүүлэх
          </Text>
        </Button>
        <View
          style={{ width: '80%', flexDirection: 'row', alignItems: 'center' }}
        >
          <View
            style={{
              height: 1,
              flex: 1,
              backgroundColor: isLight
                ? 'rgb(220,220,220)'
                : 'rgb(100,100,100)',
            }}
          ></View>
          <Text
            style={{
              paddingHorizontal: 20,
              color: isLight ? 'rgb(120,120,120)' : 'rgb(180,180,180)',
            }}
          >
            бусад
          </Text>
          <View
            style={{
              height: 1,
              flex: 1,
              backgroundColor: isLight
                ? 'rgb(220,220,220)'
                : 'rgb(100,100,100)',
            }}
          ></View>
        </View>
        <View style={{ maxWidth: '80%', flexDirection: 'row', gap: 20 }}>
          <Pressable
            style={{
              padding: 10,
              backgroundColor: isLight ? 'rgb(240,240,240)' : 'rgb(80,80,80)',
              borderRadius: 5,
            }}
          >
            <Image
              style={{ height: 35, width: 35 }}
              source={{
                uri: 'https://raw.githubusercontent.com/lobehub/lobe-icons/refs/heads/master/packages/static-png/dark/google-color.png',
              }}
            ></Image>
          </Pressable>
          <Pressable
            style={{
              padding: 10,
              backgroundColor: isLight ? 'rgb(240,240,240)' : 'rgb(80,80,80)',
              borderRadius: 5,
            }}
          >
            <Image
              style={{ height: 35, width: 35 }}
              source={{
                uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/500px-Facebook_Logo_%282019%29.png',
              }}
            ></Image>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}
