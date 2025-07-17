// import React from "react";
// import { Routes, Route, Navigate } from "react-router-dom";

// // Pages
// import HomePage from "./pages/Home";
// import AuthPage from "./pages/AuthPage";
// import NotFound from "./pages/NotFound";
// import DashboardLayout from "./pages/DashboardLayout";
// import AdminDashboard from "./admin/AdminDashboard";
// import Profile from "./pages/Profile";
// import Settings from "./pages/Settings";
// import Footer from "./components/Footer";
// import FeedbackForm from "./components/FeedbackForm";
// import VerifyEmail from "./pages/VerifyEmail";
// import TwoFA from "./pages/TwoFA";
// import ForgotPassword from "./pages/ForgotPassword";
// import ResetPassword from "./pages/ResetPassword";
// import TwoFactorAuth from "./pages/TwoFactorAuth"

// // Helper to protect routes
// const ProtectedRoute = ({ element: Component }) => {
//   const token = localStorage.getItem("token");
//   return token ? Component : <Navigate to="/login" />;
// };

// function App() {
//   return (
//     <div className="min-h-screen flex flex-col">
//       <Routes>
//         {/* 🌐 Home */}
//         <Route path="/" element={<HomePage />} />

//         {/* 🔐 Auth */}
//         <Route path="/login" element={<AuthPage />} />
//         {/* <Route path="/verify-email/:token" element={<VerifyEmail />} /> */}
//         <Route path="/2fa" element={<TwoFA />} />
//         <Route path="/forgot-password" element={<ForgotPassword />} />
//         <Route path="/reset-password/:token" element={<ResetPassword />} />
//         <Route path="/2fa" element={<TwoFactorAuth />} />

//         {/* 📊 Dashboard & Admin (Protected) */}
//         <Route path="/dashboard" element={<ProtectedRoute element={<DashboardLayout />} />} />
//         <Route path="/admin" element={<ProtectedRoute element={<AdminDashboard />} />} />

//         {/* 👤 User Settings */}
//         <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
//         <Route path="/settings" element={<ProtectedRoute element={<Settings />} />} />

//         {/* 📬 Support */}
//         <Route path="/support" element={<FeedbackForm />} />

//         {/* 🚫 404 */}
//         <Route path="*" element={<NotFound />} />
//       </Routes>

//       {/* 🧾 Footer on every page */}
//       <Footer />
//     </div>
//   );
// }

// export default App;


  import React from "react";
  import { Routes, Route } from "react-router-dom";

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
  // import VerifyEmail from "./pages/VerifyEmail";
  import TwoFA from "./pages/TwoFA";
  import ForgotPassword from "./pages/ForgotPassword";
  import ResetPassword from "./pages/ResetPassword";
  import TwoFactorAuth from "./pages/TwoFactorAuth";
  import ProtectedRoute from "./components/ProtectedRoute"; // adjust path as needed

  function App() {
    return (
      <div className="min-h-screen flex flex-col">
        <Routes>
          {/* 🌐 Home */}
          <Route path="/" element={<HomePage />} />

          {/* 🔐 Auth */}
          <Route path="/login" element={<AuthPage />} />
          {/* <Route path="/verify-email/:token" element={<VerifyEmail />} /> */}
          <Route path="/2fa" element={<TwoFA />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/2fa" element={<TwoFactorAuth />} />

          {/* 📊 Dashboard & Admin (Protected) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* 👤 User Settings */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />

          {/* 📬 Support */}
          <Route path="/support" element={<FeedbackForm />} />

          {/* 🚫 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>

        {/* 🧾 Footer on every page */}
        <Footer />
      </div>
    );
  }

  export default App;
