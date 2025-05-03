
import { GoogleSheetConfig, Order } from "@/types";

// Validate Google Sheet configuration
export const validateGoogleSheetConfig = (config: GoogleSheetConfig): boolean => {
  return Boolean(config.sheetId && config.tabName);
};

// Simulated function to sync orders with Google Sheets
export const syncOrdersWithGoogleSheet = async (
  orders: Order[],
  config: GoogleSheetConfig
): Promise<{ success: boolean; message: string }> => {
  try {
    // In a real application, this would make API calls to Google Sheets API
    console.log("Simulating sync to Google Sheets:", config);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate successful sync
    console.log(`Successfully synced ${orders.length} orders to sheet ${config.sheetId}`);
    
    return {
      success: true,
      message: `Successfully exported ${orders.length} orders to Google Sheet`
    };
  } catch (error) {
    console.error("Error syncing with Google Sheets:", error);
    return {
      success: false,
      message: `Error exporting to Google Sheet: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

// Simulated function to import orders from Google Sheets
export const importOrdersFromSheet = async (
  config: GoogleSheetConfig
): Promise<{ success: boolean; message: string; orders?: Partial<Order>[] }> => {
  try {
    // In a real application, this would make API calls to Google Sheets API
    console.log("Simulating import from Google Sheets:", config);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate successful import with mock data
    const mockImportedOrders: Partial<Order>[] = [
      {
        orderNumber: "SHEET-001",
        clientName: "Imported Client 1",
        amount: 15000,
        paidAmount: 10000,
        pendingAmount: 5000,
        items: ["Imported Item 1", "Imported Item 2"],
        status: "New",
        currentDepartment: "Sales",
        paymentStatus: "Partially Paid",
        sheetSyncId: "row-1"
      },
      {
        orderNumber: "SHEET-002",
        clientName: "Imported Client 2",
        amount: 8000,
        paidAmount: 8000,
        pendingAmount: 0,
        items: ["Imported Item 3"],
        status: "New",
        currentDepartment: "Sales",
        paymentStatus: "Paid",
        sheetSyncId: "row-2"
      }
    ];
    
    console.log(`Successfully imported ${mockImportedOrders.length} orders from sheet ${config.sheetId}`);
    
    return {
      success: true,
      message: `Successfully imported ${mockImportedOrders.length} orders from Google Sheet`,
      orders: mockImportedOrders
    };
  } catch (error) {
    console.error("Error importing from Google Sheets:", error);
    return {
      success: false,
      message: `Error importing from Google Sheet: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};
