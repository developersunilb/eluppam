'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface WordFormationGameProps {
  level: number;
  letters: string[];
  validWords: string[];
  onLevelComplete: (score: number) => void;
  onNextLevel: () => void;
  isLastLevel: boolean; // New prop to identify the last level
}

const WordFormationGame: React.FC<WordFormationGameProps> = ({ level, letters, validWords, onLevelComplete, onNextLevel, isLastLevel }) => {
  const [formedWord, setFormedWord] = useState<string>('');
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [score, setScore] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>('');
  const [is100PercentComplete, setIs100PercentComplete] = useState<boolean>(false);
  const [canProceed, setCanProceed] = useState<boolean>(false);

  useEffect(() => {
    // Reset state when the level changes
    setFormedWord('');
    setFoundWords([]);
    setScore(0);
    setFeedback('');
    setIs100PercentComplete(false);
    setCanProceed(false);
  }, [level]);

  const handleLetterClick = (letter: string) => {
    setFormedWord(formedWord + letter);
  };

  const handleBackspace = () => {
    setFormedWord(formedWord.slice(0, -1));
  };

  const handleSubmit = () => {
    if (foundWords.includes(formedWord)) {
      setFeedback('Already submitted');
    } else if (validWords.includes(formedWord)) {
      setFoundWords([...foundWords, formedWord]);
      setScore(score + 1);
      setFeedback('Correct!');
    } else {
      setFeedback('Incorrect');
    }
    setFormedWord('');
  };

  useEffect(() => {
    const completionThreshold = Math.floor(validWords.length * 0.75);

    // Only check for early completion on the last level
    if (isLastLevel && foundWords.length >= completionThreshold && foundWords.length < validWords.length) {
      setCanProceed(true);
    }

    if (foundWords.length === validWords.length) {
      if (!is100PercentComplete) { // Prevent multiple calls
        onLevelComplete(score);
        setIs100PercentComplete(true);
        setCanProceed(false); // Hide the early proceed button if they reach 100%
      }
    }
  }, [foundWords, validWords, onLevelComplete, score, is100PercentComplete, isLastLevel]);

  const handleProceed = () => {
    onLevelComplete(score); // Mark level as complete
    onNextLevel(); // Navigate to the next level
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-white shadow-xl rounded-lg">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="text-2xl font-bold text-kerala-green-700">Level {level}: Form Words</CardTitle>
        <div className="text-lg font-semibold text-gray-600">
          Words Found: {foundWords.length} / {validWords.length}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-center p-6">
        <div className="flex space-x-2 mb-6">
          {letters.map((letter, index) => (
            <Button key={index} onClick={() => handleLetterClick(letter)} className="text-2xl font-bold px-4 py-2 bg-marigold-500 hover:bg-marigold-600 text-white">
              {letter}
            </Button>
          ))}
        </div>
        <div className="mb-4 p-4 rounded-lg bg-gray-100 w-full text-center">
          <p className="text-lg font-semibold text-gray-700">Your word: <span className="text-kerala-green-700">{formedWord || '...'}</span></p>
        </div>
        <div className="flex space-x-4 mb-4">
          <Button onClick={handleSubmit} disabled={is100PercentComplete || canProceed} className="bg-kerala-green-600 hover:bg-kerala-green-700 text-white">Submit</Button>
          <Button onClick={handleBackspace} disabled={is100PercentComplete || canProceed} variant="outline">Backspace</Button>
        </div>
        <div className="h-8">
          <p className={`text-lg font-semibold ${feedback === 'Correct!' ? 'text-green-500' : 'text-red-500'}`}>{feedback}</p>
        </div>

        {canProceed && (
            <div className="mt-6 text-center p-4 border-2 border-dashed border-marigold-500 rounded-lg">
                <p className="text-xl font-bold text-kerala-green-700 mb-4">
                    You've found enough words to proceed!
                </p>
                <div className="flex justify-center gap-4">
                    <Button
                        onClick={handleProceed}
                        className="px-8 py-3 text-lg bg-marigold-500 hover:bg-marigold-600 text-white"
                    >
                        Proceed to Next Level
                    </Button>
                    <Button
                        onClick={() => setCanProceed(false)} // Keep playing
                        variant="outline"
                        className="px-8 py-3 text-lg border-marigold-500 text-marigold-700 hover:bg-marigold-100"
                    >
                        Keep Playing
                    </Button>
                </div>
            </div>
        )}

        {is100PercentComplete && (
          <Button onClick={onNextLevel} className="mt-4 bg-marigold-500 hover:bg-marigold-600 text-white">Next Level</Button>
        )}

        <div className="w-full mt-6">
          <h3 className="text-xl font-bold text-kerala-green-700 mb-2">Found Words:</h3>
          <ul className="grid grid-cols-3 gap-2 text-center">
            {foundWords.map((word, index) => (
              <li key={index} className="p-2 bg-marigold-100 text-marigold-800 rounded-md">{word}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default WordFormationGame;
