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
}

const WordFormationGame: React.FC<WordFormationGameProps> = ({ level, letters, validWords, onLevelComplete, onNextLevel }) => {
  const [formedWord, setFormedWord] = useState<string>('');
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [score, setScore] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>('');
  const [levelCompleted, setLevelCompleted] = useState<boolean>(false);

  useEffect(() => {
    // Reset state when the level changes
    setFormedWord('');
    setFoundWords([]);
    setScore(0);
    setFeedback('');
    setLevelCompleted(false);
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
    if (foundWords.length === validWords.length) {
      onLevelComplete(score);
      setLevelCompleted(true);
    }
  }, [foundWords, validWords, onLevelComplete, score]);

  return (
    <Card className="w-full max-w-2xl mx-auto bg-white shadow-xl rounded-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-kerala-green-700">Level {level}: Form Words</CardTitle>
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
          <Button onClick={handleSubmit} disabled={levelCompleted} className="bg-kerala-green-600 hover:bg-kerala-green-700 text-white">Submit</Button>
          <Button onClick={handleBackspace} disabled={levelCompleted} variant="outline">Backspace</Button>
        </div>
        <div className="h-8">
          <p className={`text-lg font-semibold ${feedback === 'Correct!' ? 'text-green-500' : 'text-red-500'}`}>{feedback}</p>
        </div>
        {levelCompleted && (
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
