'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LearnLayout from '@/components/LearnLayout';
import { useProgress } from '@/context/ProgressContext';
import { useRouter } from 'next/navigation';

export const consonants = [
    { consonant: 'ക', word: 'കപ്പൽ', meaning: 'Ship', transliteration: 'kappal', audioSrc: '/audio/malayalam/consonants/ka.mp3' },
    { consonant: 'ഖ', word: 'മുഖം', meaning: 'Face', transliteration: 'mukham', audioSrc: '/audio/malayalam/consonants/kha.mp3' },
    { consonant: 'ഗ', word: 'ഗരുഡൻ', meaning: 'Eagle', transliteration: 'garudan', audioSrc: '/audio/malayalam/consonants/ga.mp3' },
    { consonant: 'ഘ', word: 'മേഘം', meaning: 'Cloud', transliteration: 'megham', audioSrc: '/audio/malayalam/consonants/gha.mp3' },
    { consonant: 'ങ', word: 'മാങ്ങ', meaning: 'Mango', transliteration: 'maanga', audioSrc: '/audio/malayalam/consonants/nga.mp3' },
    { consonant: 'ച', word: 'ചക്രം', meaning: 'Wheel', transliteration: 'chakram', audioSrc: '/audio/malayalam/consonants/cha.mp3' },
    { consonant: 'ഛ', word: 'ഛായ', meaning: 'Photo', transliteration: 'chhaaya', audioSrc: '/audio/malayalam/consonants/chha.mp3' },
    { consonant: 'ജ', word: 'ജനൽ', meaning: 'Window', transliteration: 'janal', audioSrc: '/audio/malayalam/consonants/ja.mp3' },
    { consonant: 'ഝ', word: 'ഝഷം', meaning: 'Fish', transliteration: 'jhasham', audioSrc: '/audio/malayalam/consonants/jha.mp3' },
    { consonant: 'ഞ', word: 'ഞണ്ട്', meaning: 'Crab', transliteration: 'njandu', audioSrc: '/audio/malayalam/consonants/nja.mp3' },
    { consonant: 'ട', word: 'കുട', meaning: 'Umbrella', transliteration: 'kuda', audioSrc: '/audio/malayalam/consonants/Ta.mp3' },
    { consonant: 'ഠ', word: 'മിഠായി', meaning: 'Sweet', transliteration: 'mithaayi', audioSrc: '/audio/malayalam/consonants/Tha.mp3' },
    { consonant: 'ഡ', word: 'ഡപ്പി', meaning: 'Small Box', transliteration: 'dappi', audioSrc: '/audio/malayalam/consonants/Da.mp3' },
    { consonant: 'ഢ', word: 'ഢക്ക', meaning: 'Drum', transliteration: 'dhakka', audioSrc: '/audio/malayalam/consonants/Dha.mp3' },
    { consonant: 'ണ', word: 'പണം', meaning: 'Money', transliteration: 'panam', audioSrc: '/audio/malayalam/consonants/Na.mp3' },
    { consonant: 'ത', word: 'തല', meaning: 'Head', transliteration: 'thala', audioSrc: '/audio/malayalam/consonants/tha.mp3' },
    { consonant: 'ഥ', word: 'രഥം', meaning: 'Chariot', transliteration: 'ratham', audioSrc: '/audio/malayalam/consonants/thha.mp3' },
    { consonant: 'ദ', word: 'ദീപം', meaning: 'Lamp', transliteration: 'deepam', audioSrc: '/audio/malayalam/consonants/da.mp3' },
    { consonant: 'ധ', word: 'ധനുസ്സ്', meaning: 'Bow', transliteration: 'dhanuss', audioSrc: '/audio/malayalam/consonants/dha.mp3' },
    { consonant: 'ന', word: 'നദി', meaning: 'River', transliteration: 'nadi', audioSrc: '/audio/malayalam/consonants/na.mp3' },
    { consonant: 'പ', word: 'പശു', meaning: 'Cow', transliteration: 'pashu', audioSrc: '/audio/malayalam/consonants/pa.mp3' },
    { consonant: 'ഫ', word: 'ഫലം', meaning: 'Fruit', transliteration: 'phalam', audioSrc: '/audio/malayalam/consonants/pha.mp3' },
    { consonant: 'ബ', word: 'ബലൂൺ', meaning: 'Balloon', transliteration: 'baloon', audioSrc: '/audio/malayalam/consonants/ba.mp3' },
    { consonant: 'ഭ', word: 'ഭരണി', meaning: 'Jar', transliteration: 'bharani', audioSrc: '/audio/malayalam/consonants/bha.mp3' },
    { consonant: 'മ', word: 'മരം', meaning: 'Tree', transliteration: 'maram', audioSrc: '/audio/malayalam/consonants/ma.mp3' },
    { consonant: 'യ', word: 'മുയൽ', meaning: 'Rabbit', transliteration: 'muyal', audioSrc: '/audio/malayalam/consonants/ya.mp3' },
    { consonant: 'ര', word: 'ശരം', meaning: 'Arrow', transliteration: 'sharam', audioSrc: '/audio/malayalam/consonants/ra.mp3' },
    { consonant: 'ല', word: 'ലഡ്ഡു', meaning: 'Laddu', transliteration: 'laddu', audioSrc: '/audio/malayalam/consonants/la.mp3' },
    { consonant: 'വ', word: 'വല', meaning: 'Net', transliteration: 'vala', audioSrc: '/audio/malayalam/consonants/va.mp3' },
    { consonant: 'ശ', word: 'ശലഭം', meaning: 'Butterfly', transliteration: 'shalabham', audioSrc: '/audio/malayalam/consonants/sha.mp3' },
    { consonant: 'ഷ', word: 'ഷഡ്പദം', meaning: 'Insect', transliteration: 'shatpadam', audioSrc: '/audio/malayalam/consonants/Sha.mp3' },
    { consonant: 'സ', word: 'സിംഹം', meaning: 'Lion', transliteration: 'simham', audioSrc: '/audio/malayalam/consonants/sa.mp3' },
    { consonant: 'ഹ', word: 'ഹംസം', meaning: 'Swan', transliteration: 'hamsam', audioSrc: '/audio/malayalam/consonants/ha.mp3' },
    { consonant: 'ള', word: 'വാഴപ്പഴം', meaning: 'Banana', transliteration: 'vaazhappazham', audioSrc: '/audio/malayalam/consonants/La.mp3' },
    { consonant: 'ഴ', word: 'പുഴ', meaning: 'River', transliteration: 'puzha', audioSrc: '/audio/malayalam/consonants/zha.mp3' },
    { consonant: 'റ', word: 'പറ', meaning: 'Measuring Vessel', transliteration: 'para', audioSrc: '/audio/malayalam/consonants/Ra.mp3' },
];

const MODULE_ID = 'consonants';

export default function ConsonantsPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMoreWords, setShowMoreWords] = useState(false);
  const [isSessionCompleted, setIsSessionCompleted] = useState(false); // New state
  const { updateModuleProgress, updateLessonProgress, userProgress } = useProgress(); // Integrate useProgress
  const router = useRouter(); // Integrate useRouter

  const currentConsonant = consonants[currentIndex];
  const currentLessonId = currentConsonant.consonant; // Using the consonant itself as the lesson ID

  // Mark current lesson as completed when navigating away from it
  useEffect(() => {
    // Special case: if we are on the last consonant and it's completed, mark module as completed
    if (currentIndex === consonants.length - 1 && userProgress?.modules.find(m => m.moduleId === MODULE_ID)?.lessons.find(l => l.lessonId === currentLessonId)?.completed) {
      updateModuleProgress(MODULE_ID, 'learn', 'completed', 100, currentLessonId); // Assuming 100% score for completion
    }

  }, [currentIndex, updateModuleProgress, userProgress, currentLessonId]);

  const goToNext = () => {
    // Before moving to the next, mark the current one as completed
    updateLessonProgress(MODULE_ID, currentLessonId, true);

    const nextIndex = (currentIndex + 1);
    if (nextIndex < consonants.length) {
      setCurrentIndex(nextIndex);
    } else {
      // Reached the end of consonants, mark module as completed
      updateModuleProgress(MODULE_ID, 'learn', 'completed', 100, currentLessonId); // Assuming 100% score for completion
      setIsSessionCompleted(true);
    }
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? consonants.length - 1 : prevIndex - 1));
  };

  const playAudio = () => {
    if (currentConsonant.audioSrc) {
      const audio = new Audio(currentConsonant.audioSrc);
      audio.play().catch(e => console.error("Error playing audio:", e));
    }
  };

  const getHighlightedWord = () => {
    const word = currentConsonant.word;
    const consonant = currentConsonant.consonant;
    const parts = word.split(consonant);
    return (
      <>
        {parts[0]}
        <span className="text-red-500 font-bold">{consonant}</span>
        {parts[1]}
      </>
    );
  };

  return (
    <LearnLayout title="Vyanjanaaksharangal (Consonants)">
      <div className="text-center">
        {/* The Card */}
        <div className="relative h-80 bg-marigold-100 rounded-lg flex flex-col items-center justify-center">
          {/* Consonant */}
          <h1 className="text-8xl font-bold text-kerala-green-800">{currentConsonant.consonant}</h1>

          {/* Word */}
          <div className="mt-4 text-4xl text-kerala-green-700">
            {getHighlightedWord()}
          </div>

          {/* Transliteration */}
          <p className="mt-2 text-xl text-gray-500">{currentConsonant.transliteration}</p>

          {/* Meaning */}
          <p className="text-2xl font-semibold text-kerala-green-800 mt-2">{currentConsonant.meaning}</p>

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
            {currentIndex + 1} / {consonants.length}
          </div>
          {currentIndex === consonants.length - 1 ? (
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
            <p className="text-green-700">You have successfully completed the Consonants learning session.</p>
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
