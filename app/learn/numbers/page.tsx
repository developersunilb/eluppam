'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LearnLayout from '@/components/LearnLayout';
import { useProgress } from '@/context/ProgressContext';
import { useRouter } from 'next/navigation';

import { numbers } from '@/lib/data';

const MODULE_ID = 'numbers';

export default function NumbersPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSessionCompleted, setIsSessionCompleted] = useState(false); // New state
  const { updateModuleProgress, updateLessonProgress, userProgress } = useProgress(); // Integrate useProgress
  const router = useRouter(); // Integrate useRouter

  const currentNumber = numbers[currentIndex];
  const currentLessonId = currentNumber.number; // Using the number itself as the lesson ID

  // Mark current lesson as completed when navigating away from it
  useEffect(() => {
    // Special case: if we are on the last number and it's completed, mark module as completed
    if (currentIndex === numbers.length - 1 && userProgress?.modules.find(m => m.moduleId === MODULE_ID)?.lessons.find(l => l.lessonId === currentLessonId)?.completed) {
      updateModuleProgress(MODULE_ID, 'learn', 'completed', 100, currentLessonId); // Assuming 100% score for completion
    }

  }, [currentIndex, updateModuleProgress, userProgress, currentLessonId]);

  const goToNext = () => {
    // Before moving to the next, mark the current one as completed
    updateLessonProgress(MODULE_ID, currentLessonId, true);

    const nextIndex = (currentIndex + 1);
    if (nextIndex < numbers.length) {
      setCurrentIndex(nextIndex);
    } else {
      // Reached the end of numbers, mark module as completed
      updateModuleProgress(MODULE_ID, 'learn', 'completed', 100, currentLessonId); // Assuming 100% score for completion
      setIsSessionCompleted(true);
    }
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + numbers.length) % numbers.length);
  };

  const playAudio = () => {
    if (currentNumber.audioSrc) {
      const audio = new Audio(currentNumber.audioSrc);
      audio.play().catch(e => console.error("Error playing audio:", e));
    }
  };

  return (
    <LearnLayout title="Numbers">
      <div className="text-center">
        {/* The Card */}
        <div className="relative h-80 bg-marigold-100 rounded-lg flex flex-col items-center justify-center">
          {/* Malayalam Numeral Symbol */}
          {currentNumber.malayalamNumeral && (
            <span className="absolute top-4 left-4 text-5xl font-bold text-kerala-green-800">
              {currentNumber.malayalamNumeral}
            </span>
          )}
          {/* Number */}
          <h1 className="text-8xl font-bold text-kerala-green-800">{currentNumber.number}</h1>
          
          {/* Word */}
          <div className="mt-4 text-5xl text-kerala-green-700 font-bold">
            {currentNumber.word}
          </div>

          {/* Transliteration */}
          <p className="mt-2 text-2xl text-gray-500">{currentNumber.transliteration}</p>

          {/* Pronunciation Button */}
          <Button variant="ghost" size="icon" className="absolute top-4 right-4 text-kerala-green-600 hover:bg-marigold-200" onClick={playAudio}>
            <Volume2 className="h-6 w-6" />
          </Button>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <Button onClick={goToPrevious} className="bg-kerala-green-600 hover:bg-kerala-green-700 text-white">
            <ChevronLeft className="h-6 w-6 mr-2" />
            Previous
          </Button>
          <div className="text-sm text-gray-500">
            {currentIndex + 1} / {numbers.length}
          </div>
          {currentIndex === numbers.length - 1 ? (
            <Button onClick={goToNext} className="bg-green-500 hover:bg-green-600 text-white">
              Finish
            </Button>
          ) : (
            <Button onClick={goToNext} className="bg-kerala-green-600 hover:bg-kerala-green-700 text-white">
              Next
              <ChevronRight className="h-6 w-6 ml-2" />
            </Button>
          )}
        </div>

        {isSessionCompleted && (
          <div className="mt-8 text-center p-4 bg-green-100 rounded-lg">
            <h2 className="text-2xl font-bold text-green-800">Learn Session Completed!</h2>
            <p className="text-green-700">You have successfully completed the Numbers learning session.</p>
            <Button onClick={() => { setCurrentIndex(0); setIsSessionCompleted(false); }} className="mt-4 bg-kerala-green-600 hover:bg-kerala-green-700 text-white">
              Restart
            </Button>
            <Button onClick={() => router.push('/learn')} className="mt-4 ml-2 bg-marigold-500 hover:bg-marigold-600 text-white">
              Back to Learn Dashboard
            </Button>
          </div>
        )}
      </div>
    </LearnLayout>
  );
}
