
import React, { useEffect, useState } from 'react';
import AppRoutes from '@/components/routes/AppRoutes';
import { useUsers } from '@/contexts/UserContext';
import { initializeFirebaseDemo } from '@/utils/setupFirebase';

function App() {
  const { loading } = useUsers();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const setupFirebase = async () => {
      try {
        // Initialize Firebase with demo data if needed
        await initializeFirebaseDemo();
      } catch (error) {
        console.error("Firebase initialization error:", error);
      } finally {
        setIsInitializing(false);
      }
    };
    
    setupFirebase();
  }, []);

  if (loading || isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 border-4 border-current border-t-transparent text-primary rounded-full animate-spin" role="status" aria-label="loading"></div>
          <p className="mt-4 text-lg text-muted-foreground">Loading application...</p>
        </div>
      </div>
    );
  }

  return <AppRoutes />;
}

export default App;
