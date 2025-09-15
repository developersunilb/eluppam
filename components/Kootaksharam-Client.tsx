'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Kootaksharam } from '@/lib/kootaksharam-data';
import { useProgress } from '@/context/ProgressContext';
import { useRouter } from 'next/navigation';

interface KootaksharamClientProps {
  data: Kootaksharam[];
  moduleId: string;
}

export default function KootaksharamClient({ data, moduleId }: KootaksharamClientProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSessionCompleted, setIsSessionCompleted] = useState(false);
  const { updateModuleProgress, updateLessonProgress, userProgress } = useProgress();
  const router = useRouter();

  const currentItem = data[currentIndex];
  const currentLessonId = currentItem.conjunct;

  useEffect(() => {
    if (currentIndex === data.length - 1 && userProgress?.modules.find(m => m.moduleId === moduleId)?.lessons.find(l => l.lessonId === currentLessonId)?.completed) {
      updateModuleProgress(moduleId, 'learn', 'completed', 100, currentLessonId);
    }
  }, [currentIndex, updateModuleProgress, userProgress, currentLessonId, data.length, moduleId]);

  const goToNext = () => {
    updateLessonProgress(moduleId, currentLessonId, true);

    const nextIndex = (currentIndex + 1);
    if (nextIndex < data.length) {
      setCurrentIndex(nextIndex);
    } else {
      updateModuleProgress(moduleId, 'learn', 'completed', 100, currentLessonId);
      setIsSessionCompleted(true);
    }
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? data.length - 1 : prevIndex - 1));
  };

  const playAudio = (audioSrc: string) => {
    if (audioSrc) {
      const audio = new Audio(audioSrc);
      audio.play().catch(e => console.error("Error playing audio:", e));
    } else {
      console.log("Audio not available for this item.");
    }
  };

  return (
    <div className="text-center">
      <div className="relative min-h-[20rem] bg-marigold-100 rounded-lg flex flex-col items-center justify-center p-6">
        <h1 className="text-8xl font-bold text-kerala-green-800">{currentItem.conjunct}</h1>
        <p className="mt-2 text-xl text-gray-500">{currentItem.transliteration}</p>
        
        <Button variant="ghost" size="icon" className="absolute top-4 right-4 text-kerala-green-600 hover:bg-marigold-200" onClick={() => playAudio('/* audio src placeholder */')}>
          <Volume2 className="h-6 w-6" />
        </Button>
      </div>

      <div className="flex justify-between items-center mt-8">
        <Button onClick={goToPrevious} className="bg-kerala-green-600 hover:bg-kerala-green-700 text-white">
          <ChevronLeft className="h-6 w-6 mr-2" />
          Previous
        </Button>
        <div className="text-sm text-gray-500">
          {currentIndex + 1} / {data.length}
        </div>
        {currentIndex === data.length - 1 ? (
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
            <p className="text-green-700">You have successfully completed this learning session.</p>
            <Button onClick={() => { setCurrentIndex(0); setIsSessionCompleted(false); }} className="mt-4 bg-kerala-green-600 hover:bg-kerala-green-700 text-white">
              Restart
            </Button>
            <Button onClick={() => router.push('/learn/kootaksharangal')} className="mt-4 ml-2 bg-marigold-500 hover:bg-marigold-600 text-white">
              Back to Kootaksharangal Dashboard
            </Button>
          </div>
        )}

      <div className="mt-12">
          <h2 className="text-2xl font-semibold text-kerala-green-800 mb-4">Example Words</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentItem.examples.map((example, index) => (
                  <Card key={index} className="text-left">
                      <CardHeader>
                          <div className="flex justify-between items-start">
                              <div>
                                  <CardTitle className="text-2xl font-bold text-kerala-green-700">{example.word}</CardTitle>
                                  <p className="text-gray-500">{example.transliteration}</p>
                              </div>
                              <Button variant="ghost" size="icon" className="text-kerala-green-600 hover:bg-marigold-200" onClick={() => playAudio(example.audioSrc)}>
                                  <Volume2 className="h-5 w-5" />
                              </Button>
                          </div>
                      </CardHeader>
                      <CardContent>
                          <p className="text-gray-600"><strong>Meaning:</strong> {example.meaning}</p>
                      </CardContent>
                  </Card>
              ))}
          </div>
      </div>
    </div>
  );
}
