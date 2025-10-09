'use client';

import LearnLayout from '@/components/LearnLayout';
import { Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProgress } from '@/context/ProgressContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { festivals, seasons, cities, districts, malayalamDays, malayalamMonths, nakshatras, directions, positionalWords } from '@/lib/data';

const MODULE_ID = 'common-words';

const sections = [
  { title: 'Festivals', data: festivals },
  { title: 'Seasons', data: seasons },
  { title: 'Cities', data: cities },
  { title: 'Districts', data: districts },
  { title: 'Days', data: malayalamDays },
  { title: 'Months', data: malayalamMonths },
  { title: 'Nakshatras', data: nakshatras },
  { title: 'Directions', data: directions },
  { title: 'Positional Words', data: positionalWords },
];

interface CommonWordItem {
  malayalam: string;
  transliteration: string;
  audioSrc: string;
  meaning?: string;
}

export default function CommonWordsPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isSessionCompleted, setIsSessionCompleted] = useState(false);
  const { updateModuleProgress, userProgress } = useProgress();
  const router = useRouter();

  const WordCard = ({ item }: { item: CommonWordItem }) => {
    const playAudio = () => {
      if (item.audioSrc) {
        const audio = new Audio(item.audioSrc);
        audio.play().catch(e => console.error("Error playing audio:", e));
      }
    };
  
    return (
      <div className="relative bg-marigold-100 py-4 px-4 rounded-lg flex items-center">
        <div className="flex-grow pr-4 overflow-hidden">
          <p className="text-xl font-bold text-kerala-green-800 text-left break-words">{item.malayalam}</p>
          <p className="text-lg text-gray-600 text-left">{item.transliteration}</p>
          {item.meaning && <p className="text-lg text-gray-500 mt-1 text-left">({item.meaning})</p>}
        </div>
        {item.audioSrc && (
          <Button variant="ghost" size="icon" className="absolute right-4 text-kerala-green-600 hover:bg-marigold-200" onClick={playAudio}>
            <Volume2 className="h-5 w-5" />
          </Button>
        )}
      </div>
    );
  };

  useEffect(() => {
    if (userProgress) {
      const moduleProgress = userProgress.modules.find(m => m.moduleId === MODULE_ID);
      if (moduleProgress && moduleProgress.status === 'completed') {
        setIsSessionCompleted(true);
      }
    }
  }, [userProgress]);

  const goToNext = () => {
    if (currentStep < sections.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsFinished(true);
    }
  };

  const goToPrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentSection = sections[currentStep];

  return (
    <LearnLayout title="Common Words">
      <div>
        <h2 className="text-2xl font-bold text-center mb-4">{currentSection.title}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {currentSection.data.map((item) => <WordCard key={item.malayalam} item={item} />)}
        </div>
        {currentSection.title === 'Months' && (
          <p className="text-sm text-gray-500 mt-4 italic">
              These dates are. Since the Malayalam calendar is based on solar calculations and tied to the sidereal zodiac, the exact start and end dates shift slightly each year (usually by a day).
          </p>
        )}
      </div>
      <div className="mt-8 flex justify-between items-center">
        <Button onClick={goToPrevious} disabled={currentStep === 0} className="bg-kerala-green-600 hover:bg-kerala-green-700 text-white">
          Previous
        </Button>

        <div className="flex space-x-2"> {/* Use a flex container for middle buttons */}
          {isFinished && !isSessionCompleted && (
              <Button onClick={() => { updateModuleProgress(MODULE_ID, 'learn', 'completed', 100); setIsSessionCompleted(true); }} className="bg-green-500 hover:bg-green-600 text-white">
                Mark as Completed
              </Button>
          )}

          {isSessionCompleted && (
              <Button onClick={() => { updateModuleProgress(MODULE_ID, 'learn', 'not-started'); setIsSessionCompleted(false); setIsFinished(false); setCurrentStep(0);}} variant="outline" className="bg-kerala-green-600 hover:bg-kerala-green-700 text-white">
                Restart Module
              </Button>
          )}

          <Button onClick={() => router.push('/learn')} className="bg-marigold-500 hover:bg-marigold-600 text-white">
            Back to Learn Dashboard
          </Button>
        </div>

        {currentStep < sections.length - 1 ? (
          <Button onClick={goToNext} className="bg-kerala-green-600 hover:bg-kerala-green-700 text-white">
            Next
          </Button>
        ) : (
          !isFinished && ( // Only show Finish if not already finished
            (<Button onClick={goToNext} className="bg-green-500 hover:bg-green-600 text-white">Finish
                          </Button>)
          )
        )}
      </div>
    </LearnLayout>
  );
}