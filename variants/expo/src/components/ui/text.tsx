import * as Slot from "@rn-primitives/slot";
import { useContext, type ComponentProps } from "react";
import { Text as RNText } from "react-native";

import { TextClassContext } from "@/components/ui/text-class-context";
import { cn } from "@/lib/utils";

type TextProps = ComponentProps<typeof RNText> & { asChild?: boolean };

export function Text({ className, asChild = false, ...props }: TextProps) {
  const inheritedClassName = useContext(TextClassContext);
  const Component = asChild ? Slot.Text : RNText;

  return (
    <Component
      className={cn("text-base text-foreground", inheritedClassName, className)}
      {...props}
    />
  );
}
