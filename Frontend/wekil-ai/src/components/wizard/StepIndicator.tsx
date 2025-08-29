"use client";

import { cn } from "@/lib/utils";
import { Step, Language } from "@/components/wizard/ContractWizard";

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  currentLanguage: Language;
}

export function StepIndicator({ steps, currentStep, currentLanguage }: StepIndicatorProps) {
  const t = {
    en: {
      step: "Step",
    },
    am: {
      step: "ደረጃ",
    },
  }[currentLanguage];

  return (
    <div className="flex items-center justify-between">
      {steps.map((step, index) => (
        <div key={step.id} className="flex-1 text-center">
          <div
            className={cn(
              "w-8 h-8 mx-auto rounded-full flex items-center justify-center",
              index <= currentStep ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
            )}
          >
            {index + 1}
          </div>
          <p className="mt-2 text-sm">{t.step} {index + 1}</p>
          <p className="text-sm font-medium">{step.label}</p>
        </div>
      ))}
    </div>
  );
}