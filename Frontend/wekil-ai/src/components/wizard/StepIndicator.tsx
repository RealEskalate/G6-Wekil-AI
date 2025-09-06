"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { Step } from "@/components/wizard/ContractWizard";

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-between max-w-4xl px-2 sm:px-6 w-full overflow-x-auto">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center min-w-[80px] sm:min-w-0">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium",
                index < currentStep
                  ? "bg-slate-800 text-white"
                  : index === currentStep
                  ? "bg-teal-500 text-white"
                  : "bg-gray-200 text-gray-500"
              )}
            >
              {index < currentStep ? (
                <Check className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <step.icon className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </div>
            <div className="mt-1 sm:mt-2 text-center">
              <p
                className={cn(
                  "text-xs sm:text-sm font-medium truncate max-w-[60px] sm:max-w-none",
                  index === currentStep ? "text-teal-600" : "text-gray-600"
                )}
                title={step.label}
              >
                {step.label}
              </p>
            </div>
          </div>
          {index < steps.length - 1 && (
            <div
              className={cn(
                "flex-1 h-0.5 mx-2 sm:mx-4 min-w-[16px] sm:min-w-[32px]",
                index < currentStep ? "bg-slate-800" : "bg-gray-200"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}
