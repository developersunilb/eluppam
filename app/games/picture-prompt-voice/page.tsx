'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import PicturePromptVoiceGame from '@/components/PicturePromptVoiceGame';
import { useProgress } from '@/context/ProgressContext';
import { Button } from '@/components/ui/button';

const PicturePromptVoicePage: React.FC = () => {
  const router = useRouter();
  const { updateLessonProgress } = useProgress();
  const [gameCompleted, setGameCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const validWords = ['മരം', 'പൂവ്', 'പൂമ്പാറ്റ', 'ചിത്രശലഭം', 'മാല', 'വെള്ളം', 'ജലം', 'പുഴ', 'വഴി', 'ചെടി', 'സൂര്യൻ', 'പുല്ല്', 'കുട്ടികൾ', 'പട്ടി', 'കൊമ്പ്', 'ചില്ല', 'മരച്ചില്ല', 'കിളി', 'പക്ഷി', 'മഞ്ഞ്', 'പറവ', 'വെളിച്ചം', 'വെട്ടം', 'മേഘം', 'ശാഖ', 'മരക്കൊമ്പ്', 'കൊമ്പ്', 'കുട്ടി', 'കാട്'];
  const imageUrl = '/image/scenery.jpg';
  const currentGameId = 'picture-prompt-voice';

  const handleGameComplete = (finalScore: number) => {
    updateLessonProgress('games', currentGameId, true, finalScore);
    setScore(finalScore);
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
          <p className="text-xl text-gray-700 mb-6">You've completed the Picture Prompt Voice Game!</p>
          <p className="text-xl text-gray-700 mb-6">Your score: {score}</p>
          <Button 
            onClick={handleGoToGames}
            className="px-8 py-3 text-lg bg-marigold-500 hover:bg-marigold-600 text-white shadow-lg">
            Go to Games Page
          </Button>
        </div>
      ) : (
        <>
          <h1 className="text-4xl font-bold text-kerala-green-800 mb-8">Level 19: Picture Prompt Voice Game</h1>
          <PicturePromptVoiceGame imageUrl={imageUrl} validWords={validWords} onComplete={handleGameComplete} />
        </>
      )}
    </div>
  );
};

export default PicturePromptVoicePage;
