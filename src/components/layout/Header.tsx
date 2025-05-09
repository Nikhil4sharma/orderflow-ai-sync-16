
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import ChhapaiLogo from "@/components/ChhapaiLogo";
import ThemeToggle from "@/components/ThemeToggle";
import UserProfile from "./UserProfile";
import NotificationsDropdown from "@/components/NotificationsDropdown";
import { User } from "@/types";

interface HeaderProps {
  toggleMenu: () => void;
  currentUser: User;
  handleLogout: () => void;
  isMobile: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleMenu, currentUser, handleLogout, isMobile }) => {
  return (
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
          <UserProfile currentUser={currentUser} handleLogout={handleLogout} />
        </div>
      </div>
    </header>
  );
};

export default Header;
