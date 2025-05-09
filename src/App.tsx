import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import NewOrder from "./pages/NewOrder";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import AdminManagement from "./pages/AdminManagement";
import UserProfile from "./pages/UserProfile";
import Orders from "./pages/Orders";
import DesignTasks from "./pages/DesignTasks";
import { useOrders, OrderProvider } from "./contexts/OrderContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "sonner";
import "./App.css";
import OrderDetail from "./pages/OrderDetail";
import Reports from "./pages/admin/Reports";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageDepartments from "./pages/admin/ManageDepartments";
import DashboardSettings from "./pages/admin/DashboardSettings";
import SystemSettings from "./pages/admin/SystemSettings";
import GoogleSheetSettings from "./pages/admin/GoogleSheetSettings";
import DesignDashboard from "./pages/DesignDashboard";
import PrepressDashboard from "./pages/PrepressDashboard";
import SalesDashboard from "./pages/SalesDashboard";
import ProductionDashboard from "./pages/ProductionDashboard";

// RoleBasedRedirector sirf / route pe
function RoleBasedRedirector() {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!currentUser) {
      navigate('/login', { replace: true });
      return;
    }
    switch (currentUser.role) {
      case 'Designer':
        navigate('/design-dashboard', { replace: true });
        break;
      case 'Prepress':
        navigate('/prepress-dashboard', { replace: true });
        break;
      case 'Sales':
        navigate('/sales-dashboard', { replace: true });
        break;
      case 'Production':
        navigate('/production-dashboard', { replace: true });
        break;
      default:
        navigate('/dashboard', { replace: true });
    }
  }, [currentUser, loading, navigate]);

  return <div>Redirecting...</div>;
}

// Protected Route component
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return currentUser ? <>{children}</> : <Navigate to="/login" />;
};

// Public Route component (for login page)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return !currentUser ? <>{children}</> : <Navigate to="/" />;
};

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="app-theme">
      <AuthProvider>
        <NotificationProvider>
          <Router>
            <OrderProvider>
              <Routes>
                {/* Public Route */}
                <Route path="/login" element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                } />

                {/* Root route: role-based redirect */}
                <Route path="/" element={<RoleBasedRedirector />} />

                {/* Protected Routes with Layout */}
                <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/orders/:id" element={<OrderDetail />} />
                  <Route path="/design-tasks" element={<DesignTasks />} />
                  <Route path="/new-order" element={<NewOrder />} />
                  <Route path="/admin" element={<AdminManagement />} />
                  <Route path="/admin/reports" element={<Reports />} />
                  <Route path="/admin/users" element={<ManageUsers />} />
                  <Route path="/admin/departments" element={<ManageDepartments />} />
                  <Route path="/profile" element={<UserProfile />} />
                  <Route path="/admin/dashboard-settings" element={<DashboardSettings />} />
                  <Route path="/admin/system-settings" element={<SystemSettings />} />
                  <Route path="/admin/google-sheet" element={<GoogleSheetSettings />} />
                  <Route path="/design-dashboard" element={<DesignDashboard />} />
                  <Route path="/prepress-dashboard" element={<PrepressDashboard />} />
                  <Route path="/sales-dashboard" element={<SalesDashboard />} />
                  <Route path="/production-dashboard" element={<ProductionDashboard />} />
                </Route>

                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </OrderProvider>
            <Toaster position="top-right" />
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
