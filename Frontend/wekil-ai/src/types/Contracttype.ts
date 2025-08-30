export interface ContractFormat {
  // Common fields
  id: string;
  type: "service" | "loan" | "sale" | "nonDisclosure";
  title: string;
  payment: string;
  date: string;
  status: string;
  language: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  Description: string;
  party1: Party;
  party2: Party;

  // Service-specific fields
  services?: string;
  milestones?: Milestone[];
  revisions?: number;

  // Sale-specific fields
  goods?: Goods[];
  delivery_terms?: string;

  // Loan-specific fields
  principal?: number;
  installments?: Installment[];
  late_fee_percent?: number;

  // Non-disclosure-specific fields
  effectiveDate?: string; // ISO 8601 format
  confidentialityTerm?: number; // in years
  purpose?: string;
}
export interface Party {
  name: string;
  address: string;
  email: string;
  phone?: string;
}
export interface Milestone {
  description: string;
  date: string; // Use string to represent ISO 8601 date
}

export interface Goods {
  item: string;
  qty: number;
  unit_price: number;
}

export interface Installment {
  amount: number;
  due_date: string;
}

const party1: Party = {
  name: "John Doe",
  address: "123 Main St, Cityville",
  email: "",
  phone: "555-1234",
};
const party2: Party = {
  name: "ABC Company",
  address: "123 Main St, Cityville",
  email: "",
  phone: "555-1234",
};

export const data1: ContractFormat = {
  id: "1",
  type: "service",
  title: "Website Development Contract",
  party1: party1,
  party2: party2,
  payment: "50,000",
  date: "2024-01-15",
  status: "completed",
  language: "en",
  startDate: "2024-01-15",
  endDate: "2024-06-15",
  createdAt: "2024-01-01",
  Description:
    "This contract outlines the terms and conditions for website development services provided by John Doe to ABC Company.",
  services:
    "Design and development of a responsive website, including up to 5 pages, contact form, and basic SEO optimization.",
  milestones: [
    { description: "Initial design mockups", date: "2024-02-01" },
    { description: "Development phase", date: "2024-03-15" },
    { description: "Testing and revisions", date: "2024-05-01" },
  ],
  revisions: 2,
  goods: [
    { item: "Laptop", qty: 1, unit_price: 1500 },
    { item: "Monitor", qty: 2, unit_price: 300 },
  ],
  delivery_terms: "Delivery within 30 days of contract signing.",
  principal: 10000,
  installments: [{ amount: 2500, due_date: "2024-02-15" }],
  late_fee_percent: 5,
  effectiveDate: "2024-01-15",
  confidentialityTerm: 3,
  purpose:
    "To protect the confidential information exchanged between the parties.",
};
export const data2: ContractFormat = {
  ...data1,
  type: "loan",
  createdAt: "2024-12-01",
  status: "Active",
};
export const data3: ContractFormat = {
  ...data1,
  type: "nonDisclosure",
  status: "Active",
  createdAt: "2025-05-01",
};
export const data4: ContractFormat = {
  ...data1,
  type: "sale",
  createdAt: "2025-08-30",
  status: "completed",
};
