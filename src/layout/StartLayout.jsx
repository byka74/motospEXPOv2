import React, {useEffect, useMemo, useRef, useState, useCallback} from "react";
import {
  useWindowDimensions,
  Keyboard,
  Linking,
  Platform,
  ScrollView,
  FlatList,
  View,
  Pressable,
  StatusBar,
  StyleSheet,
  BackHandler,
} from "react-native";
import * as SplashScreen from "expo-splash-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {NavigationContainer, useNavigation} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {enableScreens} from "react-native-screens";
import * as SystemUI from "expo-system-ui";

import {BlurView} from "expo-blur";

enableScreens();

function parsePathAndParams(url) {
  if (!url || typeof url !== "string") {
    return {path: "/", params: {}};
  }

  // 1. scheme-ийг салгана (motosp:// эсвэл https://motosp.mn)
  let clean = url;

  if (url.startsWith("https://")) {
    try {
      const u = new URL(url);
      clean = u.pathname + u.search;
    } catch {
      return {path: "/", params: {}};
    }
  } else {
    const idx = url.indexOf("://");
    clean = idx !== -1 ? "/" + url.slice(idx + 3) : "/" + url;
  }

  // 2. query-г салгана
  const [path, query] = clean.split("?");

  // 3. params parse
  const params = {};
  if (query) {
    query.split("&").forEach(pair => {
      const [k, v] = pair.split("=");
      if (k) params[decodeURIComponent(k)] = decodeURIComponent(v || "");
    });
  }

  return {path, params};
}

function matchRoute(path, pattern) {
  if (typeof path !== "string") return null;

  const keys = [];
  const regex = new RegExp(
    "^" +
      pattern.replace(/:([^/()]+)(\(([^)]+)\))?/g, (_, key, __, rgx) => {
        keys.push(key);
        return `(${rgx || "[^/]+"})`;
      }) +
      "$",
  );

  const match = path.match(regex);
  if (!match) return null;

  const params = {};
  keys.forEach((k, i) => {
    params[k] = match[i + 1];
  });

  return params;
}

/* //STARTING MAIN LAYOUT ------------------------------------------------------------------ 
// ---------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------*/
export default function StartLayout({isFontLoad}) {

  const Stack = createNativeStackNavigator();
  SystemUI.setBackgroundColorAsync('#ffffff');

  /* Linking Listeners */
  useEffect(() => {

    Linking.getInitialURL().then(url => {
      if (!url) return;
      const scheme = parsePathAndParams(url);
      const route = matchRoute(scheme.path, "/ads/:id(\\d+)");
      console.log("Initial path:", scheme, route);
    });

    const linkSub = Linking.addEventListener("url", ({url}) => {
      const scheme = parsePathAndParams(url);
      const route = matchRoute(scheme.path, "/ads/:id(\\d+)");
      console.log("Initial path:", scheme, route);
    });

    return () => {
      linkSub.remove();
    };
  }, []);

  return (
    <View style={[{flex: 1}]}>
 
    </View>
  );
}
