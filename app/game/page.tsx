'use client';

import { useState, useEffect } from 'react';
import type { NextPage } from 'next';

// We need to dynamically import the game component
// because Phaser interacts with the window object, which is not available on the server.
import dynamic from 'next/dynamic';

const MaveliGame = dynamic(() => import('@/components/MaveliGame'), {
  ssr: false, // This is important to prevent server-side rendering
});

const GamePage: NextPage = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This ensures the component only renders on the client side
    setIsClient(true);
  }, []);

  const handleGameComplete = (success: boolean) => {
    console.log(success ? "Game completed successfully!" : "Game failed.");
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-900">
      <h1 className="text-white text-2xl absolute top-5">Maveli's Letter Hunt</h1>
      {isClient ? <MaveliGame onComplete={handleGameComplete} /> : <p className="text-white">Loading game...</p>}
    </div>
  );
};

export default GamePage;
