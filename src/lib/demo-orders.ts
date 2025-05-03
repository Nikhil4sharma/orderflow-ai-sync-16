
import { Order, OrderStatus, PaymentStatus } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { addDays, subDays, format } from "date-fns";

// Generate a random date between two dates
const randomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Generate demo orders
export const demoOrders: Order[] = [
  {
    id: "order-1",
    orderNumber: "ORD-2023-001",
    clientName: "Rajesh Industries",
    createdAt: subDays(new Date(), 15).toISOString(),
    status: "Completed" as OrderStatus,
    currentDepartment: "Production",
    items: ["Brochures", "Catalogs"],
    amount: 15000,
    paidAmount: 15000,
    pendingAmount: 0,
    paymentStatus: "Paid" as PaymentStatus,
    statusHistory: [
      {
        id: uuidv4(),
        orderId: "order-1",
        timestamp: subDays(new Date(), 15).toISOString(),
        department: "Sales",
        status: "New",
        remarks: "New order created",
        updatedBy: "Sales User"
      },
      {
        id: uuidv4(),
        orderId: "order-1",
        timestamp: subDays(new Date(), 14).toISOString(),
        department: "Design",
        status: "In Progress",
        remarks: "Design work started",
        updatedBy: "Design User"
      },
      {
        id: uuidv4(),
        orderId: "order-1",
        timestamp: subDays(new Date(), 10).toISOString(),
        department: "Production",
        status: "In Progress",
        remarks: "Production started",
        updatedBy: "Production User"
      },
      {
        id: uuidv4(),
        orderId: "order-1",
        timestamp: subDays(new Date(), 5).toISOString(),
        department: "Production",
        status: "Completed",
        remarks: "Order ready for dispatch",
        updatedBy: "Production User"
      }
    ],
    productStatus: [
      {
        id: "prod-1",
        name: "Brochures",
        status: "completed",
        remarks: "Printing completed with high-quality finish"
      },
      {
        id: "prod-2",
        name: "Catalogs",
        status: "completed",
        remarks: "All items packed and ready"
      }
    ]
  },
  {
    id: "order-2",
    orderNumber: "ORD-2023-002",
    clientName: "Global Tech Solutions",
    createdAt: subDays(new Date(), 7).toISOString(),
    status: "In Progress" as OrderStatus,
    currentDepartment: "Design",
    items: ["Business Cards", "Letterheads"],
    amount: 8500,
    paidAmount: 4250,
    pendingAmount: 4250,
    paymentStatus: "Partially Paid" as PaymentStatus,
    statusHistory: [
      {
        id: uuidv4(),
        orderId: "order-2",
        timestamp: subDays(new Date(), 7).toISOString(),
        department: "Sales",
        status: "New",
        remarks: "New order received with 50% advance payment",
        updatedBy: "Sales User"
      },
      {
        id: uuidv4(),
        orderId: "order-2",
        timestamp: subDays(new Date(), 5).toISOString(),
        department: "Design",
        status: "In Progress",
        remarks: "Working on initial designs",
        updatedBy: "Design User"
      }
    ],
    productStatus: [
      {
        id: "prod-3",
        name: "Business Cards",
        status: "processing",
        remarks: "Waiting for client approval"
      },
      {
        id: "prod-4",
        name: "Letterheads",
        status: "processing",
        remarks: "Initial design work started"
      }
    ]
  },
  {
    id: "order-3",
    orderNumber: "ORD-2023-003",
    clientName: "Sunrise Pharmaceuticals",
    createdAt: subDays(new Date(), 2).toISOString(),
    status: "New" as OrderStatus,
    currentDepartment: "Sales",
    items: ["Packaging Boxes", "Labels"],
    amount: 22000,
    paidAmount: 0,
    pendingAmount: 22000,
    paymentStatus: "Not Paid" as PaymentStatus,
    statusHistory: [
      {
        id: uuidv4(),
        orderId: "order-3",
        timestamp: subDays(new Date(), 2).toISOString(),
        department: "Sales",
        status: "New",
        remarks: "Client requested quote, awaiting payment confirmation",
        updatedBy: "Sales User"
      }
    ],
    productStatus: [
      {
        id: "prod-5",
        name: "Packaging Boxes",
        status: "processing",
        remarks: "Waiting for payment confirmation"
      },
      {
        id: "prod-6",
        name: "Labels",
        status: "processing",
        remarks: "Specifications received"
      }
    ]
  },
  {
    id: "order-4",
    orderNumber: "ORD-2023-004",
    clientName: "Green Valley Organics",
    createdAt: subDays(new Date(), 20).toISOString(),
    status: "On Hold" as OrderStatus,
    currentDepartment: "Production",
    items: ["Banners", "Flyers"],
    amount: 12500,
    paidAmount: 12500,
    pendingAmount: 0,
    paymentStatus: "Paid" as PaymentStatus,
    statusHistory: [
      {
        id: uuidv4(),
        orderId: "order-4",
        timestamp: subDays(new Date(), 20).toISOString(),
        department: "Sales",
        status: "New",
        remarks: "New order with full payment",
        updatedBy: "Sales User"
      },
      {
        id: uuidv4(),
        orderId: "order-4",
        timestamp: subDays(new Date(), 18).toISOString(),
        department: "Design",
        status: "In Progress",
        remarks: "Design work started",
        updatedBy: "Design User"
      },
      {
        id: uuidv4(),
        orderId: "order-4",
        timestamp: subDays(new Date(), 12).toISOString(),
        department: "Production",
        status: "On Hold",
        remarks: "Material shortage, waiting for new stock",
        updatedBy: "Production User"
      }
    ],
    productStatus: [
      {
        id: "prod-7",
        name: "Banners",
        status: "processing",
        remarks: "Material shortage"
      },
      {
        id: "prod-8",
        name: "Flyers",
        status: "completed",
        remarks: "Ready for dispatch"
      }
    ]
  },
  {
    id: "order-5",
    orderNumber: "ORD-2023-005",
    clientName: "City Hospital",
    createdAt: subDays(new Date(), 5).toISOString(),
    status: "Issue" as OrderStatus,
    currentDepartment: "Prepress",
    items: ["Prescription Pads", "Appointment Cards"],
    amount: 7500,
    paidAmount: 3750,
    pendingAmount: 3750,
    paymentStatus: "Partially Paid" as PaymentStatus,
    statusHistory: [
      {
        id: uuidv4(),
        orderId: "order-5",
        timestamp: subDays(new Date(), 5).toISOString(),
        department: "Sales",
        status: "New",
        remarks: "New order with 50% advance",
        updatedBy: "Sales User"
      },
      {
        id: uuidv4(),
        orderId: "order-5",
        timestamp: subDays(new Date(), 4).toISOString(),
        department: "Design",
        status: "Completed",
        remarks: "Design finalized",
        updatedBy: "Design User"
      },
      {
        id: uuidv4(),
        orderId: "order-5",
        timestamp: subDays(new Date(), 2).toISOString(),
        department: "Prepress",
        status: "Issue",
        remarks: "File resolution issues, need to contact client",
        updatedBy: "Prepress User"
      }
    ],
    productStatus: [
      {
        id: "prod-9",
        name: "Prescription Pads",
        status: "issue",
        remarks: "Resolution too low for printing"
      },
      {
        id: "prod-10",
        name: "Appointment Cards",
        status: "processing",
        remarks: "Awaiting prepress approval"
      }
    ]
  }
];
