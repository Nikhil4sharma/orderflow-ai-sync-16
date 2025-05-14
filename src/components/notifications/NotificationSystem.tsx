
import React, { useState, useEffect } from 'react';
import { useUsers } from '@/contexts/UserContext';
import { Bell, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Notification } from '@/types/notification';
import { Badge } from '@/components/ui/badge';
import { NotificationType } from '@/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Mock data - in a real app, this would come from a context or API
const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Order Approval Requested',
    message: 'Design for order #ORD-2023-001 needs your approval',
    timestamp: new Date().toISOString(),
    isRead: false,
    type: 'approval_request' as NotificationType,
    orderId: 'ORD-2023-001',
    forDepartments: ['Sales'],
    priority: 'high',
    category: 'order'
  },
  {
    id: '2',
    title: 'Payment Received',
    message: 'Payment of ₹15,000 received for order #ORD-2023-002',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    isRead: false,
    type: 'payment_received' as NotificationType,
    orderId: 'ORD-2023-002',
    forDepartments: ['Sales', 'Production'],
    priority: 'medium',
    category: 'payment'
  },
  {
    id: '3',
    title: 'Order Ready to Dispatch',
    message: 'Order #ORD-2023-003 is ready for dispatch',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    isRead: true,
    type: 'ready_for_dispatch' as NotificationType,
    orderId: 'ORD-2023-003',
    forDepartments: ['Sales', 'Production'],
    priority: 'medium',
    category: 'order'
  }
];

const NotificationSystem = () => {
  const { currentUser } = useUsers();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  // Filter notifications based on user's department and role
  useEffect(() => {
    if (currentUser) {
      // In a real app, fetch from database or API
      const filteredNotifications = mockNotifications.filter(notification => {
        // Admin sees all notifications
        if (currentUser.role === 'Admin') return true;
        
        // Filter by department
        return notification.forDepartments.includes(currentUser.department) ||
               (notification.forRoles && notification.forRoles.includes(currentUser.role));
      });
      
      setNotifications(filteredNotifications);
    }
  }, [currentUser]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Mark a notification as read
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true } 
          : notification
      )
    );
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  // Get relative time for notifications
  const getRelativeTime = (timestamp: string) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffMs = now.getTime() - notificationTime.getTime();
    const diffMins = Math.round(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.round(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.round(diffHours / 24);
    return `${diffDays}d ago`;
  };

  // Get background color based on notification priority
  const getNotificationStyle = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high':
        return 'bg-red-50 dark:bg-red-950/20 border-l-4 border-red-500';
      case 'medium':
        return 'bg-amber-50 dark:bg-amber-950/20 border-l-4 border-amber-500';
      default:
        return 'bg-blue-50 dark:bg-blue-950/20 border-l-4 border-blue-500';
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 min-w-5 p-0 flex items-center justify-center" 
              variant="destructive"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs h-7">
              Mark all as read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="max-h-[300px] overflow-y-auto">
          {notifications.length === 0 ? (
            <DropdownMenuItem className="text-muted-foreground text-center py-4 justify-center">
              No notifications
            </DropdownMenuItem>
          ) : (
            notifications.map(notification => (
              <DropdownMenuItem 
                key={notification.id} 
                className={`flex flex-col items-start p-3 my-1 rounded-md cursor-pointer ${notification.isRead ? '' : getNotificationStyle(notification.priority)}`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex justify-between w-full">
                  <span className="font-medium">{notification.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {getRelativeTime(notification.timestamp)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {notification.message}
                </p>
                {!notification.isRead && (
                  <Badge variant="default" className="mt-2">New</Badge>
                )}
              </DropdownMenuItem>
            ))
          )}
        </DropdownMenuGroup>
        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center">
              View all notifications
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationSystem;
