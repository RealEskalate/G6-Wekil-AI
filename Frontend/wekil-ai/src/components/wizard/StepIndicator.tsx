"use client";

import { Check } from "lucide-react";
import type { Language, Step } from "@/components/wizard/ContractWizard";

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  currentLanguage: Language;
}

export function StepIndicator({ steps, currentStep, currentLanguage }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-between max-w-4xl mx-auto">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                step.id < currentStep
                  ? "bg-slate-800 text-white"
                  : step.id === currentStep
                    ? "bg-teal-500 text-white"
                    : "bg-gray-200 text-gray-500"
              }`}
            >
              {step.id < currentStep ? (
                <Check className="h-5 w-5" />
              ) : (
                <step.icon className="h-5 w-5" />
              )}
            </div>
            <div className="mt-2 text-center">
              <p
                className={`text-sm font-medium ${
                  step.id === currentStep ? "text-teal-600" : "text-gray-600"
                }`}
              >
                {currentLanguage === "english" ? step.title : step.titleAmharic}
              </p>
            </div>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`flex-1 h-0.5 mx-4 ${
                step.id < currentStep ? "bg-slate-800" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}