import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useOrders } from "@/contexts/OrderContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import OrderTimeline from "@/components/OrderTimeline";
import { Department, OrderStatus } from "@/types";

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { orders, updateOrder, addStatusUpdate, currentUser } = useOrders();
  const order = orders.find((o) => o.id === id);

  const [status, setStatus] = useState<OrderStatus>(order?.status || "New");
  const [department, setDepartment] = useState<Department>(order?.currentDepartment || "Sales");
  const [remarks, setRemarks] = useState<string>("");

  if (!order) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
        </Button>
        <Card>
          <CardContent>Order not found</CardContent>
        </Card>
      </div>
    );
  }

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value as OrderStatus);
  };

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDepartment(e.target.value as Department);
  };

  const handleRemarksChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRemarks(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Optimistic update
    const updatedOrder = { ...order, status, currentDepartment: department };
    updateOrder(updatedOrder);

    // Add status update to context
    addStatusUpdate(order.id, {
      department: department,
      status: status,
      remarks: remarks,
    });

    // Reset remarks after submitting
    setRemarks("");
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => navigate("/")}
      >
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Order Details Card */}
        <Card>
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>Order Number:</span>
              <span>{order.orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span>Client Name:</span>
              <span>{order.clientName}</span>
            </div>
            <div className="flex justify-between">
              <span>Order Date:</span>
              <span>{new Date(order.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Amount:</span>
              <span>${order.amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Items:</span>
              <span>{order.items.join(", ")}</span>
            </div>
            <div className="flex justify-between">
              <span>Current Status:</span>
              <span>
                <StatusBadge status={order.status} />
              </span>
            </div>
            <div className="flex justify-between">
              <span>Current Department:</span>
              <span>{order.currentDepartment}</span>
            </div>
          </CardContent>
        </Card>

        {/* Status Update Card */}
        <Card>
          <CardHeader>
            <CardTitle>Update Status</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Status
                </label>
                <div className="mt-2">
                  <select
                    id="status"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                    value={status}
                    onChange={handleStatusChange}
                  >
                    <option value="New">New</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="On Hold">On Hold</option>
                    <option value="Issue">Issue</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="department"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Department
                </label>
                <div className="mt-2">
                  <select
                    id="department"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                    value={department}
                    onChange={handleDepartmentChange}
                  >
                    <option value="Sales">Sales</option>
                    <option value="Production">Production</option>
                    <option value="Design">Design</option>
                    <option value="Prepress">Prepress</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="remarks"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Remarks
                </label>
                <div className="mt-2">
                  <textarea
                    id="remarks"
                    rows={3}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={remarks}
                    onChange={handleRemarksChange}
                  />
                </div>
              </div>

              <Button type="submit">Update Order</Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Order Timeline */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Order Timeline</h2>
        <OrderTimeline statusHistory={order.statusHistory} />
      </div>
    </div>
  );
};

export default OrderDetail;
