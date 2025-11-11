'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { useProgress } from '@/context/ProgressContext'; // Import useProgress

interface WordFindGameProps {}

const GRID_MAPPING: { [key: number]: string } = {
  6: 'മ', 11: 'കോ', 12: 'ണി', 16: 'ആ', 17: 'ഴി', 20: 'ചീ',
  21: 'വീ', 22: 'ട്', 25: 'അ', 26: 'ര', 27: 'ണ', 31: 'കം',
};

const CLOCK_DIAL_LETTERS: { [key: number]: string } = {
  12: 'മ', 1: 'കോ', 2: 'ഴി', 3: 'ണ', 4: 'ആ', 5: 'വീ',
  6: 'ട്', 7: 'ചീ', 8: 'ര', 9: 'കം', 10: 'അ', 11: 'ണി',
};

interface WordData {
  word: string;
  englishWord: string;
  indices: number[];
  orientation: 'horizontal' | 'vertical' | 'diagonal';
  image: string;
  audio: string;
}

const ALL_WORDS_DATA: WordData[] = [
    { word: 'കോണി', englishWord: 'Ladder', indices: [10, 11], orientation: 'horizontal', image: '/game/assets/image/wordfind/ladder.png', audio: '/audio/placeholder.mp3' },
    { word: 'ആഴി', englishWord: 'Sea', indices: [15, 16], orientation: 'horizontal', image: '/game/assets/image/wordfind/sea.png', audio: '/audio/placeholder.mp3' },
    { word: 'ചീവീട്', englishWord: 'Cricket', indices: [19, 20, 21], orientation: 'horizontal', image: '/game/assets/image/wordfind/cricket.png', audio: '/audio/placeholder.mp3' },
    { word: 'അരണ', englishWord: 'Skink', indices: [24, 25, 26], orientation: 'horizontal', image: '/game/assets/image/wordfind/skink.png', audio: '/audio/placeholder.mp3' },
    { word: 'മണി', englishWord: 'Bell', indices: [5, 11], orientation: 'vertical', image: '/game/assets/image/wordfind/bell.png', audio: '/audio/placeholder.mp3' },
    { word: 'കോഴി', englishWord: 'Chicken', indices: [10, 16], orientation: 'vertical', image: '/game/assets/image/wordfind/chicken.png', audio: '/audio/placeholder.mp3' },
    { word: 'ആട്', englishWord: 'Goat', indices: [15, 21], orientation: 'vertical', image: '/game/assets/image/wordfind/goat.png', audio: '/audio/placeholder.mp3' },
    { word: 'വീണ', englishWord: 'Veena, a stringed Indian musical instrument', indices: [20, 26], orientation: 'vertical', image: '/game/assets/image/wordfind/veena.png', audio: '/audio/placeholder.mp3' },
    { word: 'ചീര', englishWord: 'Spinach', indices: [19, 25], orientation: 'vertical', image: '/game/assets/image/wordfind/spinach.png', audio: '/audio/placeholder.mp3' },
    { word: 'അകം', englishWord: 'Inside, of anything, i.e inside of this can', indices: [24, 30], orientation: 'vertical', image: '/game/assets/image/wordfind/inside.png', audio: '/audio/placeholder.mp3' },
];

const ROWS = 6;
const COLS = 6;
const TOTAL_SQUARES = ROWS * COLS;

const useScreenSize = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    setIsSmallScreen(mediaQuery.matches);

    const handler = (e: { matches: boolean | ((prevState: boolean) => boolean); }) => setIsSmallScreen(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return isSmallScreen;
};

const playAudio = (audioSrc: string) => {
  const audio = new Audio(audioSrc);
  audio.play();
};

const WordCollectionDisplay: React.FC<{ title: string; words: WordData[] }> = ({ title, words }) => {
  if (words.length === 0) {
    return null; // Don't render anything if there are no words
  }

  return (
    <div className="w-full rounded-lg border-2 border-marigold-500 p-2 bg-white mb-4">
      <h3 className="text-lg font-bold text-center mb-2 text-kerala-green-700">{title}</h3>
      <div className="grid grid-cols-2 gap-2">
        {words.map((wordData) => (
          <div key={wordData.word} className="group relative flex flex-col items-center p-1 rounded-md border border-gray-200">
            <img src={wordData.image} alt={wordData.word} className="w-20 h-20 object-cover rounded-md" />
            <p className="mt-1 text-sm font-bold">{wordData.word}</p>
            <div
              className="absolute top-0 right-0 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center cursor-pointer opacity-80 group-hover:opacity-100"
              onClick={() => playAudio(wordData.audio)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12 4a1 1 0 100 2 1 1 0 000-2zm-1 5a1 1 0 11-2 0 1 1 0 012 0zm1 5a1 1 0 100 2 1 1 0 000-2z" />
              </svg>
            </div>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2 py-1 bg-black text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
              {wordData.englishWord}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
const REMOVED_SQUARES = [1, 2, 3, 4, 5, 7, 8, 9, 10, 13, 14, 15, 18, 19, 23, 24, 28, 29, 30, 32, 33, 34, 35, 36];

const CLOCK_ORDER = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

export default function WordFindGame({}: WordFindGameProps) {
  const router = useRouter();
  const { addGameProgress } = useProgress(); // Initialize useProgress
  const [grid, setGrid] = useState<string[]>(Array(TOTAL_SQUARES).fill(''));
  const [selectedGridLetters, setSelectedGridLetters] = useState<number[]>([]); // Renamed from selectedLetters for clarity
  const [feedback, setFeedback] = useState<'Correct' | 'Incorrect' | 'Already found' | 'Great job. Please proceed to quick fire challenge round' | null>(null);
  const [manuallyFoundWords, setManuallyFoundWords] = useState<WordData[]>([]);
  const [otherFoundWords, setOtherFoundWords] = useState<WordData[]>([]);
  const [isGameComplete, setIsGameComplete] = useState(false);

  const [isDragging, setIsDragging] = useState(false);
  const [currentSelection, setCurrentSelection] = useState<string[]>([]); // Letters currently being dragged
  const [dialLetters, setDialLetters] = useState(Object.values(CLOCK_DIAL_LETTERS));
  const dialRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = useState<any[]>([]);

  const resetGame = () => {
    setGrid(Array(TOTAL_SQUARES).fill(''));
    setManuallyFoundWords([]);
    setOtherFoundWords([]);
    setIsGameComplete(false);
    setFeedback(null);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !dialRef.current) return;

    const rect = dialRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newParticle = {
      id: Date.now() + Math.random(),
      x,
      y,
    };

    setParticles(prev => [...prev, newParticle]);

    setTimeout(() => {
      setParticles(prev => prev.filter(p => p.id !== newParticle.id));
    }, 1000); // Corresponds to animation duration
  };

  const reshuffleLetters = () => {
    setDialLetters(prevLetters => {
      const newLetters = [...prevLetters];
      for (let i = newLetters.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newLetters[i], newLetters[j]] = [newLetters[j], newLetters[i]];
      }
      return newLetters;
    });
  };

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

    const allFoundWords = [...manuallyFoundWords, ...otherFoundWords];
    if (allFoundWords.some(fw => fw.word === formedWord)) {
      setFeedback('Already found');
      console.log('Feedback set to: Already found');
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
      setFeedback('Correct');
      console.log('Feedback set to: correct');
      setManuallyFoundWords(prev => [...prev, foundWordData]);

      const newGrid = [...grid];
      foundWordData.indices.forEach(index => {
        const squareNumber = index + 1;
        if (GRID_MAPPING[squareNumber]) {
          newGrid[index] = GRID_MAPPING[squareNumber];
        }
      });
      setGrid(newGrid);

      // Check for other newly formed words
      const newlyFormedWords: WordData[] = [];
      ALL_WORDS_DATA.forEach(word => {
        if (word.word !== foundWordData.word && !allFoundWords.some(fw => fw.word === word.word)) {
          const isFormed = word.indices.every(index => {
            const squareNumber = index + 1;
            return newGrid[index] === GRID_MAPPING[squareNumber];
          });
          if (isFormed) {
            newlyFormedWords.push(word);
          }
        }
      });

      if (newlyFormedWords.length > 0) {
        setOtherFoundWords(prev => [...prev, ...newlyFormedWords]);
      }

      if (allFoundWords.length + 1 + newlyFormedWords.length === ALL_WORDS_DATA.length) {
        setFeedback('Great job. Please proceed to quick fire challenge round');
        setIsGameComplete(true);
        addGameProgress({ gameName: "Word Find Game", score: manuallyFoundWords.length + otherFoundWords.length, date: Date.now() }); // Record game completion
      }
    } else {
      setFeedback('Incorrect');
      console.log('Feedback set to: Incorrect');
    }

    setCurrentSelection([]);
    setTimeout(() => {
      setFeedback(null);
      console.log('Feedback cleared.');
    }, 2000);
  };

  const isSmallScreen = useScreenSize();

  return (
    <Card className="w-full max-w-7xl mx-auto bg-white shadow-xl rounded-lg p-4 mb-16">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-kerala-green-700">Word Find Game</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6">
        <div className="w-full flex flex-col lg:flex-row items-start justify-center gap-4 md:gap-8">

          {/* Left Column: Found Words */}
          <div className="w-full lg:w-1/4">
            <WordCollectionDisplay title="Found Words" words={manuallyFoundWords} />
            {(manuallyFoundWords.length === 0 && otherFoundWords.length === 0) && (
              <div className="hidden lg:flex w-full h-full items-center justify-center text-center text-gray-500 p-4 border-2 border-dashed rounded-lg">
                <p>You will see the words you have discovered here.</p>
              </div>
            )}
          </div>

          {/* Middle Column: Game Grid and Controls */}
          <div className="w-full lg:w-1/2 flex flex-col items-center gap-4">
            {/* Game Grid */}
            <div className="relative grid grid-cols-6 gap-1 border-2 border-gray-300 p-1 rounded-md">
              {Array.from({ length: TOTAL_SQUARES }, (_, i) => {
                const squareNumber = i + 1;
                if (REMOVED_SQUARES.includes(squareNumber)) {
                  return <div key={i} className="w-10 h-10 md:w-12 md:h-12 bg-transparent" />;
                }
                const isFilled = GRID_MAPPING[squareNumber] !== undefined;
                const letterInGrid = grid[i];

                return (
                  <div
                    key={i}
                    className={`relative w-10 h-10 md:w-12 md:h-12 flex items-center justify-center border border-gray-300 text-lg md:text-xl font-bold rounded-sm
                      ${isFilled ? 'bg-green-100 text-green-800' : 'bg-gray-50 text-gray-700'}
                      ${selectedGridLetters.includes(i) ? 'bg-blue-200' : ''}
                    `}
                    onClick={() => handleLetterSelect(i)}
                  >
                    {letterInGrid}
                  </div>
                );
              })}
            </div>

            {/* Clock Dial, Feedback and Buttons */}
            <div className="flex flex-col items-center gap-4">
              {/* Clock Dial Letter Selection */}
              <div
                ref={dialRef}
                className="relative w-48 h-48 rounded-full border-4 border-marigold-500 flex items-center justify-center select-none"
                onMouseLeave={endDrag} // End drag if mouse leaves dial area
                onTouchCancel={endDrag} // End drag if touch leaves dial area
                onMouseUp={endDrag} // End drag if mouse up anywhere on the dial
                onTouchEnd={endDrag} // End drag if touch up anywhere on the dial
                onMouseMove={handleMouseMove}
              >
                <style>
                  {`
                    .particle {
                      position: absolute;
                      width: 8px;
                      height: 8px;
                      background-color: green;
                      border-radius: 50%;
                      pointer-events: none;
                      animation: fade-out 1s forwards;
                    }

                    @keyframes fade-out {
                      from {
                        opacity: 1;
                        transform: scale(1);
                      }
                      to {
                        opacity: 0;
                        transform: scale(0);
                      }
                    }
                  `}
                </style>
                {particles.map(p => (
                  <div
                    key={p.id}
                    className="particle"
                    style={{ left: p.x, top: p.y }}
                  />
                ))}
                <Button onClick={reshuffleLetters} className="absolute w-8 h-8 rounded-full bg-green-600 text-white text-lg font-bold hover:bg-marigold-600 p-1">
                  <img src="/game/assets/image/wordfind/reshuffle.png" alt="Reshuffle" className="w-full h-full" />
                </Button>
                {CLOCK_ORDER.map((hourNum, index) => {
                  const letter = dialLetters[index];
                  let angleForCalc = hourNum;
                  if (hourNum === 12) {
                    angleForCalc = 0; // Treat 12 as 0 for angle calculation
                  }
                                  const angle = (angleForCalc * 30) - 90; // -90 to start at 12 o'clock (top)
                                  const radius = 75; // Distance from center
                                  const x = radius * Math.cos(angle * Math.PI / 180);
                                  const y = radius * Math.sin(angle * Math.PI / 180);
                  
                                  const isCurrentlySelected = currentSelection.includes(letter);
                  
                                  return (
                                    <div
                                      key={hourNum}
                                      className={`absolute w-8 h-8 flex items-center justify-center rounded-full bg-marigold-300 text-base font-bold cursor-pointer transition-colors                        ${isCurrentlySelected ? 'bg-blue-500 text-white' : ''}
                        hover:bg-marigold-400
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
                <div className={`text-xl font-bold mt-4 ${feedback === 'Correct' || feedback === 'Great job. Please proceed to quick fire challenge round' ? 'text-green-600' : 'text-red-600'}`}>
                  {feedback === 'Correct' ? 'Great Job!' : feedback}
                </div>
              )}

              {/* Game Buttons */}
              <div className="flex flex-row items-center gap-2">
                {!isGameComplete && (
                <Button onClick={resetGame} className="bg-kerala-green-500 hover:bg-kerala-green-600 text-white">
                  Clear
                </Button>
                )}
                {isGameComplete && (
                  <Button onClick={() => router.push('/games/wordfind-memory-test')} className="bg-marigold-500 hover:bg-marigold-600 text-white">
                    Proceed to challenge
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Other Words */}
          <div className="w-full lg:w-1/4">
            <WordCollectionDisplay title="Other Words" words={otherFoundWords} />
          </div>
        </div>

        
      </CardContent>
    </Card>
  );
}
