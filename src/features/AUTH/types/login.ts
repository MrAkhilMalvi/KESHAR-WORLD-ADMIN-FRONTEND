import { Step } from "@/features/AUTH/types/forgotPassword";

export interface ILogin {
    mobile_no: string;
	password: string;
}

export interface IOtp {
    mobile_no: string;
    otp?: number;
}

export interface IResendOTP {
    mobile_no:string
}


export interface UserType {
  mobile: string;
  name: string;
  [key: string]: any; // Optional: If user has more fields like `id`, `code`
}

export interface AuthContextType {
  //login
  isAuthenticated: boolean;
  user: UserType | null;
  currentMobile: string | null;
  setIsAuthenticated: (val: boolean) => void;
  setUser: (user: UserType | null) => void;
  setCurrentMobile: (mobile: string | null) => void;
  logout: () => void;
  mobile: string;
  setMobile: (mobile: string) => void;
  password: string;
  setPassword: (password: string) => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  error: string;
  setError: (value: string) => void;
  showOTP: boolean;
  setShowOTP: (value: boolean) => void;
  currentStep: Step;
  setCurrentStep: (step:Step) => void;
  newPassword: string;
  setNewPassword: React.Dispatch<React.SetStateAction<string>>;
  confirmPassword: string;
  setConfirmPassword: React.Dispatch<React.SetStateAction<string>>;
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
  showConfirmPassword: boolean;
  setShowConfirmPassword: React.Dispatch<React.SetStateAction<boolean>>;
  projectTitle:string;
  setProjectTitle: (title: string) => void;

}
