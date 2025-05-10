import { Department } from "@/types/common";
import { Order } from "@/types/order"; // Fix the import path
import { ProductionStageStatus } from '@/types/order';
import { format, subDays, addDays } from 'date-fns';
import { nanoid } from 'nanoid';

// Generate demo data
export const generateDemoOrders = (): Order[] => {
  const orders: Order[] = [];

  for (let i = 0; i < 25; i++) {
    const createdAt = subDays(new Date(), i);
    const amount = Math.floor(Math.random() * 50000) + 1000;
    const paidAmount = Math.floor(Math.random() * amount);
    const pendingAmount = amount - paidAmount;
    const statusOptions: OrderStatus[] = ["In Progress", "Completed", "On Hold", "Issue", "Verified", "Dispatched", "Ready to Dispatch", "New", "Pending Approval"];
    const randomStatus = statusOptions[Math.floor(Math.random() * statusOptions.length)];
    const departmentOptions: Department[] = ["Sales", "Production", "Design", "Prepress"];
    const randomDepartment = departmentOptions[Math.floor(Math.random() * departmentOptions.length)];
    const paymentStatusOptions: PaymentStatus[] = ["Not Paid", "Partial", "Paid"];
    const randomPaymentStatus = paymentStatusOptions[Math.floor(Math.random() * paymentStatusOptions.length)];

    const order: Order = {
      id: nanoid(),
      orderNumber: `ORD-${1000 + i}`,
      clientName: `Client ${i + 1}`,
      amount: amount,
      paidAmount: paidAmount,
      pendingAmount: pendingAmount,
      items: [`Item ${i + 1}A`, `Item ${i + 1}B`, `Item ${i + 1}C`],
      createdAt: format(createdAt, 'yyyy-MM-dd'),
      status: randomStatus,
      currentDepartment: randomDepartment,
      paymentStatus: randomPaymentStatus,
      statusHistory: [
        {
          id: nanoid(),
          orderId: `ORD-${1000 + i}`,
          timestamp: format(subDays(createdAt, 1), 'yyyy-MM-dd HH:mm'),
          department: "Sales",
          status: "New",
          remarks: "Order placed",
          updatedBy: "System",
          editableUntil: format(addDays(new Date(), 1), 'yyyy-MM-dd HH:mm')
        },
        {
          id: nanoid(),
          orderId: `ORD-${1000 + i}`,
          timestamp: format(createdAt, 'yyyy-MM-dd HH:mm'),
          department: "Production",
          status: "In Progress",
          remarks: "Order being processed",
          updatedBy: "Production Team",
          editableUntil: format(addDays(new Date(), 1), 'yyyy-MM-dd HH:mm')
        }
      ],
      paymentHistory: [
        {
          id: nanoid(),
          amount: paidAmount / 2,
          date: format(subDays(createdAt, 2), 'yyyy-MM-dd'),
          method: "Credit Card",
          remarks: "Initial payment"
        },
        {
          id: nanoid(),
          amount: paidAmount / 2,
          date: format(subDays(createdAt, 1), 'yyyy-MM-dd'),
          method: "UPI",
          remarks: "Final payment"
        }
      ],
      productionStages: [
        {
          stage: "Printing",
          status: "completed",
          remarks: "Printing completed",
          timeline: format(addDays(new Date(), 3), 'yyyy-MM-dd')
        } as ProductionStageStatus,
        {
          stage: "Cutting",
          status: "processing",
          remarks: "Cutting in progress",
          timeline: format(addDays(new Date(), 5), 'yyyy-MM-dd')
        } as ProductionStageStatus
      ],
      lastUpdated: format(createdAt, 'yyyy-MM-dd HH:mm:ss')
    };
    orders.push(order);
  }

  return orders;
};
