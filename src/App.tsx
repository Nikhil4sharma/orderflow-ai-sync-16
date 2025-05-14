
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "@/components/routes/AppRoutes";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { OrderProvider } from "@/contexts/OrderContext";
import { UserProvider } from "@/contexts/UserContext";
import { Toaster } from "sonner";

function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <OrderProvider>
          <Router>
            <AppRoutes />
            <Toaster position="top-right" />
          </Router>
        </OrderProvider>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
