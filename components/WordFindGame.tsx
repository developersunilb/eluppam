'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface WordFindGameProps {
  onComplete: (success: boolean) => void;
}

const GRID_MAPPING: { [key: number]: string } = {
  6: 'മ', 11: 'കോ', 12: 'ണി', 16: 'ആ', 17: 'ഴി', 20: 'ചീ',
  21: 'വീ', 22: 'ട്', 25: 'അ', 26: 'ര', 27: 'ണ', 31: 'കം',
};

const CLOCK_DIAL_LETTERS: { [key: number]: string } = {
  12: 'മ', 1: 'കോ', 2: 'ഴി', 3: 'ണ', 4: 'ആ', 5: 'വീ',
  6: 'ട്', 7: 'ചീ', 8: 'ര', 9: 'കം', 10: 'അ', 11: 'ണി',
};

const ALL_WORDS_DATA: { word: string; indices: number[] }[] = [
  { word: 'കോണി', indices: [10, 11] }, // Corresponds to square numbers 11, 12
  { word: 'ആഴി', indices: [15, 16] }, // Corresponds to square numbers 16, 17
  { word: 'ചീവിട്', indices: [19, 20, 21] }, // Corresponds to square numbers 20, 21, 22
  { word: 'അരണ', indices: [24, 25, 26] }, // Corresponds to square numbers 25, 26, 27
  { word: 'മണി', indices: [5, 11] }, // Corresponds to square numbers 6, 12
  { word: 'കോഴി', indices: [10, 16] }, // Corresponds to square numbers 11, 17
  { word: 'ആട്', indices: [15, 21] }, // Corresponds to square numbers 16, 22
  { word: 'വീണ', indices: [20, 26] }, // Corresponds to square numbers 21, 27
  { word: 'ചീര', indices: [19, 25] }, // Corresponds to square numbers 20, 26
  { word: 'അകം', indices: [24, 30] }, // Corresponds to square numbers 25, 31
];

const ROWS = 6;
const COLS = 6;
const TOTAL_SQUARES = ROWS * COLS;
const REMOVED_SQUARES = [1, 2, 3, 4, 5, 7, 8, 9, 10, 13, 14, 15, 18, 19, 23, 24, 28, 29, 30, 32, 33, 34, 35, 36];

const CLOCK_ORDER = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

export default function WordFindGame({ onComplete }: WordFindGameProps) {
  const [grid, setGrid] = useState<string[]>(Array(TOTAL_SQUARES).fill(''));
  const [selectedGridLetters, setSelectedGridLetters] = useState<number[]>([]); // Renamed from selectedLetters for clarity
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | 'already_found' | null>(null);
  const [foundWords, setFoundWords] = useState<string[]>([]); // New state to track found words

  const [isDragging, setIsDragging] = useState(false);
  const [currentSelection, setCurrentSelection] = useState<string[]>([]); // Letters currently being dragged
  const [selectedClockLetters, setSelectedClockLetters] = useState<string[]>([]); // Letters that formed a correct word

  // Initialize grid with random letters (for now, just placeholders)
  useEffect(() => {
    const initialGrid = Array(TOTAL_SQUARES).fill('');
    // The grid should be empty initially, letters will be filled on correct drag/drop
    setGrid(initialGrid);
  }, []);

  const handleLetterSelect = (index: number) => {
    // This will be implemented in Phase 2
    console.log('Selected grid letter at index:', index);
  };

  const startDrag = (letter: string) => {
    setIsDragging(true);
    setCurrentSelection([letter]);
  };

  const addLetterToSelection = (letter: string) => {
    if (isDragging && !currentSelection.includes(letter)) {
      setCurrentSelection(prev => {
        const newSelection = [...prev, letter];
        return newSelection;
      });
    }
  };

  const endDrag = () => {
    setIsDragging(false);
    const formedWord = currentSelection.join('').normalize('NFC').trim(); // Add trim
    console.log('Word formed (endDrag):', `"${formedWord}"`, 'Length:', formedWord.length);

    // Log the specific entry for 'ചീവീട്' from ALL_WORDS_DATA for debugging
    const debugChiveedEntry = ALL_WORDS_DATA.find(data => data.word === 'ചീവിട്');
    if (debugChiveedEntry) {
      console.log('Debug: ALL_WORDS_DATA entry for ചീവീട്:', `"${debugChiveedEntry.word}"`, 'Length:', debugChiveedEntry.word.length);
    }

    if (formedWord.length === 0) { // Prevent processing empty selections
      setCurrentSelection([]);
      setTimeout(() => {
        setFeedback(null);
        console.log('Feedback cleared.');
      }, 2000);
      return;
    }

    if (foundWords.includes(formedWord)) {
      setFeedback('already_found');
      console.log('Feedback set to: already_found');
      setCurrentSelection([]);
      setTimeout(() => {
        setFeedback(null);
        console.log('Feedback cleared.');
      }, 2000);
      return;
    }

    const foundWordData = ALL_WORDS_DATA.find(data => {
                const normalizedDictionaryWord = data.word.normalize('NFC').trim(); // Add trim
                const comparisonResult = normalizedDictionaryWord === formedWord;
                console.log(`Comparing "${formedWord}" (len: ${formedWord.length}, codes: ${Array.from(formedWord).map(c => c.charCodeAt(0))}) with "${normalizedDictionaryWord}" (len: ${normalizedDictionaryWord.length}, codes: ${Array.from(normalizedDictionaryWord).map(c => c.charCodeAt(0))}) -> Result: ${comparisonResult}`);
                return comparisonResult;    });

    if (foundWordData) {
      setFeedback('correct');
      console.log('Feedback set to: correct');
      setFoundWords(prev => [...prev, formedWord]);
      setSelectedClockLetters(prev => [...new Set([...prev, ...currentSelection])]);

      setGrid(prevGrid => {
        const newGrid = [...prevGrid];
        foundWordData.indices.forEach(index => {
          const squareNumber = index + 1;
          if (GRID_MAPPING[squareNumber]) {
            newGrid[index] = GRID_MAPPING[squareNumber];
          }
        });
        return newGrid;
      });
    } else {
      setFeedback('incorrect');
      console.log('Feedback set to: incorrect');
    }

    setCurrentSelection([]);
    setTimeout(() => {
      setFeedback(null);
      console.log('Feedback cleared.');
    }, 2000);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white shadow-xl rounded-lg p-4">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-kerala-green-700">WordFind Game</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6">
        {/* Game Grid */}
        <div className="grid grid-cols-6 gap-1 border-2 border-gray-300 p-1 rounded-md">
          {Array.from({ length: TOTAL_SQUARES }, (_, i) => {
            const squareNumber = i + 1;
            if (REMOVED_SQUARES.includes(squareNumber)) {
              return <div key={i} className="w-16 h-16 bg-transparent" />;
            }
            const isFilled = GRID_MAPPING[squareNumber] !== undefined;
            const letterInGrid = grid[i];

            return (
              <div
                key={i}
                className={`relative w-16 h-16 flex items-center justify-center border border-gray-300 text-2xl font-bold rounded-sm
                  ${isFilled ? 'bg-green-100 text-green-800' : 'bg-gray-50 text-gray-700'}
                  ${selectedGridLetters.includes(i) ? 'bg-blue-200' : ''}
                `}
                onClick={() => handleLetterSelect(i)}
              >
                <span className="absolute top-0 right-0 text-xs p-0.5 font-semibold text-black">{squareNumber}</span>
                {letterInGrid}
              </div>
            );
          })}
        </div>

        {/* Clock Dial Letter Selection */}
        <div
          className="relative w-64 h-64 rounded-full border-4 border-marigold-500 flex items-center justify-center select-none"
          onMouseLeave={endDrag} // End drag if mouse leaves dial area
          onTouchCancel={endDrag} // End drag if touch leaves dial area
          onMouseUp={endDrag} // End drag if mouse up anywhere on the dial
          onTouchEnd={endDrag} // End drag if touch up anywhere on the dial
        >
          <div className="absolute text-xl font-bold text-marigold-700">S</div>
          {CLOCK_ORDER.map((hourNum) => {
            const letter = CLOCK_DIAL_LETTERS[hourNum];
            let angleForCalc = hourNum;
            if (hourNum === 12) {
              angleForCalc = 0; // Treat 12 as 0 for angle calculation
            }
            const angle = (angleForCalc * 30) - 90; // -90 to start at 12 o'clock (top)
            const radius = 100; // Distance from center
            const x = radius * Math.cos(angle * Math.PI / 180);
            const y = radius * Math.sin(angle * Math.PI / 180);

            const isCurrentlySelected = currentSelection.includes(letter);
            const isPermanentlySelected = selectedClockLetters.includes(letter);

            return (
              <div
                key={hourNum}
                className={`absolute w-10 h-10 flex items-center justify-center rounded-full bg-marigold-300 text-lg font-bold cursor-pointer transition-colors
                  ${isCurrentlySelected ? 'bg-blue-500 text-white' : ''}
                  ${isPermanentlySelected ? 'bg-green-500 text-white' : 'hover:bg-marigold-400'}
                `}
                style={{
                  transform: `translate(${x}px, ${y}px)`,
                }}
                onMouseDown={() => startDrag(letter)}
                onMouseEnter={() => addLetterToSelection(letter)}
                onTouchStart={() => startDrag(letter)}
                onTouchMove={() => addLetterToSelection(letter)}
              >
                {letter}
              </div>
            );
          })}
        </div>

        {/* Feedback Display */}
        {feedback && (
          <div className={`text-xl font-bold mt-4 ${feedback === 'correct' ? 'text-green-600' : 'text-red-600'}`}>
            {feedback === 'correct' ? 'Great Job!' : 'Incorrect. Try again.'}
          </div>
        )}

        {/* Placeholder for game controls/score */}
        <Button onClick={() => onComplete(true)} className="mt-4 bg-kerala-green-500 hover:bg-kerala-green-600 text-white">
          Complete Game (Placeholder)
        </Button>
      </CardContent>
    </Card>
  );
}
