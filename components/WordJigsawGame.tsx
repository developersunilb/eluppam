'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface WordJigsawGameProps {
  onComplete: (success: boolean) => void;
}

interface WordJigsaw {
  word: string;
  syllables: string[];
}

const wordJigsaws: WordJigsaw[] = [
  { word: 'കവി', syllables: ['ക', 'വി'] },
  { word: 'പുഴ', syllables: ['പു', 'ഴ'] },
  { word: 'മരം', syllables: ['മ', 'രം'] },
  { word: 'കടൽ', syllables: ['ക', 'ടൽ'] },
  { word: 'അമ്മ', syllables: ['അ', 'മ്മ'] },
];

const WordJigsawGame: React.FC<WordJigsawGameProps> = ({ onComplete }) => {
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [shuffledSyllables, setShuffledSyllables] = useState<string[]>([]);
  const [placedSyllables, setPlacedSyllables] = useState<Array<string | null>>([]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [score, setScore] = useState(0);

  const currentPuzzle = wordJigsaws[currentPuzzleIndex];

  useEffect(() => {
    if (currentPuzzle) {
      setShuffledSyllables([...currentPuzzle.syllables].sort(() => Math.random() - 0.5));
      setPlacedSyllables(new Array(currentPuzzle.syllables.length).fill(null));
      setFeedback(null);
    }
  }, [currentPuzzleIndex, currentPuzzle]);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, syllable: string, index: number) => {
    e.dataTransfer.setData('syllable', syllable);
    e.dataTransfer.setData('sourceIndex', index.toString());
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetIndex: number) => {
    e.preventDefault();
    const syllable = e.dataTransfer.getData('syllable');
    const sourceIndex = parseInt(e.dataTransfer.getData('sourceIndex'));

    if (placedSyllables[targetIndex] === null) {
      const newPlacedSyllables = [...placedSyllables];
      newPlacedSyllables[targetIndex] = syllable;
      setPlacedSyllables(newPlacedSyllables);

      const newShuffledSyllables = [...shuffledSyllables];
      newShuffledSyllables[sourceIndex] = ''; // Remove from source
      setShuffledSyllables(newShuffledSyllables);
    }
  };

  const checkAnswer = () => {
    const isCorrect = placedSyllables.join('') === currentPuzzle.word;
    let updatedScore = score;
    if (isCorrect) {
      setFeedback('correct');
      updatedScore = score + 1;
      setScore(updatedScore);
    } else {
      setFeedback('incorrect');
    }

    setTimeout(() => {
      if (currentPuzzleIndex < wordJigsaws.length - 1) {
        setCurrentPuzzleIndex(currentPuzzleIndex + 1);
      } else {
        // Game over
        onComplete(updatedScore === wordJigsaws.length); // Use the updated score
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
          <p className="text-xl mb-2 text-kerala-green-700">Arrange the syllables to form the word:</p>
          <div className="text-5xl font-bold text-marigold-500 mb-4">{currentPuzzle?.word}</div>
        </div>

        <div className="flex justify-center gap-2 mb-4">
          {placedSyllables.map((syllable, index) => (
            <div
              key={index}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              className={`w-24 h-24 border-2 border-dashed rounded-lg flex items-center justify-center text-3xl font-bold
                ${syllable ? 'border-kerala-green-700 bg-kerala-green-100' : 'border-gray-300 bg-gray-50'}
              `}
            >
              {syllable}
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-2 mb-4">
          {shuffledSyllables.map((syllable, index) => (
            syllable ? (
              <div
                key={index}
                draggable
                onDragStart={(e) => handleDragStart(e, syllable, index)}
                className="w-24 h-24 bg-marigold-500 text-white rounded-lg flex items-center justify-center text-3xl font-bold cursor-grab"
              >
                {syllable}
              </div>
            ) : (
              (<div key={index} className="w-24 h-24"></div>) // Empty space for removed syllable
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

export default WordJigsawGame;
