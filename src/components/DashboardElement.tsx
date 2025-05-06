
import React, { ReactNode } from 'react';
import { useOrders } from '@/contexts/OrderContext';
import { DashboardElement as DashboardElementType } from '@/types/dashboardConfig';

interface DashboardElementProps {
  elementId: DashboardElementType;
  children: ReactNode;
  fallback?: ReactNode;
}

// This component conditionally renders children based on user permissions
const DashboardElement: React.FC<DashboardElementProps> = ({ 
  elementId, 
  children, 
  fallback = null 
}) => {
  const { currentUser, canUserSeeElement } = useOrders();
  
  if (!currentUser) {
    return null;
  }
  
  // Check if the current user's department can see this element
  const canSee = canUserSeeElement(currentUser.department, elementId);
  
  return canSee ? <>{children}</> : <>{fallback}</>;
};

export default DashboardElement;
