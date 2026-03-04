import { create } from "zustand";
import { Appearance } from "react-native";
import { setItem, getItem } from "expo-secure-store";

export const useUserStore = create((set) => ({
  user: null,
  isUserLoggedIn: false,
  setUser: (data) => set({ user: data, isUserLoggedIn: false }),
  logout: () => set({ user: null, isUserLoggedIn: false }),
}));

export const useThemeStore = create((set) => ({
  isLight: true,
  setLight: (data) => set({ isLight: data }),
  theme: getItem("theme") ?? "auto",
}));
