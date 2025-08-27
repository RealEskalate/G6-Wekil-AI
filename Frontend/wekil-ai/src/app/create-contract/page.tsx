"use client";

import { ContractWizard } from "@/components/wizard/ContractWizard";
import { Toaster } from "sonner";
import { useRouter } from "next/navigation";

export default function CreateContractPage() {
  const router = useRouter();
  return (
    <>
      <ContractWizard onBackToDashboard={() => router.push("/dashboard")} />
      <Toaster richColors />
    </>
  );
}