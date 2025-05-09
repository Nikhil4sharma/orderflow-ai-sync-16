
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { OrderProvider } from "./contexts/OrderContext";
import { AuthProvider } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "sonner";
import "./App.css";
import AppRoutes from "./components/routes/AppRoutes";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="app-theme">
      <AuthProvider>
        <NotificationProvider>
          <OrderProvider>
            <Router>
              <AppRoutes />
            </Router>
            <Toaster position="top-center" richColors closeButton />
          </OrderProvider>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
