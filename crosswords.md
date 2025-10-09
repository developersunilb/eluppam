Across questions as below,

1. Biggest land animal?            (Answer: ആന)
2. Human face in malayalam?   (Answer: മുഖം)
3. Feeling happy (Answer: സുഖം)
4. Ivy gourd    (Answer: കോവക്ക)
5. Aeroplane    (Answer: വിമാനo)
6. Oleander, a poisonous flower     (Answer: അരളി)
7. A traditional kitchen tool / rock mortar     (Answer: ഉരൽ)
8. Blacksmith's forge                           (Answer: ആല)
9. A star / nakshatra in astrology          (Answer: മകം)

Now for the Down questions as below,

1. Introduction               (Answer: ആമുഖം)
3. Synonym of flower          (Answer: സുമം)
4. Clown                     (Answer: കോമാളി)
5. Finger                   (Answer: വിരൽ)
6. Half                     (Answer: അര)
7. World /Earth         (Answer: ഉലകം)
8. Turtle                (Answer: ആമ)
10. Nail               (Answer: നഖം)
11. Forest               (Answer: വനം)
12. Jackfruit         (Answer: ചക്ക)

We need to create letters as below so that the users can drag an drop these into the squares to form the answers.

ആ, ക്ക, ന, ഖം, വ, ച, കോ, നം, ല, മു, സു, ര, അ, ളി, കം, ഉ, മം, വി, മാ, ൽ, മ

I will instruct the correct sequence order for the letters to occupy in each square for the players to get the puzzle correctly and for us to verify when the player has got all correct and when finished a congrats audio and a picture can be dispkayed.

I will use the square numbers to denote the correct letter that should be placed in each square by user as below,

square 3 - ആ
square 4 - ന
square 10 - മു
square 11 - ഖം
square 14 - ച
square 16 - സു
square 17 - ഖം
square 19 - കോ
square 20 - വ
square 21 - ക്ക
square 23 - മം
square 25 - വി
square 26 - മാ
square 27 - നം
square 31 - അ
square 32 - ര
square 33 - ളി
square 37 - ഉ
square 38 - ര
square 39 - ൽ
square 43 - ആ
square 44 - ല
square 50 - മ
square 51 - കം

If the player places all these letters in the correct square as mentioned above then a congrats is in order.

Logic below,

import React, { useState, useMemo } from 'react';

const SOLUTION: { [key: number]: string } = {
  3: 'ആ', 4: 'ന', 10: 'മു', 11: 'ഖം', 14: 'ച', 16: 'സു', 17: 'ഖം',
  19: 'കോ', 20: 'വ', 21: 'ക്ക', 23: 'മം', 25: 'വി', 26: 'മാ', 27: 'നം',
  31: 'അ', 32: 'ര', 33: 'ളി', 37: 'ഉ', 38: 'ര', 39: 'ൽ', 43: 'ആ',
  44: 'ല', 50: 'മ', 51: 'കം',
};

const ROWS = 8;
const COLS = 7;
const totalSquares = ROWS * COLS;
const blackSquares = [18, 24, 30];
const solutionSquares = Object.keys(SOLUTION).map(Number);
const allSquares = Array.from({ length: totalSquares }, (_, i) => i + 1);

const REMOVED_SQUARES = allSquares.filter(sq => 
  !solutionSquares.includes(sq) && !blackSquares.includes(sq)
);

const CLUE_NUMBERS = {
  3: 1, 10: 2, 4: 10, 14: 12, 16: 3, 19: 4, 20: 11, 25: 5, 31: 6, 37: 7, 43: 8, 50: 9,
};

interface CrosswordPuzzleGameProps {
  onComplete: (success: boolean) => void;
}

export default function CrosswordPuzzleGame({ onComplete }: CrosswordPuzzleGameProps) {
  const initialLetters = useMemo(() => 
    [...new Set(Object.values(SOLUTION))].sort(() => 0.5 - Math.random()), 
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
    setIncorrectSquares([]); // Clear previous incorrect squares
    checkSolution(newGrid);
  };

  const checkSolution = (currentGrid: string[]) => {
    const newIncorrectSquares: number[] = [];
    let allFilled = true;

    for (const square in SOLUTION) {
      const squareIndex = parseInt(square) - 1;
      if (currentGrid[squareIndex] === '' || currentGrid[squareIndex] === undefined) {
        allFilled = false;
      } else if (currentGrid[squareIndex] !== SOLUTION[square]) {
        newIncorrectSquares.push(squareIndex);
      }
    }

    if (allFilled) {
      if (newIncorrectSquares.length === 0) {
        onComplete(true); // Solved!
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

  return (
    <div className="flex justify-center items-start gap-8 mt-8 p-4 bg-gray-100 rounded-lg">
      {/* Letter Bank and Instructions */}
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

      {/* Crossword Grid */}
      <div className="grid grid-cols-7 gap-0 shadow-lg">
        {Array.from({ length: totalSquares }, (_, i) => {
          const cellNumber = i + 1;
          const isRemoved = REMOVED_SQUARES.includes(cellNumber);
          const isBlack = blackSquares.includes(cellNumber);
          const hasClueNumber = CLUE_NUMBERS[cellNumber] !== undefined;
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

              {/* Commented out the square numbers */}
             {/* {!isBlack && (                                                                                                       
                <span                                                                                                               
                className={`absolute top-0 right-0 text-xs p-0.5 font-semibold ${                                                 
                  isBlack ? 'text-white' : 'text-gray-700'                                                                        
                }`}                                                                                                               
              >                                                                                                                   
                {cellNumber}                                                                                                      
              </span>                                                                                                             
           )} */}

              {hasClueNumber && (
                <span className="absolute top-0 left-0 text-xs p-0.5 font-bold text-blue-600">
                  {CLUE_NUMBERS[cellNumber]}
                </span>
              )}
              <div className="w-full h-full text-center text-base font-bold flex items-center justify-center text-kerala-green-800">
                {grid[i]}
              </div>
            </div>
          );
        })}
      </div>

      {/* Clues Container */}
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
