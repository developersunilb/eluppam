'use client';

import LearnLayout from '@/components/LearnLayout';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import MagicTracingGame from '@/components/MagicTracingGame'; // Import the actual component
import SoundMatchGame from '@/components/SoundMatchGame'; // Import the new SoundMatchGame component
import MemoryMatchGame from '@/components/MemoryMatchGame'; // Import the new MemoryMatchGame component
import WhackAVowelGame from '@/components/WhackAVowelGame'; // Import the new WhackAVowelGame component

export default function VowelsAdventurePage() {
  const router = useRouter();
  const [currentStage, setCurrentStage] = useState(1);
  const [clearTrigger, setClearTrigger] = useState(0);

  const handleTracingComplete = (success: boolean) => {
    if (success) {
      // For now, just advance to the next stage.
      // In a real game, you'd add points, play sounds, etc.
      setCurrentStage(currentStage + 1);
    } else {
      // Handle incorrect trace (e.g., retry, hint)
      console.log("Tracing not successful, try again!");
    }
  };

  const renderStage = () => {
    switch (currentStage) {
      case 1:
        return <MagicTracingGame character="അ" onComplete={handleTracingComplete} clearTrigger={clearTrigger} />;
      case 2:
        return <MagicTracingGame character="ആ" onComplete={handleTracingComplete} clearTrigger={clearTrigger} />;
      case 3:
        return <MagicTracingGame character="ഇ" onComplete={handleTracingComplete} clearTrigger={clearTrigger} />;
      case 4:
        return <MagicTracingGame character="ഈ" onComplete={handleTracingComplete} clearTrigger={clearTrigger} />;
      case 5:
        return <SoundMatchGame onComplete={handleTracingComplete} />;
      case 6:
        return <MemoryMatchGame onComplete={handleTracingComplete} />;
      case 7:
        return <WhackAVowelGame onComplete={handleTracingComplete} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center p-4">
            <h2 className="text-3xl font-bold text-kerala-green-700 mb-6">Level 1 Complete!</h2>
            <p className="text-lg text-gray-600 mb-4">Congratulations! You have completed the Vowels Adventure.</p>
            <Button onClick={() => router.push('/games')} className="mt-8 bg-marigold-500 hover:bg-marigold-600 text-white">
              Back to Games Dashboard
            </Button>
          </div>
        );
    }
  };

  return (
    <LearnLayout title="Vowels Adventure">
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1 className="text-4xl font-bold text-kerala-green-800 mb-8">Level 1: Vowels Adventure</h1>
        {renderStage()}
        <Button onClick={() => router.push('/games')} className="mt-8 bg-marigold-500 hover:bg-marigold-600 text-white">
          Back to Games Dashboard
        </Button>
      </div>
    </LearnLayout>
  );
}