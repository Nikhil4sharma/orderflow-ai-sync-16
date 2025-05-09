
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useUsers } from "@/contexts/UserContext";

interface DepartmentRouteProps {
  department: string;
  children: React.ReactNode;
}

const DepartmentRoute: React.FC<DepartmentRouteProps> = ({ department, children }) => {
  const { isAuthenticated, currentUser, loading } = useUsers();
  const location = useLocation();

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (currentUser?.department !== department && currentUser?.role !== "Admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default DepartmentRoute;
