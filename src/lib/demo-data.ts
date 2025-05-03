import { 
  Department, 
  DispatchDetails, 
  Order, 
  OrderStatus, 
  PaymentRecord, 
  PaymentStatus, 
  ProductionStageStatus, 
  ProductStatus, 
  StatusUpdate 
} from "@/types";
import { v4 as uuidv4 } from "uuid";

// Helper function to generate a random order number
export const generateOrderNumber = (): string => {
  const prefix = "ORD";
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  const year = new Date().getFullYear().toString().slice(2);
  return `${prefix}-${year}${randomNum}`;
};

// Helper function to generate a random date within the last 6 months
const getRandomRecentDate = (daysBack = 180): string => {
  const today = new Date();
  const earliestDate = new Date();
  earliestDate.setDate(today.getDate() - daysBack);
  
  const randomTime = earliestDate.getTime() + Math.random() * (today.getTime() - earliestDate.getTime());
  return new Date(randomTime).toISOString();
};

// Helper function to generate random status updates
const generateStatusUpdates = (orderId: string, count: number = 3): StatusUpdate[] => {
  const updates: StatusUpdate[] = [];
  const departments: Department[] = ["Sales", "Design", "Prepress", "Production"];
  
  // Generate random status updates
  for (let i = 0; i < count; i++) {
    const department = departments[Math.floor(Math.random() * departments.length)];
    const status = i === count - 1 ? "In Progress" : "Completed";
    
    updates.push({
      id: uuidv4(),
      orderId,
      department,
      status,
      timestamp: getRandomRecentDate(),
      updatedBy: "User",
      estimatedTime: new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)).toISOString() // 7 days from now
    });
  }
  
  return updates;
};

// Generate a random payment record
const generatePaymentRecord = (amount: number): PaymentRecord => {
  const methods = ["Cash", "Bank Transfer", "UPI", "Credit Card", "Cheque"];
  return {
    id: uuidv4(),
    amount: Math.round(amount * (Math.random() * 0.8 + 0.2)), // Pay between 20% and 100%
    date: getRandomRecentDate(30),
    method: methods[Math.floor(Math.random() * methods.length)],
  };
};

// Generate product statuses for an order
const generateProductStatuses = (orderItems: string[]): ProductStatus[] => {
  return orderItems.map((item) => ({
    id: uuidv4(),
    name: item,
    status: Math.random() > 0.5 ? "processing" : "completed",
    remarks: Math.random() > 0.7 ? "Some notes about this product" : undefined,
  }));
};

// Generate production stages for an order
const generateProductionStages = (completedStages: number = 2): ProductionStageStatus[] => {
  const allStages = [
    "Printing",
    "Cutting",
    "Pasting",
    "Foiling",
    "Letterpress",
    "Embossed",
    "Diecut",
    "Quality Check",
    "In Progress" // Changed from "Ready to Dispatch" to "In Progress"
  ];
  
  // Take a random subset of stages
  const selectedStages = allStages.slice(0, Math.floor(Math.random() * 5) + 3);
  
  return selectedStages.map((stage, index) => ({
    stage: stage as any,
    status: index < completedStages ? "completed" : (Math.random() > 0.3 ? "processing" : "issue"),
    remarks: Math.random() > 0.7 ? "Some notes about this stage" : undefined,
    timeline: new Date(Date.now() + ((index + 1) * 24 * 60 * 60 * 1000)).toISOString()
  }));
};

// Generate demo dispatch details (only for dispatched orders)
const generateDispatchDetails = (): DispatchDetails => {
  return {
    address: "123 Customer Street, City, State, 400001",
    contactNumber: "+91 9876543210",
    courierPartner: Math.random() > 0.5 ? "FedEx" : "DTDC",
    deliveryType: Math.random() > 0.7 ? "Express" : "Normal",
    trackingNumber: `TRK${Math.floor(1000000 + Math.random() * 9000000)}`,
    dispatchDate: getRandomRecentDate(15),
    verifiedBy: "Sales Manager"
  };
};

// Generate notification function (placeholder)
export const generateNotification = (order: Order) => {
  // This would be implemented to send notifications
  console.log(`Notification for order ${order.id}: Status changed to ${order.status}`);
  return null;
};

// Generate mock orders
export const getDemoOrders = (): Order[] => {
  const orders: Order[] = [];
  const orderCount = 15;
  
  const productOptions = [
    "Business Cards", 
    "Brochures", 
    "Flyers", 
    "Banners", 
    "Posters", 
    "Wedding Cards", 
    "Packaging Boxes",
    "Letterhead",
    "Invitation Cards",
    "Calendars",
    "Catalogs"
  ];
  
  const clientNames = [
    "Acme Corporation",
    "Globex Industries",
    "Stark Enterprises",
    "Wayne Industries",
    "Oscorp Industries", 
    "Umbrella Corporation",
    "Cyberdyne Systems",
    "Soylent Corp",
    "Initech",
    "Massive Dynamic"
  ];
  
  const statuses: OrderStatus[] = [
    "In Progress",
    "Completed",
    "On Hold",
    "Issue",
    "Ready to Dispatch",
    "Dispatched"
  ];
  
  const departments: Department[] = ["Sales", "Design", "Prepress", "Production"];
  
  // Generate orders
  for (let i = 0; i < orderCount; i++) {
    const isCompleted = Math.random() > 0.7;
    const amount = Math.round(Math.random() * 40000) + 5000;
    const paidAmount = isCompleted ? amount : Math.round(amount * (Math.random() * 0.7));
    const pendingAmount = amount - paidAmount;
    const paymentStatus: PaymentStatus = paidAmount === 0 ? "Not Paid" : (paidAmount < amount ? "Partial" : "Paid");
    
    // Select 1-3 random products
    const numProducts = Math.floor(Math.random() * 3) + 1;
    const items: string[] = [];
    for (let j = 0; j < numProducts; j++) {
      const randomProduct = productOptions[Math.floor(Math.random() * productOptions.length)];
      if (!items.includes(randomProduct)) {
        items.push(randomProduct);
      }
    }
    
    // Generate a random status and department
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const department = departments[Math.floor(Math.random() * departments.length)];
    
    // Generate demo order
    const orderId = uuidv4();
    
    const designStatus = department === 'Design' ? 
      (Math.random() > 0.5 ? "Working on it" : (Math.random() > 0.5 ? "Pending Feedback from Sales Team" : "Forwarded to Prepress")) : 
      undefined;
      
    const prepressStatus = department === 'Prepress' ? 
      (Math.random() > 0.5 ? "Working on it" : (Math.random() > 0.5 ? "Waiting for approval" : "Forwarded to production")) : 
      undefined;
      
    // Create order object
    const order: Order = {
      id: orderId,
      orderNumber: generateOrderNumber(),
      clientName: clientNames[Math.floor(Math.random() * clientNames.length)],
      amount,
      paidAmount,
      pendingAmount,
      items,
      createdAt: getRandomRecentDate(),
      status,
      currentDepartment: department,
      paymentStatus,
      productStatus: generateProductStatuses(items),
      statusHistory: generateStatusUpdates(orderId, Math.floor(Math.random() * 5) + 2),
      paymentHistory: paidAmount > 0 ? [generatePaymentRecord(amount)] : [],
      designStatus,
      designRemarks: designStatus ? "Client requested blue theme" : undefined,
      designTimeline: designStatus ? new Date(Date.now() + (5 * 24 * 60 * 60 * 1000)).toISOString() : undefined,
      prepressStatus,
      prepressRemarks: prepressStatus ? "Check the alignment" : undefined,
      productionStages: department === 'Production' ? generateProductionStages() : undefined,
      dispatchDetails: status === 'Dispatched' ? generateDispatchDetails() : undefined,
    };
    
    orders.push(order);
  }
  
  // Add one order that needs approval from sales team
  const approvalNeededOrder: Order = {
    id: uuidv4(),
    orderNumber: generateOrderNumber(),
    clientName: "Approval Test Client",
    amount: 15000,
    paidAmount: 5000,
    pendingAmount: 10000,
    items: ["Business Cards", "Brochures"],
    createdAt: new Date().toISOString(),
    status: "In Progress",
    currentDepartment: "Design",
    paymentStatus: "Partial",
    productStatus: [
      {
        id: uuidv4(),
        name: "Business Cards",
        status: "processing",
      },
      {
        id: uuidv4(),
        name: "Brochures", 
        status: "processing",
      }
    ],
    statusHistory: [
      {
        id: uuidv4(),
        department: "Sales",
        status: "New Order Created",
        timestamp: new Date(Date.now() - (2 * 24 * 60 * 60 * 1000)).toISOString(),
        updatedBy: "Sales User"
      },
      {
        id: uuidv4(),
        department: "Design",
        status: "Working on designs",
        timestamp: new Date(Date.now() - (1 * 24 * 60 * 60 * 1000)).toISOString(),
        updatedBy: "Design User"
      }
    ],
    paymentHistory: [{
      id: uuidv4(),
      amount: 5000,
      date: new Date(Date.now() - (2 * 24 * 60 * 60 * 1000)).toISOString(),
      method: "Bank Transfer",
    }],
    designStatus: "Pending Feedback from Sales Team",
    designRemarks: "Need client approval on the design mockup",
    designTimeline: new Date(Date.now() + (3 * 24 * 60 * 60 * 1000)).toISOString(),
  };
  
  // Add a prepress order that needs approval
  const prepressApprovalOrder: Order = {
    id: uuidv4(),
    orderNumber: generateOrderNumber(),
    clientName: "Prepress Approval Client",
    amount: 25000,
    paidAmount: 25000,
    pendingAmount: 0,
    items: ["Packaging Boxes"],
    createdAt: new Date().toISOString(),
    status: "In Progress",
    currentDepartment: "Prepress",
    paymentStatus: "Paid",
    productStatus: [
      {
        id: uuidv4(),
        name: "Packaging Boxes",
        status: "processing",
      }
    ],
    statusHistory: [
      {
        id: uuidv4(),
        department: "Sales",
        status: "New Order Created",
        timestamp: new Date(Date.now() - (5 * 24 * 60 * 60 * 1000)).toISOString(),
        updatedBy: "Sales User"
      },
      {
        id: uuidv4(),
        department: "Design",
        status: "Design Completed",
        timestamp: new Date(Date.now() - (2 * 24 * 60 * 60 * 1000)).toISOString(),
        updatedBy: "Design User"
      },
      {
        id: uuidv4(),
        department: "Prepress",
        status: "Preparing files",
        timestamp: new Date(Date.now() - (1 * 24 * 60 * 60 * 1000)).toISOString(),
        updatedBy: "Prepress User"
      }
    ],
    paymentHistory: [{
      id: uuidv4(),
      amount: 25000,
      date: new Date(Date.now() - (5 * 24 * 60 * 60 * 1000)).toISOString(),
      method: "Bank Transfer",
    }],
    prepressStatus: "Waiting for approval",
    prepressRemarks: "Need approval on the proofs before sending to production",
  };
  
  orders.push(approvalNeededOrder);
  orders.push(prepressApprovalOrder);
  
  return orders;
};
