'use client';

import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { ProgressProvider, useProgress } from '@/context/ProgressContext';
import { useAuth } from '@/context/AuthContext';

function AppLayoutContentWithProgress({ children }: { children: React.ReactNode }) {
  const { loading: progressLoading } = useProgress();

  if (progressLoading) {
    // Optionally render a loading spinner or skeleton while progress is loading
    return <div>Loading Progress...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex flex-col flex-grow pt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
}


export default function AppLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const userId = user?.userId;

  if (authLoading) {
    // Optionally render a loading spinner or skeleton while auth is loading
    return <div>Loading Authentication...</div>;
  }

  return (
    <ProgressProvider userId={userId || 'guest'}>
      <AppLayoutContentWithProgress>
        {children}
      </AppLayoutContentWithProgress>
    </ProgressProvider>
  );
}
