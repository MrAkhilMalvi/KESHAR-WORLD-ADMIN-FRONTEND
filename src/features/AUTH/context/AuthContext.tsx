import { AuthContextType, UserType } from "@/features/AUTH/types/login";
import { Step } from "@/features/AUTH/types/forgotPassword"
import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const storedAuth = localStorage.getItem("auth");
  const parsedAuth = storedAuth ? JSON.parse(storedAuth) : null;
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [projectTitle, setProjectTitle] = useState("KESHAR WORLD ADMIN");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!parsedAuth?.isAuthenticated
  );
  const [user, setUser] = useState<UserType | null>(parsedAuth?.user || null);
  const [currentMobile, setCurrentMobile] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<Step>('mobile');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);



  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setCurrentMobile(null);
    localStorage.removeItem("auth");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        currentMobile,
        setIsAuthenticated,
        setUser,
        setCurrentMobile,
        logout,

        mobile,
        setMobile,
        password,
        setPassword,
        isLoading,
        setIsLoading,
        error,
        setError,
        showOTP,
        setShowOTP,
        currentStep,
        setCurrentStep,

        newPassword,
        setNewPassword,
        confirmPassword,
        setConfirmPassword,
        showPassword,
        setShowPassword,
        showConfirmPassword,
        setShowConfirmPassword,

        projectTitle,
        setProjectTitle
      }}
    >

        {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

