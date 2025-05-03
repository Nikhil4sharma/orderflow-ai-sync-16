
import { Order, GoogleSheetConfig } from "@/types";
import { toast } from "sonner";

// Mock function for Google Sheets API connection
// In a real application, this would use the Google Sheets API
export async function syncOrdersWithGoogleSheet(
  orders: Order[],
  config: GoogleSheetConfig
): Promise<{success: boolean, message: string}> {
  try {
    // Since we can't actually connect to Google Sheets in this demo,
    // we'll simulate the process and return a success response
    
    console.log("Simulating Google Sheets sync with config:", config);
    console.log("Orders to sync:", orders);
    
    // In a real implementation, you'd use the Google Sheets API
    // to read/write data from/to the specified sheet
    
    // Mark orders as synced
    const syncedOrders = orders.map(order => ({
      ...order,
      lastSyncedAt: new Date().toISOString(),
      sheetSyncId: order.sheetSyncId || `sheet-${Math.random().toString(36).substr(2, 9)}`
    }));
    
    // Return success
    return {
      success: true,
      message: `Successfully synced ${orders.length} orders with Google Sheet`
    };
  } catch (error) {
    console.error("Error syncing with Google Sheet:", error);
    return {
      success: false,
      message: `Error syncing with Google Sheet: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

// Function to convert Google Sheets data to order objects
export function convertSheetDataToOrders(sheetData: any[]): Partial<Order>[] {
  // This is a mock implementation
  // In a real application, you'd map columns from the sheet to the order properties
  
  return sheetData.map(row => ({
    orderNumber: row[0],
    clientName: row[1],
    items: row[2]?.split(',').map((item: string) => item.trim()) || [],
    amount: parseFloat(row[3]) || 0,
    paidAmount: parseFloat(row[4]) || 0,
    pendingAmount: parseFloat(row[5]) || 0,
    createdAt: row[6] || new Date().toISOString(),
    status: row[7] || 'New',
    currentDepartment: row[8] || 'Sales',
    paymentStatus: row[9] || 'Not Paid',
    sheetSyncId: row[10] || `sheet-${Math.random().toString(36).substr(2, 9)}`
  }));
}

// Function to handle importing orders from Google Sheet
export async function importOrdersFromSheet(
  config: GoogleSheetConfig
): Promise<{success: boolean, message: string, orders?: Partial<Order>[]}> {
  try {
    // Since we can't actually connect to Google Sheets in this demo,
    // we'll simulate the process with mock data
    
    // Mock sheet data (in a real app, this would come from the Google Sheets API)
    const mockSheetData = [
      ["ORD-2023-001", "Demo Client", "Business Cards,Flyers", "1500", "1000", "500", "2023-05-01", "In Progress", "Design", "Partially Paid"],
      ["ORD-2023-002", "Sample Corp", "Brochures,Letterheads", "2500", "0", "2500", "2023-05-02", "New", "Sales", "Not Paid"],
      ["ORD-2023-003", "Test Ltd", "Banners", "3500", "3500", "0", "2023-05-03", "Completed", "Production", "Paid"],
    ];
    
    const orders = convertSheetDataToOrders(mockSheetData);
    
    return {
      success: true,
      message: `Successfully imported ${orders.length} orders from Google Sheet`,
      orders
    };
  } catch (error) {
    console.error("Error importing from Google Sheet:", error);
    return {
      success: false,
      message: `Error importing from Google Sheet: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

// Function to validate Google Sheet API key
export function validateGoogleSheetConfig(config: GoogleSheetConfig): boolean {
  return Boolean(config.sheetId && config.tabName);
}
