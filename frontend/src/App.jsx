//src/App.js
import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import AdminLayout from './admin/AdminLayout';

// Pages
import HomePage from "./pages/Home";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";
import DashboardLayout from "./pages/DashboardLayout";
import AdminDashboard from "./admin/AdminDashboard";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Footer from "./components/Footer";
import FeedbackForm from "./components/FeedbackForm";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AdminLogin from "./admin/AdminLogin";
// Admin Sections
import Users from './admin/sections/Users';
import Uploads from './admin/sections/Uploads';
import Insights from './admin/sections/Insights';

// Optional Pages
import VerifyEmail from "./pages/VerifyEmail";
import TwoFactorSetup from "./pages/TwoFactorSetup";
import TwoFactorPrompt from "./pages/TwoFactorPrompt";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ResendVerification from "./pages/ResendVerification";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/privacy";


// Route protection
const ProtectedRoute = ({ element: Component }) => {
  const token = localStorage.getItem("token");
  return token ? Component : <Navigate to="/login" />;
};

const ProtectedAdminRoute = ({ element: Component }) => {
  const adminToken = localStorage.getItem("adminToken");
  return adminToken ? Component : <Navigate to="/admin/login" />;
};

function App() {
  const location = useLocation();
  return (
    <div className="min-h-screen flex flex-col">
      <Routes>
        {/* 🌐 Public Pages */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        {/*Terms*/}
        <Route path="/terms" element={<TermsPage />} />
        {/*Privacy*/}
        <Route path="/privacy" element={<PrivacyPage />} />
        {/* 🔐 Auth Pages */}
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route path="/2fa/setup" element={<ProtectedRoute element={<TwoFactorSetup />} />} />
        <Route path="/2fa" element={<TwoFactorPrompt />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/resend-verification" element={<ResendVerification />} />

        {/* 📊 User Dashboard */}
        <Route path="/dashboard" element={<ProtectedRoute element={<DashboardLayout />} />} />
        {/* 👑 Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/*"
          element={
            <ProtectedAdminRoute element={<AdminLayout />} />
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="uploads" element={<Uploads />} />
          <Route path="insights" element={<Insights />} />
          <Route path="settings" element={<Settings />} />
          <Route path="support" element={<FeedbackForm />} />
          {/* Add more admin routes as needed */}
        </Route>

        {/* 👤 User Settings */}
        <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
        <Route path="/settings" element={<ProtectedRoute element={<Settings />} />} />

        {/* 📬 Support */}
        <Route path="/support" element={<FeedbackForm />} />
      
        {/* 🚫 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      {location.pathname === "/" && <Footer />}
    </div>
  );
}

export default App;
