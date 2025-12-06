import { useEffect, useState } from "react";
import { useAuth } from "@/features/AUTH/context/AuthContext";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import {
  Loader2,
  Moon,
  School,
  Sun,
  BookOpen,
  GraduationCap,
  Users,
  BarChart3,
  ArrowRight
} from "lucide-react";
import OTPVerification from "@/features/AUTH/components/OTPVerification";
import {
  login,
  verifyOTP,
  resendOTP,
} from "@/features/AUTH/services/loginService";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useTheme } from "@/shared/context/ThemeContext";

// --- Components for the Decorative Side (Bento Grid) ---
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

const Login = () => {
  const {
    mobile,
    setMobile,
    password,
    setPassword,
    isLoading,
    setIsLoading,
    error,
    showOTP,
    setShowOTP,
    currentMobile,
    setCurrentMobile,
    setUser,
    setIsAuthenticated,
    projectTitle,
    setProjectTitle,
  } = useAuth();

  const navigate = useNavigate();
  const [devOtp, setDevOtp] = useState("");
  const [blockMessage, setBlockMessage] = useState<string | null>(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const { theme, toggleTheme } = useTheme();



  useEffect(() => {
    const redirectMessage = sessionStorage.getItem("authRedirectMessage");
    if (redirectMessage) {
      toast.error("Authorization Error");
      sessionStorage.removeItem("authRedirectMessage");
    }
    return () => {
      setMobile("");
      setPassword("");
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (mobile.length !== 10 || !/^\d{10}$/.test(mobile)) {
      toast.error("Please enter a valid 10-digit mobile number");
      setIsLoading(false);
      return;
    }

    if (!password || password.trim().length === 0) {
      toast.error("Please enter your password");
      setIsLoading(false);
      return;
    }

    try {
      const result = await login({ mobile_no: mobile, password });

      if (result.success) {
        setCurrentMobile(mobile);
        setShowOTP(true);
        setBlockMessage(null);
        setIsBlocked(false);
        if (process.env.NODE_ENV !== "production" && result?.otp) {
          setDevOtp(result.otp.toString());
        }
        toast.success("OTP Sent");
      } else {
        toast.error("Invalid mobile number or password");
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
        toast.error("Login failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (otp: number): Promise<boolean> => {
    if (!currentMobile) return false;
    try {
      const res = await verifyOTP({ otp, mobile_no: currentMobile });
      if (res?.success && res?.token) {
        localStorage.setItem("token", res.token);
        localStorage.setItem(
          "auth",
          JSON.stringify({ isAuthenticated: true, user: res.data })
        );
        setIsAuthenticated(true);
        setUser(res.data);
        toast.success("Welcome Back!");
        navigate("/");
        setShowOTP(false);
        return true;
      } else {
        toast.error(res?.message || "Invalid OTP");
        return false;
      }
    } catch (err: any) {
      toast.error(err?.message || "OTP verification failed");
      return false;
    }
  };

  const handleBackToLogin = () => {
    setShowOTP(false);
    setMobile("");
    setPassword("");
  };

  const handleResendOTP = async (currentMobile: string) => {
    try {
      await resendOTP(currentMobile);
      toast.success("OTP Resent Successfully");
    } catch (err: any) {
      toast.error(err.message || "Resend Failed");
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gray-50 dark:bg-[#0f1117] transition-colors duration-500 flex items-center justify-center p-4">
      {/* --- Animated Background Shapes --- */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -left-[10%] w-[700px] h-[700px] rounded-full bg-violet-500/10 blur-[100px] dark:bg-violet-900/20"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            x: [0, 50, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] -right-[10%] w-[500px] h-[500px] rounded-full bg-blue-400/10 blur-[80px] dark:bg-blue-800/10"
        />
      </div>

      {/* --- Theme Toggle --- */}
      <div className="absolute top-6 right-6 z-50">
        <Button
          onClick={toggleTheme}
          variant="ghost"
          size="icon"
          className="rounded-full bg-white/50 dark:bg-black/20 backdrop-blur-md border border-gray-200/50 dark:border-white/10 hover:bg-white/80 dark:hover:bg-white/10 transition-all shadow-sm"
        >
          <motion.div
            key={theme}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
          >
            {theme === "dark" ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-slate-600" />}
          </motion.div>
        </Button>
      </div>

      {/* --- Main Bento Container --- */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-5xl h-auto min-h-[600px] bg-white dark:bg-[#1a1d2d] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-white/20 dark:border-white/5"
      >
        
        {/* --- LEFT SIDE: Visual/Brand (Hidden on Mobile) --- */}
        <div className="hidden md:flex md:w-[45%] relative bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-700 p-10 flex-col justify-between overflow-hidden">
            {/* Texture Overlay */}
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
            
            <div className="relative z-10">
                <motion.div 
                    initial={{x: -20, opacity: 0}}
                    animate={{x: 0, opacity: 1}}
                    transition={{delay: 0.2}}
                    className="flex items-center gap-3 text-white mb-8"
                >
                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                        <School className="w-6 h-6" />
                    </div>
                    <span className="font-semibold tracking-wide uppercase text-sm opacity-90">Education Portal</span>
                </motion.div>

                <motion.h1 
                    initial={{y: 20, opacity: 0}}
                    animate={{y: 0, opacity: 1}}
                    transition={{delay: 0.3}}
                    className="text-4xl font-bold text-white leading-tight mb-4"
                >
                    Manage Learning <br/>
                    <span className="text-blue-200">With Confidence.</span>
                </motion.h1>
                <p className="text-indigo-100 text-sm max-w-xs leading-relaxed opacity-90">
                    Secure access to the complete learning management ecosystem. Monitor progress, manage content, and empower students.
                </p>
            </div>

            {/* Floating Bento Grid Visuals */}
            <div className="relative z-10 grid grid-cols-2 gap-4 mt-8">
                <StatCard icon={Users} label="Active Users" value="12.5k" delay={0.4} />
                <StatCard icon={BookOpen} label="Courses" value="142" delay={0.5} />
                <div className="col-span-2">
                     <StatCard icon={BarChart3} label="Engagement Rate" value="94.2%" delay={0.6} />
                </div>
            </div>

            {/* Decoration Circles */}
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 -left-24 w-48 h-48 bg-fuchsia-500/20 rounded-full blur-3xl"></div>
        </div>

        {/* --- RIGHT SIDE: Form Section --- */}
        <div className="w-full md:w-[55%] p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white/50 dark:bg-[#1a1d2d] backdrop-blur-sm relative">
          
          <div className="max-w-md w-full mx-auto">
            {/* Mobile Header (Only visible on small screens) */}
            <div className="md:hidden flex items-center gap-2 mb-8 justify-center">
                 <div className="p-2 bg-violet-600 rounded-lg text-white">
                    <School className="w-6 h-6" />
                 </div>
                 <h2 className="text-xl font-bold text-gray-900 dark:text-white">{projectTitle}</h2>
            </div>

            <AnimatePresence mode="wait">
              {showOTP && currentMobile ? (
                // --- OTP FORM ---
                <motion.div
                    key="otp-form"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -50, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <OTPVerification
                        title="Two-Factor Authentication"
                        description={`We sent a code to ${currentMobile}`}
                        mobile={currentMobile}
                        onVerifyOTP={handleVerifyOTP}
                        onBack={handleBackToLogin}
                        onResendOTP={handleResendOTP}
                        autoFillOTP={devOtp}
                    />
                </motion.div>
              ) : (
                // --- LOGIN FORM ---
                <motion.div
                    key="login-form"
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 50, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="mb-10">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome Back</h2>
                        <p className="text-gray-500 dark:text-gray-400">Please enter your details to sign in.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="mobile" className="text-gray-700 dark:text-gray-300 font-medium">Mobile Number</Label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-violet-600 transition-colors">
                                        <Users className="h-5 w-5" />
                                    </div>
                                    <Input
                                        id="mobile"
                                        type="tel"
                                        placeholder="Enter 10-digit number"
                                        value={mobile}
                                        onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                                        maxLength={10}
                                        className="pl-10 h-12 bg-gray-50 dark:bg-[#121420] border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all rounded-xl"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label htmlFor="password" className="text-gray-700 dark:text-gray-300 font-medium">Password</Label>
                                    <Link
                                        to="/forgot-password"
                                        className="text-sm font-medium text-violet-600 hover:text-violet-500 dark:text-violet-400 transition-colors"
                                    >
                                        Forgot Password?
                                    </Link>
                                </div>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-violet-600 transition-colors">
                                        <GraduationCap className="h-5 w-5" />
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-10 h-12 bg-gray-50 dark:bg-[#121420] border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all rounded-xl"
                                    />
                                </div>
                            </div>
                        </div>

                        {error && (
                            <motion.div 
                                initial={{opacity: 0, y: -10}}
                                animate={{opacity: 1, y: 0}}
                                className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 text-sm"
                            >
                                {error}
                            </motion.div>
                        )}

                        {blockMessage && (
                           <motion.div 
                                initial={{opacity: 0, y: -10}}
                                animate={{opacity: 1, y: 0}}
                                className="p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 text-orange-600 dark:text-orange-300 text-sm"
                            >
                                {blockMessage}
                            </motion.div>
                        )}

                        <Button
                            type="submit"
                            className="w-full h-12 text-base font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 rounded-xl shadow-lg shadow-violet-500/30 hover:shadow-violet-500/40 transition-all duration-300"
                            disabled={isLoading || isBlocked}
                        >
                            {isLoading ? (
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            ) : isBlocked ? (
                                "Account Blocked"
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    Sign In <ArrowRight size={18} />
                                </span>
                            )}
                        </Button>
                    </form>
                    
                    <div className="mt-8 text-center">
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                            By signing in, you agree to the <span className="underline cursor-pointer hover:text-gray-600 dark:hover:text-gray-300">Terms of Service</span> and <span className="underline cursor-pointer hover:text-gray-600 dark:hover:text-gray-300">Privacy Policy</span>.
                        </p>
                    </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;