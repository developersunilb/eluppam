'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PuzzleBlocksGameProps {
  onComplete: (success: boolean) => void;
}

interface WordPuzzle {
  word: string;
  letters: string[];
}

const wordPuzzles: WordPuzzle[] = [
    { word: 'അമ്മ', letters: ['അ', 'മ്മ'] },
  { word: 'ആന', letters: ['ആ', 'ന'] },
  { word: 'ഇല', letters: ['ഇ', 'ല'] },
  { word: 'ഈച്ച', letters: ['ഈ', 'ച്ച'] },
  { word: 'ഉറി', letters: ['ഉ', 'റി'] },
];

const PuzzleBlocksGame: React.FC<PuzzleBlocksGameProps> = ({ onComplete }) => {
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [shuffledLetters, setShuffledLetters] = useState<string[]>([]);
  const [placedLetters, setPlacedLetters] = useState<Array<string | null>>([]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [score, setScore] = useState(0);

  const currentPuzzle = wordPuzzles[currentPuzzleIndex];

  useEffect(() => {
    if (currentPuzzle) {
      setShuffledLetters([...currentPuzzle.letters].sort(() => Math.random() - 0.5));
      setPlacedLetters(new Array(currentPuzzle.letters.length).fill(null));
      setFeedback(null);
    }
  }, [currentPuzzleIndex, currentPuzzle]);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, letter: string, index: number) => {
    e.dataTransfer.setData('letter', letter);
    e.dataTransfer.setData('sourceIndex', index.toString());
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetIndex: number) => {
    e.preventDefault();
    const letter = e.dataTransfer.getData('letter');
    const sourceIndex = parseInt(e.dataTransfer.getData('sourceIndex'));

    if (placedLetters[targetIndex] === null) {
      const newPlacedLetters = [...placedLetters];
      newPlacedLetters[targetIndex] = letter;
      setPlacedLetters(newPlacedLetters);

      const newShuffledLetters = [...shuffledLetters];
      newShuffledLetters[sourceIndex] = ''; // Remove from source
      setShuffledLetters(newShuffledLetters);
    }
  };

  const checkAnswer = () => {
    const isCorrect = placedLetters.join('') === currentPuzzle.word;
    if (isCorrect) {
      setFeedback('correct');
      setScore(score + 1);
    } else {
      setFeedback('incorrect');
    }

    setTimeout(() => {
      if (currentPuzzleIndex < wordPuzzles.length - 1) {
        setCurrentPuzzleIndex(currentPuzzleIndex + 1);
      } else {
        // Game over
        onComplete(score === wordPuzzles.length); // All correct for success
        setCurrentPuzzleIndex(0); // Reset for next play
        setScore(0);
      }
    }, 1500);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <p className="text-xl mb-2 text-kerala-green-700">Arrange the letters to form the word:</p>
          <div className="text-5xl font-bold text-marigold-500 mb-4">{currentPuzzle?.word}</div>
        </div>

        <div className="flex justify-center gap-2 mb-4">
          {placedLetters.map((letter, index) => (
            <div
              key={index}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              className={`w-20 h-20 border-2 border-dashed rounded-lg flex items-center justify-center text-3xl font-bold
                ${letter ? 'border-kerala-green-700 bg-kerala-green-100' : 'border-gray-300 bg-gray-50'}
              `}
            >
              {letter}
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-2 mb-4">
          {shuffledLetters.map((letter, index) => (
            letter ? (
              <div
                key={index}
                draggable
                onDragStart={(e) => handleDragStart(e, letter, index)}
                className="w-20 h-20 bg-marigold-500 text-white rounded-lg flex items-center justify-center text-3xl font-bold cursor-grab"
              >
                {letter}
              </div>
            ) : (
              <div key={index} className="w-20 h-20"></div> // Empty space for removed letter
            )
          ))}
        </div>

        <div className="flex justify-center">
          <Button onClick={checkAnswer} className="px-8 py-3 text-lg bg-gradient-to-r from-marigold-500 to-marigold-600 hover:from-marigold-600 hover:to-marigold-700 text-white shadow-lg hover:shadow-xl transition-all">
            Check Answer
          </Button>
        </div>

        {feedback && (
          <div className={`text-center text-2xl font-bold mt-4 ${feedback === 'correct' ? 'text-green-600' : 'text-red-600'}`}>
            {feedback === 'correct' ? 'Correct!' : 'Incorrect!'}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PuzzleBlocksGame;
