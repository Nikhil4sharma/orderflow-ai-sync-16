
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import OrderDetail from "@/pages/OrderDetail";
import NewOrder from "@/pages/NewOrder";
import Login from "@/pages/Login";
import Layout from "@/components/layout/Layout";
import Admin from "@/pages/Admin";
import Profile from "@/pages/Profile";
import ManageUsers from "@/pages/admin/ManageUsers";
import ManageDepartments from "@/pages/admin/ManageDepartments";
import SystemSettings from "@/pages/admin/SystemSettings";
import Reports from "@/pages/admin/Reports";
import GoogleSheetSettings from "@/pages/admin/GoogleSheetSettings";
import DashboardSettings from "@/pages/admin/DashboardSettings";
import NotFound from "@/pages/NotFound";
import Orders from "@/pages/Orders";
import DesignTasks from "@/pages/DesignTasks";
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";
import DepartmentRoute from "./DepartmentRoute";
import SalesDashboard from "@/pages/SalesDashboard";
import DesignDashboard from "@/pages/DesignDashboard";
import PrepressDashboard from "@/pages/PrepressDashboard";
import ProductionDashboard from "@/pages/ProductionDashboard";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Root path goes directly to login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      
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
      
      {/* Department-specific dashboards */}
      <Route
        path="/design"
        element={
          <DepartmentRoute department="Design">
            <Layout />
          </DepartmentRoute>
        }
      >
        <Route index element={<DesignDashboard />} />
      </Route>
      
      <Route
        path="/prepress"
        element={
          <DepartmentRoute department="Prepress">
            <Layout />
          </DepartmentRoute>
        }
      >
        <Route index element={<PrepressDashboard />} />
      </Route>
      
      <Route
        path="/production"
        element={
          <DepartmentRoute department="Production">
            <Layout />
          </DepartmentRoute>
        }
      >
        <Route index element={<ProductionDashboard />} />
      </Route>
      
      <Route
        path="/sales"
        element={
          <DepartmentRoute department="Sales">
            <Layout />
          </DepartmentRoute>
        }
      >
        <Route index element={<SalesDashboard />} />
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
        path="/orders"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<Orders />} />
      </Route>
      
      <Route
        path="/design-tasks"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<DesignTasks />} />
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
      
      {/* Admin routes */}
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
        path="/admin/dashboard-settings"
        element={
          <AdminRoute>
            <Layout />
          </AdminRoute>
        }
      >
        <Route index element={<DashboardSettings />} />
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
  );
};

export default AppRoutes;
