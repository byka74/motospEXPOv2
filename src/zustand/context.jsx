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
 */

const systemLight = Appearance.getColorScheme();

/** @type {import('zustand').UseBoundStore<import('zustand').StoreApi<ThemeState>>} */
export const useThemeStore = create((set) => ({
  isLight: systemLight === 'light' ? true : false,
  setLight: (data) => set({ isLight: data }),
  theme: getItem('theme') ?? 'auto',
}));
