'use client';

import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { ProgressProvider } from '@/context/ProgressContext';
import { useAuth } from '@/context/AuthContext';

export default function AppLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const userId = user?.userId;

  if (authLoading) {
    // Optionally render a loading spinner or skeleton while auth is loading
    return <div>Loading authentication...</div>; 
  }

  return (
    <ProgressProvider userId={userId || 'guest'}> {/* Pass userId from AuthContext, default to 'guest' if not logged in */}
      <div className="flex flex-col min-h-screen">
        <Navigation />
        <main className="flex-grow pt-20">
          {children}
        </main>
        <Footer />
      </div>
    </ProgressProvider>
  );
}
