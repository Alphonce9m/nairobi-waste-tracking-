// Type definitions for authentication

export interface SignInFormData {
  email: string;
  password: string;
}

export interface SignUpFormData extends SignInFormData {
  confirmPassword: string;
  role: 'buyer' | 'seller';
  fullName: string;
  phone: string;
}

export interface ResetStatus {
  type: 'success' | 'error';
  message: string;
}

export type UserRole = 'buyer' | 'seller' | null;

export interface AuthState {
  signIn: SignInFormData;
  signUp: SignUpFormData;
  resetEmail: string;
  resetStatus: ResetStatus | null;
  signInRole: UserRole;
  showForgotPassword: boolean;
  showSignInButton: boolean;
  lastSignedUpEmail: string;
  authLoading: boolean;
}

export const initialAuthState: AuthState = {
  signIn: {
    email: "",
    password: "",
  },
  signUp: {
    email: "",
    password: "",
    confirmPassword: "",
    role: "buyer",
    fullName: "",
    phone: ""
  },
  resetEmail: "",
  resetStatus: null,
  signInRole: null,
  showForgotPassword: false,
  showSignInButton: false,
  lastSignedUpEmail: "",
  authLoading: false,
};
