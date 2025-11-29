import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "./pages/Layout";
import Login from "./features/AUTH/components/Login";
import ForgotPassword from "./features/AUTH/components/ForgotPassword";
import Dashboard from "./features/DASHBOARD/components/Dashboard";

import { RedirectIfAuth, RequireAuth } from "./providers/authGuard";

// --- COURSE COMPONENTS ---
// Assuming you placed the files from the previous answer in these paths:
import CourseList from "@/features/COURSES/pages/CourseListPage";
import CourseManager from "@/features/COURSES/pages/CourseManager";
import ProductList from "./features/PRODUCTS/components/ProductList";
import ProductManager from "./features/PRODUCTS/components/ProductManager";

function AppRoutes() {
  return (
    <>
      <Routes>
        {/* 1. Public / Auth Routes */}
        <Route element={<RedirectIfAuth />}>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>

        {/* 2. Protected Admin Routes */}
        <Route element={<RequireAuth />}>
          <Route element={<Layout />}>
            {/* Dashboard */}
            <Route path="/" element={<Dashboard />} />

            {/* --- COURSES MANAGEMENT --- */}

            {/* View All Courses */}
            <Route path="/courses" element={<CourseList />} />

            {/* Create New Course (CourseManager handles creation if no ID is present) */}
            <Route path="/courses/new" element={<CourseManager />} />

            {/* Edit Course (CourseManager handles Edit + Modules + Videos via Tabs) */}
            <Route path="/courses/edit/:id" element={<CourseManager />} />

            <Route path="/products" element={<ProductList />} />

            {/* Create New Product */}
            <Route path="/products/create" element={<ProductManager />} />

            {/* Edit Existing Product (Dynamic ID) */}
            <Route path="/products/edit/:id" element={<ProductManager />} />
          </Route>
        </Route>

        {/* 3. Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default AppRoutes;
