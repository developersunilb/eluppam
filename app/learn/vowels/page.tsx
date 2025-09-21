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

export const vowels = [
  { vowel: 'അ', word: 'അമ്മ', meaning: 'Mother', transliteration: 'amma', audioSrc: '/audio/malayalam/vowels/അ.wav', gifSrc: '/writing/vowels/അ.gif' },
  { vowel: 'ആ', word: 'ആന', meaning: 'Elephant', transliteration: 'aana', audioSrc: '/audio/malayalam/vowels/ആ.wav', gifSrc: '/writing/vowels/ആ.gif' },
  { vowel: 'ഇ', word: 'ഇല', meaning: 'Leaf', transliteration: 'ila', audioSrc: '/audio/malayalam/vowels/ഇ.wav', gifSrc: '/writing/vowels/ഇ.gif' },
  { vowel: 'ഈ', word: 'ഈച്ച', meaning: 'Housefly', transliteration: 'eecha', audioSrc: '/audio/malayalam/vowels/ഈ.wav', gifSrc: '/writing/vowels/ഈ.gif' },
  { vowel: 'ഉ', word: 'ഉറക്കം', meaning: 'Sleep', transliteration: 'urakkam', audioSrc: '/audio/malayalam/vowels/ഉ.wav', gifSrc: '/writing/vowels/ഉ.gif' },
  { vowel: 'ഊ', word: 'ഊഞ്ഞാൽ', meaning: 'Swing', transliteration: 'oonjaal', audioSrc: '/audio/malayalam/vowels/ഊ.wav', gifSrc: '/writing/vowels/ഊ.gif' },
  { vowel: 'ഋ', word: 'ഋഷി', meaning: 'Sage', transliteration: 'rishi', audioSrc: '/audio/malayalam/vowels/ഋ.wav', gifSrc: '/writing/vowels/ഋ.gif' },
  { vowel: 'എ', word: 'എലി', meaning: 'Rat', transliteration: 'eli', audioSrc: '/audio/malayalam/vowels/e.mp3' },
  { vowel: 'ഏ', word: 'ഏണി', meaning: 'Ladder', transliteration: 'Eni', audioSrc: '/audio/malayalam/vowels/E.mp3' },
  { vowel: 'ഐ', word: 'ഐരാവതം', meaning: 'Airavatham', transliteration: 'airaavatham', audioSrc: '/audio/malayalam/vowels/ai.mp3' },
  { vowel: 'ഒ', word: 'ഒട്ടകം', meaning: 'Camel', transliteration: 'ottakam', audioSrc: '/audio/malayalam/vowels/o.mp3' },
  { vowel: 'ഓ', word: 'ഓല', meaning: 'Palm leaf', transliteration: 'Ola', audioSrc: '/audio/malayalam/vowels/O.mp3' },
  { vowel: 'ഔ', word: 'ഔഷധം', meaning: 'Medicine', transliteration: 'oushadham', audioSrc: '/audio/malayalam/vowels/au.mp3' },
  { vowel: 'അം', word: 'അംബുജം', meaning: 'Lotus', transliteration: 'ambujam', audioSrc: '/audio/malayalam/vowels/am.mp3' },
  { vowel: 'അഃ', word: 'ദുഃഖം', meaning: 'Sadness', transliteration: 'duhkham', audioSrc: '/audio/malayalam/vowels/ah.mp3' },
];

const moreVowelWords = {
  'അ': [
    { malayalam: 'അച്ഛൻ', meaning: 'Father', audioSrc: '/audio/malayalam/vowels/more/achchan.mp3' },
    { malayalam: 'അടുക്കള', meaning: 'Kitchen', audioSrc: '/audio/malayalam/vowels/more/adukkala.mp3' },
    { malayalam: 'അരി', meaning: 'Rice', audioSrc: '/audio/malayalam/vowels/more/ari.mp3' },
  ],
  'ആ': [
    { malayalam: 'ആകാശം', meaning: 'Sky', audioSrc: '/audio/malayalam/vowels/more/aakaasham.mp3' },
    { malayalam: 'ആഹാരം', meaning: 'Food', audioSrc: '/audio/malayalam/vowels/more/aahaaram.mp3' },
    { malayalam: 'ആട്', meaning: 'Goat', audioSrc: '/audio/malayalam/vowels/more/aadu.mp3' },
  ],
  'ഇ': [
    { malayalam: 'ഇരുമ്പ്', meaning: 'Iron', audioSrc: '/audio/malayalam/vowels/more/irumb.mp3' },
    { malayalam: 'ഇടം', meaning: 'Place', audioSrc: '/audio/malayalam/vowels/more/idam.mp3' },
    { malayalam: 'ഇരുട്ട്', meaning: 'Darkness', audioSrc: '/audio/malayalam/vowels/more/irutt.mp3' },
  ],
  'ഈ': [
    { malayalam: 'ഈന്തപ്പഴം', meaning: 'Date (fruit)', audioSrc: '/audio/malayalam/vowels/more/eenthappazham.mp3' },
    { malayalam: 'ഈശ്വരൻ', meaning: 'God', audioSrc: '/audio/malayalam/vowels/more/eeswaran.mp3' },
    { malayalam: 'ഈണം', meaning: 'Melody', audioSrc: '/audio/malayalam/vowels/more/eenam.mp3' },
  ],
  'ഉ': [
    { malayalam: 'ഉറുമ്പ്', meaning: 'Ant', audioSrc: '/audio/malayalam/vowels/more/urumb.mp3' },
    { malayalam: 'ഉത്തരം', meaning: 'Answer', audioSrc: '/audio/malayalam/vowels/more/uttharam.mp3' },
    { malayalam: 'ഉപ്പ്', meaning: 'Salt', audioSrc: '/audio/malayalam/vowels/more/uppu.mp3' },
  ],
  'ഊ': [
    { malayalam: 'ഊണ്', meaning: 'Meal', audioSrc: '/audio/malayalam/vowels/more/oonu.mp3' },
    { malayalam: 'ഊഷ്മാവ്', meaning: 'Temperature', audioSrc: '/audio/malayalam/vowels/more/ooshmaav.mp3' },
    { malayalam: 'ഊർജ്ജം', meaning: 'Energy', audioSrc: '/audio/malayalam/vowels/more/oorjjam.mp3' },
  ],
  'ഋ': [
    { malayalam: 'ഋതു', meaning: 'Season', audioSrc: '/audio/malayalam/vowels/more/ruthu.mp3' },
    { malayalam: 'ഋഗ്വേദം', meaning: 'Rigveda', audioSrc: '/audio/malayalam/vowels/more/rigvedam.mp3' },
  ],
  'എ': [
    { malayalam: 'എണ്ണ', meaning: 'Oil', audioSrc: '/audio/malayalam/vowels/more/enna.mp3' },
    { malayalam: 'എഴുത്ത്', meaning: 'Writing', audioSrc: '/audio/malayalam/vowels/more/ezhuth.mp3' },
    { malayalam: 'എട്ട്', meaning: 'Eight', audioSrc: '/audio/malayalam/vowels/more/ett.mp3' },
  ],
  'ഏ': [
    { malayalam: 'ഏകത്വം', meaning: 'Unity', audioSrc: '/audio/malayalam/vowels/more/ekathwam.mp3' },
    { malayalam: 'ഏണിപ്പടി', meaning: 'Ladder step', audioSrc: '/audio/malayalam/vowels/more/enippadi.mp3' },
    { malayalam: 'ഏഴ്', meaning: 'Seven', audioSrc: '/audio/malayalam/vowels/more/ezh.mp3' },
  ],
  'ഐ': [
    { malayalam: 'ഐക്യം', meaning: 'Unity', audioSrc: '/audio/malayalam/vowels/more/aikyam.mp3' },
    { malayalam: 'ഐതിഹ്യം', meaning: 'Legend', audioSrc: '/audio/malayalam/vowels/more/aithihyam.mp3' },
  ],
  'ഒ': [
    { malayalam: 'ഒന്ന്', meaning: 'One', audioSrc: '/audio/malayalam/vowels/more/onnu.mp3' },
    { malayalam: 'ഒച്ച', meaning: 'Sound', audioSrc: '/audio/malayalam/vowels/more/ochcha.mp3' },
    { malayalam: 'ഒഴുക്ക്', meaning: 'Flow', audioSrc: '/audio/malayalam/vowels/more/ozhukk.mp3' },
  ],
  'ഓ': [
    { malayalam: 'ഓണം', meaning: 'Onam (festival)', audioSrc: '/audio/malayalam/vowels/more/onam.mp3' },
    { malayalam: 'ഓർമ്മ', meaning: 'Memory', audioSrc: '/audio/malayalam/vowels/more/ormma.mp3' },
    { malayalam: 'ഓട്ടം', meaning: 'Run', audioSrc: '/audio/malayalam/vowels/more/ottam.mp3' },
  ],
  'ഔ': [
    { malayalam: 'ഔദ്യോഗികം', meaning: 'Official', audioSrc: '/audio/malayalam/vowels/more/audyogikam.mp3' },
    { malayalam: 'ഔചിത്യം', meaning: 'Propriety', audioSrc: '/audio/malayalam/vowels/more/auchithyam.mp3' },
  ],
  'അം': [
    { malayalam: 'അംബരം', meaning: 'Sky', audioSrc: '/audio/malayalam/vowels/more/ambaram.mp3' },
    { malayalam: 'അംശം', meaning: 'Part', audioSrc: '/audio/malayalam/vowels/more/amsham.mp3' },
  ],
  'അഃ': [
    { malayalam: 'ദുഃസ്വപ്നം', meaning: 'Nightmare', audioSrc: '/audio/malayalam/vowels/more/duhswapnam.mp3' },
  ],
};

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