"use client";
import { getAgreementDetailById } from "@/lib/ContractGetAgreements";
import { ContractFormat } from "@/types/Contracttype";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import ViewContract from "../ViewContract";
import WeKilAILoader from "@/components/ui/WekilAILoader";

const ShowAgreement = ({ id }: { id: string }) => {
  const [SpecificDetails, setSpecificDetail] = useState<ContractFormat | null>(
    null
  );
  const { data: session, status } = useSession();
  useEffect(() => {
    const fetch = async () => {
      if (status === "authenticated" && session?.user) {
        const res = await getAgreementDetailById(
          id,
          session.user.accessToken || ""
        );
        setSpecificDetail(convertIntakeToContractFormat(res.data));
      }
    };
    fetch();
  }, [status, session, id]);
  if (SpecificDetails != null) {
    return <ViewContract contract={SpecificDetails} />;
  } else {
    return <WeKilAILoader />;
  }
};

export interface Intake {
  // Common fields
  id?: string; // MongoDB ObjectID
  agreement_type?: "sale" | "service" | "loan" | "nda"; // Type of agreement
  parties?: Party[]; // 0 disclosing party | 1 receiving party
  location?: string;
  currency?: string;
  total_amount?: number;
  start_date?: string; // ISO date string
  end_date?: string; // ISO date string

  // Service-specific fields
  services?: string;
  milestones?: ApiMilestone[];
  revisions?: number;

  // Sale-specific fields
  goods?: ApiGoods[];
  delivery_terms?: string;

  // Loan-specific fields
  principal?: number;
  installments?: ApiInstallment[];
  late_fee_percent?: number;

  // NDA fields
  //! the below two could be removed in future
  disclosing_party?: Party; // The one spilling the beans
  receiving_party?: Party; // The one promising to keep quiet
  is_mutual?: boolean;
  effective_date?: string; // ISO date string
  confidentiality_term?: number;
  purpose?: string;
}
export interface Party {
  name: string;
  email?: string;
  address?: string;
  phone?: string;
}

export interface ApiMilestone {
  description: string;
  date: string; // ISO date string
}

export interface ApiGoods {
  description: string;
  quantity: number;
  unit_price: number;
}

export interface ApiInstallment {
  amount: number;
  due_date: string; // ISO date string
}

export function convertIntakeToContractFormat(intake: Intake): ContractFormat {
  return {
    id: intake.id ?? "",
    // type:
    //   intake.agreement_type === "nda"
    //     ? "nonDisclosure"
    //     : intake.agreement_type ?? "service",
    type: "service",
    title: `${intake.agreement_type?.toUpperCase() ?? "CONTRACT"} Agreement`,
    payment: `${intake.currency ?? "USD"} ${
      intake.total_amount?.toFixed(2) ?? "0.00"
    }`,
    date: new Date().toISOString(), // You can replace this with a real field if available
    status: "draft", // Default value; change if needed
    language: "en", // Default; change if dynamic
    startDate: intake.start_date ?? "",
    endDate: intake.end_date ?? "",
    createdAt: new Date().toISOString(), // Replace with actual createdAt if stored
    Description: `Generated from intake.`,
    pdfURl: "", // Set later if PDF is generated

    party1: {
      name: intake.parties?.[0]?.name ?? intake.disclosing_party?.name ?? "",
      address:
        intake.parties?.[0]?.address ?? intake.disclosing_party?.address ?? "",
      email: intake.parties?.[0]?.email ?? intake.disclosing_party?.email ?? "",
      phone: intake.parties?.[0]?.phone ?? intake.disclosing_party?.phone,
    },

    party2: {
      name: intake.parties?.[1]?.name ?? intake.receiving_party?.name ?? "",
      address:
        intake.parties?.[1]?.address ?? intake.receiving_party?.address ?? "",
      email: intake.parties?.[1]?.email ?? intake.receiving_party?.email ?? "",
      phone: intake.parties?.[1]?.phone ?? intake.receiving_party?.phone,
    },

    // Service-specific
    services: intake.services,
    milestones: intake.milestones?.map((m) => ({
      description: m.description,
      date: m.date,
    })),
    revisions: intake.revisions,

    // Sale-specific
    goods: intake.goods?.map((g) => ({
      item: g.description,
      qty: g.quantity,
      unit_price: g.unit_price,
    })),
    delivery_terms: intake.delivery_terms,

    // Loan-specific
    principal: intake.principal,
    installments: intake.installments?.map((i) => ({
      amount: i.amount,
      due_date: i.due_date,
      paymentTerm: "N/A", // You can add logic if needed
    })),
    late_fee_percent: intake.late_fee_percent,

    // NDA-specific
    isMutual: intake.is_mutual,
    effectiveDate: intake.effective_date,
    confidentialityTerm: intake.confidentiality_term,
    purpose: intake.purpose,
  };
}

export default ShowAgreement;
