'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import CloseButton from './CloseButton';

interface GameWrapperProps {
  children: React.ReactNode;
}

export default function GameWrapper({ children }: GameWrapperProps) {
  const params = useParams();
  const slug = params.slug as string; // Assuming slug is always present

  // This component will wrap individual game components.
  // It provides a consistent layout and handles the "Game Not Found" scenario
  // if a game component is not passed as children (though in our refactor, it always will be).

  return (
    <div className="min-h-screen bg-marigold-100 flex flex-col items-center justify-center p-4 relative">
      <CloseButton />
      {children ? (
        children
      ) : (
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-600">Game Not Found</h1>
          <p className="text-xl mt-4">The game you are looking for does not exist.</p>
          <Link href="/games" className="mt-8 inline-block px-6 py-3 bg-blue-500 text-red rounded-lg shadow-lg hover:bg-blue-600 transition-colors">
            Back to Games Hub
          </Link>
        </div>
      )}
    </div>
  );
}
