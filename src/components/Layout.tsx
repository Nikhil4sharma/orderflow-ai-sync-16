
import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useOrders } from "@/contexts/OrderContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, LogOut, Menu, Settings, User, Home, FileText, PlusCircle, BarChart, X, NotebookPen } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";

const Layout: React.FC = () => {
  const { currentUser, logoutUser } = useOrders();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();

  // Set page title based on department and current route
  useEffect(() => {
    const pathParts = location.pathname.split('/').filter(Boolean);
    const currentSection = pathParts.length > 0 ? 
      pathParts[0].charAt(0).toUpperCase() + pathParts[0].slice(1) : 
      'Dashboard';
    
    document.title = `${currentSection} | OrderFlow Management`;
  }, [location.pathname]);

  // Define navigation items with department-specific visibility
  const navItems = [
    { 
      name: 'Dashboard', 
      path: '/dashboard', 
      icon: <Home className="w-5 h-5 mr-2" />,
      showFor: ['Admin', 'Sales', 'Design', 'Production', 'Prepress'] // Everyone sees this
    },
    { 
      name: 'New Order', 
      path: '/new-order', 
      icon: <PlusCircle className="w-5 h-5 mr-2" />, 
      showFor: ['Admin', 'Sales'] // Only sales and admin
    },
    { 
      name: 'Orders', 
      path: '/orders', 
      icon: <FileText className="w-5 h-5 mr-2" />,
      showFor: ['Admin', 'Sales', 'Design', 'Production', 'Prepress'] // Everyone sees this
    },
    { 
      name: 'Reports', 
      path: '/reports', 
      icon: <BarChart className="w-5 h-5 mr-2" />,
      showFor: ['Admin', 'Sales'] // Only visible to admin and sales
    },
    { 
      name: 'Design Tasks', 
      path: '/design-tasks', 
      icon: <NotebookPen className="w-5 h-5 mr-2" />,
      showFor: ['Admin', 'Design'] // Only visible to design team and admin
    },
    { 
      name: 'Admin', 
      path: '/admin', 
      icon: <Settings className="w-5 h-5 mr-2" />, 
      showFor: ['Admin'] // Only visible to admin
    },
    { 
      name: 'Profile', 
      path: '/profile', 
      icon: <User className="w-5 h-5 mr-2" />,
      showFor: ['Admin', 'Sales', 'Design', 'Production', 'Prepress'] // Everyone sees this
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
    logoutUser();
    toast.success("You have been logged out successfully");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-background border-b border-border sticky top-0 z-10 w-full">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={toggleMenu} aria-label="Menu">
              <Menu className="h-5 w-5" />
            </Button>
            <Link to="/dashboard" className="text-xl font-bold flex items-center">
              <span className="bg-primary text-primary-foreground p-1 rounded mr-2 hidden sm:flex">OF</span>
              <span className={isMobile ? "text-lg" : "text-xl"}>Order Management</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
            
            <Button variant="ghost" size="icon" aria-label="Notifications">
              <Bell className="h-5 w-5" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full" aria-label="User menu">
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
                  <Link to="/profile" className="w-full flex cursor-pointer items-center">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                {currentUser?.role === "Admin" && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="w-full flex cursor-pointer items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      Admin
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-50 dark:focus:bg-red-950/30">
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
            <span className="bg-primary text-primary-foreground p-1.5 rounded mr-2 text-sm font-semibold">OF</span>
            <span className="font-bold text-lg">OrderFlow</span>
          </div>
          <Button variant="ghost" size="sm" onClick={toggleMenu} className="h-8 w-8 p-0" aria-label="Close menu">
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
                  <Link 
                    to={item.path}
                    className={cn(
                      "flex items-center px-3 py-2.5 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors",
                      location.pathname === item.path && "bg-accent text-accent-foreground font-medium"
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
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
                  <Link 
                    to="/admin/users"
                    className={cn(
                      "flex items-center px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors",
                      location.pathname === "/admin/users" && "bg-accent text-accent-foreground font-medium"
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="w-5 h-5 mr-2" />
                    Manage Users
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/admin/departments"
                    className={cn(
                      "flex items-center px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors",
                      location.pathname === "/admin/departments" && "bg-accent text-accent-foreground font-medium"
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FileText className="w-5 h-5 mr-2" />
                    Manage Departments
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/admin/settings"
                    className={cn(
                      "flex items-center px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors",
                      location.pathname === "/admin/settings" && "bg-accent text-accent-foreground font-medium"
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Settings className="w-5 h-5 mr-2" />
                    System Settings
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {currentUser?.name?.[0] || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{currentUser?.name}</span>
              <span className="text-xs text-muted-foreground">{currentUser?.department}</span>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="w-full mt-3 text-sm h-9"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign out
          </Button>
        </div>
      </div>
      
      {/* Overlay to close menu when clicked outside */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 bg-background">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
