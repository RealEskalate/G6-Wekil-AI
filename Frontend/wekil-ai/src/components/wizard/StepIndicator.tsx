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
    <div className="flex items-center justify-between max-w-4xl px-6">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium",
                index < currentStep
                  ? "bg-slate-800 text-white"
                  : index === currentStep
                  ? "bg-teal-500 text-white"
                  : "bg-gray-200 text-gray-500"
              )}
            >
              {index < currentStep ? (
                <Check className="h-5 w-5" />
              ) : (
                <step.icon className="h-5 w-5" />
              )}
            </div>
            <div className="mt-2 text-center">
              <p
                className={cn(
                  "text-sm font-medium",
                  index === currentStep ? "text-teal-600" : "text-gray-600"
                )}
              >
                {step.label}
              </p>
            </div>
          </div>
          {index < steps.length - 1 && (
            <div
              className={cn(
                "flex-1 h-0.5 mx-4",
                index < currentStep ? "bg-slate-800" : "bg-gray-200"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}
