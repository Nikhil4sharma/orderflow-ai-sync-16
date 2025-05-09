
import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useOrders } from "@/contexts/OrderContext";
import { Home, FileText, PlusCircle, BarChart, Settings, User, NotebookPen } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import { NavItem } from "@/types/layout";
import Header from "./Header";
import SidebarNav from "./SidebarNav";

const Layout: React.FC = () => {
  const { currentUser, logout, orders } = useOrders();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();

  // Set page title based on department and current route
  useEffect(() => {
    const pathParts = location.pathname.split('/').filter(Boolean);
    const currentSection = pathParts.length > 0 ? 
      pathParts[0].charAt(0).toUpperCase() + pathParts[0].slice(1) : 
      'Dashboard';
    
    document.title = `${currentSection} | Chhapai Management`;
  }, [location.pathname]);

  // Define navigation items with department-specific visibility and order counts
  const navItems: NavItem[] = [
    { 
      name: 'Dashboard', 
      path: '/dashboard', 
      icon: <Home className="w-5 h-5 mr-2" />,
      showFor: ['Admin', 'Sales', 'Design', 'Production', 'Prepress'],
      badge: null
    },
    { 
      name: 'New Order', 
      path: '/new-order', 
      icon: <PlusCircle className="w-5 h-5 mr-2" />, 
      showFor: ['Admin', 'Sales'],
      badge: null
    },
    { 
      name: 'Orders', 
      path: '/orders', 
      icon: <FileText className="w-5 h-5 mr-2" />,
      showFor: ['Admin', 'Sales', 'Design', 'Production', 'Prepress'],
      badge: orders.length
    },
    { 
      name: 'Design Tasks', 
      path: '/design-tasks', 
      icon: <NotebookPen className="w-5 h-5 mr-2" />,
      showFor: ['Admin', 'Design'],
      badge: orders.filter(o => o.currentDepartment === 'Design').length
    },
    { 
      name: 'Reports', 
      path: '/admin/reports', 
      icon: <BarChart className="w-5 h-5 mr-2" />,
      showFor: ['Admin', 'Sales'],
      badge: null
    },
    { 
      name: 'Admin', 
      path: '/admin', 
      icon: <Settings className="w-5 h-5 mr-2" />, 
      showFor: ['Admin'],
      badge: null
    },
    { 
      name: 'Profile', 
      path: '/profile', 
      icon: <User className="w-5 h-5 mr-2" />,
      showFor: ['Admin', 'Sales', 'Design', 'Production', 'Prepress'],
      badge: null
    },
  ];

  // Filter navigation items based on user role and department
  const filteredNavItems = navItems.filter(
    item => currentUser && item.showFor.includes(currentUser.role)
  );

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout(); // Use the logout function from the OrderContext
    toast.success("You have been logged out successfully");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header 
        toggleMenu={toggleMenu} 
        currentUser={currentUser}
        handleLogout={handleLogout}
        isMobile={isMobile}
      />

      {/* Sliding Menu */}
      <SidebarNav
        isMenuOpen={isMenuOpen}
        toggleMenu={toggleMenu}
        navItems={filteredNavItems}
        currentUser={currentUser}
        handleLogout={handleLogout}
      />

      {/* Main Content */}
      <main className={cn("flex-1 container mx-auto px-4 py-6", isMenuOpen && "blur-sm pointer-events-none")}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
