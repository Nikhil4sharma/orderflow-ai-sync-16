
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
import { Toaster } from "./components/ui/toaster";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "./components/theme-provider";
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

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="app-theme">
      <OrderProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Layout />
                </PrivateRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="orders/:id" element={<OrderDetail />} />
              <Route path="new-order" element={<NewOrder />} />
              <Route path="profile" element={<Profile />} />
              <Route path="admin" element={
                <AdminRoute>
                  <Admin />
                </AdminRoute>
              } />
              <Route path="admin/users" element={
                <AdminRoute>
                  <ManageUsers />
                </AdminRoute>
              } />
              <Route path="admin/departments" element={
                <AdminRoute>
                  <ManageDepartments />
                </AdminRoute>
              } />
              <Route path="admin/settings" element={
                <AdminRoute>
                  <SystemSettings />
                </AdminRoute>
              } />
              <Route path="admin/reports" element={
                <AdminRoute>
                  <Reports />
                </AdminRoute>
              } />
              <Route path="admin/google-sheet" element={
                <AdminRoute>
                  <GoogleSheetSettings />
                </AdminRoute>
              } />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </Router>
      </OrderProvider>
    </ThemeProvider>
  );
}

export default App;
