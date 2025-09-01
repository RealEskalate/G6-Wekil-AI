"use client";

import * as React from "react";
import { cn } from "./utils";

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  checked?: boolean;
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, checked, ...props }, ref) => {
    return (
      <label
        className={cn(
          "relative inline-flex items-center cursor-pointer",
          className
        )}
      >
        <input
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          ref={ref}
          {...props}
        />
        <span
          className={cn(
            "w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 transition-colors",
            "after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-transform peer-checked:after:translate-x-5"
          )}
        />
      </label>
    );
  }
);

Switch.displayName = "Switch";

export { Switch };
