
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { Toaster } from 'sonner';
import { ThemeProvider } from './contexts/ThemeContext';
import { OrderProvider } from './contexts/OrderContext';
import { UserProvider } from './contexts/UserContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <UserProvider>
          <OrderProvider>
            <Toaster position="top-right" richColors />
            <App />
          </OrderProvider>
        </UserProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
