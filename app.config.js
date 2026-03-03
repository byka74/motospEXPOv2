export default {
  expo: {
    name: "MotoSP",
    slug: "motospmn-app",
    version: "1.0.1",
    orientation: "portrait",
    icon: "./src/assets/icons/icon.png",
    scheme: "motospmn",
    userInterfaceStyle: "automatic",
    jsEngine: "hermes",
    backgroundColor: "#ff1119",
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.motospmn.app",
      buildNumber: "1.0.1",
      config: {usesNonExemptEncryption: false},
      infoPlist: {
        NSFaceIDUsageDescription: "Биометрик хамгаалалт.",
        UIViewControllerBasedStatusBarAppearance: false,
      },
    },
    android: {
      softwareKeyboardLayoutMode: "resize",
      adaptiveIcon: {
        backgroundColor: "#ff1119",
        foregroundImage: "./src/assets/icons/android-icon-foreground.png",
        backgroundImage: "./src/assets/icons/android-icon-background.png",
        monochromeImage: "./src/assets/icons/android-icon-monochrome.png",
      },
      predictiveBackGestureEnabled: false,
      permissions: ["USE_BIOMETRIC", "USE_FINGERPRINT"],
      package: "com.motospmn.app",
    },
    plugins: [
      "expo-system-ui",
      "expo-router",
      [
        "expo-splash-screen",
        {
          backgroundColor: "#ff1119",
          image: "./src/assets/icons/splash-icon.png",
          resizeMode: "contain",
          imageWidth: 200
        },
      ],
      [
        "expo-notifications",
        {
          icon: "./src/assets/icon-BLk7VyK7.png",
          color: "#ffffff",
          defaultChannel: "default",
          enableBackgroundRemoteNotifications: true,
        },
      ],
      "expo-font",
      "expo-secure-store",
    ],
    experiments: {typedRoutes: false, reactCompiler: false},
  },
};
