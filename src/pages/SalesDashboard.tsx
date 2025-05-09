import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";

const SalesDashboard: React.FC = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const q = collection(db, 'orders');
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setOrders(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h1>Sales Dashboard (All Orders - Debug Mode)</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div>
          {orders.map((order: any) => (
            <div key={order.id} style={{ border: '1px solid #ccc', margin: 8, padding: 8 }}>
              <h3>{order.title || order.orderNumber || order.id}</h3>
              <p>Status: {order.status}</p>
              <p>Client: {order.clientName}</p>
              <p>
                Date: {order.createdAt
                  ? (new Date(order.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" }))
                  : "N/A"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SalesDashboard; 