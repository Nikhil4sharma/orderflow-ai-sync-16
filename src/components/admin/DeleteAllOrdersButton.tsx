
import React, { useState } from "react";
import { collection, getDocs, deleteDoc, doc, writeBatch } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const DeleteAllOrdersButton: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDeleteAll = async () => {
    setLoading(true);
    try {
      const ordersRef = collection(db, "orders");
      const snapshot = await getDocs(ordersRef);
      
      // Use batched writes for better performance and atomicity
      const batchSize = 500; // Firestore allows max 500 operations per batch
      let operationCount = 0;
      let batch = writeBatch(db);
      
      for (const orderDoc of snapshot.docs) {
        batch.delete(doc(db, "orders", orderDoc.id));
        operationCount++;
        
        // If we reach batch size limit, commit and create a new batch
        if (operationCount === batchSize) {
          await batch.commit();
          batch = writeBatch(db);
          operationCount = 0;
        }
      }
      
      // Commit any remaining operations
      if (operationCount > 0) {
        await batch.commit();
      }
      
      toast.success(`Successfully deleted ${snapshot.docs.length} orders`);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error deleting orders:", error);
      toast.error("Failed to delete all orders");
    }
    setLoading(false);
  };

  return (
    <>
      <Button 
        variant="destructive" 
        onClick={() => setIsDialogOpen(true)} 
        className="flex items-center gap-2"
        id="delete-all-orders-btn"
        data-testid="delete-all-orders"
      >
        <Trash2 className="h-4 w-4" />
        Delete All Orders
      </Button>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete All Orders</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete all orders 
              from the database.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteAll} 
              disabled={loading}
              id="confirm-delete-all-orders-btn"
              data-testid="confirm-delete-all-orders"
            >
              {loading ? "Deleting..." : "Yes, Delete All Orders"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DeleteAllOrdersButton;
