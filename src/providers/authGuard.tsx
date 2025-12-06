import { Navigate, Outlet } from "react-router-dom";

export function RequireAuth() {
  const auth = localStorage.getItem("auth");
  const isAuthenticated = auth ? JSON.parse(auth).isAuthenticated : false;
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

export function RedirectIfAuth() {
  const auth = localStorage.getItem("auth");
  const isAuthenticated = auth ? JSON.parse(auth).isAuthenticated : false;
  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
}
