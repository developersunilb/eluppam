'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useProgress } from '@/context/ProgressContext';
import { Button } from '@/components/ui/button';

const SOLUTION = new Map<number, string>([
  [3, 'ആ'], [4, 'ന'], [10, 'മു'], [11, 'ഖം'], [14, 'ച'], [16, 'സു'], [17, 'ഖം'],
  [19, 'കോ'], [20, 'വ'], [21, 'ക്ക'], [23, 'മം'], [25, 'വി'], [26, 'മാ'], [27, 'നം'],
  [31, 'അ'], [32, 'ര'], [33, 'ളി'], [37, 'ഉ'], [38, 'ര'], [39, 'ൽ'], [43, 'ആ'],
  [44, 'ല'], [50, 'മ'], [51, 'കം'],
]);

const ROWS = 8;
const COLS = 7;
const totalSquares = ROWS * COLS;
const blackSquares = [18, 24, 30];
const solutionSquares = Array.from(SOLUTION.keys());
const allSquares = Array.from({ length: totalSquares }, (_, i) => i + 1);

const REMOVED_SQUARES = allSquares.filter(sq => 
  !solutionSquares.includes(sq) && !blackSquares.includes(sq)
);

const CLUE_NUMBERS = new Map<number, number>([
  [3, 1], [10, 2], [4, 10], [14, 12], [16, 3], [19, 4], [20, 11], [25, 5], [31, 6], [37, 7], [43, 8], [50, 9],
]);

export default function CrosswordPuzzleGame() {
  const router = useRouter();
  const { updateModuleProgress } = useProgress();
  const [gameCompleted, setGameCompleted] = useState(false);
  const [wasSuccessful, setWasSuccessful] = useState(false);
  const currentGameId = 'crossword-puzzle';

  const initialLetters = useMemo(() => 
    [...new Set(Array.from(SOLUTION.values()))].sort(() => 0.5 - Math.random()), 
  []);

  const initialGrid = Array(totalSquares).fill('');
  const [grid, setGrid] = useState<string[]>(initialGrid);
  const [incorrectSquares, setIncorrectSquares] = useState<number[]>([]);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, letter: string) => {
    e.dataTransfer.setData('text/plain', letter);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    const letter = e.dataTransfer.getData('text/plain');
    const newGrid = [...grid];
    newGrid[index] = letter;
    setGrid(newGrid);
    setIncorrectSquares([]);
    checkSolution(newGrid);
  };

  const checkSolution = (currentGrid: string[]) => {
    const newIncorrectSquares: number[] = [];
    let allFilled = true;

    for (const [square, solutionLetter] of SOLUTION) {
      const squareIndex = square - 1;
      if (currentGrid[squareIndex] === '' || currentGrid[squareIndex] === undefined) {
        allFilled = false;
      } else if (currentGrid[squareIndex] !== solutionLetter) {
        newIncorrectSquares.push(squareIndex);
      }
    }

    if (allFilled) {
      if (newIncorrectSquares.length === 0) {
        updateModuleProgress(currentGameId, 'practice', 'completed', 100);
        setWasSuccessful(true);
        setGameCompleted(true);
      } else {
        setIncorrectSquares(newIncorrectSquares);
        alert('Some answers are incorrect. Please try again.');
      }
    }
  };

  const handleClearGrid = () => {
    setGrid(initialGrid);
    setIncorrectSquares([]);
  };

  const handleGoToGames = () => {
    router.push(`/games?completed=${currentGameId}`);
  };

  if (gameCompleted) {
    return (
      <div className="text-center p-8 bg-gray-800 rounded-lg shadow-xl text-white">
        <h2 className="text-3xl font-bold text-emerald-400 mb-4">
          {wasSuccessful ? 'Congratulations!' : 'Game Over'}
        </h2>
        <p className="text-xl text-gray-300 mb-6">
          {wasSuccessful ? "You've completed the Crossword Puzzle!" : "Better luck next time!"}
        </p>
        <Button 
          onClick={handleGoToGames}
          className="px-8 py-3 text-lg bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg">
          Go to Games Page
        </Button>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-start gap-8 mt-8 p-4 bg-gray-100 rounded-lg">
      <div className="flex flex-col gap-4 items-center w-48">
        <h3 className="font-bold text-lg">Letters</h3>
        <div className="grid grid-cols-3 gap-2">
          {initialLetters.map((letter, index) => (
            <div
              key={index}
              draggable
              onDragStart={(e) => handleDragStart(e, letter)}
              className="w-12 h-12 bg-marigold-300 flex items-center justify-center text-base font-bold cursor-pointer rounded-md shadow-sm hover:shadow-md transition-shadow"
            >
              {letter}
            </div>
          ))}
        </div>
        <button onClick={handleClearGrid} className="bg-green-500 text-white px-4 py-2 rounded-md w-full hover:bg-green-600 transition-colors">Clear All</button>
        <div className="text-sm text-gray-600 self-start mt-4">
          <h3 className="font-bold">Instructions:</h3>
          <ul className="list-disc list-inside">
            <li>Drag and drop the letters into the correct squares.</li>
            <li>To replace a letter, drop a new one on top.</li>
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-0 shadow-lg">
        {Array.from({ length: totalSquares }, (_, i) => {
          const cellNumber = i + 1;
          const isRemoved = REMOVED_SQUARES.includes(cellNumber);
          const isBlack = blackSquares.includes(cellNumber);
          const hasClueNumber = CLUE_NUMBERS.has(cellNumber);
          const isIncorrect = incorrectSquares.includes(i);
  
          if (isRemoved) {
            return <div key={i} className="w-12 h-12 bg-transparent" />;
          }
  
          return (
            <div
              key={i}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, i)}
              className={`w-12 h-12 border relative flex items-center justify-center ${
                isBlack ? 'bg-black' : isIncorrect ? 'bg-red-200' : 'bg-white'
              } border-gray-400`}
            >
              {hasClueNumber && (
                <span className="absolute top-0 left-0 text-xs p-0.5 font-bold text-blue-600">
                  {CLUE_NUMBERS.get(cellNumber)}
                </span>
              )}
              <div className="w-full h-full text-center text-base font-bold flex items-center justify-center text-kerala-green-800">
                {grid[i]}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-4 w-64">
        <div>
          <h3 className="font-bold text-lg mb-2">Across</h3>
          <ul className="list-none text-sm">
            <li>1. Biggest land animal</li>
            <li>2. Face</li>
            <li>3. Feeling happy</li>
            <li>4. Ivy gourd</li>
            <li>5. Aeroplane</li>
            <li>6. Oleander a poisonous flower</li>
            <li>7. Traditional kitchen tool  / Rock Mortar</li>
            <li>8. The blacksmith forge</li>
            <li>9. A Malayalam Nakshatra in astrology</li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-lg mb-2">Down</h3>
          <ul className="list-none text-sm">
            <li>1. Introduction</li>
            <li>3. Synonym of flower</li>
            <li>4. Clown</li>
            <li>5. Finger</li>
            <li>6. Half</li>
            <li>7. World / Earth</li>
            <li>8. Turtle</li>
            <li>10. Nail</li>
            <li>11. Forest</li>
            <li>12. Jackfruit</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
