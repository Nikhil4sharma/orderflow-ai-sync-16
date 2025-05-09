
import React from 'react';
import { useOrders } from '@/contexts/OrderContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Department, Role } from '@/types/common';

interface RoleBasedSliderMenuProps {
  role?: Role;
  department?: Department;
  className?: string;
}

const RoleBasedSliderMenu: React.FC<RoleBasedSliderMenuProps> = ({
  role,
  department,
  className
}) => {
  const { currentUser } = useOrders();
  
  // Use provided role/department or fall back to currentUser
  const userRole = role || currentUser?.role;
  const userDepartment = department || currentUser?.department;

  if (!userRole || !userDepartment) {
    return null;
  }

  return (
    <Card className={`${className || ''}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">
          {userDepartment} Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-1">
        {/* Actions will vary based on role and department */}
        {userRole === 'Admin' && (
          <>
            <a href="/admin/users" className="group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
              Manage Users
            </a>
            <a href="/admin/settings" className="group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
              System Settings
            </a>
          </>
        )}
        
        {userDepartment === 'Sales' && (
          <>
            <a href="/new-order" className="group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
              New Order
            </a>
            <a href="/orders" className="group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
              View Orders
            </a>
          </>
        )}
        
        {userDepartment === 'Design' && (
          <a href="/design-tasks" className="group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
            Design Tasks
          </a>
        )}
        
        {userDepartment === 'Production' && (
          <a href="/orders" className="group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
            Production Queue
          </a>
        )}
        
        {userDepartment === 'Prepress' && (
          <a href="/orders" className="group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
            Prepress Tasks
          </a>
        )}
      </CardContent>
    </Card>
  );
};

export default RoleBasedSliderMenu;
