
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GoogleSheetSync from "@/components/GoogleSheetSync";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const GoogleSheetSettings: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-8 px-4">
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => navigate("/admin")}
      >
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Admin
      </Button>
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Google Sheet Integration</h1>
        <p className="text-muted-foreground">
          Configure and manage Google Sheet integration for importing and exporting orders.
        </p>
      </div>
      
      <Tabs defaultValue="sync" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="sync">Sync Settings</TabsTrigger>
          <TabsTrigger value="logs">Sync Logs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sync" className="space-y-6">
          <GoogleSheetSync />
          
          <Card>
            <CardHeader>
              <CardTitle>Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Setting Up Google Sheet Integration</h3>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Create a Google Sheet with the following columns:
                    <ul className="list-disc pl-5">
                      <li>Order Number</li>
                      <li>Client Name</li>
                      <li>Items (comma separated)</li>
                      <li>Total Amount</li>
                      <li>Paid Amount</li>
                      <li>Pending Amount</li>
                      <li>Created Date</li>
                      <li>Status</li>
                      <li>Department</li>
                      <li>Payment Status</li>
                      <li>Sheet Sync ID (leave blank for new orders)</li>
                    </ul>
                  </li>
                  <li>Share the Google Sheet with the service account email or make it public.</li>
                  <li>Copy the Google Sheet ID from the URL (the part between /d/ and /edit).</li>
                  <li>Enter the Sheet ID and tab name in the form above.</li>
                  <li>Use the Export and Import buttons to sync your data.</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>Sync Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-6">
                Sync logs will appear here after you perform export or import operations.
              </p>
              {/* In a real application, we would display actual logs here */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GoogleSheetSettings;
