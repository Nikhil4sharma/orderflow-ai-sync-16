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
import NotificationBell from './NotificationBell';

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
    <NotificationBell />
  );
};

export default NotificationsDropdown;
