import { useEffect, useState } from "react";
import { Button } from "@/shared/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/shared/components/ui/input-otp";
import { Loader2, ArrowLeft, RefreshCw, KeyRound } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const OTPVerification = ({
  title,
  description,
  mobile,
  onVerifyOTP,
  onBack,
  onResendOTP,
  autoFillOTP,
}: any) => {
  const [otp, setOtp] = useState("");
  const { isLoading, setIsLoading, error } = useAuth();
  const [timer, setTimer] = useState(60);

  // Animation for Dev OTP
  const animateOtpFill = async (otpStr: string) => {
    for (let i = 1; i <= otpStr.length; i++) {
      setOtp(otpStr.slice(0, i));
      await new Promise((res) => setTimeout(res, 100));
    }
  };

  useEffect(() => {
    if (autoFillOTP && autoFillOTP.length === 6) {
      animateOtpFill(autoFillOTP).then(() => {
         // Optional: Auto submit after fill
         // handleVerifyOTP(autoFillOTP);
      });
    }
  }, [autoFillOTP]);

  useEffect(() => {
    if (timer === 0) return;
    const countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(countdown);
  }, [timer]);

  const handleVerifyOTP = async (inputOtp?: string) => {
    const finalOtp = inputOtp || otp;

    if (finalOtp.length !== 6 || !/^\d{6}$/.test(finalOtp)) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setIsLoading(true);
    try {
      await onVerifyOTP(Number(finalOtp), mobile);
    } catch (err: any) {
      toast.error(err.message || "Verification failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = () => {
    if (onResendOTP) onResendOTP(mobile);
    setOtp("");
    setTimer(60);
  };

  return (
    <div className="w-full">
        <div className="mb-8 text-center">
            <div className="mx-auto w-12 h-12 bg-violet-100 dark:bg-violet-900/30 rounded-xl flex items-center justify-center mb-4 text-violet-600 dark:text-violet-400">
                <KeyRound size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{title}</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
                {description} <br/> 
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                    +91 {mobile?.slice(0, 2)}******{mobile?.slice(-2)}
                </span>
            </p>
        </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleVerifyOTP();
        }}
        className="space-y-6"
      >
        <div className="flex justify-center">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={(value) => setOtp(value)}
          >
            <InputOTPGroup className="gap-2">
              {[...Array(6)].map((_, i) => (
                <InputOTPSlot
                  key={i}
                  index={i}
                  className="h-12 w-10 sm:h-14 sm:w-12 text-lg border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#121420] rounded-lg focus:border-violet-500 focus:ring-4 focus:ring-violet-500/20 transition-all"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>

        {error && (
            <div className="p-3 text-center rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 text-sm">
                {error}
            </div>
        )}

        <Button
          type="submit"
          className="w-full h-12 text-base font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 rounded-xl shadow-lg shadow-violet-500/30 transition-all"
          disabled={isLoading || otp.length !== 6}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Verifying...
            </>
          ) : (
            "Verify & Proceed"
          )}
        </Button>

        <div className="flex justify-between items-center text-sm pt-2">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white flex items-center transition-colors"
            >
              <ArrowLeft className="mr-1 h-4 w-4" /> Change Mobile
            </button>
          )}

          {timer > 0 ? (
            <span className="text-gray-400 dark:text-gray-500 font-mono">
              Resend in {timer}s
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="text-violet-600 hover:text-violet-700 dark:text-violet-400 font-medium flex items-center transition-colors"
            >
              <RefreshCw className="mr-1 h-3 w-3" /> Resend Code
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default OTPVerification;