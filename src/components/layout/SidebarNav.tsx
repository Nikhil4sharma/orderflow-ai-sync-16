
import React from "react";
import { NavLink } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { User as UserIcon, X, FileText, Settings, LogOut } from "lucide-react";
import ChhapaiLogo from "@/components/ChhapaiLogo";
import { User } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NavItem } from "@/types/layout";

interface SidebarNavProps {
  isMenuOpen: boolean;
  toggleMenu: () => void;
  navItems: NavItem[];
  currentUser: User;
  handleLogout: () => void;
}

const SidebarNav: React.FC<SidebarNavProps> = ({
  isMenuOpen,
  toggleMenu,
  navItems,
  currentUser,
  handleLogout
}) => {
  return (
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
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink 
                  to={item.path}
                  className={({ isActive }) => cn(
                    "flex items-center justify-between px-3 py-2.5 rounded-md hover:bg-accent hover:text-accent-foreground transition-all hover:translate-x-1",
                    isActive && "bg-accent text-accent-foreground font-medium"
                  )}
                  onClick={toggleMenu}
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
                  onClick={toggleMenu}
                >
                  <UserIcon className="w-5 h-5 mr-2" />
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
                  onClick={toggleMenu}
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
                  onClick={toggleMenu}
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
  );
};

export default SidebarNav;
