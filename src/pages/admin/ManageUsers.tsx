
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, UserRound, UserPlus, PenLine, Trash } from "lucide-react";
import { Department, User, Role } from "@/types";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUsers } from "@/contexts/UserContext";
import { notifyUserCreated } from "@/utils/notifications";

const ManageUsers: React.FC = () => {
  const navigate = useNavigate();
  const { users, addUser, removeUser, currentUser } = useUsers();
  
  // New user form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState<Department>("Sales");
  const [role, setRole] = useState<Role>("Staff");
  
  // Delete user confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if current user is admin
  if (currentUser?.role !== "Admin") {
    toast.error("Access denied. Admin privileges required.");
    navigate("/dashboard");
    return null;
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validation
    if (!name || !email || !password) {
      toast.error("Please fill all required fields");
      setIsSubmitting(false);
      return;
    }
    
    // Check if email is already in use (local check)
    const emailExists = users.some(user => user.email === email);
    if (emailExists) {
      toast.error("Email is already in use");
      setIsSubmitting(false);
      return;
    }

    try {
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // 2. Add user profile to Firestore
      const newUser: User = {
        id: uid,
        name,
        email,
        department,
        role,
        permissions: []
      };
      
      await setDoc(doc(db, "users", uid), newUser);

      // 3. Add to local state (without password)
      await addUser({ ...newUser });
      
      // 4. Create notification
      await notifyUserCreated(uid, name, department);

      // 5. Reset form
      setName("");
      setEmail("");
      setPassword("");
      setDepartment("Sales");
      setRole("Staff");

      toast.success("User created successfully");
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        toast.error("Email is already registered in Firebase");
      } else if (error.code === "auth/weak-password") {
        toast.error("Password is too weak (minimum 6 characters)");
      } else {
        toast.error("Failed to create user: " + (error.message || error));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDeleteDialog = (userId: string) => {
    setUserToDelete(userId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    // Don't allow deleting yourself
    if (userToDelete === currentUser?.id) {
      toast.error("You cannot delete your own account");
      setDeleteDialogOpen(false);
      setUserToDelete(null);
      return;
    }

    setIsSubmitting(true);
    try {
      // Remove the user
      await removeUser(userToDelete);
      toast.success("User deleted successfully");
    } catch (error) {
      toast.error("Failed to delete user");
      console.error(error);
    } finally {
      setIsSubmitting(false);
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => navigate("/admin")}
      >
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Admin Dashboard
      </Button>
      
      <Card className="glass-card mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <UserRound className="h-5 w-5 mr-2" />
            Manage Users
          </CardTitle>
          <CardDescription>
            Create, edit, and manage system users
          </CardDescription>
        </CardHeader>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserPlus className="h-5 w-5 mr-2" />
                Add New User
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateUser} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select
                    value={department}
                    onValueChange={(value) => setDepartment(value as Department)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sales">Sales</SelectItem>
                      <SelectItem value="Production">Production</SelectItem>
                      <SelectItem value="Design">Design</SelectItem>
                      <SelectItem value="Prepress">Prepress</SelectItem>
                      <SelectItem value="Admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={role}
                    onValueChange={(value) => setRole(value as Role)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Manager">Manager</SelectItem>
                      <SelectItem value="Staff">Staff</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  {isSubmitting ? "Creating..." : "Create User"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>User List</CardTitle>
              <CardDescription>
                All users in the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-accent/50">
                      <th className="p-3 text-left">Name</th>
                      <th className="p-3 text-left">Email</th>
                      <th className="p-3 text-left">Department</th>
                      <th className="p-3 text-left">Role</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-opacity-20">
                        <td className="p-3">{user.name}</td>
                        <td className="p-3">{user.email || "N/A"}</td>
                        <td className="p-3">{user.department}</td>
                        <td className="p-3">{user.role}</td>
                        <td className="p-3 text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm">
                              <PenLine className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => openDeleteDialog(user.id)}
                              disabled={user.id === currentUser?.id}
                            >
                              <Trash className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser} disabled={isSubmitting}>
              {isSubmitting ? "Deleting..." : "Delete User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageUsers;
