
import { Order } from '@/types';
import { addHours } from 'date-fns';

const now = new Date();
const yesterday = new Date(now);
yesterday.setDate(yesterday.getDate() - 1);

// Sample Users for the status updates
const sampleUsers = ['John Smith', 'Emma Davis', 'Michael Johnson', 'Sarah Wilson'];

// Helper function to get a random user
const getRandomUser = () => sampleUsers[Math.floor(Math.random() * sampleUsers.length)];

// Helper to create a status update
const createStatusUpdate = (
  orderId: string,
  department: 'Sales' | 'Design' | 'Production' | 'Prepress',
  status: string,
  timestamp: Date,
  remarks?: string,
  selectedProduct?: string
) => ({
  id: `upd-${Math.random().toString(36).substring(2, 9)}`,
  orderId,
  department,
  status,
  remarks: remarks || '',
  timestamp: timestamp.toISOString(),
  updatedBy: getRandomUser(),
  editableUntil: addHours(timestamp, 1).toISOString(),
  selectedProduct
});

// Create demo orders based on the screenshot data
export const demoOrders: Order[] = [
  {
    id: 'ord-52041',
    orderNumber: 'Order #52041',
    clientName: 'United MSG',
    amount: 2077,
    paidAmount: 2077,
    pendingAmount: 0,
    items: ['Quick Cards'],
    createdAt: new Date('2025-04-01').toISOString(),
    status: 'Completed',
    currentDepartment: 'Sales',
    statusHistory: [
      createStatusUpdate('ord-52041', 'Sales', 'New', new Date('2025-04-01T09:00:00')),
      createStatusUpdate('ord-52041', 'Design', 'In Progress', new Date('2025-04-01T10:30:00')),
      createStatusUpdate('ord-52041', 'Production', 'In Progress', new Date('2025-04-01T14:00:00')),
      createStatusUpdate('ord-52041', 'Production', 'Completed', new Date('2025-04-01T17:00:00')),
      createStatusUpdate('ord-52041', 'Sales', 'Completed', new Date('2025-04-01T18:00:00'))
    ],
    productStatus: [
      {
        id: 'prod-52041-1',
        name: 'Quick Cards',
        status: 'completed'
      }
    ],
    paymentStatus: 'Paid',
    paymentHistory: [
      {
        id: 'pay-52041-1',
        amount: 2077,
        date: new Date('2025-04-01T12:00:00').toISOString(),
        method: 'Bank Transfer',
        remarks: 'Invoice paid in full'
      }
    ]
  },
  {
    id: 'ord-52045',
    orderNumber: 'Order #52045',
    clientName: 'Poonam Patel',
    amount: 1238,
    paidAmount: 1238,
    pendingAmount: 0,
    items: ['NFC Card'],
    createdAt: new Date('2025-04-02').toISOString(),
    status: 'Completed',
    currentDepartment: 'Sales',
    statusHistory: [
      createStatusUpdate('ord-52045', 'Sales', 'New', new Date('2025-04-02T09:30:00')),
      createStatusUpdate('ord-52045', 'Production', 'In Progress', new Date('2025-04-02T11:00:00')),
      createStatusUpdate('ord-52045', 'Production', 'Completed', new Date('2025-04-02T16:00:00')),
      createStatusUpdate('ord-52045', 'Sales', 'Completed', new Date('2025-04-02T17:30:00'))
    ],
    productStatus: [
      {
        id: 'prod-52045-1',
        name: 'NFC Card',
        status: 'completed'
      }
    ],
    paymentStatus: 'Paid',
    paymentHistory: [
      {
        id: 'pay-52045-1',
        amount: 1238,
        date: new Date('2025-04-02T10:15:00').toISOString(),
        method: 'Cash',
        remarks: 'Paid at pickup'
      }
    ]
  },
  {
    id: 'ord-52054',
    orderNumber: 'Order #52054',
    clientName: 'Art Muse',
    amount: 92294,
    paidAmount: 0,
    pendingAmount: 92294,
    items: ['Letterhead+ Biz Card EP+Envelopes'],
    createdAt: new Date('2025-04-05').toISOString(),
    status: 'In Progress',
    currentDepartment: 'Design',
    statusHistory: [
      createStatusUpdate('ord-52054', 'Sales', 'New', new Date('2025-04-05T11:00:00')),
      createStatusUpdate('ord-52054', 'Design', 'In Progress', new Date('2025-04-05T14:00:00'))
    ],
    productStatus: [
      {
        id: 'prod-52054-1',
        name: 'Letterhead',
        status: 'processing'
      },
      {
        id: 'prod-52054-2',
        name: 'Business Cards',
        status: 'processing'
      },
      {
        id: 'prod-52054-3',
        name: 'Envelopes',
        status: 'processing'
      }
    ],
    paymentStatus: 'Not Paid',
    paymentHistory: []
  },
  {
    id: 'ord-52059',
    orderNumber: 'Order #52059',
    clientName: 'Raghav',
    amount: 2950,
    paidAmount: 2950,
    pendingAmount: 0,
    items: ['Biz Card Design'],
    createdAt: new Date('2025-04-08').toISOString(),
    status: 'Completed',
    currentDepartment: 'Sales',
    statusHistory: [
      createStatusUpdate('ord-52059', 'Sales', 'New', new Date('2025-04-08T10:00:00')),
      createStatusUpdate('ord-52059', 'Design', 'In Progress', new Date('2025-04-08T12:00:00')),
      createStatusUpdate('ord-52059', 'Design', 'Completed', new Date('2025-04-08T15:30:00')),
      createStatusUpdate('ord-52059', 'Sales', 'Completed', new Date('2025-04-08T16:45:00'))
    ],
    productStatus: [
      {
        id: 'prod-52059-1',
        name: 'Biz Card Design',
        status: 'completed'
      }
    ],
    paymentStatus: 'Paid',
    paymentHistory: [
      {
        id: 'pay-52059-1',
        amount: 2950,
        date: new Date('2025-04-08T16:50:00').toISOString(),
        method: 'UPI',
        remarks: '07AAQFM7949A1ZY'
      }
    ]
  },
  {
    id: 'ord-52064',
    orderNumber: 'Order #52064',
    clientName: 'Palak',
    amount: 979,
    paidAmount: 979,
    pendingAmount: 0,
    items: ['Sample Kit'],
    createdAt: new Date('2025-04-08').toISOString(),
    status: 'Completed',
    currentDepartment: 'Sales',
    statusHistory: [
      createStatusUpdate('ord-52064', 'Sales', 'New', new Date('2025-04-08T11:15:00')),
      createStatusUpdate('ord-52064', 'Production', 'In Progress', new Date('2025-04-08T13:00:00')),
      createStatusUpdate('ord-52064', 'Production', 'Completed', new Date('2025-04-08T15:45:00')),
      createStatusUpdate('ord-52064', 'Sales', 'Completed', new Date('2025-04-08T16:30:00'))
    ],
    productStatus: [
      {
        id: 'prod-52064-1',
        name: 'Sample Kit',
        status: 'completed'
      }
    ],
    paymentStatus: 'Paid',
    paymentHistory: [
      {
        id: 'pay-52064-1',
        amount: 979,
        date: new Date('2025-04-08T11:30:00').toISOString(),
        method: 'Cash',
        remarks: '07AAECN1867B1ZO'
      }
    ]
  },
  {
    id: 'ord-52085',
    orderNumber: 'Order #52085',
    clientName: 'Sameer Abrol',
    amount: 170741,
    paidAmount: 50000,
    pendingAmount: 120741,
    items: ['Metal Cards', 'Letterhead', 'Envelope', 'Design', 'Business Card', 'Pouch'],
    createdAt: new Date('2025-04-10').toISOString(),
    status: 'In Progress',
    currentDepartment: 'Production',
    statusHistory: [
      createStatusUpdate('ord-52085', 'Sales', 'New', new Date('2025-04-10T09:00:00')),
      createStatusUpdate('ord-52085', 'Design', 'In Progress', new Date('2025-04-10T11:30:00')),
      createStatusUpdate('ord-52085', 'Design', 'Completed', new Date('2025-04-11T15:00:00')),
      createStatusUpdate('ord-52085', 'Production', 'In Progress', new Date('2025-04-11T16:00:00'))
    ],
    productStatus: [
      {
        id: 'prod-52085-1',
        name: 'Metal Cards',
        status: 'processing'
      },
      {
        id: 'prod-52085-2',
        name: 'Letterhead',
        status: 'processing'
      },
      {
        id: 'prod-52085-3',
        name: 'Envelope',
        status: 'processing'
      },
      {
        id: 'prod-52085-4',
        name: 'Business Card',
        status: 'processing'
      },
      {
        id: 'prod-52085-5',
        name: 'Pouch',
        status: 'processing'
      }
    ],
    paymentStatus: 'Partially Paid',
    paymentHistory: [
      {
        id: 'pay-52085-1',
        amount: 50000,
        date: new Date('2025-04-10T10:00:00').toISOString(),
        method: 'Bank Transfer',
        remarks: 'Advance payment 5%'
      }
    ]
  },
  // Add more demo orders as needed based on the screenshot
  {
    id: 'ord-52072',
    orderNumber: 'Order #52072',
    clientName: 'Jitendra Dhanjani',
    amount: 5308,
    paidAmount: 0,
    pendingAmount: 5308,
    items: ['Sample Kit + Stationary Design'],
    createdAt: new Date('2025-04-12').toISOString(),
    status: 'In Progress',
    currentDepartment: 'Design',
    statusHistory: [
      createStatusUpdate('ord-52072', 'Sales', 'New', new Date('2025-04-12T10:20:00')),
      createStatusUpdate('ord-52072', 'Design', 'In Progress', new Date('2025-04-12T14:15:00'))
    ],
    productStatus: [
      {
        id: 'prod-52072-1',
        name: 'Sample Kit',
        status: 'processing'
      },
      {
        id: 'prod-52072-2',
        name: 'Stationary Design',
        status: 'processing'
      }
    ],
    paymentStatus: 'Not Paid',
    paymentHistory: []
  },
  {
    id: 'ord-52214',
    orderNumber: 'Order #52214',
    clientName: 'Dr. Yashwant',
    amount: 2950,
    paidAmount: 0,
    pendingAmount: 2950,
    items: ['Business Card Design'],
    createdAt: new Date('2025-04-24').toISOString(),
    status: 'In Progress',
    currentDepartment: 'Design',
    statusHistory: [
      createStatusUpdate('ord-52214', 'Sales', 'New', new Date('2025-04-24T09:45:00')),
      createStatusUpdate('ord-52214', 'Design', 'In Progress', new Date('2025-04-24T11:30:00')),
    ],
    productStatus: [
      {
        id: 'prod-52214-1',
        name: 'Business Card Design',
        status: 'processing'
      }
    ],
    paymentStatus: 'Not Paid',
    paymentHistory: []
  }
];
