
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import OrderDetail from "./pages/OrderDetail";
import NewOrder from "./pages/NewOrder";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageDepartments from "./pages/admin/ManageDepartments";
import SystemSettings from "./pages/admin/SystemSettings";
import Reports from "./pages/admin/Reports";
import GoogleSheetSettings from "./pages/admin/GoogleSheetSettings";
import { useOrders, OrderProvider } from "./contexts/OrderContext";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "sonner";
import "./App.css";

// Private route component
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useOrders();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// Admin route component
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, currentUser } = useOrders();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (currentUser?.role !== "Admin") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Root route redirect to dashboard if authenticated, login if not
const RootRedirect = () => {
  const { isAuthenticated } = useOrders();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="app-theme">
      <OrderProvider>
        <Router>
          <Routes>
            {/* Make root path redirect to login or dashboard based on auth status */}
            <Route path="/" element={<RootRedirect />} />
            
            <Route path="/login" element={<Login />} />
            
            {/* Make dashboard the main entry point after login */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Layout />
                </PrivateRoute>
              }
            >
              <Route index element={<Dashboard />} />
            </Route>
            
            <Route
              path="/orders/:id"
              element={
                <PrivateRoute>
                  <Layout />
                </PrivateRoute>
              }
            >
              <Route index element={<OrderDetail />} />
            </Route>
            
            <Route
              path="/new-order"
              element={
                <PrivateRoute>
                  <Layout />
                </PrivateRoute>
              }
            >
              <Route index element={<NewOrder />} />
            </Route>
            
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Layout />
                </PrivateRoute>
              }
            >
              <Route index element={<Profile />} />
            </Route>
            
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <Layout />
                </AdminRoute>
              }
            >
              <Route index element={<Admin />} />
            </Route>
            
            <Route
              path="/admin/users"
              element={
                <AdminRoute>
                  <Layout />
                </AdminRoute>
              }
            >
              <Route index element={<ManageUsers />} />
            </Route>
            
            <Route
              path="/admin/departments"
              element={
                <AdminRoute>
                  <Layout />
                </AdminRoute>
              }
            >
              <Route index element={<ManageDepartments />} />
            </Route>
            
            <Route
              path="/admin/settings"
              element={
                <AdminRoute>
                  <Layout />
                </AdminRoute>
              }
            >
              <Route index element={<SystemSettings />} />
            </Route>
            
            <Route
              path="/admin/reports"
              element={
                <AdminRoute>
                  <Layout />
                </AdminRoute>
              }
            >
              <Route index element={<Reports />} />
            </Route>
            
            <Route
              path="/admin/google-sheet"
              element={
                <AdminRoute>
                  <Layout />
                </AdminRoute>
              }
            >
              <Route index element={<GoogleSheetSettings />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
        <Toaster position="top-center" richColors closeButton />
      </OrderProvider>
    </ThemeProvider>
  );
}

export default App;
