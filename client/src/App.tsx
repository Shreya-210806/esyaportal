import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { DataProvider } from "@/contexts/DataContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

import UserLayout from "@/components/UserLayout";
import AdminLayout from "@/components/AdminLayout";

import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import AdminLoginPage from "@/pages/AdminLoginPage";

import DashboardPage from "@/pages/DashboardPage";
import BillsPage from "@/pages/BillsPage";
import PayBillPage from "@/pages/PayBillPage";
import PaymentHistoryPage from "@/pages/PaymentHistoryPage";
import ConsumptionPage from "@/pages/ConsumptionPage";
import ConsumersPage from "@/pages/ConsumersPage";
import NotificationsPage from "@/pages/NotificationsPage";
import SupportPage from "@/pages/SupportPage";
import AboutPage from "@/pages/AboutPage";
import ProfilePage from "@/pages/ProfilePage";
import NewConnectionPage from "@/pages/NewConnectionPage";

import AdminDashboard from "@/pages/AdminDashboard";

import NotFound from "@/pages/NotFound";
import ResidentialConnectionPage from "@/pages/ResidentialConnectionPage";
import ServicesPage from "@/pages/ServicesPage";
import ComplaintsPage from "@/pages/ComplaintsPage";
import OutageStatusPage from "@/pages/OutageStatusPage";
import ContactUsPage from "@/pages/ContactUsPage";
import MobileVerificationPage from "@/pages/MobileVerificationPage";
import OtpVerificationPage from "@/pages/OtpVerificationPage";
import ApplicationTrackingPage from "@/pages/ApplicationTrackingPage";
import PersonalDetailsPage from "@/pages/PersonalDetailsPage";
import DocumentUploadPage from "@/pages/DocumentUploadPage";

const queryClient = new QueryClient();


// ================= USER ROUTES =================
function UserRoutes() {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <DataProvider
      userId={user.id}
      consumerNumber={user.consumerNumber}
      connectionStatus={user?.connectionStatus || "active"}
      isFirstLogin={user?.isFirstLogin}
    >
      <UserLayout>
        <Routes>
          <Route path="/consumers" element={<ConsumersPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/new-connection" element={<NewConnectionPage />} />
          <Route path="/bills" element={<BillsPage />} />
          <Route path="/pay-bill" element={<PayBillPage />} />
          <Route path="/payment-history" element={<PaymentHistoryPage />} />
          <Route path="/consumption" element={<ConsumptionPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/profile" element={<ProfilePage />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </UserLayout>
    </DataProvider>
  );
}


import AdminConsumers from "@/pages/admin/AdminConsumers";
import AdminBills from "@/pages/admin/AdminBills";
import AdminPayments from "@/pages/admin/AdminPayments";
import AdminImport from "@/pages/admin/AdminImport";
import AdminApplications from "@/pages/admin/AdminApplications";

// ================= ADMIN ROUTES =================
function AdminRoutes() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "admin") {
    // Logged-in non-admins are redirected to user dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <AdminLayout>
      <Routes>
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/consumers" element={<AdminConsumers />} />
        <Route path="/applications" element={<AdminApplications />} />
        <Route path="/bills" element={<AdminBills />} />
        <Route path="/payments" element={<AdminPayments />} />
        <Route path="/import" element={<AdminImport />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AdminLayout>
  );
}


// ================= MAIN ROUTES =================
function AppRoutes() {
  const { user, isAuthenticated } = useAuth();

  const authenticatedRedirect =
    user?.role === "admin" ? "/admin/dashboard" : "/dashboard";

  return (
    <Routes>

      {/* Public Pages */}

      <Route
        path="/"
        element={
          isAuthenticated
            ? <Navigate to={authenticatedRedirect} replace />
            : <LandingPage />
        }
      />

      <Route path="/services" element={<ServicesPage />} />
      <Route path="/complaints" element={<ComplaintsPage />} />
      <Route path="/outage-status" element={<OutageStatusPage />} />
      <Route path="/contact-us" element={<ContactUsPage />} />
      <Route path="/mobile-verification" element={<MobileVerificationPage />} />
      <Route path="/otp-verification" element={<OtpVerificationPage />} />
      <Route path="/application-tracking" element={<ApplicationTrackingPage />} />
      <Route path="/new-connection/personal" element={<PersonalDetailsPage />} />
      <Route path="/new-connection/documents" element={<DocumentUploadPage />} />

      {/* Auth Pages */}

      <Route
        path="/login"
        element={
          isAuthenticated
            ? <Navigate to={authenticatedRedirect} replace />
            : <LoginPage />
        }
      />

      <Route path="/register" element={<RegisterPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />

      <Route path="/new-connection/residential" element={<ResidentialConnectionPage />} />

      <Route path="/forgot-password" element={<Navigate to="/login" replace />} />

      {/* Admin Routes */}

      <Route path="/admin/*" element={<AdminRoutes />} />

      {/* User Routes */}

      <Route path="/*" element={<UserRoutes />} />

    </Routes>
  );
}


// ================= APP ROOT =================
const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>

          <Toaster />
          <Sonner />

          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>

        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;