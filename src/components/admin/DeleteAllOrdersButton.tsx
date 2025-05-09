import React, { useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const DeleteAllOrdersButton: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleDeleteAll = async () => {
    if (!window.confirm("Are you sure you want to delete ALL orders? This action cannot be undone!")) return;
    setLoading(true);
    try {
      const ordersRef = collection(db, "orders");
      const snapshot = await getDocs(ordersRef);
      const deletePromises = snapshot.docs.map((orderDoc) =>
        deleteDoc(doc(db, "orders", orderDoc.id))
      );
      await Promise.all(deletePromises);
      toast.success("All orders deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete all orders");
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <Button variant="destructive" onClick={handleDeleteAll} disabled={loading}>
      {loading ? "Deleting..." : "Delete All Orders"}
    </Button>
  );
};

export default DeleteAllOrdersButton; 