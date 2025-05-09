
import React from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Settings, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { User as UserType } from "@/types";

interface UserProfileProps {
  currentUser: UserType;
  handleLogout: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ currentUser, handleLogout }) => {
  return (
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
  );
};

export default UserProfile;
