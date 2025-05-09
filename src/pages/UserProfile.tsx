import React, { useState } from "react";
import { useOrders } from "@/contexts/OrderContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

const UserProfile = () => {
  const { currentUser, setCurrentUser } = useOrders();
  const [edit, setEdit] = useState(false);
  const [name, setName] = useState(currentUser?.name || "");
  const [saving, setSaving] = useState(false);

  if (!currentUser) {
    return <div className="p-8">User not found.</div>;
  }

  const handleSave = async () => {
    setSaving(true);
    try {
      const userRef = doc(db, "users", currentUser.id);
      await updateDoc(userRef, { name });
      setCurrentUser({ ...currentUser, name });
      setEdit(false);
    } catch (err) {
      alert("Failed to update name");
    }
    setSaving(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-background">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <strong>Name:</strong> {edit ? (
              <Input value={name} onChange={e => setName(e.target.value)} className="mt-2" />
            ) : (
              <span className="ml-2">{currentUser.name}</span>
            )}
            {edit ? (
              <Button size="sm" className="ml-2" onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
            ) : (
              <Button size="sm" className="ml-2" onClick={() => setEdit(true)}>Edit</Button>
            )}
          </div>
          <div><strong>Email:</strong> {currentUser.email}</div>
          <div><strong>Department:</strong> {currentUser.department}</div>
          <div><strong>Role:</strong> {currentUser.role}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile; 