'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import WordFormationGame from '@/components/WordFormationGame';
import { useProgress } from '@/context/ProgressContext';
import { Button } from '@/components/ui/button';

const gameLevels = [
  {
    letters: ['അ', 'മ', 'ടി'],
    validWords: ['മടി', 'അടി', 'അടിമ'],
  },
  {
    letters: ['ക', 'ട', 'മ', 'ര', 'ല'],
    validWords: ['കട', 'മല', 'കടമ', 'കടല', 'കര', 'കല', 'മട'],
  },
  {
    letters: ['ദ', 'വ', 'യ', 'ള', 'ൽ', 'കാ'],
    validWords: ['കായൽ', 'കാള', 'ദയ', 'വയൽ', 'വള', 'കായ', 'കാൽ', 'കാവൽ'],
  },
];

const WordFormationPage: React.FC = () => {
  const router = useRouter();
  const { updateLessonProgress } = useProgress();
  const [currentLevel, setCurrentLevel] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [totalScore, setTotalScore] = useState(0);

  const currentGameId = 'word-formation';

  const handleLevelComplete = (score: number) => {
    const newTotalScore = totalScore + score;
    setTotalScore(newTotalScore);
    const percentage = (score / gameLevels[currentLevel].validWords.length) * 100;
    if (percentage > 50 && currentLevel < gameLevels.length - 1) {
      // Unlock next level
    } else if (currentLevel === gameLevels.length - 1) {
      setGameCompleted(true);
      updateLessonProgress('games', currentGameId, true, newTotalScore);
    }
  };

  const handleNextLevel = () => {
    if (currentLevel < gameLevels.length - 1) {
      setCurrentLevel(currentLevel + 1);
    }
  };

  const handleGoToGames = () => {
    router.push(`/games?completed=${currentGameId}`);
  };

  const currentLevelData = gameLevels[currentLevel];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 to-marigold-50 p-4 flex flex-col items-center justify-center">
      {gameCompleted ? (
        <div className="text-center p-8 bg-white rounded-lg shadow-xl">
          <h2 className="text-3xl font-bold text-kerala-green-700 mb-4">Congratulations!</h2>
          <p className="text-xl text-gray-700 mb-6">You have completed the Word Formation game!</p>
          <p className="text-xl text-gray-700 mb-6">Your total score: {totalScore}</p>
          <Button 
            onClick={handleGoToGames}
            className="px-8 py-3 text-lg bg-marigold-500 hover:bg-marigold-600 text-white shadow-lg">
            Go to Games Page
          </Button>
        </div>
      ) : (
        <>
          <WordFormationGame 
            level={currentLevel + 1}
            letters={currentLevelData.letters} 
            validWords={currentLevelData.validWords} 
            onLevelComplete={handleLevelComplete} 
            onNextLevel={handleNextLevel}
          />
        </>
      )}
    </div>
  );
};

export default WordFormationPage;
