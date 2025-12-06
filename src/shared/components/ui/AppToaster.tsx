import { Toaster, toast, Toast, resolveValue } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Loader2, 
  X, 
  Info 
} from "lucide-react";

// 1. Configuration for Toast Types (Colors & Icons)
const toastTypes = {
  success: {
    icon: CheckCircle2,
    color: "text-emerald-500",
    bg: "bg-emerald-500",
    border: "border-emerald-200 dark:border-emerald-900",
  },
  error: {
    icon: XCircle,
    color: "text-red-500",
    bg: "bg-red-500",
    border: "border-red-200 dark:border-red-900",
  },
  loading: {
    icon: Loader2,
    color: "text-blue-500",
    bg: "bg-blue-500",
    border: "border-blue-200 dark:border-blue-900",
  },
  blank: {
    icon: Info,
    color: "text-gray-500",
    bg: "bg-gray-500",
    border: "border-gray-200 dark:border-gray-800",
  },
  custom: {
     icon: Info,
     color: "text-violet-500",
     bg: "bg-violet-500",
     border: "border-violet-200 dark:border-violet-900"
  }
};

// 2. The Individual Toast Card Component
const ToastCard = ({ t }: { t: Toast }) => {
  const type = t.type === "success" || t.type === "error" || t.type === "loading" ? t.type : "blank";
  const config = toastTypes[type];
  const Icon = config.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={`
        group relative w-full max-w-sm pointer-events-auto 
        flex overflow-hidden rounded-xl 
        bg-white/90 dark:bg-[#1a1d26]/90 backdrop-blur-md 
        shadow-lg ring-1 ring-black/5 dark:ring-white/10
        ${t.visible ? "animate-enter" : "animate-leave"}
      `}
      style={{
         // Ensure it sits above other elements
         zIndex: 9999
      }}
    >
      {/* Colored Side Accent (Left Border) */}
      <div className={`w-1.5 ${config.bg}`} />

      <div className="flex-1 p-4 flex items-start gap-3.5">
        {/* Animated Icon */}
        <div className={`mt-0.5 shrink-0 ${config.color}`}>
          <Icon 
            size={20} 
            className={type === "loading" ? "animate-spin" : ""} 
          />
        </div>

        {/* Content */}
        <div className="flex-1 grid gap-1">
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {resolveValue(t.message, t)}
          </p>
          {/* You could add a timestamp or subtitle here if needed */}
        </div>

        {/* Close Button (Visible on Hover) */}
        <button
          onClick={() => toast.dismiss(t.id)}
          className="shrink-0 rounded-lg p-1 text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors opacity-0 group-hover:opacity-100"
        >
          <X size={16} />
        </button>
      </div>

      {/* 3. The "Line Animation" Progress Bar */}
      {t.type !== "loading" && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100 dark:bg-gray-800">
          <motion.div
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ 
              duration: t.duration ? t.duration / 1000 : 2, // Convert ms to seconds
              ease: "linear" 
            }}
            className={`h-full ${config.bg} opacity-30`}
          />
        </div>
      )}
    </motion.div>
  );
};

// 4. Main Export
export const AppToaster = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000, // Default duration
      }}
      containerStyle={{
        top: 24,
        right: 24,
        bottom: 24,
        left: 24,
      }}
    >
      {(t) => (
        <AnimatePresence>
           {t.visible && <ToastCard t={t} />}
        </AnimatePresence>
      )}
    </Toaster>
  );
};