'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

const puzzles = [
  {
    image: '/image/malayalam/puzzle-wordjigsaw/rabbit.png',
    word: 'മുയൽ',
    letters: ['മു', 'യ', 'ൽ', 'ര'],
    correctOrder: [0, 1, 2],
  },
  {
    image: '/image/malayalam/puzzle-wordjigsaw/elephant.png',
    word: 'ആന',
    letters: ['ആ', 'ന', 'മ', 'ട'],
    correctOrder: [0, 1],
  },
  {
    image: '/image/malayalam/puzzle-wordjigsaw/deer.png',
    word: 'മാൻ',
    letters: ['മാ', 'ൻ', 'ല', 'പ'],
    correctOrder: [0, 1],
  },
  {
    image: '/image/malayalam/puzzle-wordjigsaw/monkey.png',
    word: 'കുരങ്ങൻ',
    letters: ['കു', 'ര', 'ങ്ങ', 'ൻ'],
    correctOrder: [0, 1, 2, 3],
  },
];

interface WordJigsawGameProps {
  onComplete: (success: boolean) => void;
}

const WordJigsawGame = ({ onComplete }: WordJigsawGameProps) => {
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = React.useState(0);
  const [selectedIndices, setSelectedIndices] = React.useState<number[]>([]);
  const [isCorrect, setIsCorrect] = React.useState<boolean | null>(null);
  const [showWord, setShowWord] = React.useState(false);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  const currentPuzzle = puzzles[currentPuzzleIndex];

  const handleLetterClick = (index: number) => {
    if (showWord) return;
    setSelectedIndices((prev) => {
      if (prev.includes(index)) {
        return prev.filter((i) => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  const checkAnswer = () => {
    const isAnswerCorrect =
      selectedIndices.length === currentPuzzle.correctOrder.length &&
      selectedIndices.every((index, i) => index === currentPuzzle.correctOrder[i]);

    setIsCorrect(isAnswerCorrect);

    if (isAnswerCorrect) {
      setShowWord(true);
      if (audioRef.current) {
        audioRef.current.src = `/audio/malayalam/words/${currentPuzzle.word}.mp3`;
        audioRef.current.play();
      }
      toast({
        title: 'Correct Answer!',
        description: `You formed the word "${currentPuzzle.word}"!`,
        variant: 'success',
      });
    } else {
      toast({
        title: 'Please try again',
        description: 'The letters are not in the correct order.',
        variant: 'destructive',
      });
      setSelectedIndices([]);
    }
  };

  const nextPuzzle = () => {
    if (currentPuzzleIndex === puzzles.length - 1) {
      onComplete(true);
    } else {
      setSelectedIndices([]);
      setIsCorrect(null);
      setShowWord(false);
      setCurrentPuzzleIndex((prev) => (prev + 1) % puzzles.length);
    }
  };

  return (
    <div className="bg-white p-4">
            <Card className="w-full max-w-2xl mx-auto">
              <CardContent className="space-y-6">        <div className="relative w-full mx-auto">
          <img src={currentPuzzle.image} alt={currentPuzzle.word} className="w-full rounded-lg" />
          {!showWord && (
            <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-1">
              {currentPuzzle.letters.map((letter, index) => (
                <div
                  key={index}
                  onClick={() => handleLetterClick(index)}
                  className={`flex items-center justify-center text-4xl font-bold text-white bg-black bg-opacity-50 cursor-pointer transition-colors ${
                    selectedIndices.includes(index) ? 'bg-opacity-75 border-4 border-yellow-400' : ''
                  }`}
                >
                  {letter}
                </div>
              ))}
            </div>
          )}
        </div>

        {showWord && (
          <div className="text-center">
            <p className="text-4xl font-bold text-kerala-green-700">{currentPuzzle.word}</p>
            <Button onClick={() => audioRef.current?.play()} className="mt-2">
              Play Sound
            </Button>
          </div>
        )}

        <div className="flex justify-center gap-4">
          {!showWord && (
            <Button onClick={checkAnswer} className="px-8 py-3 text-lg bg-marigold-500 hover:bg-marigold-600 text-white">
              Check Answer
            </Button>
          )}
          <Button onClick={nextPuzzle} className="px-8 py-3 text-lg bg-marigold-500 hover:bg-marigold-600 text-white">
            Next Puzzle
          </Button>
        </div>
        <audio ref={audioRef} />
      </CardContent>
          </Card>
        </div>
      );};

export default WordJigsawGame;