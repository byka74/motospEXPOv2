import React, { useEffect, useState, useCallback } from "react";
import { View, Text, ScrollView } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { useUserStore, useThemeStore } from "../zustand/context";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Appearance } from "react-native";

export default function () {
  const user = useUserStore((state) => state.user);
  const isLight = useThemeStore((state) => state.isLight);
  const setLight = useThemeStore((state) => state.setLight);
  const initInsets = useSafeAreaInsets();
  useEffect(() => {
    const colorsSchemeSub = Appearance.addChangeListener(({colorScheme})=>{
      setLight(colorScheme === 'light' ? true : false);
    })
    return ()=>{
      colorsSchemeSub.remove();
    }
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: isLight ? "rgb(255,255,255)" : "rgb(50,50,50)" }}>
      <StatusBar
        style={isLight ? 'dark' : 'light'}
        animated={true}></StatusBar>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ScrollView
          bounces={false}
          overScrollMode="never"
          horizontal={false}
          contentContainerStyle={{ minWidth: "100%", minHeight: "100%" }}>
          <View style={{backgroundColor: 'rgb(100,100,100)', flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 500, paddingTop: initInsets.top, paddingBottom: initInsets.bottom }}>
            <Text>Header</Text>
            <Text>{user ?? "null"}</Text>
            <Text>Center content</Text>
            <Text>Footer</Text>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
