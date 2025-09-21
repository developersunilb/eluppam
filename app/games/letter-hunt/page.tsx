'use client';

import LetterHuntGame from '@/components/LetterHuntGame';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProgress } from '@/context/ProgressContext';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

import { GAME_LEVELS } from '@/lib/game-levels';


export default function LetterHuntPage() {
  const router = useRouter();
  const { updateLessonProgress } = useProgress();
  const [gameCompleted, setGameCompleted] = useState(false);

  const currentGameId = 'letter-hunt'; // This game's ID

  const handleGameComplete = () => {
    // Mark this game as completed within the 'games' module.
    updateLessonProgress('games', currentGameId, true);
    setGameCompleted(true);
  };

  const handleGoToGames = () => {
    router.push(`/games?completed=${currentGameId}`);
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 to-marigold-50 p-4 flex flex-col items-center justify-center">
      {gameCompleted ? (
        <div className="text-center p-8 bg-white rounded-lg shadow-xl">
          <h2 className="text-3xl font-bold text-kerala-green-700 mb-4">Congratulations!</h2>
          <p className="text-xl text-gray-700 mb-6">You've completed Letter Hunt!</p>
          <Button 
            onClick={handleGoToGames}
            className="px-8 py-3 text-lg bg-marigold-500 hover:bg-marigold-600 text-white shadow-lg">
            Go to Games Page
          </Button>
        </div>
      ) : (
        <>
          <h1 className="text-4xl font-bold text-kerala-green-800 mb-8">Letter Hunt</h1>
          <LetterHuntGame onGameComplete={handleGameComplete} />
        </>
      )}
    </div>
  );
}