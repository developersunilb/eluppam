'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LearnLayout from '@/components/LearnLayout';
import { useProgress } from '@/context/ProgressContext';
import { useRouter } from 'next/navigation';

export const numbers = [
    { number: '1', word: 'ഒന്ന്', transliteration: 'onnu', audioSrc: '/audio/malayalam/numbers/1.mp3', malayalamNumeral: '൧' },
    { number: '2', word: 'രണ്ട്', transliteration: 'randu', audioSrc: '/audio/malayalam/numbers/2.mp3', malayalamNumeral: '൨' },
    { number: '3', word: 'മൂന്ന്', transliteration: 'moonnu', audioSrc: '/audio/malayalam/numbers/3.mp3', malayalamNumeral: '൩' },
    { number: '4', word: 'നാല്', transliteration: 'naalu', audioSrc: '/audio/malayalam/numbers/4.mp3', malayalamNumeral: '൪' },
    { number: '5', word: 'അഞ്ച്', transliteration: 'anchu', audioSrc: '/audio/malayalam/numbers/5.mp3', malayalamNumeral: '൫' },
    { number: '6', word: 'ആറ്', transliteration: 'aaru', audioSrc: '/audio/malayalam/numbers/6.mp3', malayalamNumeral: '൬' },
    { number: '7', word: 'ഏഴ്', transliteration: 'ezhu', audioSrc: '/audio/malayalam/numbers/7.mp3', malayalamNumeral: '൭' },
    { number: '8', word: 'എട്ട്', transliteration: 'ettu', audioSrc: '/audio/malayalam/numbers/8.mp3', malayalamNumeral: '൮' },
    { number: '9', word: 'ഒമ്പത്', transliteration: 'onpathu', audioSrc: '/audio/malayalam/numbers/9.mp3', malayalamNumeral: '൯' },
    { number: '10', word: 'പത്ത്', transliteration: 'pathu', audioSrc: '/audio/malayalam/numbers/10.mp3', malayalamNumeral: '൰' },
    { number: '20', word: 'ഇരുപത്', transliteration: 'irupath', audioSrc: '/audio/malayalam/numbers/20.mp3', malayalamNumeral: '൱' },
    { number: '30', word: 'മുപ്പത്', transliteration: 'muppath', audioSrc: '/audio/malayalam/numbers/30.mp3', malayalamNumeral: '൲' },
    { number: '40', word: 'നാല്പത്', transliteration: 'naalpth', audioSrc: '/audio/malayalam/numbers/40.mp3', malayalamNumeral: '൳' },
    { number: '50', word: 'അമ്പത്', transliteration: 'ampath', audioSrc: '/audio/malayalam/numbers/50.mp3', malayalamNumeral: '൴' },
    { number: '60', word: 'അറുപത്', transliteration: 'arupath', audioSrc: '/audio/malayalam/numbers/60.mp3', malayalamNumeral: '൵' },
    { number: '70', word: 'എഴുപത്', transliteration: 'ezhupath', audioSrc: '/audio/malayalam/numbers/70.mp3', malayalamNumeral: '൶' },
    { number: '80', word: 'എൺപത്', transliteration: 'enpath', audioSrc: '/audio/malayalam/numbers/80.mp3', malayalamNumeral: '൷' },
    { number: '90', word: 'തൊണ്ണൂറ്', transliteration: 'thonnooru', audioSrc: '/audio/malayalam/numbers/90.mp3', malayalamNumeral: '൸' },
    { number: '100', word: 'നൂറ്', transliteration: 'nooru', audioSrc: '/audio/malayalam/numbers/100.mp3', malayalamNumeral: '൹' },
    { number: '1000', word: 'ആയിരം', transliteration: 'aayiram', audioSrc: '/audio/malayalam/numbers/1000.mp3', malayalamNumeral: 'ൠ' },
    { number: '10000', word: 'പതിനായിരം', transliteration: 'pathinaayiram', audioSrc: '/audio/malayalam/numbers/10000.mp3', malayalamNumeral: 'ൡ' },
    { number: '100000', word: 'ലക്ഷം', transliteration: 'laksham', audioSrc: '/audio/malayalam/numbers/100000.mp3', malayalamNumeral: 'ൢ' },
];

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
