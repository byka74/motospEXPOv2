import { create } from 'zustand';
import { Appearance } from 'react-native';
import { setItem, getItem } from 'expo-secure-store';

/**
 * @typedef {object} UserState
 * @property {object|null} user - Хэрэглэгчийн мэдээлэл
 * @property {boolean} isUserLoggedIn - Нэвтэрсэн эсэх
 * @property {function(object): void} setUser - Хэрэглэгчийг тохируулах
 * @property {function(): void} logout - Системээс гарах
 */

/** @type {import('zustand').UseBoundStore<import('zustand').StoreApi<UserState>>} */
export const useUserStore = create((set) => ({
  user: null,
  isUserLoggedIn: false,
  setUser: (data) => set({ user: data, isUserLoggedIn: false }),
  logout: () => set({ user: null, isUserLoggedIn: false }),
}));

/**
 * @typedef {object} ThemeState
 * @property {boolean} isLight - Цайвар горим идэвхтэй эсэх
 * @property {string} theme - Сонгосон тем ('light', 'dark', 'auto')
 * @property {function(boolean): void} setLight - Горимыг гараар солих
 * @property {function(string): void} setTheme - Темийг хадгалах
 * @property {string} navigatorHeight
 * @property {function(boolean): void} setNavigatorheight
 */

const systemLight = Appearance.getColorScheme();

/** @type {import('zustand').UseBoundStore<import('zustand').StoreApi<ThemeState>>} */
export const useThemeStore = create((set) => ({
  isLight: systemLight === 'light' ? true : false,
  setLight: (data) => set({ isLight: data }),
  theme: getItem('theme') ?? 'auto',
  navigatorHeight: 100,
  setNavigatorheight: (data)=>set({navigatorHeight: data}),
}));

/**
 * @typedef {object} GlobalState
 * @property {number} index - Одоогийн индекс
 * @property {function(number): void} setIndex - Индекс шинэчлэх функц
 * @property {number} navigatorIndex - Навигатор индекс
 * @property {function(number): void} setNavigatorIndex - Навигатор индекс шинэчлэх функц
 */

/** @type {import('zustand').UseBoundStore<import('zustand').StoreApi<GlobalState>>} */
export const useGlobalState = create((set) => ({
  index: 0,
  setIndex: (data) => set({ index: data }),
  navigatorIndex: 0,
  setNavigatorIndex: (data) => set({ navigatorIndex: data }),
}));
