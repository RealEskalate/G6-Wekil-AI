export interface SignupFormData {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  telephone: string;
  password: string;
  confirmPassword: string;
}

export interface FormData {
  profilePicture: string;
  signatureImage: string;
  firstName: string;
  middleName: string;
  lastName: string;
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