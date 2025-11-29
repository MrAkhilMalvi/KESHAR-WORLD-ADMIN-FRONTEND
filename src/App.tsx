import {  useLocation, useNavigate } from "react-router-dom";
import { TooltipProvider } from "@/shared/components/ui/tooltip";
import { AuthProvider } from "./features/AUTH/context/AuthContext";
import AppRoutes from "./AppRoutes";
import { AppToaster } from "./shared/components/ui/AppToaster";
import { useEffect } from "react";
import { setRedirectToLogin } from "./shared/services/redirectService";

const App = () => {
  return (
    <TooltipProvider>
      <AppToaster />
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </TooltipProvider>
  );
};

const AppContent = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setRedirectToLogin(() => {
      localStorage.clear();
      navigate("/login");
    });
  }, [navigate, location]);

  return <AppRoutes />;
};

export default App;
