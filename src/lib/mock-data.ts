
import { Department, Order, OrderStatus, ProductionStage, StatusUpdate, User } from "@/types";

// Sample users for the system
export const mockUsers: User[] = [
  { id: "user1", name: "John Smith", department: "Sales", role: "Sales Representative" },
  { id: "user2", name: "Emma Davis", department: "Production", role: "Production Manager" },
  { id: "user3", name: "Michael Chen", department: "Design", role: "Senior Designer" },
  { id: "user4", name: "Sarah Johnson", department: "Prepress", role: "Prepress Specialist" }
];

// Sample orders with statuses
export const mockOrders: Order[] = [
  {
    id: "ord1",
    orderNumber: "ORD-2023-001",
    clientName: "Acme Corp",
    amount: 1500,
    items: ["Business Cards", "Letterheads"],
    createdAt: "2023-04-28T08:30:00Z",
    status: "In Progress",
    currentDepartment: "Production",
    productionStages: [
      { stage: "Printing", status: "completed", timeline: "2023-04-30T14:00:00Z", remarks: "Premium paper used" },
      { stage: "Foiling", status: "processing", timeline: "2023-05-02T14:00:00Z" },
      { stage: "Electroplating", status: "processing" },
      { stage: "Cutting", status: "processing" },
      { stage: "Pasting", status: "processing" }
    ],
    designStatus: "Completed",
    designTimeline: "2023-04-29T11:20:00Z",
    designRemarks: "Client approved final design",
    statusHistory: [
      {
        id: "upd1",
        orderId: "ord1",
        department: "Sales",
        status: "New",
        remarks: "Order received from client",
        timestamp: "2023-04-28T08:30:00Z",
        updatedBy: "John Smith"
      },
      {
        id: "upd2",
        orderId: "ord1",
        department: "Design",
        status: "In Progress",
        remarks: "Starting design work",
        timestamp: "2023-04-28T10:15:00Z",
        updatedBy: "Michael Chen"
      },
      {
        id: "upd3",
        orderId: "ord1",
        department: "Design",
        status: "In Progress",
        remarks: "Design completed, awaiting approval",
        timestamp: "2023-04-29T09:45:00Z",
        updatedBy: "Michael Chen"
      },
      {
        id: "upd4",
        orderId: "ord1",
        department: "Design",
        status: "Completed",
        remarks: "Client approved final design",
        timestamp: "2023-04-29T11:20:00Z",
        updatedBy: "Michael Chen"
      },
      {
        id: "upd5",
        orderId: "ord1",
        department: "Production",
        status: "In Progress",
        remarks: "Starting production",
        timestamp: "2023-04-30T08:00:00Z",
        updatedBy: "Emma Davis"
      },
      {
        id: "upd6",
        orderId: "ord1",
        department: "Production",
        status: "In Progress",
        remarks: "Printing completed",
        timestamp: "2023-04-30T14:00:00Z",
        updatedBy: "Emma Davis"
      },
      {
        id: "upd7",
        orderId: "ord1",
        department: "Production",
        status: "In Progress",
        remarks: "Starting foiling process",
        timestamp: "2023-05-01T09:00:00Z",
        updatedBy: "Emma Davis"
      }
    ]
  },
  {
    id: "ord2",
    orderNumber: "ORD-2023-002",
    clientName: "TechStart Inc",
    amount: 2800,
    items: ["Brochures", "Flyers"],
    createdAt: "2023-04-29T14:15:00Z",
    status: "New",
    currentDepartment: "Sales",
    statusHistory: [
      {
        id: "upd8",
        orderId: "ord2",
        department: "Sales",
        status: "New",
        remarks: "Order received from client",
        timestamp: "2023-04-29T14:15:00Z",
        updatedBy: "John Smith"
      }
    ]
  },
  {
    id: "ord3",
    orderNumber: "ORD-2023-003",
    clientName: "Global Media",
    amount: 5000,
    items: ["Product Catalogs", "Magazines"],
    createdAt: "2023-04-27T11:20:00Z",
    status: "In Progress",
    currentDepartment: "Design",
    designStatus: "Working on it",
    designRemarks: "Creating initial mockups",
    statusHistory: [
      {
        id: "upd9",
        orderId: "ord3",
        department: "Sales",
        status: "New",
        remarks: "Order received from client",
        timestamp: "2023-04-27T11:20:00Z",
        updatedBy: "John Smith"
      },
      {
        id: "upd10",
        orderId: "ord3",
        department: "Design",
        status: "In Progress",
        remarks: "Starting design work",
        timestamp: "2023-04-28T09:00:00Z",
        updatedBy: "Michael Chen"
      }
    ]
  },
  {
    id: "ord4",
    orderNumber: "ORD-2023-004",
    clientName: "Eco Solutions",
    amount: 3200,
    items: ["Recycled Business Cards", "Eco-friendly Banners"],
    createdAt: "2023-04-26T15:40:00Z",
    status: "Issue",
    currentDepartment: "Production",
    productionStages: [
      { stage: "Printing", status: "issue", timeline: "2023-04-29T10:00:00Z", remarks: "Paper stock unavailable" },
      { stage: "Foiling", status: "processing" },
      { stage: "Electroplating", status: "processing" },
      { stage: "Cutting", status: "processing" },
      { stage: "Pasting", status: "processing" }
    ],
    designStatus: "Completed",
    designTimeline: "2023-04-28T14:30:00Z",
    statusHistory: [
      {
        id: "upd11",
        orderId: "ord4",
        department: "Sales",
        status: "New",
        remarks: "Order received from client",
        timestamp: "2023-04-26T15:40:00Z",
        updatedBy: "John Smith"
      },
      {
        id: "upd12",
        orderId: "ord4",
        department: "Design",
        status: "In Progress",
        remarks: "Starting design work",
        timestamp: "2023-04-27T09:30:00Z",
        updatedBy: "Michael Chen"
      },
      {
        id: "upd13",
        orderId: "ord4",
        department: "Design",
        status: "Completed",
        remarks: "Design completed and approved",
        timestamp: "2023-04-28T14:30:00Z",
        updatedBy: "Michael Chen"
      },
      {
        id: "upd14",
        orderId: "ord4",
        department: "Production",
        status: "In Progress",
        remarks: "Starting production",
        timestamp: "2023-04-29T08:15:00Z",
        updatedBy: "Emma Davis"
      },
      {
        id: "upd15",
        orderId: "ord4",
        department: "Production",
        status: "Issue",
        remarks: "Recycled paper stock out of inventory",
        timestamp: "2023-04-29T10:00:00Z",
        updatedBy: "Emma Davis"
      }
    ]
  },
  {
    id: "ord5",
    orderNumber: "ORD-2023-005",
    clientName: "Local Cafe",
    amount: 800,
    items: ["Menu Cards", "Coasters"],
    createdAt: "2023-04-25T09:10:00Z",
    status: "Completed",
    currentDepartment: "Prepress",
    productionStages: [
      { stage: "Printing", status: "completed", timeline: "2023-04-27T11:00:00Z" },
      { stage: "Foiling", status: "completed", timeline: "2023-04-27T16:30:00Z" },
      { stage: "Electroplating", status: "completed", timeline: "2023-04-28T12:00:00Z" },
      { stage: "Cutting", status: "completed", timeline: "2023-04-29T09:45:00Z" },
      { stage: "Pasting", status: "completed", timeline: "2023-04-29T14:20:00Z" }
    ],
    designStatus: "Completed",
    designTimeline: "2023-04-26T15:00:00Z",
    prepressStatus: "Ready",
    prepressRemarks: "All files ready for delivery",
    statusHistory: [
      {
        id: "upd16",
        orderId: "ord5",
        department: "Sales",
        status: "New",
        remarks: "Order received from client",
        timestamp: "2023-04-25T09:10:00Z",
        updatedBy: "John Smith"
      },
      {
        id: "upd17",
        orderId: "ord5",
        department: "Design",
        status: "In Progress",
        timestamp: "2023-04-25T13:45:00Z",
        updatedBy: "Michael Chen"
      },
      {
        id: "upd18",
        orderId: "ord5",
        department: "Design",
        status: "Completed",
        remarks: "Design completed and approved",
        timestamp: "2023-04-26T15:00:00Z",
        updatedBy: "Michael Chen"
      },
      // Production updates
      {
        id: "upd19",
        orderId: "ord5",
        department: "Production",
        status: "In Progress",
        timestamp: "2023-04-27T08:30:00Z",
        updatedBy: "Emma Davis"
      },
      {
        id: "upd20",
        orderId: "ord5",
        department: "Production",
        status: "In Progress",
        remarks: "Printing completed",
        timestamp: "2023-04-27T11:00:00Z",
        updatedBy: "Emma Davis"
      },
      {
        id: "upd21",
        orderId: "ord5",
        department: "Production",
        status: "In Progress",
        remarks: "Foiling completed",
        timestamp: "2023-04-27T16:30:00Z",
        updatedBy: "Emma Davis"
      },
      {
        id: "upd22",
        orderId: "ord5",
        department: "Production",
        status: "In Progress",
        remarks: "Electroplating completed",
        timestamp: "2023-04-28T12:00:00Z",
        updatedBy: "Emma Davis"
      },
      {
        id: "upd23",
        orderId: "ord5",
        department: "Production",
        status: "In Progress",
        remarks: "Cutting completed",
        timestamp: "2023-04-29T09:45:00Z",
        updatedBy: "Emma Davis"
      },
      {
        id: "upd24",
        orderId: "ord5",
        department: "Production",
        status: "In Progress",
        remarks: "Pasting completed",
        timestamp: "2023-04-29T14:20:00Z",
        updatedBy: "Emma Davis"
      },
      {
        id: "upd25",
        orderId: "ord5",
        department: "Production",
        status: "Completed",
        remarks: "All production stages completed",
        timestamp: "2023-04-29T14:30:00Z",
        updatedBy: "Emma Davis"
      },
      {
        id: "upd26",
        orderId: "ord5",
        department: "Prepress",
        status: "Completed",
        remarks: "Final review completed, files ready for delivery",
        timestamp: "2023-04-30T10:15:00Z",
        updatedBy: "Sarah Johnson"
      }
    ]
  }
];

// Helper function to get the color class for a status
export const getStatusColorClass = (status: string): string => {
  const statusLower = status.toLowerCase();
  
  if (statusLower.includes('completed')) return 'status-badge-completed';
  if (statusLower.includes('issue') || statusLower.includes('error')) return 'status-badge-issue';
  return 'status-badge-processing';
};

// Function to find an order by ID
export const findOrderById = (id: string): Order | undefined => {
  return mockOrders.find(order => order.id === id);
};

// Function to get all production stages
export const getProductionStages = (): ProductionStage[] => {
  return ["Printing", "Foiling", "Electroplating", "Cutting", "Pasting"];
};

// Function to get all departments
export const getDepartments = (): Department[] => {
  return ["Sales", "Production", "Design", "Prepress"];
};

// Function to get a user by ID
export const getUserById = (id: string): User | undefined => {
  return mockUsers.find(user => user.id === id);
};

// Function to get the current user (mocked for now)
export const getCurrentUser = (): User => {
  return mockUsers[0]; // Default to the first user for now
};
