import { useEffect, useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Loader2,
  School,
  CheckCircle,
  ShieldCheck,
  Smartphone,
  LockKeyhole,
  HelpCircle,
  ArrowRight,
} from "lucide-react";
import OTPVerification from "@/features/AUTH/components/OTPVerification";
import PasswordReset from "@/features/AUTH/components/PasswordReset";
import { motion, AnimatePresence } from "framer-motion";
import {
  forgotPassword,
  verifyOTP as verifyForgotPasswordOTP,
  setPassword as resetPassword,
  resendOTP as resendForgotPasswordOTP,
} from "@/features/AUTH/services/forgotPassService";
import { useAuth } from "@/features/AUTH/context/AuthContext";
import toast from "react-hot-toast";

// --- Decorative Components (Matching Login) ---
const StatCard = ({ icon: Icon, label, value, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex flex-col justify-between text-white shadow-lg"
  >
    <div className="bg-white/20 w-8 h-8 rounded-lg flex items-center justify-center mb-3">
      <Icon size={16} className="text-white" />
    </div>
    <div>
      <p className="text-xs text-blue-100 font-medium">{label}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  </motion.div>
);

const ForgotPassword = () => {
  const {
    mobile,
    setMobile,
    isLoading,
    setIsLoading,
    error,
    currentStep,
    setCurrentStep,
  } = useAuth();

  const [blockMessage, setBlockMessage] = useState<string | null>(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const [devOtp, setDevOtp] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentStep("mobile");
    setIsLoading(false);
    return () => {
      setMobile("");
    };
  }, [setMobile, setCurrentStep, setIsLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (mobile.length !== 10 || !/^\d{10}$/.test(mobile)) {
      toast.error("Please enter a valid 10-digit mobile number");
      setIsLoading(false);
      return;
    }

    try {
      const data = await forgotPassword({ mobile_no: mobile });
      if (data.success) {
        setCurrentStep("otp");
        if (process.env.NODE_ENV !== "production" && data?.otp) {
          setDevOtp(data.otp.toString());
        }
        toast.success("OTP Sent");
      } else {
        toast.error("Invalid mobile no");
      }
    } catch (err: any) {
      if (err?.blockTime) {
        const formatted = new Intl.DateTimeFormat("en-IN", {
          dateStyle: "medium",
          timeStyle: "medium",
        }).format(new Date(err?.blockTime));

        setBlockMessage(`Blocked until ${formatted}`);
        setIsBlocked(true);
      } else {
        toast.error("Request failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (
    otp: string,
    currentMobile: string
  ): Promise<boolean> => {
    try {
      const response = await verifyForgotPasswordOTP({
        mobile_no: currentMobile,
        otp: Number(otp),
      });

      if (response.success) {
        setCurrentStep("password");
        toast.success("Identity Verified");
        return true;
      } else {
        toast.error(response?.message || "Invalid OTP");
        return false;
      }
    } catch (err: any) {
      if (err?.blockTime) {
        let formatted = "";

        if (err?.blockTime) {
          formatted = new Intl.DateTimeFormat("en-IN", {
            dateStyle: "medium",
            timeStyle: "medium",
          }).format(new Date(err?.blockTime));
        }
        setBlockMessage(`Blocked until ${formatted}`);
        setIsBlocked(true);
        setMobile("");
        setCurrentStep("mobile");
        return;
      }
      toast.error(err?.message || "Invalid OTP. Please try again.");
    }
  };

  const handleResendOTP = async (currentMobile: string) => {
    try {
      const res = await resendForgotPasswordOTP(currentMobile);
      if (res?.success) toast.success("OTP Resent");
      else toast.error("Failed to resend OTP");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong.");
    }
  };

  const handleResetPassword = async (newPassword: string): Promise<boolean> => {
    if (!mobile) {
      toast.error("Missing mobile number");
      return false;
    }
    try {
      const res = await resetPassword({
        mobile_no: mobile,
        password: newPassword,
      });
      if (res?.success) {
        setCurrentStep("success");
        toast.success("Password Updated");
        return true;
      }
      return false;
    } catch (err: any) {
      toast.error(err.message || "Failed to reset password");
      return false;
    }
  };

  const handleBackToMobile = () => {
    setCurrentStep("mobile");
    setMobile("");
    navigate("/forgot-password");
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gray-50 dark:bg-[#0f1117] transition-colors duration-500 flex items-center justify-center p-4">
      {/* --- Animated Background Shapes --- */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, -90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -right-[10%] w-[700px] h-[700px] rounded-full bg-indigo-500/10 blur-[100px] dark:bg-indigo-900/20"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], x: [0, -50, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] -left-[10%] w-[500px] h-[500px] rounded-full bg-fuchsia-400/10 blur-[80px] dark:bg-fuchsia-800/10"
        />
      </div>

      {/* --- Main Bento Container --- */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-5xl h-auto min-h-[600px] bg-white dark:bg-[#1a1d2d] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-white/20 dark:border-white/5"
      >
        {/* --- LEFT SIDE: Visual/Brand --- */}
        <div className="hidden md:flex md:w-[45%] relative bg-gradient-to-br from-slate-800 via-indigo-900 to-slate-900 p-10 flex-col justify-between overflow-hidden">
          {/* Texture Overlay */}
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>

          <div className="relative z-10">
            <Link
              to="/login"
              className="inline-flex items-center text-indigo-200 hover:text-white transition-colors mb-8 text-sm font-medium"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Login
            </Link>
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-bold text-white leading-tight mb-4"
            >
              Account <br />
              <span className="text-indigo-400">Recovery.</span>
            </motion.h1>
            <p className="text-slate-300 text-sm max-w-xs leading-relaxed opacity-90">
              Securely reset your password using 2-factor authentication. We
              prioritize your account security.
            </p>
          </div>

          {/* Floating Bento Grid Visuals for Recovery */}
          <div className="relative z-10 grid grid-cols-2 gap-4 mt-8">
            <StatCard
              icon={ShieldCheck}
              label="Security"
              value="Encrypted"
              delay={0.4}
            />
            <StatCard
              icon={HelpCircle}
              label="Support"
              value="24/7"
              delay={0.5}
            />
          </div>

          <div className="absolute top-1/2 -right-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl"></div>
        </div>

        {/* --- RIGHT SIDE: Forms --- */}
        <div className="w-full md:w-[55%] p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white/50 dark:bg-[#1a1d2d] backdrop-blur-sm relative">
          <AnimatePresence mode="wait">
            {/* 1. SUCCESS STATE */}
            {currentStep === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center space-y-6"
              >
                <div className="mx-auto h-24 w-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Password Reset!
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400">
                    Your account has been secured with a new password.
                  </p>
                </div>
                <Link to="/login" className="block">
                  <Button className="w-full h-12 text-base font-semibold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-xl shadow-lg shadow-green-500/30">
                    Proceed to Login
                  </Button>
                </Link>
              </motion.div>
            )}

            {/* 2. PASSWORD RESET FORM */}
            {currentStep === "password" && (
              <motion.div
                key="password"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -50, opacity: 0 }}
              >
                <PasswordReset
                  onResetPassword={handleResetPassword}
                  onBack={handleBackToMobile}
                />
              </motion.div>
            )}

            {/* 3. OTP FORM */}
            {currentStep === "otp" && mobile && (
              <motion.div
                key="otp"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -50, opacity: 0 }}
              >
                <OTPVerification
                  title="Verify Identity"
                  description="Enter the code sent to your mobile"
                  mobile={mobile}
                  onVerifyOTP={handleVerifyOTP}
                  onResendOTP={() => handleResendOTP(mobile)}
                  onBack={handleBackToMobile}
                  autoFillOTP={devOtp}
                />
              </motion.div>
            )}

            {/* 4. MOBILE ENTRY FORM (DEFAULT) */}
            {currentStep === "mobile" && (
              <motion.div
                key="mobile"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 50, opacity: 0 }}
              >
                <div className="mb-10">
                  {/* Mobile Back Button */}
                  <Link
                    to="/login"
                    className="md:hidden inline-flex items-center text-gray-500 mb-6 text-sm"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Link>
                  <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/30 rounded-xl flex items-center justify-center mb-4 text-violet-600 dark:text-violet-400">
                    <LockKeyhole size={24} />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Forgot Password?
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400">
                    Enter your registered mobile number to reset it.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="mobile"
                      className="text-gray-700 dark:text-gray-300 font-medium"
                    >
                      Mobile Number
                    </Label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-violet-600 transition-colors">
                        <Smartphone className="h-5 w-5" />
                      </div>
                      <Input
                        id="mobile"
                        type="tel"
                        placeholder="Enter 10-digit number"
                        value={mobile}
                        maxLength={10}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (/^\d*$/.test(val) && val.length <= 10)
                            setMobile(val);
                        }}
                        className="pl-10 h-12 bg-gray-50 dark:bg-[#121420] border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all rounded-xl"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 text-sm">
                      {error}
                    </div>
                  )}

                  {blockMessage && (
                    <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 text-orange-600 dark:text-orange-300 text-sm">
                      {blockMessage}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-12 text-base font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 rounded-xl shadow-lg shadow-violet-500/30 transition-all duration-300"
                    disabled={isLoading || isBlocked}
                  >
                    {isLoading ? (
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : isBlocked ? (
                      "Blocked"
                    ) : (
                      <span className="flex items-center gap-2">
                        Send OTP <ArrowRight size={18} />
                      </span>
                    )}
                  </Button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
