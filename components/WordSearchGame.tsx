'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const rounds = [
  {
    grid: [
      ['അ', 'മ്മ', 'പ', 'റ', 'വ', 'ല', 'ത', 'ന', 'യ'],
      ['ക', 'ട', 'ല', 'ശ', 'ര', 'ണം', 'മ', 'ഴ', 'ചെ'],
      ['പ', 'ന', 'സ', 'മ', 'രം', 'ഗ', 'ള', 'ക', 'ളി'],
      ['വ', 'യ', 'ൽ', 'ആ', 'ന', 'ന്ദം', 'പ', 'ശു', 'വ'],
      ['മ', 'ല', 'ര', 'ക', 'ളി', 'ൽ', 'ഊ', 'ഞ്ഞാ', 'ൽ'],
      ['പു', 'ഴ', 'മീ', 'ൻ', 'തു', 'ള്ളി', 'ക്ക', 'ളി', 'ച്ചു'],
      ['കാ', 'ക്ക', 'പ', 'റ', 'ന്നു', 'പോ', 'യി', 'മ', 'രം'],
      ['പൂ', 'ച്ച', 'ക', 'ര', 'ഞ്ഞു', 'കൊ', 'ണ്ട്', 'ചി', 'രി'],
      ['അ', 'ണ്ണാ', 'റ', 'ക്ക', 'ണ്ണ', 'ൻ', 'മാ', 'വി', 'ൽ'],
    ],
    words: ['അമ്മ', 'മരം', 'അട', 'വയൽ', 'മീൻ','പുഴ', 'ശരണം', 'കാക്ക', 'ആന', 'പറ', 'പശു','ചെളി','മല', 'മഴ', 'പന', 'പൂച്ച', 'കളി', 'കര', 'പറവ', 'വല' , 'പശ','അണ്ണാറക്കണ്ണൻ', 'സമരം', 'ആനന്ദം', 'ചിരി', 'ഊഞ്ഞാൽ', 'പോയി'],
  },
  {
    grid: [
      ['കൊ', 'മീ', 'ൻ', 'ർ', 'ചോ', 'അ', 'ണ്ണാ', 'ൻ', 'കോ'],
      ['തു', 'ശ', 'പ്പ്', 'ഘ', 'റ്', 'പി', 'പു', 'ഷ്', 'പം'],
      ['ക്', 'ഉ', 'ത', 'ടി', 'ദ', 'യ', 'ഴ', 'പാ', 'ഇ'],
      ['പ്പ്', 'ര', 'ത്ത', 'കാ', 'ട്', 'ൽ', 'യ', 'കു', 'ല'],
      ['സം', 'ൽ', 'മ', 'രം', 'ക്ക', 'സം', 'ടം', 'യി', 'പു'],
    ],
    words: ['കൊതുക്', 'മീൻ', 'ചോറ്', 'അണ്ണാൻ', 'കോപം', 'മീശ', 'ഉത്തരം' , 'പുഴ' , 'കാക്ക' , 'തടി' , 'പുഷ്പം' , 'കുല', 'ഘടികാരം', 'ദയ', 'പിഴ', 'ഇല', 'മരം' , 'ഉരൽ' , 'ഉപ്പ്' , 'പായസം' , 'കുടം' , 'കാട്' , 'തത്ത'],
  },
  {
    grid: [
      ['പു', 'പ', 'ഊ', 'ദി', 'നം', 'ഊ', 'ഞ്ഞാ', 'ൽ', 'ക'],
      ['ക', 'ല്ല്', 'വ', 'ഴം', 'വെ', 'വ', 'ണ്', 'ഈ', 'സേ'],
      ['മാ', 'സം', 'ള', 'ക', 'ള്ളം', 'ആ', 'ഴ്', 'ച', 'ര'],
      ['ല', 'ക', 'പ്പ', 'ല', 'റ', 'ന', 'താ', 'മ', 'ര'],
    ],
    words: [ 'ദിവസം' , 'വള' , 'കള്ളം' , 'ഊഞ്ഞാൽ' , 'കല്ല്' , 'പല്ല്' ,  'കല',  'ഊഴം', 'പുക', 'പുല്ല്', 'ഊണ്' , 'കസേര' , 'താമര' , 'കറ' , 'കപ്പ' , 'മാല' , 'വെള്ളം' , 'ദിനം' , 'ആന' , 'മാസം'],
  }
];

const highlightColors = ['bg-yellow-300/50', 'bg-green-300/50', 'bg-blue-300/50', 'bg-indigo-300/50', 'bg-purple-300/50', 'bg-pink-300/50', 'bg-red-300/50', 'bg-orange-300/50'];

const WordSearchGame = () => {
  const [currentRound, setCurrentRound] = useState(0);
  const [selectedLetters, setSelectedLetters] = useState<{ row: number; col: number }[]>([]);
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [isSelecting, setIsSelecting] = useState(false);
  const [foundWordPaths, setFoundWordPaths] = useState<{ path: { row: number; col: number }[]; color: string }[]>([]);
  const [gameComplete, setGameComplete] = useState(false);

  const { grid, words } = rounds[currentRound];
  const uniqueWords = [...new Set(words)];

  const handleMouseDown = (row: number, col: number) => {
    setIsSelecting(true);
    setSelectedLetters([{ row, col }]);
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (isSelecting) {
      if (!selectedLetters.some(l => l.row === row && l.col === col)) {
        setSelectedLetters([...selectedLetters, { row, col }]);
      }
    }
  };

  const handleMouseUp = () => {
    setIsSelecting(false);
    if (selectedLetters.length < 2) {
      setSelectedLetters([]);
      return;
    }

    const selectedWord = selectedLetters.map(({ row, col }) => grid[row][col]).join('');
    const reversedSelectedWord = [...selectedLetters].reverse().map(({ row, col }) => grid[row][col]).join('');

    for (const word of uniqueWords) {
      if ((word === selectedWord || word === reversedSelectedWord) && !foundWords.has(word)) {
        setFoundWords(prev => new Set(prev).add(word));
        const newPath = {
          path: selectedLetters,
          color: highlightColors[foundWords.size % highlightColors.length],
        };
        setFoundWordPaths(prev => [...prev, newPath]);
        break;
      }
    }

    setSelectedLetters([]);
  };

  const getCellHighlight = (row: number, col: number) => {
    for (const p of foundWordPaths) {
      if (p.path.some(cell => cell.row === row && cell.col === col)) {
        return p.color;
      }
    }
    return '';
  };

  const handleNextRound = () => {
    if (currentRound < rounds.length - 1) {
      setCurrentRound(currentRound + 1);
      setFoundWords(new Set());
      setFoundWordPaths([]);
      setSelectedLetters([]);
    } else {
      setGameComplete(true);
    }
  };

  useEffect(() => {
    if (foundWords.size === uniqueWords.length && currentRound === rounds.length - 1) {
      setGameComplete(true);
    }
  }, [foundWords, currentRound, uniqueWords.length]);

  if (gameComplete) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <h2 className="text-2xl font-bold text-marigold-500 mb-4">Congrats, you have completed the word search game and unlocked the next level</h2>
        <Link href="/games" passHref>
          <Button className="mt-4 bg-marigold-500 hover:bg-marigold-600">Back to Games</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">Word Search - Round {currentRound + 1}</h2>
      <div className="flex gap-8">
        <div
          className="grid grid-cols-9 gap-1 bg-gray-100 p-2 rounded-md select-none" 
          style={{ borderCollapse: 'collapse' }}
          onMouseLeave={() => setIsSelecting(false)}
        >
          {grid.map((row, rowIndex) =>
            row.map((letter, colIndex) => {
              const isSelected = selectedLetters.some(
                (cell) => cell.row === rowIndex && cell.col === colIndex
              );
              const highlightClass = getCellHighlight(rowIndex, colIndex);
              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`relative w-14 h-14 border border-gray-300 flex items-center justify-center cursor-pointer transition-colors duration-200 ${highlightClass} ${isSelected ? 'bg-yellow-300' : 'bg-white'}`}
                  onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                  onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                  onMouseUp={handleMouseUp}
                >
                  {letter}
                </div>
              );
            })
          )}
        </div>
        <div className="w-auto">
          <h3 className="text-lg font-semibold mb-2">Found Words: {foundWords.size}/{uniqueWords.length}</h3>
          <div className="flex gap-4">
            {Array.from({ length: Math.ceil(uniqueWords.length / 10) }).map((_, colIndex) => (
              <ul key={colIndex} className="flex-1 min-w-[120px]">
                {uniqueWords.slice(colIndex * 10, (colIndex + 1) * 10).map((word, index) => (
                  <li key={index} className={`font-bold ${foundWords.has(word) ? 'text-blue-600 line-through' : 'text-gray-500'}`}>{word}</li>
                ))}
              </ul>
            ))}
          </div>
          {foundWords.size === uniqueWords.length && (
            <Button onClick={handleNextRound} className="mt-4 bg-marigold-500 hover:bg-marigold-600">
              {currentRound < rounds.length - 1 ? 'Next Round' : 'Finish Game'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WordSearchGame;
