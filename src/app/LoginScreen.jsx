import { Button } from '../components/Button';
import { View } from '../components/View';
import { TextInput } from '../components/TextInput';
import { Text } from '../components/Text';
import {
  useGlobalState,
  useThemeStore,
  useUserStore,
} from '../zustand/context';
import {
  ActivityIndicator,
  Keyboard,
  Pressable,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import Checkbox from '../components/Checkbox';
import { router } from 'expo-router';

export default function LoginScreen(props, ref) {
  const navigatorIndex = useGlobalState((data) => data.navigatorIndex);
  const isLight = useThemeStore((data) => data.isLight);
  const navigatorHeight = useThemeStore((data) => data.navigatorHeight);
  const insets = useSafeAreaInsets();
  const emailValue = useRef('');
  const passwordValue = useRef('');
  // 1. Имэйл шалгах Regex (Стандарт формат)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // 2. Нууц үг шалгах Regex (Дор хаяж 8 тэмдэгт, 1 том үсэг, 1 тоо)
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const [loginButtonDisabled, setLoginButtonDisabled] = useState(true);

  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  const [biometricStatus, setBiometricStatus] = useState(false);
  const [saveBiometric, setSaveBiometric] = useState(false);

  const [checkbox, setCheckbox] = useState(false);
  const [isLoginLoading, setLoginLoading] = useState(false);

  const isUserLoggedIn = useUserStore((data) => data.isUserLoggedIn);
  const setUserLoggedIn = useUserStore((data) => data.setUserLoggedIn);
  const user = useUserStore((data) => data.user);
  const setUser = useUserStore((data) => data.setUser);

  useEffect(() => {
    const isAvailable = SecureStore.isAvailableAsync();
    if (isAvailable) {
      setBiometricStatus(true);
    } else {
      setBiometricStatus(false);
    }
  }, [navigatorIndex]);

  const loginHandler = async () => {
    setLoginLoading(true);
    try {
      const res = await axios.post(
        'http://192.168.1.45:3099/api/v1/login',
        { identifier: emailValue.current, password: passwordValue.current },
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
        },
      );
      const data = res.data;
      if (res.status === 200) {
        const accessToken = data.data[0].accessToken ?? null;
        const refreshToken = data.data[0].refreshToken ?? null;
        console.log(accessToken, refreshToken);
        emailInputRef.current.clear();
        passwordInputRef.current.clear();
        emailValue.current = '';
        passwordValue.current = '';
        /*         if (
          typeof data === 'object' &&
          accessToken != null &&
          refreshToken != null
        ) {
          await SecureStore.setItemAsync('user_token', JSON.stringify(data));
          const userData = { accessToken, refreshToken };
          setUserLoggedIn(true);
          setUser({ ...user, ...userData });
        } else {
          await SecureStore.deleteItemAsync('user_token');
          setUserLoggedIn(false);
          setUser(null);
        } */
      }
    } catch (e) {
      console.log(e.response.data.errorMessage);
    } finally {
      setLoginLoading(false);
    }
  };

  useEffect(() => {
    emailInputRef.current.clear();
    passwordInputRef.current.clear();
    emailValue.current = '';
    passwordValue.current = '';
    console.log('cleared by init');
  }, []);

  useEffect(() => {
    emailInputRef.current.clear();
    passwordInputRef.current.clear();
    emailValue.current = '';
    passwordValue.current = '';
    console.log('cleared by user');
  }, [user]);

  return (
    <ScrollView
      horizontal={false}
      nestedScrollEnabled
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ width: '100%', minHeight: '100%' }}
    >
      <View
        style={{
          paddingBottom: navigatorHeight,
          paddingTop: insets.top,
          minHeight: '100%',
          gap: 40,
          paddingHorizontal: 30,
        }}
      >
        <View
          style={{
            width: '100%',
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
              width: '100%',
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
              ref={emailInputRef}
              syncLight
              onChange={(e) => {
                console.log('onChange');
              }}
              onBlur={() => {
                if (emailValue.current.length === 0) {
                  emailInputRef.current.clear();
                  setEmailError(false);
                  setLoginButtonDisabled(true);
                }
              }}
              onChangeText={(text) => {
                emailValue.current = text;
                if (
                  emailRegex.test(emailValue.current) &&
                  passwordRegex.test(passwordValue.current)
                ) {
                  if (emailError === true && passwordError === false) {
                    setLoginButtonDisabled(false);
                  }
                }
                if (emailError === true && emailRegex.test(text) === true) {
                  setEmailError(false);
                  console.log('noError');
                } else if (
                  emailError === false &&
                  emailRegex.test(text) === false
                ) {
                  setEmailError(true);
                  setLoginButtonDisabled(true);
                  console.log('Error');
                } else if (text.length === 0) {
                  setEmailError(false);
                  setLoginButtonDisabled(true);
                  console.log('0Lenght');
                }
              }}
              placeholder="Имэйл хаяг"
              secureTextEntry={false}
              autoCapitalize="none"
              autoComplete="email"
              inputMode="email"
              keyboardType="email-address"
              returnKeyType="next"
              enterKeyHint="next"
              value={null}
              textContentType="emailAddress"
              onSubmitEditing={(e) => {
                if (emailError === false && emailValue.current.length > 0) {
                  passwordInputRef.current.focus();
                }
              }}
            ></TextInput>
          </View>
          <View
            style={{
              width: '100%',
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
              onBlur={() => {
                if (passwordValue.current.length === 0) {
                  passwordInputRef.current.clear();
                  setPasswordError(false);
                  setLoginButtonDisabled(true);
                }
              }}
              onChangeText={(text) => {
                passwordValue.current = text;
                if (
                  emailRegex.test(emailValue.current) &&
                  passwordRegex.test(passwordValue.current)
                ) {
                  if (emailError === false && passwordError === true) {
                    setLoginButtonDisabled(false);
                  }
                }
                if (
                  passwordError === true &&
                  passwordRegex.test(text) === true
                ) {
                  setPasswordError(false);
                  console.log('noError');
                } else if (
                  passwordError === false &&
                  passwordRegex.test(text) === false
                ) {
                  setPasswordError(true);
                  setLoginButtonDisabled(true);
                  console.log('Error');
                } else if (text.length === 0) {
                  setPasswordError(false);
                  setLoginButtonDisabled(true);
                  console.log('0Lenght');
                }
              }}
              autoCapitalize="none"
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
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <Button
              hitSlop={8}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}
              onPress={() => {
                setCheckbox((prev) => (prev ? false : true));
              }}
            >
              <Checkbox checked={checkbox} size={20} />
              <Text syncLight>Нэвтрэлт сануулах</Text>
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
              width: '100%',
              flexDirection: 'row',
              gap: '5%',
            }}
          >
            <Button
              onPress={() => {
                if (loginButtonDisabled === false && isLoginLoading === false) {
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
                    : isLoginLoading
                      ? isLight
                        ? 'rgb(200,200,200)'
                        : 'rgb(80,80,80)'
                      : '#ff1119',
              }}
              duration={500}
            >
              {isLoginLoading ? (
                <ActivityIndicator
                  color={'#fff'}
                  size={'small'}
                ></ActivityIndicator>
              ) : (
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
              )}
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
          style={{ width: '100%', flexDirection: 'row', alignItems: 'center' }}
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
            router.push('5/RegisterScreen');
          }}
          style={{
            padding: 20,
            width: '100%',
            borderRadius: 5,
          }}
          syncLight
        >
          <Text style={{ textAlign: 'center' }} syncLight>
            Бүртгүүлэх
          </Text>
        </Button>
        <View
          style={{ width: '100%', flexDirection: 'row', alignItems: 'center' }}
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
        <View
          style={{
            width: '100%',
            justifyContent: 'center',
            flexDirection: 'row',
            gap: 20,
          }}
        >
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
