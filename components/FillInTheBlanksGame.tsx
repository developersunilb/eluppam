'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FillInTheBlanksGameProps {
  onComplete: (success: boolean) => void;
}

interface SentencePuzzle {
  sentence: string;
  correctAnswer: string;
  options: string[];
}

const sentencePuzzles: SentencePuzzle[] = [
  {
    sentence: 'ഞാൻ ___ പോകുന്നു.',
    correctAnswer: 'വീട്ടിൽ',
    options: ['വീട്ടിൽ', 'മരത്തിൽ', 'പുഴയിൽ', 'ആകാശത്തിൽ'],
  },
  {
    sentence: 'അവൾ ഒരു ___ ആണ്.',
    correctAnswer: 'കുട്ടി',
    options: ['മരം', 'കുട്ടി', 'പൂച്ച', 'നായ'],
  },
  {
    sentence: 'ഇത് ഒരു ___ ആണ്.',
    correctAnswer: 'പുസ്തകം',
    options: ['പേന', 'പുസ്തകം', 'പെൻസിൽ', 'ബാഗ്'],
  },
];

const FillInTheBlanksGame: React.FC<FillInTheBlanksGameProps> = ({ onComplete }) => {
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const currentPuzzle = sentencePuzzles[currentPuzzleIndex];
  const sentenceParts = currentPuzzle.sentence.split('___');

  const handleOptionClick = (option: string) => {
    if (feedback) return; // Prevent multiple selections

    setSelectedOption(option);
    if (option === currentPuzzle.correctAnswer) {
      setFeedback('correct');
      setScore(score + 1);
    } else {
      setFeedback('incorrect');
    }

    setTimeout(() => {
      setFeedback(null);
      setSelectedOption(null);
      if (currentPuzzleIndex < sentencePuzzles.length - 1) {
        setCurrentPuzzleIndex(currentPuzzleIndex + 1);
      } else {
        // Game over
        onComplete(score === sentencePuzzles.length); // All correct for success
        setCurrentPuzzleIndex(0); // Reset for next play
        setScore(0);
      }
    }, 1500);
  };

  const handleNextQuestion = () => {
    setFeedback(null);
    setSelectedOption(null);
    if (currentPuzzleIndex < sentencePuzzles.length - 1) {
      setCurrentPuzzleIndex(currentPuzzleIndex + 1);
    } else {
      // Game over
      onComplete(score === sentencePuzzles.length); // All correct for success
      setCurrentPuzzleIndex(0); // Reset for next play
      setScore(0);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center justify-center">
          {currentPuzzle && (
            <p className="text-xl mb-4 text-kerala-green-700">
              {sentenceParts[0]}
              {selectedOption && feedback ? (
                <span className={feedback === 'correct' ? 'text-green-600' : 'text-red-600'}>
                  {selectedOption}
                </span>
              ) : (
                <span className="text-gray-400">___</span>
              )}
              {sentenceParts[1]}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-6 justify-center">
          {currentPuzzle?.options.map((option) => (
            <Button
              key={option}
              onClick={() => handleOptionClick(option)}
              className={`text-lg whitespace-normal h-auto w-full px-8 py-2 flex items-center justify-center text-center
                ${selectedOption === option
                  ? feedback === 'correct'
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white'
                  : feedback && option === currentPuzzle.correctAnswer
                    ? 'bg-green-300 text-white' // Show correct answer if incorrect selection
                    : 'bg-white text-kerala-green-700 border border-kerala-green-700'
                }
              `}
              disabled={!!feedback}
            >
              {option}
            </Button>
          ))}
        </div>

        {feedback && (
          <>
            <div className={`text-center text-2xl font-bold mt-4 ${feedback === 'correct' ? 'text-green-600' : 'text-red-600'}`}>
              {feedback === 'correct' ? 'Correct!' : 'Incorrect!'}
            </div>
            <div className="flex justify-center mt-4">
              <Button onClick={handleNextQuestion} className="px-8 py-3 text-lg bg-gradient-to-r from-marigold-500 to-marigold-600 hover:from-marigold-600 hover:to-marigold-700 text-white shadow-lg hover:shadow-xl transition-all">
                Next Question
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default FillInTheBlanksGame;
