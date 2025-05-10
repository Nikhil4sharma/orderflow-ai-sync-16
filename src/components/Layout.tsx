import React, { useState, useEffect } from "react";
import { Outlet, useLocation, Link, NavLink } from "react-router-dom";
import { useOrders, useUsers } from "@/contexts/OrderContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Menu, Settings, User, Home, FileText, PlusCircle, BarChart, X, NotebookPen } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ThemeToggle from "./ThemeToggle";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import ChhapaiLogo from "./ChhapaiLogo";
import { Badge } from "./ui/badge";
import NotificationsDropdown from "./NotificationsDropdown";

const Layout: React.FC = () => {
  const { currentUser, logout, orders } = useOrders();
  const { users } = useUsers();
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

  // Count orders by status for badges
  const countOrdersByStatus = (status: string) => {
    return orders.filter(order => order.status === status).length;
  };

  // Define navigation items with department-specific visibility and order counts
  const navItems = [
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
      <header className="bg-background border-b border-border sticky top-0 z-10 w-full">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleMenu} 
              aria-label="Menu"
              className="hover:bg-accent transition-colors hover:scale-105"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <Link to="/dashboard" className="flex items-center">
              <ChhapaiLogo size={isMobile ? "sm" : "md"} />
            </Link>
          </div>
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
            
            <NotificationsDropdown />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="relative h-10 w-10 rounded-full hover:bg-accent transition-colors hover:scale-105" 
                  aria-label="User menu"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage src="/placeholder.svg" alt={currentUser?.name || "User"} />
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {currentUser?.name?.[0] || currentUser?.email?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-1">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span>{currentUser?.name}</span>
                    <span className="text-xs text-muted-foreground">{currentUser?.role} • {currentUser?.department}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="w-full flex cursor-pointer items-center hover:text-primary transition-colors">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                {currentUser?.role === "Admin" && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="w-full flex cursor-pointer items-center hover:text-primary transition-colors">
                      <Settings className="mr-2 h-4 w-4" />
                      Admin
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-50 dark:focus:bg-red-950/30 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Sliding Menu */}
      <div 
        className={cn(
          "fixed top-0 left-0 h-full bg-background border-r border-border z-50 w-72 transform transition-transform duration-300 ease-in-out shadow-lg",
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-4 flex items-center justify-between border-b">
          <div className="flex items-center">
            <ChhapaiLogo size="sm" />
          </div>
          <Button variant="ghost" size="sm" onClick={toggleMenu} className="h-8 w-8 p-0 hover:bg-accent hover:scale-110 transition-all" aria-label="Close menu">
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="py-4 px-2">
          <div className="px-2 pb-2">
            <span className="text-xs font-medium uppercase text-muted-foreground tracking-wider">Main Navigation</span>
          </div>
          <nav>
            <ul className="space-y-1">
              {filteredNavItems.map((item) => (
                <li key={item.path}>
                  <NavLink 
                    to={item.path}
                    className={({ isActive }) => cn(
                      "flex items-center justify-between px-3 py-2.5 rounded-md hover:bg-accent hover:text-accent-foreground transition-all hover:translate-x-1",
                      isActive && "bg-accent text-accent-foreground font-medium"
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="flex items-center">
                      {item.icon}
                      {item.name}
                    </div>
                    {item.badge !== null && (
                      <Badge variant="outline" className="bg-background ml-2">
                        {item.badge}
                      </Badge>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        
        {currentUser?.role === "Admin" && (
          <div className="py-2 px-2 border-t border-border mt-2">
            <div className="px-2 py-2">
              <span className="text-xs font-medium uppercase text-muted-foreground tracking-wider">Admin</span>
            </div>
            <nav>
              <ul className="space-y-1">
                <li>
                  <NavLink 
                    to="/admin/users"
                    className={({ isActive }) => cn(
                      "flex items-center px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-all hover:translate-x-1",
                      isActive && "bg-accent text-accent-foreground font-medium"
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="w-5 h-5 mr-2" />
                    Manage Users
                  </NavLink>
                </li>
                <li>
                  <NavLink 
                    to="/admin/departments"
                    className={({ isActive }) => cn(
                      "flex items-center px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-all hover:translate-x-1",
                      isActive && "bg-accent text-accent-foreground font-medium"
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FileText className="w-5 h-5 mr-2" />
                    Manage Departments
                  </NavLink>
                </li>
                <li>
                  <NavLink 
                    to="/admin/settings"
                    className={({ isActive }) => cn(
                      "flex items-center px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-all hover:translate-x-1",
                      isActive && "bg-accent text-accent-foreground font-medium"
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Settings className="w-5 h-5 mr-2" />
                    System Settings
                  </NavLink>
                </li>
              </ul>
            </nav>
          </div>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src="/placeholder.svg" alt={currentUser?.name || "User"} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {currentUser?.name?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <p className="font-medium truncate max-w-[120px]">{currentUser?.name}</p>
                <p className="text-xs text-muted-foreground">{currentUser?.role}</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleLogout}
              className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
