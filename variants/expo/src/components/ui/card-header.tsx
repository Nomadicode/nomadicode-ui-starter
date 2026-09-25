import type { ComponentProps } from "react";
import { View } from "react-native";

import { cn } from "@/lib/utils";

export function CardHeader({
  className,
  ...props
}: ComponentProps<typeof View>) {
  return (
    <View className={cn("flex-row items-center gap-2 p-4 pb-2", className)} {...props} />
  );
}
