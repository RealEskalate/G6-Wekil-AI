export interface SignupFormData {
  first_name: string;
  middle_name: string;
  last_name: string;
  email: string;
  telephone: string;
  password: string;
  confirmPassword: string;
}

export interface FormData {
  profilePicture: string;
  signatureImage: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  email: string;
  telephone: string;
  password: string;
  confirmPassword: string;
  address: string;
}

export interface FormErrors {
  first_name?: string;
  last_name?: string;
  middle_name?: string;
  email?: string;
  telephone?: string;
  password?: string;
  confirmPassword?: string;
  address?:string;
  general?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AnalyticsData {
  month: string;
  contracts: number;
  users: number;
  revenue: number;
}

export interface Contract {
  id: string;
  title: string;
  type: "service" | "sale" | "loan" | "nda";
  status: "draft" | "pending" | "active" | "completed" | "cancelled";
  creator: string;
  createdAt: string;
  amount: number;
  currency: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  contractsCount: number;
  status: "active" | "inactive";
  lastActivity: string;
}