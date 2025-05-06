
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

// Generate real-world orders based on the provided table
export const getDemoOrders = (): Order[] => {
  // Create orders from the provided data table
  const tableDemoOrders: Order[] = [
    // April 1, 2025 - United MSG - Quick Cards
    {
      id: uuidv4(),
      orderNumber: "Order #52041",
      clientName: "United MSG",
      amount: 2077,
      paidAmount: 2077,
      pendingAmount: 0,
      items: ["Quick Cards"],
      createdAt: new Date(2025, 3, 1).toISOString(),
      status: "Completed" as OrderStatus,
      currentDepartment: "Sales",
      paymentStatus: "Paid" as PaymentStatus,
      statusHistory: [
        {
          id: uuidv4(),
          orderId: "",
          department: "Sales",
          status: "New",
          timestamp: new Date(2025, 3, 1).toISOString(),
          updatedBy: "Sales User"
        },
        {
          id: uuidv4(),
          orderId: "",
          department: "Production",
          status: "In Progress",
          timestamp: new Date(2025, 3, 2).toISOString(),
          updatedBy: "Production User"
        },
        {
          id: uuidv4(),
          orderId: "",
          department: "Production",
          status: "Completed",
          timestamp: new Date(2025, 3, 3).toISOString(),
          updatedBy: "Production User"
        }
      ],
      productStatus: [
        {
          id: uuidv4(),
          name: "Quick Cards",
          status: "completed",
          remarks: "Completed on time"
        }
      ]
    },
    // April 2, 2025 - Poonam Patel - NFC Card
    {
      id: uuidv4(),
      orderNumber: "Order #52045",
      clientName: "Poonam Patel",
      amount: 1238,
      paidAmount: 1238,
      pendingAmount: 0,
      items: ["NFC Card"],
      createdAt: new Date(2025, 3, 2).toISOString(),
      status: "Completed" as OrderStatus,
      currentDepartment: "Production",
      paymentStatus: "Paid" as PaymentStatus,
      statusHistory: [
        {
          id: uuidv4(),
          orderId: "",
          department: "Sales",
          status: "New",
          timestamp: new Date(2025, 3, 2).toISOString(),
          updatedBy: "Sales User"
        },
        {
          id: uuidv4(),
          orderId: "",
          department: "Production",
          status: "Completed",
          timestamp: new Date(2025, 3, 4).toISOString(),
          updatedBy: "Production User"
        }
      ],
      productStatus: [
        {
          id: uuidv4(),
          name: "NFC Card",
          status: "completed",
        }
      ]
    },
    // April 5, 2025 - Art Muse - Letterhead+ Biz Card EP+Envelopes
    {
      id: uuidv4(),
      orderNumber: "Order #52054",
      clientName: "Art Muse",
      amount: 92294,
      paidAmount: 92294,
      pendingAmount: 0,
      items: ["Letterhead", "Business Card", "Envelopes"],
      createdAt: new Date(2025, 3, 5).toISOString(),
      status: "In Progress" as OrderStatus,
      currentDepartment: "Design",
      paymentStatus: "Paid" as PaymentStatus,
      statusHistory: [
        {
          id: uuidv4(),
          orderId: "",
          department: "Sales",
          status: "New",
          timestamp: new Date(2025, 3, 5).toISOString(),
          updatedBy: "Sales User"
        },
        {
          id: uuidv4(),
          orderId: "",
          department: "Design",
          status: "In Progress",
          timestamp: new Date(2025, 3, 7).toISOString(),
          updatedBy: "Design User"
        }
      ],
      productStatus: [
        {
          id: uuidv4(),
          name: "Letterhead",
          status: "processing",
        },
        {
          id: uuidv4(),
          name: "Business Card",
          status: "processing",
        },
        {
          id: uuidv4(),
          name: "Envelopes",
          status: "processing",
        }
      ],
      designStatus: "Working on it",
      designRemarks: "Client requested premium paper and embossed elements"
    },
    // April 8, 2025 - Raghav - Biz Card Design
    {
      id: uuidv4(),
      orderNumber: "Order #52059",
      clientName: "Raghav",
      amount: 2950,
      paidAmount: 2950,
      pendingAmount: 0,
      items: ["Biz Card Design"],
      createdAt: new Date(2025, 3, 8).toISOString(),
      status: "Completed" as OrderStatus,
      currentDepartment: "Design",
      paymentStatus: "Paid" as PaymentStatus,
      statusHistory: [
        {
          id: uuidv4(),
          orderId: "",
          department: "Sales",
          status: "New",
          timestamp: new Date(2025, 3, 8).toISOString(),
          updatedBy: "Sales User"
        },
        {
          id: uuidv4(),
          orderId: "",
          department: "Design",
          status: "In Progress",
          timestamp: new Date(2025, 3, 9).toISOString(),
          updatedBy: "Design User"
        },
        {
          id: uuidv4(),
          orderId: "",
          department: "Design",
          status: "Completed",
          timestamp: new Date(2025, 3, 10).toISOString(),
          updatedBy: "Design User"
        }
      ],
      productStatus: [
        {
          id: uuidv4(),
          name: "Biz Card Design",
          status: "completed",
        }
      ]
    },
    // April 8, 2025 - Palak - Sample Kit
    {
      id: uuidv4(),
      orderNumber: "Order #52064",
      clientName: "Palak",
      amount: 979,
      paidAmount: 979,
      pendingAmount: 0,
      items: ["Sample Kit"],
      createdAt: new Date(2025, 3, 8).toISOString(),
      status: "Completed" as OrderStatus,
      currentDepartment: "Sales",
      paymentStatus: "Paid" as PaymentStatus,
      statusHistory: [
        {
          id: uuidv4(),
          orderId: "",
          department: "Sales",
          status: "New",
          timestamp: new Date(2025, 3, 8).toISOString(),
          updatedBy: "Sales User"
        },
        {
          id: uuidv4(),
          orderId: "",
          department: "Production",
          status: "Completed",
          timestamp: new Date(2025, 3, 9).toISOString(),
          updatedBy: "Production User"
        }
      ],
      productStatus: [
        {
          id: uuidv4(),
          name: "Sample Kit",
          status: "completed",
        }
      ]
    },
    // April 10, 2025 - Sameer Abrol - Metal Cards+Letterhead+Envelope+Design+Business Card + Pouch
    {
      id: uuidv4(),
      orderNumber: "Order #52085",
      clientName: "Sameer Abrol",
      amount: 170741,
      paidAmount: 50000,
      pendingAmount: 120741,
      items: ["Metal Cards", "Letterhead", "Envelope", "Business Card", "Pouch"],
      createdAt: new Date(2025, 3, 10).toISOString(),
      status: "In Progress" as OrderStatus,
      currentDepartment: "Prepress",
      paymentStatus: "Partial" as PaymentStatus,
      statusHistory: [
        {
          id: uuidv4(),
          orderId: "",
          department: "Sales",
          status: "New",
          timestamp: new Date(2025, 3, 10).toISOString(),
          updatedBy: "Sales User"
        },
        {
          id: uuidv4(),
          orderId: "",
          department: "Design",
          status: "In Progress",
          timestamp: new Date(2025, 3, 12).toISOString(),
          updatedBy: "Design User"
        },
        {
          id: uuidv4(),
          orderId: "",
          department: "Design",
          status: "Completed",
          timestamp: new Date(2025, 3, 15).toISOString(),
          updatedBy: "Design User"
        },
        {
          id: uuidv4(),
          orderId: "",
          department: "Prepress",
          status: "In Progress",
          timestamp: new Date(2025, 3, 16).toISOString(),
          updatedBy: "Prepress User"
        }
      ],
      productStatus: [
        {
          id: uuidv4(),
          name: "Metal Cards",
          status: "processing",
        },
        {
          id: uuidv4(),
          name: "Letterhead",
          status: "processing",
        },
        {
          id: uuidv4(),
          name: "Envelope",
          status: "processing",
        },
        {
          id: uuidv4(),
          name: "Business Card",
          status: "processing",
        },
        {
          id: uuidv4(),
          name: "Pouch",
          status: "processing",
        }
      ],
      prepressStatus: "Working on it",
      prepressRemarks: "Premium quality metal cards require special preparation"
    },
    // April 24, 2025 - Dr. Yashwant - Business Card Design
    {
      id: uuidv4(),
      orderNumber: "Order #52214",
      clientName: "Dr. Yashwant",
      amount: 2950,
      paidAmount: 2950,
      pendingAmount: 0,
      items: ["Business Card Design"],
      createdAt: new Date(2025, 3, 24).toISOString(),
      status: "In Progress" as OrderStatus,
      currentDepartment: "Design",
      paymentStatus: "Paid" as PaymentStatus,
      statusHistory: [
        {
          id: uuidv4(),
          orderId: "",
          department: "Sales",
          status: "New",
          timestamp: new Date(2025, 3, 24).toISOString(),
          updatedBy: "Sales User"
        },
        {
          id: uuidv4(),
          orderId: "",
          department: "Design",
          status: "In Progress",
          timestamp: new Date(2025, 3, 25).toISOString(),
          updatedBy: "Design User"
        }
      ],
      productStatus: [
        {
          id: uuidv4(),
          name: "Business Card Design",
          status: "processing",
        }
      ],
      designStatus: "Working on it",
      designRemarks: "Professional medical theme requested"
    },
    // April 28, 2025 - Swati - Foiling Biz Card
    {
      id: uuidv4(),
      orderNumber: "Order #52229",
      clientName: "Swati",
      amount: 19205,
      paidAmount: 19205,
      pendingAmount: 0,
      items: ["Foiling Biz Card"],
      createdAt: new Date(2025, 3, 28).toISOString(),
      status: "In Progress" as OrderStatus,
      currentDepartment: "Production",
      paymentStatus: "Paid" as PaymentStatus,
      statusHistory: [
        {
          id: uuidv4(),
          orderId: "",
          department: "Sales",
          status: "New",
          timestamp: new Date(2025, 3, 28).toISOString(),
          updatedBy: "Sales User"
        },
        {
          id: uuidv4(),
          orderId: "",
          department: "Design",
          status: "Completed",
          timestamp: new Date(2025, 3, 29).toISOString(),
          updatedBy: "Design User"
        },
        {
          id: uuidv4(),
          orderId: "",
          department: "Prepress",
          status: "Completed",
          timestamp: new Date(2025, 3, 30).toISOString(),
          updatedBy: "Prepress User"
        },
        {
          id: uuidv4(),
          orderId: "",
          department: "Production",
          status: "In Progress",
          timestamp: new Date(2025, 4, 1).toISOString(),
          updatedBy: "Production User"
        }
      ],
      productStatus: [
        {
          id: uuidv4(),
          name: "Foiling Biz Card",
          status: "processing",
        }
      ],
      productionStages: [
        {
          stage: "Printing" as any,
          status: "completed",
          timeline: new Date(2025, 4, 2).toISOString()
        },
        {
          stage: "Foiling" as any,
          status: "processing",
          timeline: new Date(2025, 4, 3).toISOString(),
          remarks: "3540+amount for block and QR"
        },
        {
          stage: "Cutting" as any,
          status: "processing",
          timeline: new Date(2025, 4, 4).toISOString()
        },
      ],
    },
    // April 30, 2025 - Shaguna Khetamal - Letterheads
    {
      id: uuidv4(),
      orderNumber: "Order #52240",
      clientName: "Shaguna Khetamal",
      amount: 17700,
      paidAmount: 17700,
      pendingAmount: 0,
      items: ["Letterheads"],
      createdAt: new Date(2025, 3, 30).toISOString(),
      status: "In Progress" as OrderStatus,
      currentDepartment: "Prepress",
      paymentStatus: "Paid" as PaymentStatus,
      statusHistory: [
        {
          id: uuidv4(),
          orderId: "",
          department: "Sales",
          status: "New",
          timestamp: new Date(2025, 3, 30).toISOString(),
          updatedBy: "Sales User"
        },
        {
          id: uuidv4(),
          orderId: "",
          department: "Design",
          status: "Completed",
          timestamp: new Date(2025, 4, 1).toISOString(),
          updatedBy: "Design User"
        },
        {
          id: uuidv4(),
          orderId: "",
          department: "Prepress",
          status: "In Progress",
          timestamp: new Date(2025, 4, 2).toISOString(),
          updatedBy: "Prepress User"
        }
      ],
      productStatus: [
        {
          id: uuidv4(),
          name: "Letterheads",
          status: "processing",
        }
      ],
      prepressStatus: "Working on it",
      prepressRemarks: "Premium quality letterheads require special preparation"
    },
    // April 12, 2025 - Jitendra Dhanjani - Sample Kit + Stationary Design
    {
      id: uuidv4(),
      orderNumber: "Order #52072",
      clientName: "Jitendra Dhanjani",
      amount: 5308,
      paidAmount: 5308,
      pendingAmount: 0,
      items: ["Sample Kit", "Stationary Design"],
      createdAt: new Date(2025, 3, 12).toISOString(),
      status: "In Progress" as OrderStatus,
      currentDepartment: "Production",
      paymentStatus: "Paid" as PaymentStatus,
      statusHistory: [
        {
          id: uuidv4(),
          orderId: "",
          department: "Sales",
          status: "New",
          timestamp: new Date(2025, 3, 12).toISOString(),
          updatedBy: "Sales User"
        },
        {
          id: uuidv4(),
          orderId: "",
          department: "Design",
          status: "Completed",
          timestamp: new Date(2025, 3, 14).toISOString(),
          updatedBy: "Design User"
        },
        {
          id: uuidv4(),
          orderId: "",
          department: "Production",
          status: "In Progress",
          timestamp: new Date(2025, 3, 16).toISOString(),
          updatedBy: "Production User"
        }
      ],
      productStatus: [
        {
          id: uuidv4(),
          name: "Sample Kit",
          status: "completed",
          remarks: "Sample Kit Dispatched"
        },
        {
          id: uuidv4(),
          name: "Stationary Design",
          status: "processing",
        }
      ],
      productionStages: [
        {
          stage: "Printing" as any,
          status: "completed",
          timeline: new Date(2025, 3, 17).toISOString()
        },
        {
          stage: "Cutting" as any,
          status: "processing",
          timeline: new Date(2025, 3, 18).toISOString()
        },
      ],
    }
  ];
  
  // Add previous demo orders for variety
  const orders = [...tableDemoOrders];
  
  // Add a prepress order that needs approval
  const prepressApprovalOrder: Order = {
    id: uuidv4(),
    orderNumber: "Order #52299",
    clientName: "Prepress Approval Client",
    amount: 25000,
    paidAmount: 25000,
    pendingAmount: 0,
    items: ["Packaging Boxes"],
    createdAt: new Date().toISOString(),
    status: "In Progress" as OrderStatus,
    currentDepartment: "Prepress",
    paymentStatus: "Paid" as PaymentStatus,
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
        orderId: "",
        department: "Sales",
        status: "New",
        timestamp: new Date(Date.now() - (5 * 24 * 60 * 60 * 1000)).toISOString(),
        updatedBy: "Sales User"
      },
      {
        id: uuidv4(),
        orderId: "",
        department: "Design",
        status: "Design Completed",
        timestamp: new Date(Date.now() - (2 * 24 * 60 * 60 * 1000)).toISOString(),
        updatedBy: "Design User"
      },
      {
        id: uuidv4(),
        orderId: "",
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
  
  orders.push(prepressApprovalOrder);
  
  // Fix IDs for status history
  orders.forEach(order => {
    order.statusHistory.forEach(status => {
      if (!status.orderId) {
        status.orderId = order.id;
      }
    });
  });
  
  return orders;
};
