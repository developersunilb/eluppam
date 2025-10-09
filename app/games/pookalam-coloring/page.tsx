'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useProgress } from '@/context/ProgressContext';
import { Button } from '@/components/ui/button';

const PookalamColoringApp = dynamic(() => import('@/components/PookkalamColoringApp'), { ssr: false });

const PookalamColorSayAloudPage: React.FC = () => {
  const router = useRouter();
  const { updateModuleProgress } = useProgress();
  const [gameCompleted, setGameCompleted] = useState(false);
  const [wasSuccessful, setWasSuccessful] = useState(false);

  const currentGameId = 'pookalam-color-sayaloud';

  const handleGameComplete = (success: boolean) => {
    if (success) {
      updateModuleProgress(currentGameId, 'practice', 'completed', 100);
      setWasSuccessful(true);
    }
    setGameCompleted(true);
  };

  const handleGoToGames = () => {
    router.push(`/games?completed=${currentGameId}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 flex flex-col items-center justify-center">
      {gameCompleted ? (
        <div className="text-center p-8 bg-gray-800 rounded-lg shadow-xl">
          <h2 className="text-3xl font-bold text-emerald-400 mb-4">
            {wasSuccessful ? 'Congratulations!' : 'Game Over'}
          </h2>
          <p className="text-xl text-gray-300 mb-6">
            {wasSuccessful ? "You've completed the Pookalam Color Say-Aloud!" : "Better luck next time!"}
          </p>
          <Button 
            onClick={handleGoToGames}
            className="px-8 py-3 text-lg bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg">
            Go to Games Page
          </Button>
        </div>
      ) : (
        <>
          <h1 className="text-4xl font-bold text-emerald-400 mb-8">Pookalam Color Say-Aloud</h1>
          <PookalamColoringApp onComplete={handleGameComplete} />
        </>
      )}
    </div>
  );
};

export default PookalamColorSayAloudPage;