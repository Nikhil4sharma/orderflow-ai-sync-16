
import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useUsers } from "@/contexts/UserContext";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/SidebarNav";

const Layout: React.FC = () => {
  const { isAuthenticated, logout } = useUsers();
  const navigate = useNavigate();

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header onLogout={handleLogout} />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
