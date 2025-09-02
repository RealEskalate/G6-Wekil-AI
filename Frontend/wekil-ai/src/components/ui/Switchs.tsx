"use client"

<<<<<<< HEAD:Frontend/wekil-ai/src/components/ui/switch.tsx
import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
=======
import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";

import { cn } from "@/lib/utils";

interface CustomSwitchProps
  extends Omit<
    React.ComponentProps<typeof SwitchPrimitive.Root>,
    "onChange" | "onCheckedChange"
  > {
  onCheckedChange?: (checked: boolean) => void;
}

function Switch({ className, onCheckedChange, ...props }: CustomSwitchProps) {
>>>>>>> 777a9dc5cbaf9a5f85fa23c8fc6ba77d31ff4968:Frontend/wekil-ai/src/components/ui/Switchs.tsx
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-gray-200 focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
      onCheckedChange={onCheckedChange} // ✅ Correctly forward your prop
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0"
        )}
      />
    </SwitchPrimitive.Root>
<<<<<<< HEAD:Frontend/wekil-ai/src/components/ui/switch.tsx
  )
}

export { Switch }
=======
  );
}

export { Switch };
>>>>>>> 777a9dc5cbaf9a5f85fa23c8fc6ba77d31ff4968:Frontend/wekil-ai/src/components/ui/Switchs.tsx
