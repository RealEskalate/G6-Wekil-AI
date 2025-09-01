"use client";

import { ContractWizard } from "@/components/wizard/ContractWizard";
import { Toaster } from "sonner";
import { useRouter } from "next/navigation";

export default function CreateContractPage() {
  const router = useRouter();
  return (
    <>
      <div className="flex h-screen bg-gray-200">
        <main className="flex-1 overflow-auto bg-gray-800">
          <ContractWizard onBackToDashboard={() => router.push("/dashboard")} />
          <Toaster richColors />
        </main>
      </div>
    </>
  );
}
