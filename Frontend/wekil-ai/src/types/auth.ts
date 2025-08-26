export type AccountType = "individual" | "organization";

export interface IndividualFormData {
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  telephone: string;
  password: string;
  confirmPassword: string;
}

export interface FormErrors {
  firstName?: string;
  lastName?: string;
  middleName?: string;
  email?: string;
  telephone?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

export interface LoginData {
  email: string;
  password: string;
}