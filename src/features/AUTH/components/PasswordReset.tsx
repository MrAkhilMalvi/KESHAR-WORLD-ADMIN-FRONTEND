import { useEffect } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Loader2, Eye, EyeOff, Lock, Check } from "lucide-react";
import { useAuth } from "@/features/AUTH/context/AuthContext";
import toast from "react-hot-toast";

interface PasswordResetProps {
  onResetPassword: (
    newPassword: string,
    currentMobile: string
  ) => Promise<boolean>;
  onBack: () => void;
}

const PasswordReset = ({ onResetPassword, onBack }: PasswordResetProps) => {
  const {
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    isLoading,
    setIsLoading,
    error,
    currentMobile,
  } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const success = await onResetPassword(newPassword, currentMobile);
      if (!success) {
        toast.error("Failed to reset password.");
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      setNewPassword("");
      setConfirmPassword("");
    };
  }, []);

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Reset Password
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Create a strong password for your account.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* New Password */}
        <div className="space-y-2">
          <Label
            htmlFor="newPassword"
            className="text-gray-700 dark:text-gray-300 font-medium"
          >
            New Password
          </Label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-violet-600 transition-colors">
              <Lock className="h-5 w-5" />
            </div>
            <Input
              id="newPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Min. 6 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="pl-10 pr-10 h-12 bg-gray-50 dark:bg-[#121420] border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all rounded-xl"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label
            htmlFor="confirmPassword"
            className="text-gray-700 dark:text-gray-300 font-medium"
          >
            Confirm Password
          </Label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-violet-600 transition-colors">
              <Lock className="h-5 w-5" />
            </div>
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pl-10 pr-10 h-12 bg-gray-50 dark:bg-[#121420] border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all rounded-xl"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {confirmPassword && confirmPassword !== newPassword && (
            <p className="text-xs text-red-500 animate-pulse">
              Passwords do not match
            </p>
          )}
          {confirmPassword && confirmPassword === newPassword && (
            <p className="text-xs text-green-600 dark:text-green-400 flex items-center">
              <Check size={12} className="mr-1" /> Passwords match
            </p>
          )}
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 text-sm">
            {error}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="w-full sm:w-1/3 h-12 rounded-xl border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="w-full sm:w-2/3 h-12 text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 rounded-xl shadow-lg shadow-violet-500/30 transition-all"
            disabled={
              isLoading ||
              !newPassword ||
              !confirmPassword ||
              newPassword !== confirmPassword
            }
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Updating...
              </>
            ) : (
              "Update Password"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PasswordReset;
