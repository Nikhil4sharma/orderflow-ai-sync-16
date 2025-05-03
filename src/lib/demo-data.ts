
import { Department, DispatchDetails, Notification, Order, OrderStatus, PaymentRecord, PaymentStatus, ProductStatus, StatusType, StatusUpdate, User } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { addDays, format, parseISO, subDays } from "date-fns";

// Create mock users
export const users: User[] = [
  {
    id: "user-1",
    name: "Admin User",
    email: "admin@example.com",
    department: "Sales",
    role: "Admin",
    permissions: ["view_orders", "create_orders", "update_orders", "delete_orders", "manage_users", "view_reports", "export_data"]
  },
  {
    id: "user-2",
    name: "Sales User",
    email: "sales@example.com",
    department: "Sales",
    role: "Manager",
    permissions: ["view_orders", "create_orders", "update_orders", "view_address_details"]
  },
  {
    id: "user-3",
    name: "Design User",
    email: "design@example.com",
    department: "Design",
    role: "User",
    permissions: ["view_orders", "update_order_status"]
  },
  {
    id: "user-4",
    name: "Prepress User",
    email: "prepress@example.com",
    department: "Prepress",
    role: "User",
    permissions: ["view_orders", "update_order_status"]
  },
  {
    id: "user-5",
    name: "Production User",
    email: "production@example.com",
    department: "Production",
    role: "User",
    permissions: ["view_orders", "update_order_status"]
  }
];

// Helper function to create a status history entry
const createStatusEntry = (orderId: string, department: Department, status: string, remarks: string, date: Date, updatedBy: string): StatusUpdate => {
  return {
    id: uuidv4(),
    orderId,
    department,
    status,
    remarks,
    timestamp: date.toISOString(),
    updatedBy
  };
};

// Helper function to generate a notification
export const generateNotification = (order: Order): Notification => {
  const notificationType = order.designStatus === "Pending Feedback from Sales Team" 
    ? "approval_request" 
    : order.prepressStatus === "Waiting for approval" 
    ? "approval_request"
    : "status_update";

  const title = notificationType === "approval_request" 
    ? "Approval Required"
    : "Status Update";

  const message = notificationType === "approval_request"
    ? `Order ${order.orderNumber} requires your approval`
    : `Order ${order.orderNumber} status has been updated to ${order.status}`;

  return {
    id: uuidv4(),
    title,
    message,
    timestamp: new Date().toISOString(),
    isRead: false,
    type: notificationType,
    orderId: order.id,
    forDepartments: ["Sales", "Admin"]
  };
};

// Generate demo orders based on the screenshot
export const getDemoOrders = (): Order[] => {
  const orders: Order[] = [
    {
      id: "order-1",
      orderNumber: "Order #52041",
      clientName: "United MSG",
      amount: 2077,
      paidAmount: 2077,
      pendingAmount: 0,
      items: ["Quick Cards"],
      productStatus: [
        {
          id: uuidv4(),
          name: "Quick Cards",
          status: "completed"
        }
      ],
      createdAt: new Date(2025, 3, 1).toISOString(), // April 1, 2025
      status: "Completed",
      currentDepartment: "Sales",
      paymentStatus: "Paid",
      statusHistory: [
        createStatusEntry("order-1", "Sales", "In Progress", "Order created", new Date(2025, 3, 1), "Sales User"),
        createStatusEntry("order-1", "Design", "Working on it", "Started designing", new Date(2025, 3, 1), "Design User"),
        createStatusEntry("order-1", "Design", "Forwarded to Prepress", "Design completed", new Date(2025, 3, 2), "Design User"),
        createStatusEntry("order-1", "Prepress", "Forwarded to production", "Prepress work done", new Date(2025, 3, 2), "Prepress User"),
        createStatusEntry("order-1", "Production", "Completed", "Production completed", new Date(2025, 3, 3), "Production User")
      ]
    },
    {
      id: "order-2",
      orderNumber: "Order #52045",
      clientName: "Poonam Patel",
      amount: 1238,
      paidAmount: 1238,
      pendingAmount: 0,
      items: ["NFC Card"],
      productStatus: [
        {
          id: uuidv4(),
          name: "NFC Card",
          status: "completed"
        }
      ],
      createdAt: new Date(2025, 3, 2).toISOString(), // April 2, 2025
      status: "Completed",
      currentDepartment: "Sales",
      paymentStatus: "Paid",
      statusHistory: [
        createStatusEntry("order-2", "Sales", "In Progress", "Order created", new Date(2025, 3, 2), "Sales User"),
        createStatusEntry("order-2", "Design", "Completed", "Design finished", new Date(2025, 3, 3), "Design User"),
        createStatusEntry("order-2", "Production", "Completed", "Production finished", new Date(2025, 3, 4), "Production User")
      ]
    },
    {
      id: "order-3",
      orderNumber: "Order #52054",
      clientName: "Art Muse",
      amount: 92294,
      paidAmount: 0,
      pendingAmount: 92294,
      items: ["Letterhead+ Biz Card EP+Envelopes"],
      productStatus: [
        {
          id: uuidv4(),
          name: "Letterhead",
          status: "processing"
        },
        {
          id: uuidv4(),
          name: "Business Card",
          status: "processing"
        },
        {
          id: uuidv4(),
          name: "Envelopes",
          status: "processing"
        }
      ],
      createdAt: new Date(2025, 3, 5).toISOString(), // April 5, 2025
      status: "In Progress",
      currentDepartment: "Design",
      paymentStatus: "Not Paid",
      statusHistory: [
        createStatusEntry("order-3", "Sales", "In Progress", "Order created", new Date(2025, 3, 5), "Sales User"),
        createStatusEntry("order-3", "Design", "Working on it", "Design started", new Date(2025, 3, 6), "Design User")
      ]
    },
    {
      id: "order-4",
      orderNumber: "Order #52059",
      clientName: "Raghav",
      amount: 2950,
      paidAmount: 2950,
      pendingAmount: 0,
      items: ["Biz Card Design"],
      productStatus: [
        {
          id: uuidv4(),
          name: "Biz Card Design",
          status: "completed"
        }
      ],
      createdAt: new Date(2025, 3, 8).toISOString(), // April 8, 2025
      status: "Completed",
      currentDepartment: "Sales",
      paymentStatus: "Paid",
      statusHistory: [
        createStatusEntry("order-4", "Sales", "In Progress", "Order created with GST: 07AAQFM7949A1ZY", new Date(2025, 3, 8), "Sales User"),
        createStatusEntry("order-4", "Design", "Completed", "Design finished", new Date(2025, 3, 9), "Design User"),
        createStatusEntry("order-4", "Sales", "Completed", "Order completed", new Date(2025, 3, 10), "Sales User")
      ]
    },
    {
      id: "order-5",
      orderNumber: "Order #52064",
      clientName: "Palak",
      amount: 979,
      paidAmount: 979,
      pendingAmount: 0,
      items: ["Sample Kit"],
      productStatus: [
        {
          id: uuidv4(),
          name: "Sample Kit",
          status: "completed"
        }
      ],
      createdAt: new Date(2025, 3, 8).toISOString(), // April 8, 2025
      status: "Completed",
      currentDepartment: "Sales",
      paymentStatus: "Paid",
      statusHistory: [
        createStatusEntry("order-5", "Sales", "In Progress", "Order created with GST: 07AAECN1867B1ZO", new Date(2025, 3, 8), "Sales User"),
        createStatusEntry("order-5", "Production", "Completed", "Sample kit prepared", new Date(2025, 3, 9), "Production User")
      ]
    },
    {
      id: "order-6",
      orderNumber: "Order #52085",
      clientName: "Sameer Abrol",
      amount: 170741,
      paidAmount: 50000,
      pendingAmount: 120741,
      items: ["Metal Cards+Letterhead+Envelope+Design+Business Card + Pouch"],
      productStatus: [
        {
          id: uuidv4(),
          name: "Metal Cards",
          status: "processing"
        },
        {
          id: uuidv4(),
          name: "Letterhead",
          status: "processing"
        },
        {
          id: uuidv4(),
          name: "Envelope Design",
          status: "processing"
        },
        {
          id: uuidv4(),
          name: "Business Card",
          status: "processing"
        },
        {
          id: uuidv4(),
          name: "Pouch",
          status: "processing"
        }
      ],
      createdAt: new Date(2025, 3, 10).toISOString(), // April 10, 2025
      status: "In Progress",
      currentDepartment: "Design",
      paymentStatus: "Partial",
      statusHistory: [
        createStatusEntry("order-6", "Sales", "In Progress", "Order created with 5% prepayment", new Date(2025, 3, 10), "Sales User"),
        createStatusEntry("order-6", "Design", "Working on it", "Starting on designs", new Date(2025, 3, 11), "Design User")
      ],
      paymentHistory: [
        {
          id: uuidv4(),
          amount: 50000,
          date: new Date(2025, 3, 10).toISOString(),
          method: "Bank Transfer"
        }
      ]
    }
  ];
  
  // Add more orders from the screenshot
  const additionalOrders = [
    {
      orderNumber: "Order #52071",
      clientName: "Yashaswi Academy For Skills",
      amount: 859,
      date: new Date(2025, 3, 11), // April 11, 2025
      product: "Sample Kit",
      status: "Completed",
      paid: true
    },
    {
      orderNumber: "Order #52072",
      clientName: "Jitendra Dhanjani",
      amount: 5308,
      date: new Date(2025, 3, 12), // April 12, 2025
      product: "Sample Kit + Stationary Design",
      status: "In Progress",
      paid: true,
      remarks: "Sample Kit Dispatched"
    },
    {
      orderNumber: "Order #52182",
      clientName: "Dipankar",
      amount: 1827,
      date: new Date(2025, 3, 17), // April 17, 2025
      product: "NFC Card",
      status: "Completed",
      paid: true
    },
    {
      orderNumber: "Order #52183",
      clientName: "DRANDING CONSULTING PRIVATE LIMITED",
      amount: 1827,
      date: new Date(2025, 3, 17), // April 17, 2025
      product: "NFC Card",
      status: "Completed",
      paid: true
    },
    {
      orderNumber: "Order #52188",
      clientName: "Ravi Kant",
      amount: 13125,
      date: new Date(2025, 3, 18), // April 18, 2025
      product: "Ep Card",
      status: "Completed",
      paid: true
    },
    {
      orderNumber: "Order #52190",
      clientName: "Poonam Patel",
      amount: 1355,
      date: new Date(2025, 3, 18), // April 18, 2025
      product: "NFC Card",
      status: "Completed",
      paid: true
    },
    {
      orderNumber: "Order #52214",
      clientName: "Dr. Yashwant",
      amount: 2950,
      date: new Date(2025, 3, 24), // April 24, 2025
      product: "Business Card Design",
      status: "In Progress",
      paid: true
    },
    {
      orderNumber: "Order #52217",
      clientName: "MNRS",
      amount: 844,
      date: new Date(2025, 3, 24), // April 24, 2025
      product: "Matt Biz Card",
      status: "Completed",
      paid: true
    },
    {
      orderNumber: "Order #52211",
      clientName: "Harinder Singh",
      amount: 689,
      date: new Date(2025, 3, 25), // April 25, 2025
      product: "Sample Kit",
      status: "Completed",
      paid: true
    },
    {
      orderNumber: "Order #52227",
      clientName: "Raghav",
      amount: 844,
      date: new Date(2025, 3, 28), // April 28, 2025
      product: "Matt Biz Card",
      status: "Completed",
      paid: true
    },
    {
      orderNumber: "Order #52229",
      clientName: "Swati",
      amount: 19205,
      date: new Date(2025, 3, 28), // April 28, 2025
      product: "Foiling Biz Card",
      status: "In Progress",
      paid: true
    },
    {
      orderNumber: "Order #52239",
      clientName: "Nikhil",
      amount: 4129,
      date: new Date(2025, 3, 29), // April 29, 2025
      product: "Metal NFC Card",
      status: "Completed",
      paid: true,
      gst: "06AKCT1052C1ZR"
    }
  ];

  // Convert the additional orders to the proper format and add them
  additionalOrders.forEach((item, index) => {
    const orderStatus: OrderStatus = item.status === "Completed" ? "Completed" : "In Progress";
    const paymentStatus: PaymentStatus = item.paid ? "Paid" : "Not Paid";
    
    orders.push({
      id: `order-${orders.length + index + 1}`,
      orderNumber: item.orderNumber,
      clientName: item.clientName,
      amount: item.amount,
      paidAmount: item.paid ? item.amount : 0,
      pendingAmount: item.paid ? 0 : item.amount,
      items: [item.product],
      productStatus: [
        {
          id: uuidv4(),
          name: item.product,
          status: orderStatus === "Completed" ? "completed" as StatusType : "processing" as StatusType
        }
      ],
      createdAt: item.date.toISOString(),
      status: orderStatus,
      currentDepartment: orderStatus === "Completed" ? "Sales" : "Design",
      paymentStatus: paymentStatus,
      statusHistory: [
        createStatusEntry(
          `order-${orders.length + index + 1}`, 
          "Sales", 
          "In Progress", 
          `Order created${item.gst ? ` with GST: ${item.gst}` : ""}`, 
          new Date(item.date), 
          "Sales User"
        )
      ],
      remarks: item.remarks
    });
  });

  return orders;
};
