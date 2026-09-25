import { Activity, CircleAlert, CircleCheck } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { ActivityIndicator } from "react-native";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CardContent } from "@/components/ui/card-content";
import { CardHeader } from "@/components/ui/card-header";
import { CardTitle } from "@/components/ui/card-title";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useHealth } from "@/hooks/use-health";

export function HealthStatusCard() {
  const { t } = useTranslation();
  const { status, health, refresh } = useHealth();

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <Icon as={Activity} className="text-muted-foreground" />
        <CardTitle>{t("health.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        {status === "loading" && <ActivityIndicator />}
        {status === "online" && health && (
          <Text className="text-success">
            <Icon as={CircleCheck} className="text-success" />{" "}
            {t("health.online", {
              service: health.service,
              version: health.version,
              database: health.database,
            })}
          </Text>
        )}
        {status === "error" && (
          <>
            <Text className="text-destructive">
              <Icon as={CircleAlert} className="text-destructive" />{" "}
              {t("health.error")}
            </Text>
            <Button variant="outline" onPress={refresh}>
              <Text>{t("common.retry")}</Text>
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
