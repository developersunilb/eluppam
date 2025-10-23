'use client'

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';



interface WordData {
  word: string;
  containsTarget: boolean;
}

interface LetterHuntGameLevel {
  targetLetter: string;
  words: WordData[];
}

const gameLevels: LetterHuntGameLevel[] = [
  {
    targetLetter: 'അ',
    words: [
      { word: 'അമ്മ', containsTarget: true },
      { word: 'ആന', containsTarget: false },
      { word: 'ഇല', containsTarget: false },
      { word: 'അച്ഛൻ', containsTarget: true },
      { word: 'ഉറി', containsTarget: false },
      { word: 'അവൻ', containsTarget: true },
      { word: 'ഋഷി', containsTarget: false },
      { word: 'എലി', containsTarget: false },
      { word: 'ഐരാവതം', containsTarget: false }, // This word was causing issues
      { word: 'ഒട്ടകം', containsTarget: false },
    ],
  },
  {
    targetLetter: 'ക',
    words: [
      { word: 'കണ്ണ്', containsTarget: true },
      { word: 'പൂച്ച', containsTarget: false },
      { word: 'കാക്ക', containsTarget: true },
      { word: 'മരം', containsTarget: false },
      { word: 'കുട്ടി', containsTarget: true },
      { word: 'പുഴ', containsTarget: false },
      { word: 'കടുവ', containsTarget: true },
      { word: 'മീൻ', containsTarget: false },
      { word: 'കപ്പൽ', containsTarget: true },
      { word: 'പാമ്പ്', containsTarget: false },
    ],
  },
  {
    targetLetter: 'മ',
    words: [
      { word: 'മരം', containsTarget: true },
      { word: 'പുഴ', containsTarget: false },
      { word: 'മഴ', containsTarget: true },
      { word: 'കാറ്റ്', containsTarget: false },
      { word: 'മണ്ണ്', containsTarget: true },
      { word: 'വെള്ളം', containsTarget: false },
      { word: 'മഞ്ഞ്', containsTarget: true },
      { word: 'തീ', containsTarget: false },
      { word: 'മത്സ്യം', containsTarget: true },
      { word: 'ആകാശം', containsTarget: false },
    ],
  },
  {
    targetLetter: 'പ',
    words: [
      { word: 'പൂച്ച', containsTarget: true },
      { word: 'നായ', containsTarget: false },
      { word: 'പാമ്പ്', containsTarget: true },
      { word: 'പക്ഷി', containsTarget: true },
      { word: 'മത്സ്യം', containsTarget: false },
      { word: 'പശു', containsTarget: true },
      { word: 'ആട്', containsTarget: false },
      { word: 'പന്നി', containsTarget: true },
      { word: 'കുതിര', containsTarget: false },
      { word: 'പുലി', containsTarget: true },
    ],
  },
  {
    targetLetter: 'വ',
    words: [
      { word: 'വരം', containsTarget: true },
      { word: 'മരം', containsTarget: false },
      { word: 'വഴി', containsTarget: true },
      { word: 'വെള്ളം', containsTarget: true },
      { word: 'കാറ്റ്', containsTarget: false },
      { word: 'വല', containsTarget: true },
      { word: 'കയർ', containsTarget: false },
      { word: 'വണ്ടി', containsTarget: true },
      { word: 'ചക്രം', containsTarget: false },
      { word: 'വാഴ', containsTarget: true },
    ],
  },
];

interface LetterHuntGameProps {
  onComplete?: (success: boolean) => void;
}

const LetterHuntGame: React.FC<LetterHuntGameProps> = ({ onComplete }) => {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const currentLevel = gameLevels[currentLevelIndex];

  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [showProceedButton, setShowProceedButton] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const resetGame = () => {
    setSelectedWords([]);
    setShowResults(false);
    setFeedbackMessage('');
    setShowProceedButton(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleWordClick = (word: string) => {
    if (showResults) return; // Prevent selection after results are shown
    setSelectedWords((prevSelected) =>
      prevSelected.includes(word) ? prevSelected.filter((w) => w !== word) : [...prevSelected, word]
    );
  };

  const proceedToNext = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    onComplete?.(true);
    resetGame();
  };

  const checkAnswers = () => {
    setShowResults(true);
    const correctSelections = selectedWords.filter((word) =>
      currentLevel.words.find((w) => w.word === word)?.containsTarget
    );
    const incorrectSelections = selectedWords.filter(
      (word) => !currentLevel.words.find((w) => w.word === word)?.containsTarget
    );
    const missedCorrect = currentLevel.words.filter(
      (w) => w.containsTarget && !selectedWords.includes(w.word)
    );

    if (selectedWords.length === 0) {
      setFeedbackMessage('Find the words and give it a try! You can do it!');
    } else if (incorrectSelections.length === 0 && missedCorrect.length === 0) {
      setFeedbackMessage('Excellent! All correct!');
      setShowProceedButton(true);
      timerRef.current = setTimeout(() => {
        proceedToNext();
      }, 8000); // 8 seconds delay
    } else if (incorrectSelections.length > 0) {
      setFeedbackMessage('Oops! Some incorrect selections. Try again!');
    } else if (missedCorrect.length > 0) {
      setFeedbackMessage('Almost! You missed some correct words.');
    }
  };

  const getWordButtonVariant = (word: string) => {
    if (showResults) {
      const wordData = currentLevel.words.find((w) => w.word === word);
      if (wordData?.containsTarget) {
        return selectedWords.includes(word) ? 'default' : 'outline';
      } else {
        return selectedWords.includes(word) ? 'destructive' : 'outline';
      }
    } else {
      return selectedWords.includes(word) ? 'default' : 'outline';
    }
  };

  const getWordButtonClassName = (word: string) => {
    let classes = '';
    const wordData = currentLevel.words.find((w) => w.word === word);

    if (!showResults) {
      if (selectedWords.includes(word)) {
        classes += ' bg-kerala-green-700 text-white hover:bg-kerala-green-800';
      } else {
        classes += ' border-kerala-green-700 text-kerala-green-700 hover:bg-kerala-green-50';
      }
    } else { // showResults is true
      if (wordData?.containsTarget) {
        if (selectedWords.includes(word)) {
          classes += ' bg-kerala-green-700 text-white'; // Correctly selected
        } else {
          classes += ' border-backwater-blue-600 text-backwater-blue-600'; // Missed correct word
        }
      } else { // Does not contain target
        if (selectedWords.includes(word)) {
          classes += ' bg-red-500 text-white'; // Incorrectly selected
        } else {
          classes += ' border-kerala-green-700 text-kerala-green-700'; // Not selected, not target
        }
      }
    }
    return classes;
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
      </CardHeader>
      <CardContent className="space-y-6 relative">
        <div className="text-center">
          <p className="text-xl mb-2 text-kerala-green-700">Find the words containing the letter:</p>
          <Badge className="text-4xl p-4 bg-marigold-500 text-white">{currentLevel.targetLetter}</Badge>
        </div>

        <div className="grid grid-cols-2 gap-6 justify-center">
          {currentLevel.words.map((data) => (
            <Button
              key={data.word}
              variant={getWordButtonVariant(data.word)}
              onClick={() => handleWordClick(data.word)}
              className={`text-lg whitespace-normal h-auto w-full px-8 py-2 flex items-center justify-center text-center ${getWordButtonClassName(data.word)}`}
              disabled={showResults}
            >
              {data.word}
            </Button>
          ))}
        </div>

        {showResults && ( // Display feedback only after checking answers
          (<div className="text-center mt-4">
            <p className="text-xl font-semibold text-kerala-green-700">{feedbackMessage}</p>
            {feedbackMessage === 'Excellent! All correct!' && (
              <img src="/game/parrotclap.gif" alt="Parrot Help" className="absolute bottom-4 right-4 h-20 w-20" />
            )}
          </div>)
        )}

        <div className="flex justify-center gap-4 mt-6">
          {!showResults ? (
            <Button onClick={checkAnswers} className="px-8 py-3 text-lg bg-gradient-to-r from-marigold-500 to-marigold-600 hover:from-marigold-600 hover:to-marigold-700 text-white shadow-lg hover:shadow-xl transition-all">
              Check Answers
            </Button>
          ) : (
            <>
              {feedbackMessage === 'Excellent! All correct!' ? (
                <Button onClick={proceedToNext} className="px-8 py-3 text-lg bg-gradient-to-r from-kerala-green-500 to-kerala-green-600 hover:from-kerala-green-600 hover:to-kerala-green-700 text-white shadow-lg hover:shadow-xl transition-all">
                  Proceed to Next Game
                </Button>
              ) : (
                <Button onClick={resetGame} className="px-8 py-3 text-lg bg-gradient-to-r from-marigold-500 to-marigold-600 hover:from-marigold-600 hover:to-marigold-700 text-white shadow-lg hover:shadow-xl transition-all">
                  Play Again
                </Button>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LetterHuntGame;