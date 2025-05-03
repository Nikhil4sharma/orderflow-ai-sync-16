
import { 
  Department, 
  DesignStatus, 
  Order, 
  OrderStatus, 
  PaymentStatus, 
  PrepressStatus, 
  ProductStatus, 
  ProductionStageStatus, 
  StatusUpdate 
} from "@/types";
import { generateId } from "./utils";

// Helper function to create a timestamp for a specified number of days ago
const daysAgo = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
};

// Helper function to create a status update
const createStatusUpdate = (
  orderId: string,
  department: Department,
  status: string,
  updatedBy: string,
  daysBack: number,
  remarks?: string
): StatusUpdate => {
  return {
    id: generateId(),
    orderId,
    department,
    status,
    updatedBy,
    timestamp: daysAgo(daysBack),
    remarks
  };
};

// Generate demo orders that showcase different stages of the workflow
export const getDemoOrders = (): Order[] => {
  return [
    // Order 1: New order in Sales department
    {
      id: "ord-001",
      orderNumber: "ORD-20250501-001",
      clientName: "Rajesh Enterprises",
      amount: 25000,
      paidAmount: 12500,
      pendingAmount: 12500,
      paymentStatus: "Partial" as PaymentStatus,
      items: ["Business Cards", "Letterheads"],
      createdAt: daysAgo(1),
      status: "In Progress" as OrderStatus,
      currentDepartment: "Sales",
      statusHistory: [
        createStatusUpdate("ord-001", "Sales", "In Progress", "Admin User", 1, "New order created")
      ],
      paymentHistory: [
        {
          id: generateId(),
          amount: 12500,
          date: daysAgo(1),
          method: "Bank Transfer",
          remarks: "50% advance payment"
        }
      ],
      deliveryAddress: "123 Main Street, Mumbai, Maharashtra 400001",
      contactNumber: "+91 98765 43210",
      productStatus: [
        {
          id: generateId(),
          name: "Business Cards",
          status: "processing",
          assignedDepartment: "Sales"
        },
        {
          id: generateId(),
          name: "Letterheads",
          status: "processing",
          assignedDepartment: "Sales"
        }
      ]
    },
    
    // Order 2: Order in Design department with "Working on it" status
    {
      id: "ord-002",
      orderNumber: "ORD-20250429-002",
      clientName: "Mehta Enterprises",
      amount: 35000,
      paidAmount: 17500,
      pendingAmount: 17500,
      paymentStatus: "Partial" as PaymentStatus,
      items: ["Brochures", "Flyers"],
      createdAt: daysAgo(3),
      status: "In Progress" as OrderStatus,
      currentDepartment: "Design",
      designStatus: "Working on it" as DesignStatus,
      designRemarks: "Creating initial mockups",
      designTimeline: daysAgo(-2), // 2 days in the future
      statusHistory: [
        createStatusUpdate("ord-002", "Sales", "In Progress", "Admin User", 3, "New order created"),
        createStatusUpdate("ord-002", "Sales", "Forwarded to Design", "Sales Manager", 2, "Order details sent to design team"),
        createStatusUpdate("ord-002", "Design", "Working on it", "Design Team", 2, "Starting design work")
      ],
      paymentHistory: [
        {
          id: generateId(),
          amount: 17500,
          date: daysAgo(3),
          method: "Credit Card",
          remarks: "50% advance payment"
        }
      ],
      productStatus: [
        {
          id: generateId(),
          name: "Brochures",
          status: "processing",
          remarks: "Working on initial design",
          assignedDepartment: "Design"
        },
        {
          id: generateId(),
          name: "Flyers",
          status: "processing",
          remarks: "Will start after brochure design",
          assignedDepartment: "Design"
        }
      ]
    },
    
    // Order 3: Order in Design department with "Pending Feedback from Sales Team" status
    {
      id: "ord-003",
      orderNumber: "ORD-20250428-003",
      clientName: "Global Solutions",
      amount: 45000,
      paidAmount: 45000,
      pendingAmount: 0,
      paymentStatus: "Paid" as PaymentStatus,
      items: ["Company Profile", "Product Catalog"],
      createdAt: daysAgo(5),
      status: "In Progress" as OrderStatus,
      currentDepartment: "Design",
      designStatus: "Pending Feedback from Sales Team" as DesignStatus,
      designRemarks: "Initial designs created, awaiting feedback",
      designTimeline: daysAgo(-1), // 1 day in the future
      statusHistory: [
        createStatusUpdate("ord-003", "Sales", "In Progress", "Admin User", 5, "New order created"),
        createStatusUpdate("ord-003", "Sales", "Forwarded to Design", "Admin User", 4, "Order details sent to design team"),
        createStatusUpdate("ord-003", "Design", "Working on it", "Design Team", 4, "Starting design work"),
        createStatusUpdate("ord-003", "Design", "Pending Feedback from Sales Team", "Design Team", 2, "Initial designs ready for review")
      ],
      paymentHistory: [
        {
          id: generateId(),
          amount: 45000,
          date: daysAgo(5),
          method: "Bank Transfer",
          remarks: "Full payment received"
        }
      ],
      productStatus: [
        {
          id: generateId(),
          name: "Company Profile",
          status: "processing",
          remarks: "Initial design complete, awaiting feedback",
          assignedDepartment: "Design"
        },
        {
          id: generateId(),
          name: "Product Catalog",
          status: "processing",
          remarks: "Initial layouts created",
          assignedDepartment: "Design"
        }
      ]
    },
    
    // Order 4: Order in Prepress department with "Waiting for approval" status
    {
      id: "ord-004",
      orderNumber: "ORD-20250425-004",
      clientName: "Patel Industries",
      amount: 28000,
      paidAmount: 28000,
      pendingAmount: 0,
      paymentStatus: "Paid" as PaymentStatus,
      items: ["Labels", "Packaging"],
      createdAt: daysAgo(8),
      status: "In Progress" as OrderStatus,
      currentDepartment: "Prepress",
      prepressStatus: "Waiting for approval" as PrepressStatus,
      prepressRemarks: "Files prepared for printing, awaiting final approval",
      statusHistory: [
        createStatusUpdate("ord-004", "Sales", "In Progress", "Sales Manager", 8, "New order created"),
        createStatusUpdate("ord-004", "Sales", "Forwarded to Design", "Sales Manager", 7, "Order details sent to design team"),
        createStatusUpdate("ord-004", "Design", "Working on it", "Design Team", 7, "Starting design work"),
        createStatusUpdate("ord-004", "Design", "Pending Feedback from Sales Team", "Design Team", 6, "Initial designs ready for review"),
        createStatusUpdate("ord-004", "Design", "Working on it", "Design Team", 5, "Incorporating feedback"),
        createStatusUpdate("ord-004", "Design", "Forwarded to Prepress", "Design Team", 3, "Final designs ready for prepress"),
        createStatusUpdate("ord-004", "Prepress", "Working on it", "Prepress Team", 2, "Preparing files for production"),
        createStatusUpdate("ord-004", "Prepress", "Waiting for approval", "Prepress Team", 1, "Files ready for final approval")
      ],
      paymentHistory: [
        {
          id: generateId(),
          amount: 28000,
          date: daysAgo(8),
          method: "Bank Transfer",
          remarks: "Full payment received"
        }
      ],
      productStatus: [
        {
          id: generateId(),
          name: "Labels",
          status: "completed",
          remarks: "Ready for production",
          assignedDepartment: "Prepress"
        },
        {
          id: generateId(),
          name: "Packaging",
          status: "processing",
          remarks: "Final adjustments in progress",
          assignedDepartment: "Prepress"
        }
      ]
    },
    
    // Order 5: Order in Production department with multiple production stages
    {
      id: "ord-005",
      orderNumber: "ORD-20250422-005",
      clientName: "Sharma & Sons",
      amount: 65000,
      paidAmount: 32500,
      pendingAmount: 32500,
      paymentStatus: "Partial" as PaymentStatus,
      items: ["Annual Reports", "Corporate Folders"],
      createdAt: daysAgo(12),
      status: "In Progress" as OrderStatus,
      currentDepartment: "Production",
      statusHistory: [
        createStatusUpdate("ord-005", "Sales", "In Progress", "Admin User", 12, "New order created"),
        createStatusUpdate("ord-005", "Sales", "Forwarded to Design", "Admin User", 11, "Order details sent to design team"),
        createStatusUpdate("ord-005", "Design", "Working on it", "Design Team", 10, "Starting design work"),
        createStatusUpdate("ord-005", "Design", "Forwarded to Prepress", "Design Team", 8, "Designs approved and forwarded"),
        createStatusUpdate("ord-005", "Prepress", "Working on it", "Prepress Team", 7, "Preparing files for production"),
        createStatusUpdate("ord-005", "Prepress", "Forwarded to production", "Prepress Team", 5, "Files ready for production"),
        createStatusUpdate("ord-005", "Production", "In Progress", "Production Team", 4, "Starting production process")
      ],
      productionStages: [
        {
          stage: "Printing",
          status: "completed",
          remarks: "Printing completed on schedule",
          timeline: daysAgo(2)
        },
        {
          stage: "Cutting",
          status: "processing",
          remarks: "In progress, slight delay due to machine maintenance",
          timeline: daysAgo(-1)
        },
        {
          stage: "Pasting",
          status: "processing",
          remarks: "Scheduled to start after cutting",
          timeline: daysAgo(-2)
        }
      ],
      paymentHistory: [
        {
          id: generateId(),
          amount: 32500,
          date: daysAgo(12),
          method: "Bank Transfer",
          remarks: "50% advance payment"
        }
      ],
      productStatus: [
        {
          id: generateId(),
          name: "Annual Reports",
          status: "processing",
          remarks: "In production",
          assignedDepartment: "Production"
        },
        {
          id: generateId(),
          name: "Corporate Folders",
          status: "processing",
          remarks: "In production",
          assignedDepartment: "Production"
        }
      ]
    },
    
    // Order 6: Order ready for dispatch
    {
      id: "ord-006",
      orderNumber: "ORD-20250418-006",
      clientName: "Kumar Exports",
      amount: 42000,
      paidAmount: 42000,
      pendingAmount: 0,
      paymentStatus: "Paid" as PaymentStatus,
      items: ["Product Boxes", "Shipping Labels"],
      createdAt: daysAgo(15),
      status: "Completed" as OrderStatus,
      currentDepartment: "Production",
      statusHistory: [
        createStatusUpdate("ord-006", "Sales", "In Progress", "Sales Manager", 15, "New order created"),
        createStatusUpdate("ord-006", "Sales", "Forwarded to Design", "Sales Manager", 14, "Order details sent to design team"),
        createStatusUpdate("ord-006", "Design", "Working on it", "Design Team", 13, "Starting design work"),
        createStatusUpdate("ord-006", "Design", "Forwarded to Prepress", "Design Team", 11, "Designs approved and forwarded"),
        createStatusUpdate("ord-006", "Prepress", "Working on it", "Prepress Team", 10, "Preparing files for production"),
        createStatusUpdate("ord-006", "Prepress", "Forwarded to production", "Prepress Team", 8, "Files ready for production"),
        createStatusUpdate("ord-006", "Production", "In Progress", "Production Team", 7, "Starting production process"),
        createStatusUpdate("ord-006", "Production", "Ready to Dispatch", "Production Team", 1, "Production completed, ready for dispatch")
      ],
      productionStages: [
        {
          stage: "Printing",
          status: "completed",
          remarks: "Completed",
          timeline: daysAgo(4)
        },
        {
          stage: "Cutting",
          status: "completed",
          remarks: "Completed",
          timeline: daysAgo(3)
        },
        {
          stage: "Quality Check",
          status: "completed",
          remarks: "All items passed quality check",
          timeline: daysAgo(1)
        },
        {
          stage: "Ready to Dispatch",
          status: "completed",
          remarks: "All items ready for dispatch",
          timeline: daysAgo(1)
        }
      ],
      paymentHistory: [
        {
          id: generateId(),
          amount: 21000,
          date: daysAgo(15),
          method: "Credit Card",
          remarks: "50% advance payment"
        },
        {
          id: generateId(),
          amount: 21000,
          date: daysAgo(2),
          method: "Bank Transfer",
          remarks: "Final payment"
        }
      ],
      productStatus: [
        {
          id: generateId(),
          name: "Product Boxes",
          status: "completed",
          remarks: "Ready for dispatch",
          assignedDepartment: "Production"
        },
        {
          id: generateId(),
          name: "Shipping Labels",
          status: "completed",
          remarks: "Ready for dispatch",
          assignedDepartment: "Production"
        }
      ]
    },
    
    // Order 7: Completed and dispatched order
    {
      id: "ord-007",
      orderNumber: "ORD-20250415-007",
      clientName: "Kapoor & Associates",
      amount: 18500,
      paidAmount: 18500,
      pendingAmount: 0,
      paymentStatus: "Paid" as PaymentStatus,
      items: ["Business Cards", "Presentation Folders"],
      createdAt: daysAgo(18),
      status: "Dispatched" as OrderStatus,
      currentDepartment: "Sales",
      statusHistory: [
        createStatusUpdate("ord-007", "Sales", "In Progress", "Admin User", 18, "New order created"),
        createStatusUpdate("ord-007", "Sales", "Forwarded to Design", "Admin User", 17, "Order details sent to design team"),
        createStatusUpdate("ord-007", "Design", "Working on it", "Design Team", 16, "Starting design work"),
        createStatusUpdate("ord-007", "Design", "Forwarded to Prepress", "Design Team", 14, "Designs approved and forwarded"),
        createStatusUpdate("ord-007", "Prepress", "Working on it", "Prepress Team", 13, "Preparing files for production"),
        createStatusUpdate("ord-007", "Prepress", "Forwarded to production", "Prepress Team", 11, "Files ready for production"),
        createStatusUpdate("ord-007", "Production", "In Progress", "Production Team", 10, "Starting production process"),
        createStatusUpdate("ord-007", "Production", "Ready to Dispatch", "Production Team", 5, "Production completed, ready for dispatch"),
        createStatusUpdate("ord-007", "Production", "Completed", "Production Team", 4, "All items ready for dispatch"),
        createStatusUpdate("ord-007", "Sales", "Verified", "Sales Manager", 3, "Order verified and ready for dispatch"),
        createStatusUpdate("ord-007", "Sales", "Dispatched", "Sales Manager", 2, "Order dispatched via DTDC")
      ],
      dispatchDetails: {
        address: "456 Park Avenue, Delhi, 110001",
        contactNumber: "+91 98765 12345",
        courierPartner: "DTDC",
        deliveryType: "Express",
        trackingNumber: "DTDC12345678",
        dispatchDate: daysAgo(2),
        verifiedBy: "Sales Manager"
      },
      paymentHistory: [
        {
          id: generateId(),
          amount: 18500,
          date: daysAgo(18),
          method: "Bank Transfer",
          remarks: "Full payment received"
        }
      ],
      productStatus: [
        {
          id: generateId(),
          name: "Business Cards",
          status: "completed",
          remarks: "Dispatched",
          assignedDepartment: "Sales"
        },
        {
          id: generateId(),
          name: "Presentation Folders",
          status: "completed",
          remarks: "Dispatched",
          assignedDepartment: "Sales"
        }
      ]
    },
    
    // Order 8: Order with an Issue in Production
    {
      id: "ord-008",
      orderNumber: "ORD-20250420-008",
      clientName: "Gupta Trading Co.",
      amount: 32000,
      paidAmount: 16000,
      pendingAmount: 16000,
      paymentStatus: "Partial" as PaymentStatus,
      items: ["Banners", "Standees"],
      createdAt: daysAgo(13),
      status: "Issue" as OrderStatus,
      currentDepartment: "Production",
      statusHistory: [
        createStatusUpdate("ord-008", "Sales", "In Progress", "Admin User", 13, "New order created"),
        createStatusUpdate("ord-008", "Sales", "Forwarded to Design", "Admin User", 12, "Order details sent to design team"),
        createStatusUpdate("ord-008", "Design", "Working on it", "Design Team", 11, "Starting design work"),
        createStatusUpdate("ord-008", "Design", "Forwarded to Prepress", "Design Team", 9, "Designs approved and forwarded"),
        createStatusUpdate("ord-008", "Prepress", "Working on it", "Prepress Team", 8, "Preparing files for production"),
        createStatusUpdate("ord-008", "Prepress", "Forwarded to production", "Prepress Team", 6, "Files ready for production"),
        createStatusUpdate("ord-008", "Production", "In Progress", "Production Team", 5, "Starting production process"),
        createStatusUpdate("ord-008", "Production", "Issue", "Production Team", 2, "Problem with printing equipment, order delayed")
      ],
      productionStages: [
        {
          stage: "Printing",
          status: "issue",
          remarks: "Issue with printing equipment, maintenance required",
          timeline: daysAgo(-3)
        }
      ],
      paymentHistory: [
        {
          id: generateId(),
          amount: 16000,
          date: daysAgo(13),
          method: "Credit Card",
          remarks: "50% advance payment"
        }
      ],
      productStatus: [
        {
          id: generateId(),
          name: "Banners",
          status: "issue",
          remarks: "Equipment issue causing delay",
          assignedDepartment: "Production"
        },
        {
          id: generateId(),
          name: "Standees",
          status: "processing",
          remarks: "Waiting for equipment repair",
          assignedDepartment: "Production"
        }
      ]
    }
  ];
};
