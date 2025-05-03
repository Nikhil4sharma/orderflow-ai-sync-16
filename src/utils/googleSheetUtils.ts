
import { GoogleSheetConfig, Order } from "@/types";
import { toast } from "sonner";

// Function to validate Google Sheet config
export const validateGoogleSheetConfig = (config: GoogleSheetConfig): boolean => {
  return Boolean(config.sheetId && config.tabName);
};

// Function to export orders to Google Sheet
export const syncOrdersWithGoogleSheet = async (
  orders: Order[],
  config: GoogleSheetConfig
): Promise<{ success: boolean; message: string }> => {
  // This is a mock implementation
  console.log("Exporting orders to Google Sheet", orders.length);
  
  // In a real implementation, this would make an API call to Google Sheets API
  // For demonstration purposes, we'll simulate a successful export
  await new Promise((resolve) => setTimeout(resolve, 1500));
  
  // Simulate success
  return {
    success: true,
    message: `Successfully exported ${orders.length} orders to Google Sheet`
  };
};

// Function to import orders from Google Sheet
export const importOrdersFromSheet = async (
  config: GoogleSheetConfig
): Promise<{ success: boolean; message: string; orders?: Partial<Order>[] }> => {
  // This is a mock implementation
  console.log("Importing orders from Google Sheet", config);
  
  // In a real implementation, this would make an API call to Google Sheets API
  // For demonstration purposes, we'll simulate a successful import with mock data
  await new Promise((resolve) => setTimeout(resolve, 1500));
  
  // Create mock imported orders
  const mockImportedOrders: Partial<Order>[] = [
    {
      sheetSyncId: "sheet-row-1",
      orderNumber: "SHEET-001",
      clientName: "Sheet Import Client 1",
      amount: 25000,
      paidAmount: 12500,
      pendingAmount: 12500,
      items: ["Imported Item 1", "Imported Item 2"],
      createdAt: new Date().toISOString(),
      status: "In Progress",
      currentDepartment: "Sales",
      paymentStatus: "Partial"
    },
    {
      sheetSyncId: "sheet-row-2",
      orderNumber: "SHEET-002",
      clientName: "Sheet Import Client 2",
      amount: 35000,
      paidAmount: 35000,
      pendingAmount: 0,
      items: ["Imported Item 3", "Imported Item 4"],
      createdAt: new Date().toISOString(),
      status: "In Progress",
      currentDepartment: "Sales",
      paymentStatus: "Paid"
    }
  ];
  
  // Simulate success
  return {
    success: true,
    message: `Successfully imported ${mockImportedOrders.length} orders from Google Sheet`,
    orders: mockImportedOrders
  };
};

// Update a specific row in the Google Sheet
export const updateRowInSheet = async (
  config: GoogleSheetConfig,
  rowId: string,
  data: any
): Promise<{ success: boolean; message: string }> => {
  // This is a mock implementation
  console.log("Updating row in Google Sheet", rowId, data);
  
  // In a real implementation, this would make an API call to Google Sheets API
  // For demonstration purposes, we'll simulate a successful update
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  // Simulate success
  return {
    success: true,
    message: `Successfully updated row ${rowId} in Google Sheet`
  };
};
