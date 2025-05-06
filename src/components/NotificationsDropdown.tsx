
import React, { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useOrders } from "@/contexts/OrderContext";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  message: string;
  date: Date;
  read: boolean;
  type: "order" | "system" | "alert";
  link?: string;
}

const NotificationsDropdown: React.FC = () => {
  const { orders } = useOrders();
  
  // Mock notifications based on orders with pending actions
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "New Order Received",
      message: "A new order has been placed and requires your attention.",
      date: new Date(),
      read: false,
      type: "order",
      link: "/orders"
    },
    {
      id: "2",
      title: "Design Approval Required",
      message: "A design is awaiting your approval to proceed.",
      date: new Date(Date.now() - 3600000),
      read: false,
      type: "alert",
      link: "/design-tasks"
    },
    {
      id: "3",
      title: "System Update",
      message: "The system will undergo maintenance tonight at 10 PM.",
      date: new Date(Date.now() - 86400000),
      read: true,
      type: "system"
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    toast.success("All notifications marked as read");
  };

  const handleNotificationClick = (id: string, link?: string) => {
    // Mark this notification as read
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
    
    // Navigate if there's a link
    if (link) {
      window.location.href = link;
    }
  };

  const formatNotificationTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    
    const diffHours = Math.round(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.round(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const getNotificationIcon = (type: string) => {
    switch(type) {
      case 'order':
        return "🛍️";
      case 'alert':
        return "🔔";
      case 'system':
        return "🔧";
      default:
        return "📋";
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative animate-pulse hover:animate-none">
          <Bell className="h-5 w-5 hover:text-primary transition-colors" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center p-0 text-xs bg-red-500 text-white hover:bg-red-600"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-80 max-h-[70vh] overflow-y-auto">
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleMarkAllAsRead}
              className="text-xs h-7 hover:text-primary transition-colors"
            >
              Mark all as read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {notifications.length === 0 ? (
          <div className="py-4 text-center text-muted-foreground">
            No notifications
          </div>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem 
              key={notification.id} 
              className={cn(
                "flex flex-col items-start p-3 gap-1 cursor-pointer hover:bg-accent transition-colors",
                !notification.read && "bg-accent/40"
              )}
              onClick={() => handleNotificationClick(notification.id, notification.link)}
            >
              <div className="flex justify-between items-start w-full">
                <div className="flex gap-2 items-center">
                  <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                  <span className="font-medium">{notification.title}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatNotificationTime(notification.date)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {notification.message}
              </p>
              {!notification.read && (
                <div className="w-2 h-2 rounded-full bg-blue-500 absolute top-3 right-3"></div>
              )}
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationsDropdown;
