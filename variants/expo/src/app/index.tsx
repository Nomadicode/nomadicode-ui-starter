import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { HealthStatusCard } from "@/components/health-status-card";

export default function HomeScreen() {
  const { t } = useTranslation();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center gap-6 px-6">
        <Text className="text-3xl font-bold text-foreground">
          {t("home.title")}
        </Text>
        <Text className="text-center text-base text-muted">
          {t("home.tagline")}
        </Text>
        <HealthStatusCard />
      </View>
    </SafeAreaView>
  );
}
