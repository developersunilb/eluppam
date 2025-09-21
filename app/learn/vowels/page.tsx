'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LearnLayout from '@/components/LearnLayout';
import { useProgress } from '@/context/ProgressContext';
import { useRouter } from 'next/navigation';
import StrokeAnimation from '@/components/StrokeAnimation';

// Placeholder data for 'അ'
// IMPORTANT: This is placeholder data and does not represent the actual character.
// You need to replace this with the real SVG path data for 'അ'.
// The 'length' property is the length of the path, which can be measured.
const aVowelStrokes = [
  { d: "M 25,85 C 25,20 75,20 75,85", length: 150 },
  { d: "M 50,55 C 65,45 75,65 50,85", length: 70 },
];

import { vowels, moreVowelWords } from '@/lib/data';

const MODULE_ID = 'vowels';

export default function VowelsPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMoreWords, setShowMoreWords] = useState(false);
  const [isSessionCompleted, setIsSessionCompleted] = useState(false);
  const { updateModuleProgress, updateLessonProgress, userProgress } = useProgress();
  const router = useRouter();

  const currentVowel = vowels[currentIndex];
  const currentLessonId = currentVowel.vowel; // Using the vowel itself as the lesson ID

  // Mark current lesson as completed when navigating away from it
  useEffect(() => {
    // Special case: if we are on the last vowel and it's completed, mark module as completed
    if (currentIndex === vowels.length - 1 && userProgress?.modules.find(m => m.moduleId === MODULE_ID)?.lessons.find(l => l.lessonId === currentLessonId)?.completed) {
      updateModuleProgress(MODULE_ID, 'learn', 'completed', 100, currentLessonId); // Assuming 100% score for completion
    }

  }, [currentIndex, updateModuleProgress, userProgress, currentLessonId]);

  const goToNext = () => {
    // Before moving to the next, mark the current one as completed
    updateLessonProgress(MODULE_ID, currentLessonId, true);

    const nextIndex = (currentIndex + 1);
    if (nextIndex < vowels.length) {
      setCurrentIndex(nextIndex);
    } else {
      // Reached the end of vowels, mark module as completed
      updateModuleProgress(MODULE_ID, 'learn', 'completed', 100, currentLessonId); // Assuming 100% score for completion
      setIsSessionCompleted(true);
    }
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + vowels.length) % vowels.length);
  };

  const playAudio = () => {
    if (currentVowel.audioSrc) {
      const audio = new Audio(currentVowel.audioSrc);
      audio.play().catch(e => console.error("Error playing audio:", e));
    }
  };

  const playMoreWordAudio = (audioSrc: string) => {
    if (audioSrc) {
      const audio = new Audio(audioSrc);
      audio.play().catch(e => console.error("Error playing more word audio:", e));
    }
  };

  return (
    <LearnLayout title="Swaraksharangal (Vowels)">
      <div className="text-center">
        {/* The Card */}
        <div className="relative h-80 bg-marigold-100 rounded-lg flex flex-col items-center justify-center">
          {/* GIF Image */}
          {currentVowel.gifSrc && (
            <img src={currentVowel.gifSrc} alt={`${currentVowel.vowel} writing`} className="absolute top-4 left-4 w-24 h-24 rounded-lg shadow-md" />
          )}
          {/* Vowel */}
          <h1 className="text-8xl font-bold text-kerala-green-800">{currentVowel.vowel}</h1>
          
          {/* Word */}
          <div className="mt-4 text-4xl text-kerala-green-700">
            {currentVowel.word}
          </div>

          {/* Transliteration */}
          <p className="mt-2 text-xl text-gray-500">{currentVowel.transliteration}</p>

          {/* Meaning */}
          <p className="text-2xl font-semibold text-kerala-green-800 mt-2">{currentVowel.meaning}</p>

          {/* Pronunciation Button */}
          <Button variant="ghost" size="icon" className="absolute top-4 right-4 text-kerala-green-600 hover:bg-marigold-200" onClick={playAudio}>
            <Volume2 className="h-6 w-6" />
          </Button>
        </div>

        {/* Stroke Animation for 'അ' */}
        {currentVowel.vowel === 'അ' && (
          <div className="mt-8 p-4 bg-white rounded-lg shadow-inner">
            <h3 className="text-xl font-semibold text-kerala-green-700 mb-4">Stroke Order Animation</h3>
            <StrokeAnimation
              key={currentIndex} // Re-mount component when vowel changes to restart animation
              strokes={aVowelStrokes}
              viewBox="0 0 100 100"
              className="w-48 h-48 mx-auto"
            />
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <Button onClick={goToPrevious} className="bg-kerala-green-600 hover:bg-kerala-green-700 text-white">
            <ChevronLeft className="h-6 w-6 mr-2" />
            Previous
          </Button>
          <div className="text-sm text-gray-500">
            {currentIndex + 1} / {vowels.length}
          </div>
          {currentIndex === vowels.length - 1 ? (
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
            <p className="text-green-700">You have successfully completed the vowels learning session.</p>
            <Button onClick={() => { setCurrentIndex(0); setIsSessionCompleted(false); }} className="mt-4 bg-kerala-green-600 hover:bg-kerala-green-700 text-white">
              Restart
            </Button>
            <Button onClick={() => router.push('/learn')} className="mt-4 ml-2 bg-marigold-500 hover:bg-marigold-600 text-white">
              Back to Learn Dashboard
            </Button>
          </div>
        )}

        <div className="mt-8 text-center">
          <Button onClick={() => setShowMoreWords(!showMoreWords)} variant="outline" className="text-kerala-green-700 border-kerala-green-700 hover:bg-kerala-green-50">
            {showMoreWords ? 'Hide More Words' : 'Show More Words'}
          </Button>
        </div>

        {showMoreWords && moreVowelWords[currentVowel.vowel] && (
          <div className="mt-6 p-4 bg-marigold-50 rounded-lg shadow-inner">
            <h3 className="text-xl font-semibold text-kerala-green-700 mb-3">More words starting with '{currentVowel.vowel}':</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {moreVowelWords[currentVowel.vowel].map((wordItem, index) => (
                <div key={index} className="relative bg-white p-3 rounded-md text-kerala-green-800 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="font-bold text-lg">{wordItem.malayalam}</p>
                    <p className="text-sm text-gray-600">{wordItem.meaning}</p>
                  </div>
                  {wordItem.audioSrc && (
                    <Button variant="ghost" size="icon" className="flex-shrink-0 text-kerala-green-600 hover:bg-marigold-200" onClick={() => playMoreWordAudio(wordItem.audioSrc)}>
                      <Volume2 className="h-5 w-5" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </LearnLayout>
  );
}