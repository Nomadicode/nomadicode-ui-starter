import type { ComponentProps } from "react";

import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

export function CardTitle({ className, ...props }: ComponentProps<typeof Text>) {
  return (
    <Text
      role="heading"
      className={cn("text-sm font-medium uppercase tracking-wide text-muted-foreground", className)}
      {...props}
    />
  );
}
