import type { ComponentProps } from "react";
import { View } from "react-native";

import { cn } from "@/lib/utils";

export function CardContent({
  className,
  ...props
}: ComponentProps<typeof View>) {
  return <View className={cn("gap-3 p-4 pt-2", className)} {...props} />;
}
