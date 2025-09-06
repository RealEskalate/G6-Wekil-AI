import { ContractData } from "@/components/wizard/ContractWizard";
import { ContractDraft } from "./Contracttype";

export interface ApiContractDraft{
    id: string;
    title: string;
    sections: {heading: string; text: string}[];
    signatures: {party_a: string; party_b: string; place: string; date: string};
}

export function convertInterfaceContractDraft(data: ApiContractDraft): ContractDraft {

    return {
        title: data.title,
        party1: {name: "", address: "", email: ""}, 
        party2: {name: "", address: "", email: ""},
        sections: data.sections.map((item) => ({
            heading: item.heading,
            description: item.text
        })),
        sign1: data.signatures.party_a,
        sign2: data.signatures.party_b,
        place: data.signatures.place,
        date: data.signatures.date,
    }
}

export interface Intake {
  // Common fields
  id: string; 
  agreement_type?: "sale" | "service" | "loan" | "nda"; // Type of agreement
  parties?: Party[]; // 0 disclosing party | 1 receiving party
  location?: string;
  currency?: string;
  total_amount?: number;
  start_date?: string; // ISO date string
  end_date?: string;   // ISO date string

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

  disclosing_party?: Party; // The one spilling the beans
  receiving_party?: Party;  // The one promising to keep quiet
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
export function convertContractFormatToIntake(data: ContractData): Intake {
  return {
    id: data.id ?? "",
    agreement_type: (data.contractType?.toLowerCase() as
      | "sale"
      | "service"
      | "loan"
      | "nda") ?? "",
    parties: data.parties?.map((p): Party => ({
      name: p.fullName ?? "",
      address: p.address ?? "",
      email: p.email ?? "",
      phone: p.phone ?? "",
    })) ?? [],
    location: data.commonDetails?.location ?? "",
    currency: data.commonDetails?.currency ?? "",
    total_amount: data.commonDetails?.totalAmount ?? 0,
    start_date: data.commonDetails?.startDate ?? "",
    end_date: data.commonDetails?.endDate ?? "",

    // Service-specific fields
    services: data.specificDetails?.servicesDescription ?? "",
    milestones: data.specificDetails?.milestones ?? [],
    revisions: data.specificDetails?.revisions ?? 0,

    // Sale-specific fields
    goods: data.specificDetails?.items?.map((item) => ({
      description: item.description ?? "",
      quantity: item.quantity ?? 0,
      unit_price: item.unitPrice ?? 0,
    })) ?? [],
    delivery_terms: data.specificDetails?.deliveryTerms ?? "",

    // Loan-specific fields
    principal: data.specificDetails?.principalAmount ?? 0,
    installments: data.specificDetails?.installments?.map((inst) => ({
      amount: inst.amount ?? 0,
      due_date: inst.dueDate ?? "",
    })) ?? [],
    late_fee_percent: data.specificDetails?.lateFeePercentage ?? 0,

    // NDA fields
    is_mutual: data.specificDetails?.isMutual ?? false,
    effective_date: data.specificDetails?.effectiveDate ?? "",
    confidentiality_term: data.specificDetails?.confidentialityPeriod ?? 0,
    purpose: data.specificDetails?.purpose ?? "",
  };
}

export interface ClassificationResult {
  category: string; // e.g., "basic", "complex", etc.
  reasons: string[];
}

export interface FinalPreviewResponse {
  message: string; // e.g., "Final draft classified successfully."
  classification: ClassificationResult;
  type?: string; // optional, e.g., "ai/finalPreview/fulfilled"
}



