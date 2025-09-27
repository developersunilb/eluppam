'use client';

import { useState, useEffect } from 'react';
import LearnLayout from '@/components/LearnLayout';
import MalayalamKeyboard from '@/components/MalayalamKeyboard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronLeft, ChevronRight, Check, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useProgress } from '@/context/ProgressContext';

const practiceAboutYourself = [
    {
        sentence: 'എന്റെ പേര് [നിങ്ങളുടെ പേര്].',
        meaning: 'My name is [Your Name].',
        transliteration: 'Ente peru [Njangalude peru].',
    },
    {
        sentence: 'ഞാൻ വരുന്നത് [നിങ്ങളുടെ സ്ഥലം] നിന്നാണ്.',
        meaning: 'I am from [Your Location].',
        transliteration: 'Njan varunnathu [Njangalude sthalam] ninnanu.',
    },
    {
        sentence: 'എനിക്ക് [നിങ്ങളുടെ വയസ്സ്] വയസ്സായി.',
        meaning: 'I am [Your Age] years old.',
        transliteration: 'Enikku [Njangalude vayassu] vayassayi.',
    },
];

const MODULE_ID = 'about-yourself-practice';

export default function AboutYourselfPracticePage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(true);
  const [isSessionFinished, setIsSessionFinished] = useState(false); // New state

  const { updateModuleProgress, resetModuleProgress, userProgress } = useProgress();
  const router = useRouter();

  const currentItem = practiceAboutYourself[currentIndex];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
    setFeedback(null);
  };

  const handleKeyPress = (char: string) => {
    setUserInput((prev) => prev + char);
    setFeedback(null);
  };

  const handleBackspace = () => {
    setUserInput((prev) => prev.slice(0, -1));
    setFeedback(null);
  };

  const checkAnswer = () => {
    // For this module, we can't auto-check user's personal info.
    // We'll just provide a visual comparison.
    // User can self-assess if their input matches the pattern.
    // For now, always show "Correct" as a placeholder for self-assessment.
    setFeedback('correct'); 
  };

  const goToNext = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < practiceAboutYourself.length) {
      setCurrentIndex(nextIndex);
    } else {
      // Reached the end, mark module as completed
      updateModuleProgress(MODULE_ID, 'practice', 'completed', 100); // Assuming 100% score for completion
      setIsSessionFinished(true);
    }
    setUserInput('');
    setFeedback(null);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + practiceAboutYourself.length) % practiceAboutYourself.length);
    setUserInput('');
    setFeedback(null);
  };

  return (
    <LearnLayout title="Introduce Yourself Practice">
      <div className="text-center">
        <div className="relative bg-marigold-100 rounded-lg p-8 mb-8">
          <p className="text-xl text-gray-600 mb-2">{currentItem.meaning} ({currentItem.transliteration})</p>
          <div className="text-5xl font-bold text-kerala-green-800 flex justify-center items-center space-x-2">
            <span>{currentItem.sentence}</span>
          </div>
          
          <Input
            type="text"
            value={userInput}
            onChange={handleInputChange}
            className="w-full mt-4 text-center text-kerala-green-700 border-b-2 border-kerala-green-500 focus:border-marigold-500"
            placeholder="Type your sentence here..."
          />

          {feedback && (
            <div className={`mt-4 flex items-center justify-center text-lg font-semibold ${feedback === 'correct' ? 'text-green-600' : 'text-red-600'}`}>
              {feedback === 'correct' ? <Check className="h-6 w-6 mr-2" /> : <XCircle className="h-6 w-6 mr-2" />}
              {feedback === 'correct' ? 'Self-assess: Does your sentence match the pattern?' : 'Self-assess: Does your sentence match the pattern?'}
            </div>
          )}
        </div>

        <Button onClick={checkAnswer} className="bg-marigold-500 hover:bg-marigold-600 text-white text-lg px-8 py-3">
          Check (Self-Assess)
        </Button>

        <div className="flex justify-between items-center mt-8">
          <Button onClick={goToPrevious} className="bg-kerala-green-600 hover:bg-kerala-green-700 text-white">
            <ChevronLeft className="h-6 w-6 mr-2" />
            Previous
          </Button>
          <div className="text-sm text-gray-500">
            {currentIndex + 1} / {practiceAboutYourself.length}
          </div>
          {currentIndex === practiceAboutYourself.length - 1 ? (
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

        {isSessionFinished && (
          <div className="mt-8 text-center p-4 bg-green-100 rounded-lg">
            <h2 className="text-2xl font-bold text-green-800">Practice Session Completed!</h2>
            <p className="text-green-700">You have successfully completed the &quot;Introduce Yourself&quot; practice session.</p>
            <Button onClick={() => { setCurrentIndex(0); setUserInput(''); setFeedback(null); setIsSessionFinished(false); resetModuleProgress(MODULE_ID); }} className="mt-4 bg-kerala-green-600 hover:bg-kerala-green-700 text-white">
              Restart
            </Button>
            <Button onClick={() => router.push('/practice')} className="mt-4 ml-2 bg-marigold-500 hover:bg-marigold-600 text-white">
              Back to Practice Dashboard
            </Button>
          </div>
        )}

        <div className="mt-8">
          <Button onClick={() => setIsKeyboardVisible(!isKeyboardVisible)} variant="outline" className="mb-4">
            {isKeyboardVisible ? 'Hide Keyboard' : 'Show Keyboard'}
          </Button>
          {isKeyboardVisible && <MalayalamKeyboard onKeyPress={handleKeyPress} onBackspace={handleBackspace} />}
        </div>
      </div>
    </LearnLayout>
  );
}
