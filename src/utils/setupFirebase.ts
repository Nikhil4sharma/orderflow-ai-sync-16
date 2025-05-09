
import { 
  collection, 
  getDocs, 
  addDoc, 
  setDoc, 
  doc, 
  query, 
  where 
} from 'firebase/firestore';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { db, auth } from '@/lib/firebase';
import { User, Order } from '@/types';
import { nanoid } from 'nanoid';
import { format } from 'date-fns';

// Demo users
const demoUsers = [
  {
    name: "Admin User",
    email: "admin@chhapai.com",
    password: "admin123",
    department: "Admin",
    role: "Admin",
    permissions: ["manage_users", "manage_departments", "manage_orders", "update_orders", "delete_orders", "view_finances", "manage_settings", "export_data"]
  },
  {
    name: "Sales Representative",
    email: "sales@chhapai.com",
    password: "sales123",
    department: "Sales",
    role: "Staff",
    permissions: ["create_orders", "update_orders", "view_reports", "request_approval"]
  },
  {
    name: "Design Team Member",
    email: "design@chhapai.com",
    password: "design123",
    department: "Design",
    role: "Staff",
    permissions: ["update_order_status", "request_approval", "forward_to_department"]
  },
  {
    name: "Production Manager",
    email: "production@chhapai.com",
    password: "production123",
    department: "Production",
    role: "Manager",
    permissions: ["update_order_status", "mark_ready_dispatch", "view_reports"]
  }
];

// Demo orders
const generateDemoOrders = (userId: string) => {
  const statuses = ["New", "In Progress", "On Hold", "Completed", "Ready to Dispatch", "Issue"];
  const departments = ["Sales", "Design", "Prepress", "Production"];
  const clients = ["ABC Printing", "XYZ Corp", "123 Industries", "Global Tech", "Local Business"];
  const productItems = ["Business Cards", "Flyers", "Brochures", "Banners", "Posters", "Letterheads"];

  const orders: Partial<Order>[] = [];

  // Generate 10-15 random orders
  const numOrders = Math.floor(Math.random() * 6) + 10;
  
  for (let i = 0; i < numOrders; i++) {
    const orderDate = new Date();
    orderDate.setDate(orderDate.getDate() - Math.floor(Math.random() * 30)); // Random date within last 30 days
    
    const amount = Math.floor(Math.random() * 10000) + 1000;
    const paidAmount = Math.random() > 0.3 ? amount : Math.floor(amount * (Math.random() * 0.8));
    const pendingAmount = amount - paidAmount;
    
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    const randomDepartment = departments[Math.floor(Math.random() * departments.length)];
    const randomClient = clients[Math.floor(Math.random() * clients.length)];
    
    // Generate 1-3 random items
    const numItems = Math.floor(Math.random() * 3) + 1;
    const items = [];
    for (let j = 0; j < numItems; j++) {
      const randomItem = productItems[Math.floor(Math.random() * productItems.length)];
      if (!items.includes(randomItem)) {
        items.push(randomItem);
      }
    }
    
    const paymentStatus = paidAmount === 0 ? "Not Paid" : 
                          paidAmount === amount ? "Paid" : 
                          "Partial";
    
    const orderNumber = `ORD-${nanoid(6).toUpperCase()}`;
    
    // Create status update
    const statusHistory = [{
      id: nanoid(),
      orderId: orderNumber,
      timestamp: format(orderDate, 'yyyy-MM-dd HH:mm:ss'),
      department: randomDepartment,
      status: randomStatus,
      remarks: `Order created with status ${randomStatus}`,
      updatedBy: userId,
      editableUntil: format(new Date(orderDate.getTime() + 30 * 60000), 'yyyy-MM-dd HH:mm:ss')
    }];
    
    orders.push({
      orderNumber,
      clientName: randomClient,
      amount,
      paidAmount,
      pendingAmount,
      items,
      createdAt: format(orderDate, 'yyyy-MM-dd HH:mm:ss'),
      status: randomStatus,
      currentDepartment: randomDepartment,
      paymentStatus,
      statusHistory,
      paymentHistory: [],
      lastUpdated: format(orderDate, 'yyyy-MM-dd HH:mm:ss')
    });
  }
  
  return orders;
};

export const initializeFirebaseDemo = async () => {
  try {
    // Check if demo data is already initialized
    const usersCollection = collection(db, 'users');
    const usersSnapshot = await getDocs(usersCollection);
    
    if (usersSnapshot.docs.length > 0) {
      console.log("Firebase already contains data. Skipping demo initialization.");
      return;
    }
    
    console.log("Creating demo data...");
    
    // Create demo users
    for (const demoUser of demoUsers) {
      try {
        // Create user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(
          auth, 
          demoUser.email, 
          demoUser.password
        );
        
        // Create user profile in Firestore
        const userId = userCredential.uid;
        await setDoc(doc(db, 'users', userId), {
          id: userId,
          name: demoUser.name,
          email: demoUser.email,
          department: demoUser.department,
          role: demoUser.role,
          permissions: demoUser.permissions
        });
        
        console.log(`Created demo user: ${demoUser.email}`);
        
        // Generate demo orders for admin
        if (demoUser.department === "Admin") {
          const demoOrders = generateDemoOrders(userId);
          for (const order of demoOrders) {
            await addDoc(collection(db, 'orders'), order);
          }
          console.log(`Created ${demoOrders.length} demo orders`);
        }
      } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
          console.log(`User ${demoUser.email} already exists. Skipping.`);
        } else {
          console.error(`Error creating demo user ${demoUser.email}:`, error);
        }
      }
    }
    
    console.log("Demo data initialization completed successfully");
  } catch (error) {
    console.error("Error initializing Firebase demo data:", error);
    throw error;
  }
};
