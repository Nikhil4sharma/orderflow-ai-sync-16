
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { useOrders } from "@/contexts/OrderContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, LogOut, Menu, Settings, User, Home, FileText, PlusCircle, BarChart, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useLocation } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { cn } from "@/lib/utils";

const Layout: React.FC = () => {
  const { currentUser, logoutUser } = useOrders();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Define navigation items
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <Home className="w-5 h-5 mr-2" /> },
    { name: 'New Order', path: '/new-order', icon: <PlusCircle className="w-5 h-5 mr-2" />, role: ['Admin', 'Sales'] },
    { name: 'Reports', path: '/reports', icon: <BarChart className="w-5 h-5 mr-2" /> },
    { name: 'Admin', path: '/admin', icon: <Settings className="w-5 h-5 mr-2" />, role: ['Admin'] },
    { name: 'Profile', path: '/profile', icon: <User className="w-5 h-5 mr-2" /> },
  ];

  // Filter navigation items based on user role
  const filteredNavItems = navItems.filter(
    item => !item.role || (currentUser && item.role.includes(currentUser.role))
  );

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-background border-b border-border sticky top-0 z-10 w-full">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              <Menu className="h-5 w-5" />
            </Button>
            <Link to="/" className="text-xl font-bold">
              Order Management
            </Link>
          </div>
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
            
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>
                      {currentUser?.name?.[0] || currentUser?.email?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
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
                <DropdownMenuItem onClick={() => logoutUser()} className="cursor-pointer">
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
          "fixed top-0 left-0 h-full bg-background border-r border-border z-50 w-64 transform transition-transform duration-300 ease-in-out",
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-4 flex items-center justify-between border-b">
          <span className="font-bold text-lg">Menu</span>
          <Button variant="ghost" size="sm" onClick={toggleMenu}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <nav className="p-2">
          <ul className="space-y-1">
            {filteredNavItems.map((item) => (
              <li key={item.path}>
                <Link 
                  to={item.path}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors",
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
        
        {currentUser?.role === "Admin" && (
          <>
            <div className="px-4 pt-4 pb-2">
              <span className="text-xs font-bold uppercase text-muted-foreground">Admin</span>
            </div>
            <nav className="p-2">
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
          </>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <div className="flex items-center">
            <Avatar className="h-9 w-9 mr-2">
              <AvatarFallback>
                {currentUser?.name?.[0] || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{currentUser?.name}</span>
              <span className="text-xs text-muted-foreground">{currentUser?.department}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Overlay to close menu when clicked outside */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
