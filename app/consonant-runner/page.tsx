'use client';

import { useState, useEffect } from 'react';
import type { NextPage } from 'next';

// We need to dynamically import the game component
// because PixiJS interacts with the window object, which is not available on the server.
import dynamic from 'next/dynamic';

const ConsonantGame = dynamic(() => import('@/components/ConsonantGame'), {
  ssr: false, // This is important to prevent server-side rendering
});

const GeometryRunnerPage: NextPage = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This ensures the component only renders on the client side
    setIsClient(true);
  }, []);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-900">
      <h1 className="text-4xl font-bold text-emerald-400 mb-8">Consonant Runner</h1>
      {isClient ? <ConsonantGame /> : <p className="text-white">Loading game...</p>}
    </div>
  );
};

export default GeometryRunnerPage;