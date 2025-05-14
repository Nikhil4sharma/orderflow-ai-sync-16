
import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useUsers } from "@/contexts/UserContext";
import Header from "@/components/layout/Header";
import SidebarNav from "@/components/layout/SidebarNav";
import { useState } from "react";

const Layout: React.FC = () => {
  const { isAuthenticated, logout, currentUser } = useUsers();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <SidebarNav 
        isMenuOpen={isMenuOpen} 
        toggleMenu={toggleMenu} 
        navItems={[]} 
        currentUser={currentUser} 
        handleLogout={handleLogout} 
      />
      <div className="flex-1 flex flex-col">
        <Header toggleMenu={toggleMenu} user={currentUser} />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
