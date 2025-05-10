// Add editableUntil field to all status updates
// For example:
export const demoOrders = [
  {
    id: "order1",
    orderNumber: "ORD-2023-001",
    clientName: "Acme Corp",
    amount: 5000,
    paidAmount: 3000,
    pendingAmount: 2000,
    items: ["Business Cards", "Flyers"],
    createdAt: "2023-05-31T18:30:00Z",
    lastUpdated: "2023-06-05T12:00:00Z",
    status: "In Progress",
    currentDepartment: "Production",
    paymentStatus: "Partial",
    statusHistory: [
      {
        id: "status1",
        orderId: "order1",
        timestamp: "2023-06-01T10:00:00Z",
        department: "Sales",
        status: "New",
        remarks: "Order created",
        updatedBy: "John Doe",
        editableUntil: "2023-06-01T15:00:00Z" // Add this field to all status updates
      },
      {
        id: "status2",
        orderId: "order1",
        timestamp: "2023-06-02T14:00:00Z",
        department: "Design",
        status: "In Progress",
        remarks: "Design started",
        updatedBy: "Alice Smith",
        editableUntil: "2023-06-02T19:00:00Z"
      },
      {
        id: "status3",
        orderId: "order1",
        timestamp: "2023-06-03T16:00:00Z",
        department: "Production",
        status: "In Progress",
        remarks: "Printing in progress",
        updatedBy: "Bob Johnson",
        editableUntil: "2023-06-03T21:00:00Z"
      },
      {
        id: "status4",
        orderId: "order1",
        timestamp: "2023-06-04T18:00:00Z",
        department: "Production",
        status: "Completed",
        remarks: "Printing completed",
        updatedBy: "Bob Johnson",
        editableUntil: "2023-06-04T23:00:00Z"
      }
    ],
    paymentHistory: [
      {
        id: "payment1",
        amount: 3000,
        date: "2023-06-01T12:00:00Z",
        method: "Credit Card",
        remarks: "Initial payment"
      }
    ],
    timeline: {
      "2023-06-01T10:00:00Z": {
        timestamp: "2023-06-01T10:00:00Z",
        remarks: "Order created",
        updatedBy: "John Doe"
      }
    },
    sheetSyncId: "1234567890",
    pendingApprovalFrom: "Sales",
    approvalReason: "Discount approval",
    productStatus: [
      {
        id: "product1",
        name: "Business Cards",
        status: "processing",
        remarks: "Awaiting design",
        estimatedCompletion: "2023-06-02T12:00:00Z",
        assignedDepartment: "Design"
      }
    ],
    designStatus: "Working on it",
    designRemarks: "Design in progress",
    designTimeline: "2023-06-02T12:00:00Z",
    prepressStatus: "Waiting for approval",
    prepressRemarks: "Awaiting approval",
    productionStages: [
      {
        stage: "Printing",
        status: "processing",
        remarks: "Printing in progress",
        timeline: "2023-06-03T12:00:00Z"
      }
    ],
    deliveryAddress: "123 Main St",
    contactNumber: "555-1234",
    dispatchDetails: {
      address: "123 Main St",
      contactNumber: "555-1234",
      courierPartner: "FedEx",
      deliveryType: "Express",
      trackingNumber: "TN123456789",
      dispatchDate: "2023-06-05T12:00:00Z",
      verifiedBy: "Jane Smith"
    },
    expectedCompletionDate: "2023-06-07T12:00:00Z",
    verifiedBy: "Jane Smith",
    verifiedAt: "2023-06-05T12:00:00Z"
  },
  {
    id: "order2",
    orderNumber: "ORD-2023-002",
    clientName: "Beta Inc",
    amount: 3000,
    paidAmount: 3000,
    pendingAmount: 0,
    items: ["Brochures"],
    createdAt: "2023-06-01T09:00:00Z",
    lastUpdated: "2023-06-03T17:00:00Z",
    status: "Completed",
    currentDepartment: "Production",
    paymentStatus: "Paid",
    statusHistory: [
      {
        id: "status5",
        orderId: "order2",
        timestamp: "2023-06-01T11:00:00Z",
        department: "Sales",
        status: "New",
        remarks: "Order created",
        updatedBy: "John Doe",
        editableUntil: "2023-06-01T16:00:00Z"
      },
      {
        id: "status6",
        orderId: "order2",
        timestamp: "2023-06-01T13:00:00Z",
        department: "Design",
        status: "In Progress",
        remarks: "Design in progress",
        updatedBy: "Alice Smith",
        editableUntil: "2023-06-01T18:00:00Z"
      }
    ],
    paymentHistory: [
      {
        id: "payment2",
        amount: 3000,
        date: "2023-06-01T12:00:00Z",
        method: "Credit Card",
        remarks: "Full payment"
      }
    ],
    timeline: {
      "2023-06-01T11:00:00Z": {
        timestamp: "2023-06-01T11:00:00Z",
        remarks: "Order created",
        updatedBy: "John Doe"
      }
    },
    sheetSyncId: "0987654321",
    productStatus: [
      {
        id: "product2",
        name: "Brochures",
        status: "completed",
        remarks: "Design completed",
        estimatedCompletion: "2023-06-01T15:00:00Z",
        assignedDepartment: "Design"
      }
    ],
    designStatus: "Working on it",
    designRemarks: "Design completed",
    designTimeline: "2023-06-01T15:00:00Z",
    prepressStatus: "Waiting for approval",
    prepressRemarks: "Awaiting approval",
    productionStages: [
      {
        stage: "Printing",
        status: "completed",
        remarks: "Printing completed",
        timeline: "2023-06-02T12:00:00Z"
      }
    ],
    deliveryAddress: "456 Oak St",
    contactNumber: "555-5678",
    dispatchDetails: {
      address: "456 Oak St",
      contactNumber: "555-5678",
      courierPartner: "DHL",
      deliveryType: "Normal",
      trackingNumber: "TN987654321",
      dispatchDate: "2023-06-03T12:00:00Z",
      verifiedBy: "Jane Smith"
    },
    expectedCompletionDate: "2023-06-04T12:00:00Z",
    verifiedBy: "Jane Smith",
    verifiedAt: "2023-06-03T12:00:00Z"
  },
  {
    id: "order3",
    orderNumber: "ORD-2023-003",
    clientName: "Gamma Ltd",
    amount: 7500,
    paidAmount: 4000,
    pendingAmount: 3500,
    items: ["Posters", "Banners"],
    createdAt: "2023-06-02T14:00:00Z",
    lastUpdated: "2023-06-06T09:00:00Z",
    status: "In Progress",
    currentDepartment: "Sales",
    paymentStatus: "Partial",
    statusHistory: [
      {
        id: "status7",
        orderId: "order3",
        timestamp: "2023-06-02T15:00:00Z",
        department: "Sales",
        status: "New",
        remarks: "Order created",
        updatedBy: "John Doe",
        editableUntil: "2023-06-02T20:00:00Z"
      }
    ],
    paymentHistory: [
      {
        id: "payment3",
        amount: 4000,
        date: "2023-06-02T16:00:00Z",
        method: "Bank Transfer",
        remarks: "Initial payment"
      }
    ],
    timeline: {
      "2023-06-02T15:00:00Z": {
        timestamp: "2023-06-02T15:00:00Z",
        remarks: "Order created",
        updatedBy: "John Doe"
      }
    },
    sheetSyncId: "2468135790",
    productStatus: [
      {
        id: "product3",
        name: "Posters",
        status: "processing",
        remarks: "Awaiting design",
        estimatedCompletion: "2023-06-03T12:00:00Z",
        assignedDepartment: "Design"
      }
    ],
    designStatus: "Working on it",
    designRemarks: "Design in progress",
    designTimeline: "2023-06-03T12:00:00Z",
    prepressStatus: "Waiting for approval",
    prepressRemarks: "Awaiting approval",
    productionStages: [
      {
        stage: "Printing",
        status: "processing",
        remarks: "Printing in progress",
        timeline: "2023-06-04T12:00:00Z"
      }
    ],
    deliveryAddress: "789 Pine St",
    contactNumber: "555-9012",
    dispatchDetails: {
      address: "789 Pine St",
      contactNumber: "555-9012",
      courierPartner: "BlueDart",
      deliveryType: "Express",
      trackingNumber: "TN019283746",
      dispatchDate: "2023-06-06T12:00:00Z",
      verifiedBy: "Jane Smith"
    },
    expectedCompletionDate: "2023-06-08T12:00:00Z",
    verifiedBy: "Jane Smith",
    verifiedAt: "2023-06-06T12:00:00Z"
  },
  {
    id: "order4",
    orderNumber: "ORD-2023-004",
    clientName: "Delta Co",
    amount: 4200,
    paidAmount: 4200,
    pendingAmount: 0,
    items: ["Stickers"],
    createdAt: "2023-06-03T10:30:00Z",
    lastUpdated: "2023-06-05T15:00:00Z",
    status: "Completed",
    currentDepartment: "Production",
    paymentStatus: "Paid",
    statusHistory: [
      {
        id: "status8",
        orderId: "order4",
        timestamp: "2023-06-03T11:30:00Z",
        department: "Sales",
        status: "New",
        remarks: "Order created",
        updatedBy: "John Doe",
        editableUntil: "2023-06-03T16:30:00Z"
      },
      {
        id: "status9",
        orderId: "order4",
        timestamp: "2023-06-03T13:30:00Z",
        department: "Design",
        status: "In Progress",
        remarks: "Design in progress",
        updatedBy: "Alice Smith",
        editableUntil: "2023-06-03T18:30:00Z"
      }
    ],
    paymentHistory: [
      {
        id: "payment4",
        amount: 4200,
        date: "2023-06-03T12:00:00Z",
        method: "Credit Card",
        remarks: "Full payment"
      }
    ],
    timeline: {
      "2023-06-03T11:30:00Z": {
        timestamp: "2023-06-03T11:30:00Z",
        remarks: "Order created",
        updatedBy: "John Doe"
      }
    },
    sheetSyncId: "9753108642",
    productStatus: [
      {
        id: "product4",
        name: "Stickers",
        status: "completed",
        remarks: "Design completed",
        estimatedCompletion: "2023-06-03T15:00:00Z",
        assignedDepartment: "Design"
      }
    ],
    designStatus: "Working on it",
    designRemarks: "Design completed",
    designTimeline: "2023-06-03T15:00:00Z",
    prepressStatus: "Waiting for approval",
    prepressRemarks: "Awaiting approval",
    productionStages: [
      {
        stage: "Printing",
        status: "completed",
        remarks: "Printing completed",
        timeline: "2023-06-04T12:00:00Z"
      }
    ],
    deliveryAddress: "321 Elm St",
    contactNumber: "555-4321",
    dispatchDetails: {
      address: "321 Elm St",
      contactNumber: "555-4321",
      courierPartner: "FedEx",
      deliveryType: "Express",
      trackingNumber: "TN654321987",
      dispatchDate: "2023-06-05T12:00:00Z",
      verifiedBy: "Jane Smith"
    },
    expectedCompletionDate: "2023-06-06T12:00:00Z",
    verifiedBy: "Jane Smith",
    verifiedAt: "2023-06-05T12:00:00Z"
  }
];
