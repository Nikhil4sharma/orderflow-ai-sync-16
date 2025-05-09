import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';

const DesignDashboard: React.FC = () => {
  const [tab, setTab] = useState('assigned');
  const [assignedOrders, setAssignedOrders] = useState([]);
  const [approvedOrders, setApprovedOrders] = useState([]);

  useEffect(() => {
    // Assigned to design team
    const q1 = query(collection(db, 'orders'), where('currentDepartment', '==', 'Design'));
    const unsub1 = onSnapshot(q1, (snap) => {
      setAssignedOrders(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Approved by Sales Team or Design approved
    const q2 = query(
      collection(db, 'orders'),
      where('status', 'in', ['Approved by Sales Team', 'Design approved'])
    );
    const unsub2 = onSnapshot(q2, (snap) => {
      setApprovedOrders(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => { unsub1(); unsub2(); };
  }, []);

  const forwardToPrepress = async (orderId: string) => {
    await updateDoc(doc(db, 'orders', orderId), {
      status: 'Sent to Prepress',
      currentDepartment: 'Prepress'
    });
  };

  return (
    <div>
      <h1>Design Dashboard</h1>
      <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
        <button onClick={() => setTab('assigned')} style={{ fontWeight: tab === 'assigned' ? 'bold' : 'normal' }}>Assigned</button>
        <button onClick={() => setTab('approved')} style={{ fontWeight: tab === 'approved' ? 'bold' : 'normal' }}>Approved Orders</button>
      </div>
      {tab === 'assigned' && (
        <div>
          <h2>Assigned Orders</h2>
          {assignedOrders.length === 0 ? <p>No assigned orders.</p> : assignedOrders.map(order => (
            <div key={order.id} style={{ border: '1px solid #ccc', margin: 8, padding: 8 }}>
              <h3>{order.title || order.id}</h3>
              <p>Status: {order.status}</p>
            </div>
          ))}
        </div>
      )}
      {tab === 'approved' && (
        <div>
          <h2>Approved Orders</h2>
          {approvedOrders.length === 0 ? <p>No approved orders yet.</p> : approvedOrders.map(order => (
            <div key={order.id} style={{ border: '1px solid #ccc', margin: 8, padding: 8 }}>
              <h3>{order.title || order.id}</h3>
              <p>Status: {order.status}</p>
              <button onClick={() => forwardToPrepress(order.id)}>
                Forward to Prepress
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DesignDashboard; 