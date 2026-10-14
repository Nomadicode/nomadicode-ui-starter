import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

import "@/global.css";
import "@/i18n";
import { useScreenTracking } from "@/hooks/use-screen-tracking";
import { useSyncDeviceLanguage } from "@/hooks/use-sync-device-language";

export default function RootLayout() {
  useSyncDeviceLanguage();
  useScreenTracking();

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaProvider>
  );
}
