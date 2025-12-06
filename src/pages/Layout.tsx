import { useState } from "react";
import { useAuth } from "@/features/AUTH/context/AuthContext";
import { Button } from "@/shared/components/ui/button";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  BookOpen,
  Package,
} from "lucide-react";
import { useTheme } from "@/shared/context/ThemeContext";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const Layout = () => {
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      logout();
      navigate("/login");
    } catch (error) {
      localStorage.clear();
      window.location.href = "/";
      toast.error("Session ended.");
    }
  };

  // Navigation (Audit removed)
  const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Courses", href: "/courses", icon: BookOpen },
    { name: "Products", href: "/products", icon: Package }, 
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50 dark:bg-[#0B0D12] transition-colors duration-500">

      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 w-full border-b border-gray-200/50 dark:border-gray-800/50 bg-white/70 dark:bg-[#0B0D12]/70 backdrop-blur-xl"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">

            {/* Logo */}
            <Link to="/" className="group flex items-center gap-3 select-none">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-primary-dark text-white shadow-lg shadow-primary/20 transition-transform group-hover:scale-105 group-active:scale-95">
                <span className="font-bold text-lg">KW</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="font-bold leading-none tracking-tight text-gray-900 dark:text-white text-lg">
                  KESHAR WORLD
                </h1>
                <span className="text-[10px] font-semibold tracking-[0.2em] text-primary uppercase">
                  Admin Console
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 p-1 bg-gray-100/50 dark:bg-gray-800/50 rounded-full border border-gray-200/50 dark:border-gray-700/50 shadow-inner">
              {navigation.map((item) => {
                const isActive = item.href === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "relative px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 z-10 flex items-center gap-2",
                      isActive
                        ? "text-primary-foreground"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 bg-white dark:bg-gray-700 rounded-full shadow-sm"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        style={{ zIndex: -1 }}
                      />
                    )}
                    <item.icon size={16} className={isActive ? "text-primary" : "text-current"} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Actions */}
            <div className="hidden md:flex items-center gap-3">
              <Button size="icon" variant="ghost" onClick={toggleTheme} className="rounded-full">
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </Button>
              <Button size="icon" variant="destructive" onClick={handleLogout} className="rounded-full h-8 w-8">
                <LogOut size={16} />
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t bg-white dark:bg-gray-900"
            >
              <div className="flex flex-col p-4 space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="flex gap-3 p-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon size={18} /> {item.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Layout;
