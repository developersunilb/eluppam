'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProgress } from '@/context/ProgressContext';
import { Button } from '@/components/ui/button';
import MagicTracingGame from '@/components/MagicTracingGame';
import { CheckCircle, XCircle } from 'lucide-react';

// The sequence of characters for the game
const TRACING_CHARACTERS = ['അ', 'ആ', 'ഇ', 'ഈ', 'ഉ'];

export default function MagicTracingPage() {
  const router = useRouter();
  const { updateLessonProgress } = useProgress();

  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [gameStatus, setGameStatus] = useState<'playing' | 'level_complete'>('playing');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [clearCanvasTrigger, setClearCanvasTrigger] = useState(0);

  const currentGameId = 'magic-tracing';

  const handleTraceComplete = (success: boolean) => {
    if (success) {
      if (currentCharIndex < TRACING_CHARACTERS.length - 1) {
        setFeedback('correct');
        setTimeout(() => {
          setCurrentCharIndex(prev => prev + 1);
          setFeedback(null);
          setClearCanvasTrigger(prev => prev + 1);
        }, 1000);
      } else {
        setFeedback('correct');
        updateLessonProgress('games', currentGameId, true);
        setGameStatus('level_complete');
      }
    }
    else {
      setFeedback('incorrect');
      setTimeout(() => {
        setFeedback(null);
      }, 1500);
    }
  };

  const handleGoToGames = () => {
    router.push(`/games?completed=${currentGameId}`);
  };

  if (gameStatus === 'level_complete') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream-50 to-marigold-50 p-4 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-xl">
          <h2 className="text-3xl font-bold text-kerala-green-700 mb-4">
            Congratulations!
          </h2>
          <p className="text-xl text-gray-700 mb-6">
            You've passed the Magic Tracing game!
          </p>
          <Button 
            onClick={handleGoToGames}
            className="px-8 py-3 text-lg bg-marigold-500 hover:bg-marigold-600 text-white shadow-lg">
            Go to Games Page
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 to-marigold-50 p-4 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-kerala-green-800 mb-8">Magic Tracing</h1>
      <p className="text-xl text-gray-600 mb-6">Character {currentCharIndex + 1} of {TRACING_CHARACTERS.length}</p>

      <MagicTracingGame 
        character={TRACING_CHARACTERS[currentCharIndex]} 
        onComplete={handleTraceComplete} 
        clearTrigger={clearCanvasTrigger}
      />

      {feedback && (
        <div className={`mt-4 p-4 rounded-lg flex items-center text-2xl font-bold 
          ${feedback === 'correct' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {feedback === 'correct' ? <CheckCircle className="mr-2" /> : <XCircle className="mr-2" />}
          {feedback === 'correct' ? 'Perfect!' : 'Not quite, try again!'}
        </div>
      )}
    </div>
  );
}
