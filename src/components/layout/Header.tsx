
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, Bell, Sun, Moon, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/types";
import ChhapaiLogo from "@/components/ChhapaiLogo";
import { useTheme } from "@/contexts/ThemeContext";
import NotificationSystem from "@/components/notifications/NotificationSystem";

interface HeaderProps {
  toggleMenu: () => void;
  currentUser?: User | null;
  handleLogout: () => void;
  isMobile: boolean;
}

const Header: React.FC<HeaderProps> = ({
  toggleMenu,
  currentUser,
  handleLogout,
  isMobile
}) => {
  const { theme, setTheme } = useTheme();

  return (
    <header className="bg-background border-b sticky top-0 z-40">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMenu}
            className="mr-2 h-8 w-8 lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Link to="/" className="flex items-center gap-2">
            <ChhapaiLogo size="sm" />
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-8 w-8"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          
          {/* Notifications */}
          <NotificationSystem />

          {/* User Menu */}
          {currentUser && (
            <div className="flex items-center gap-2">
              {!isMobile && (
                <div className="text-sm mr-2">
                  <p className="font-medium">{currentUser.name}</p>
                  <p className="text-xs text-muted-foreground">{currentUser.department} / {currentUser.role}</p>
                </div>
              )}
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg" alt={currentUser.name} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {currentUser.name[0]}
                </AvatarFallback>
              </Avatar>
              <Button
                variant="ghost" 
                size="icon"
                onClick={handleLogout}
                className="h-8 w-8 text-red-600 hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-900/20"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
