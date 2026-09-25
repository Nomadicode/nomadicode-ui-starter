import type { ComponentProps } from "react";
import { View } from "react-native";

import { cn } from "@/lib/utils";

export function Card({ className, ...props }: ComponentProps<typeof View>) {
  return (
    <View
      className={cn("rounded-xl border border-border bg-card", className)}
      {...props}
    />
  );
}
