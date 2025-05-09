
import { Order, User, Department, OrderStatus, PaymentStatus, PermissionKey, Role } from "@/types";
import { v4 as uuidv4 } from "uuid";

// Generate a random date within the past month
const getRandomDate = () => {
  const now = new Date();
  const pastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
  const randomTime = pastMonth.getTime() + Math.random() * (now.getTime() - pastMonth.getTime());
  return new Date(randomTime).toISOString();
};

// Generate a random order number
const generateOrderNumber = () => {
  const prefix = "ORD";
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `${prefix}-${randomNum}`;
};

// Generate mock orders
export const getMockOrders = (): Order[] => {
  const departments: Department[] = ["Sales", "Design", "Production", "Prepress"];
  const statuses: OrderStatus[] = ["In Progress", "Completed", "On Hold", "Issue"];
  const paymentStatuses: PaymentStatus[] = ["Not Paid", "Partial", "Paid"];
  
  return Array.from({ length: 15 }, (_, i) => {
    const amount = Math.floor(1000 + Math.random() * 10000);
    const paidAmount = Math.random() > 0.5 ? amount : Math.floor(Math.random() * amount);
    const pendingAmount = amount - paidAmount;
    const paymentStatus = paidAmount === 0 ? "Not Paid" : paidAmount === amount ? "Paid" : "Partial";
    const createdAt = getRandomDate();
    const orderNumber = generateOrderNumber();
    
    return {
      id: uuidv4(),
      orderNumber,
      clientName: `Client ${i + 1}`,
      amount,
      paidAmount,
      pendingAmount,
      items: [`Product ${i + 1}`, `Product ${i + 2}`],
      createdAt,
      status: statuses[Math.floor(Math.random() * statuses.length)] as OrderStatus,
      currentDepartment: departments[Math.floor(Math.random() * departments.length)],
      statusHistory: [
        {
          id: uuidv4(),
          orderId: uuidv4(),
          department: "Sales" as Department,
          status: "Created",
          remarks: "Order created",
          timestamp: createdAt,
          updatedBy: "System"
        }
      ],
      paymentStatus: paymentStatus as PaymentStatus
    };
  });
};

// Generate mock users with the demo accounts
export const getMockUsers = (): User[] => {
  // Create the admin demo user
  const adminUser: User = {
    id: "admin-1",
    name: "Admin User",
    email: "admin@chhapai.com",
    password: "admin123",
    department: "Sales" as Department,
    role: "Admin" as Role,
    permissions: [
      "manage_users", 
      "manage_departments", 
      "update_orders", 
      "delete_orders", 
      "manage_settings", 
      "export_data"
    ] as PermissionKey[]
  };
  
  // Create the sales demo user
  const salesUser: User = {
    id: "sales-1",
    name: "Sales User",
    email: "sales@chhapai.com",
    password: "sales123",
    department: "Sales" as Department,
    role: "Manager" as Role,
    permissions: [
      "view_orders", 
      "create_orders", 
      "update_orders", 
      "update_order_status"
    ] as PermissionKey[]
  };
  
  // Create the design demo user
  const designUser: User = {
    id: "design-1",
    name: "Design User",
    email: "design@chhapai.com",
    password: "design123",
    department: "Design" as Department,
    role: "Staff" as Role,
    permissions: [
      "view_orders", 
      "update_order_status", 
      "request_approval"
    ] as PermissionKey[]
  };
  
  // Create the production demo user
  const productionUser: User = {
    id: "production-1",
    name: "Production User",
    email: "production@chhapai.com",
    password: "production123",
    department: "Production" as Department,
    role: "Manager" as Role,
    permissions: [
      "view_orders", 
      "update_order_status", 
      "mark_ready_dispatch"
    ] as PermissionKey[]
  };
  
  // Generate other random users
  const otherUsers = Array.from({ length: 3 }, (_, i) => {
    const departmentOptions: Department[] = ["Sales", "Design", "Production", "Prepress"];
    const roleOptions: Role[] = ["Admin", "Manager", "Staff"];
    const department = departmentOptions[Math.floor(Math.random() * departmentOptions.length)];
    const role = roleOptions[Math.floor(Math.random() * roleOptions.length)];
    
    return {
      id: `user-${i + 1}`,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      password: "password",
      department,
      role,
      permissions: [] as PermissionKey[]
    };
  });
  
  return [adminUser, salesUser, designUser, productionUser, ...otherUsers];
};

// Export other utility functions as needed
export const getRandomOrderStatus = (): OrderStatus => {
  const statuses: OrderStatus[] = ["In Progress", "Completed", "On Hold", "Issue"];
  return statuses[Math.floor(Math.random() * statuses.length)];
};

export const getRandomDepartment = (): Department => {
  const departments: Department[] = ["Sales", "Design", "Production", "Prepress"];
  return departments[Math.floor(Math.random() * departments.length)];
};

export const getRandomPaymentStatus = (): PaymentStatus => {
  const statuses: PaymentStatus[] = ["Not Paid", "Partial", "Paid"];
  return statuses[Math.floor(Math.random() * statuses.length)];
};

// Add missing functions needed by other components
export const getDepartments = (): Department[] => {
  return ["Sales", "Design", "Production", "Prepress", "Admin"];
};

export const getAllowedStatusesForDepartment = (department: Department): OrderStatus[] => {
  switch (department) {
    case "Sales":
      return ["In Progress", "Completed", "On Hold", "Issue"];
    case "Design":
      return ["In Progress", "Completed", "On Hold", "Issue"];
    case "Production":
      return ["In Progress", "Completed", "On Hold", "Issue", "Ready to Dispatch"];
    case "Prepress":
      return ["In Progress", "Completed", "On Hold", "Issue"];
    case "Admin":
      return ["In Progress", "Completed", "On Hold", "Issue", "Ready to Dispatch", "Dispatched", "New", "Pending Approval"];
    default:
      return ["In Progress", "Completed", "On Hold", "Issue", "Ready to Dispatch", "Dispatched"];
  }
};

export const getNextDepartment = (currentDepartment: Department): Department | null => {
  const flowOrder: Department[] = ["Sales", "Design", "Prepress", "Production"];
  const currentIndex = flowOrder.indexOf(currentDepartment);
  
  if (currentIndex === -1 || currentIndex === flowOrder.length - 1) {
    return null;
  }
  
  return flowOrder[currentIndex + 1];
};
