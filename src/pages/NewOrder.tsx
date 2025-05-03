
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOrders } from "@/contexts/OrderContext";
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
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus, Minus, IndianRupee } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { DatePicker } from "@/components/ui/date-picker";
import MobileBackButton from "@/components/MobileBackButton";

const NewOrder: React.FC = () => {
  const navigate = useNavigate();
  const { addOrder, currentUser } = useOrders();
  
  // Form state
  const [clientName, setClientName] = useState("");
  const [amount, setAmount] = useState("");
  const [items, setItems] = useState<string[]>([""]);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [products, setProducts] = useState<{ name: string }[]>([{ name: "" }]);
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState<Date | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  
  // Validate form
  const isFormValid = () => {
    if (!clientName.trim()) {
      toast.error("Client name is required");
      return false;
    }
    
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Valid amount is required");
      return false;
    }
    
    if (items.some(item => !item.trim())) {
      toast.error("All items must have a name");
      return false;
    }
    
    if (!deliveryAddress.trim()) {
      toast.error("Delivery address is required");
      return false;
    }
    
    if (!contactNumber.trim()) {
      toast.error("Contact number is required");
      return false;
    }
    
    if (products.some(product => !product.name.trim())) {
      toast.error("All products must have a name");
      return false;
    }
    
    return true;
  };
  
  // Add an item
  const addItem = () => {
    setItems([...items, ""]);
  };
  
  // Remove an item
  const removeItem = (indexToRemove: number) => {
    setItems(items.filter((_, index) => index !== indexToRemove));
  };
  
  // Update an item
  const updateItem = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    setItems(newItems);
  };
  
  // Add a product
  const addProduct = () => {
    setProducts([...products, { name: "" }]);
  };
  
  // Remove a product
  const removeProduct = (indexToRemove: number) => {
    setProducts(products.filter((_, index) => index !== indexToRemove));
  };
  
  // Update a product
  const updateProduct = (index: number, value: string) => {
    const newProducts = [...products];
    newProducts[index].name = value;
    setProducts(newProducts);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      return;
    }
    
    setLoading(true);
    
    // Generate order number
    const orderPrefix = "ORD";
    const timestamp = new Date().getTime().toString().slice(-6);
    const orderNumber = `${orderPrefix}-${timestamp}`;
    
    // Create product status entries
    const productStatus = products.map(product => ({
      id: uuidv4(),
      name: product.name,
      status: "processing" as const,
    }));
    
    // Create new order - Always assigned to Sales department first
    const newOrder = {
      id: uuidv4(),
      orderNumber,
      clientName,
      amount: parseFloat(amount),
      paidAmount: 0,
      pendingAmount: parseFloat(amount),
      items: items.filter(item => item.trim()),
      createdAt: new Date().toISOString(),
      status: "New" as const,
      currentDepartment: "Sales" as const, // Always start with Sales department
      paymentStatus: "Not Paid" as const,
      statusHistory: [],
      productStatus,
      deliveryAddress,
      contactNumber,
      expectedDeliveryDate: expectedDeliveryDate?.toISOString(),
    };
    
    // Add order
    addOrder(newOrder);
    
    toast.success("Order created successfully");
    
    // Navigate to dashboard
    navigate("/");
    
    setLoading(false);
  };
  
  return (
    <div className="container mx-auto py-8 px-4 min-h-screen">
      <MobileBackButton to="/" className="mb-4 md:hidden" />
      
      <Button
        variant="ghost"
        className="mb-4 hidden md:flex"
        onClick={() => navigate("/")}
      >
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
      </Button>
      
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-2xl">Create New Order</CardTitle>
          <CardDescription>
            Enter order details below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="clientName">Client Name *</Label>
                <Input
                  id="clientName"
                  placeholder="Enter client name"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="amount">Order Amount (₹) *</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IndianRupee className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input
                    id="amount"
                    type="number"
                    className="pl-10"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
            
            <div>
              <Label>Order Items *</Label>
              {items.map((item, index) => (
                <div key={index} className="flex gap-2 mt-2">
                  <Input
                    placeholder={`Item ${index + 1}`}
                    value={item}
                    onChange={(e) => updateItem(index, e.target.value)}
                    required
                  />
                  {items.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeItem(index)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  )}
                  {index === items.length - 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={addItem}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            
            <div>
              <Label>Products *</Label>
              {products.map((product, index) => (
                <div key={index} className="flex gap-2 mt-2">
                  <Input
                    placeholder={`Product ${index + 1} name`}
                    value={product.name}
                    onChange={(e) => updateProduct(index, e.target.value)}
                    required
                  />
                  {products.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeProduct(index)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  )}
                  {index === products.length - 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={addProduct}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            
            <div className="pt-4 border-t">
              <h3 className="font-medium mb-3">Delivery Information *</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactNumber">Contact Number *</Label>
                  <Input
                    id="contactNumber"
                    placeholder="Enter contact number"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="expectedDeliveryDate">Expected Delivery Date</Label>
                  <DatePicker 
                    date={expectedDeliveryDate} 
                    setDate={setExpectedDeliveryDate} 
                    className="w-full"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <Label htmlFor="deliveryAddress">Delivery Address *</Label>
                  <Textarea
                    id="deliveryAddress"
                    placeholder="Enter delivery address"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    rows={3}
                    required
                  />
                </div>
              </div>
            </div>
            
            <div className="pt-4 flex justify-end">
              <Button type="submit" disabled={loading}>
                Create Order
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewOrder;
