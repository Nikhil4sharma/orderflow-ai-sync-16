
import React from 'react';
import { useOrders } from '@/contexts/OrderContext';
import ApprovalsList from './ApprovalsList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

interface DashboardApprovalSectionProps {
  className?: string;
}

const DashboardApprovalSection: React.FC<DashboardApprovalSectionProps> = ({ className }) => {
  const { currentUser } = useOrders();

  // Only show approvals section for Sales team and Admin
  if (currentUser.department !== 'Sales' && currentUser.role !== 'Admin') {
    return null;
  }

  return (
    <div className={className}>
      <h2 className="text-2xl font-bold mb-4">Approvals Dashboard</h2>
      <ApprovalsList />
    </div>
  );
};

export default DashboardApprovalSection;
