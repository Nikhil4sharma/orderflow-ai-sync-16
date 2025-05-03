
import React from 'react';
import { useOrders } from '@/contexts/OrderContext';
import ApprovalsList from './ApprovalsList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

interface DashboardApprovalSectionProps {
  className?: string;
}

const DashboardApprovalSection: React.FC<DashboardApprovalSectionProps> = ({ className }) => {
  const { currentUser, orders } = useOrders();

  // Only show approvals section for Sales team and Admin
  if (currentUser?.department !== 'Sales' && currentUser?.role !== 'Admin') {
    return null;
  }

  // Count orders waiting for approval
  const waitingApprovalCount = orders.filter(order => {
    return (
      (order.currentDepartment === 'Design' && order.designStatus === 'Pending Feedback from Sales Team') ||
      (order.currentDepartment === 'Prepress' && order.prepressStatus === 'Waiting for approval')
    );
  }).length;

  return (
    <div className={className}>
      <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold flex items-center">
              <CheckCircle className="mr-2 h-5 w-5 text-blue-500" />
              Approvals Dashboard
            </CardTitle>
            {waitingApprovalCount > 0 && (
              <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                {waitingApprovalCount} pending
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Orders from Design and Prepress teams waiting for your approval
          </p>
          <ApprovalsList />
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardApprovalSection;
