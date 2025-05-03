
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useOrders } from "@/contexts/OrderContext";
import { 
  syncOrdersWithGoogleSheet, 
  importOrdersFromSheet,
  validateGoogleSheetConfig
} from "@/utils/googleSheetUtils";
import { GoogleSheetConfig, Order } from "@/types";
import { Download, Upload, RefreshCcw } from "lucide-react";

const GoogleSheetSync: React.FC = () => {
  const { orders, addOrder } = useOrders();
  const [config, setConfig] = useState<GoogleSheetConfig>({
    sheetId: "",
    tabName: "",
    apiKey: "",
  });
  const [loading, setLoading] = useState<'import' | 'export' | null>(null);
  
  const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConfig(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleExportToSheet = async () => {
    if (!validateGoogleSheetConfig(config)) {
      toast.error("Please fill in all required Google Sheet configuration fields");
      return;
    }
    
    setLoading('export');
    try {
      const result = await syncOrdersWithGoogleSheet(orders, config);
      
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Export error:", error);
      toast.error("There was an error exporting to Google Sheet");
    } finally {
      setLoading(null);
    }
  };
  
  const handleImportFromSheet = async () => {
    if (!validateGoogleSheetConfig(config)) {
      toast.error("Please fill in all required Google Sheet configuration fields");
      return;
    }
    
    setLoading('import');
    try {
      const result = await importOrdersFromSheet(config);
      
      if (result.success && result.orders) {
        // Add each imported order
        result.orders.forEach(orderData => {
          // Create order with required fields
          // In a real app, you'd need more robust data validation
          const order = {
            id: `import-${Math.random().toString(36).substring(2, 9)}`,
            orderNumber: orderData.orderNumber || `ORD-${Date.now()}`,
            clientName: orderData.clientName || "Imported Client",
            amount: orderData.amount || 0,
            paidAmount: orderData.paidAmount || 0,
            pendingAmount: orderData.pendingAmount || 0,
            items: orderData.items || [],
            createdAt: orderData.createdAt || new Date().toISOString(),
            status: orderData.status || 'New',
            currentDepartment: orderData.currentDepartment || 'Sales',
            paymentStatus: orderData.paymentStatus || 'Not Paid',
            statusHistory: [],
            sheetSyncId: orderData.sheetSyncId
          } as Order;
          
          addOrder(order);
        });
        
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Import error:", error);
      toast.error("There was an error importing from Google Sheet");
    } finally {
      setLoading(null);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Google Sheet Integration</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sheet-id">Google Sheet ID</Label>
            <Input
              id="sheet-id"
              name="sheetId"
              value={config.sheetId}
              onChange={handleConfigChange}
              placeholder="e.g., 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
            />
            <p className="text-xs text-muted-foreground">
              The ID is the part of the Google Sheet URL between /d/ and /edit
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tab-name">Tab Name</Label>
            <Input
              id="tab-name"
              name="tabName"
              value={config.tabName}
              onChange={handleConfigChange}
              placeholder="e.g., Orders"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="api-key">API Key (Optional)</Label>
            <Input
              id="api-key"
              name="apiKey"
              value={config.apiKey}
              onChange={handleConfigChange}
              placeholder="Your Google API key"
              type="password"
            />
            <p className="text-xs text-muted-foreground">
              Only required for private sheets
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 mt-6">
            <Button
              variant="outline"
              onClick={handleExportToSheet}
              disabled={loading !== null}
              className="flex-1"
            >
              {loading === 'export' ? (
                <>
                  <RefreshCcw className="h-4 w-4 mr-2 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Export Orders to Sheet
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              onClick={handleImportFromSheet}
              disabled={loading !== null}
              className="flex-1"
            >
              {loading === 'import' ? (
                <>
                  <RefreshCcw className="h-4 w-4 mr-2 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Import Orders from Sheet
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoogleSheetSync;
