'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';


// Next.js page / React component for a Malayalam Scrabble-like base (Level 20)
// - TailwindCSS classes used for styling
// - Drag & drop from rack to board cells (HTML5 drag/drop)
// - Basic word validation against a per-level word list (Level 20 provided)
// - Simple scoring: 1 point per letter (can be extended to Scrabble scores)
// - Modular so you can later extract components and enhance game logic


// Level 20 data (letters and allowed words)
const LEVEL_20 = {
  id: 20,
  name: 'Level 20',
  // initial rack letters for the player (unicode Malayalam letters + conjuncts)
  rack: ['ക', 'ാ', 'ല', 'ദ', 'ി', 'യ', 'വ', 'ള', 'ട', 'മ', 'റ', 'അ', 'ം'],
  // sample allowed words for level 20 (this is the "dictionary" for validation)
  // NOTE: extend this list with a proper Malayalam lexicon later
  words: [
    'കട', 'കടല', 'കവല','മാല', 'കടമ', 'കര', 'കല', 'മടി', 'അടി', 'അട','അടിമ',
    'കായൽ', 'കാള', 'ദയ', 'വയൽ', 'വള', 'കായ', 'കാൽ', 'കാവൽ',
    'കല്യം', 'കടവി', 'മറ', 'മട', 'മറ്റു', 'ടമല', 'കലശം', 'വിനയം', 'അന്ത', 'മല','തല'
  ],
};

const LETTER_SCORES: { [key: string]: number } = {
  'ക': 1, 'ാ': 1, 'ല': 1, 'ദ': 2, 'ി': 1, 'വ': 1, 'ള': 3, 'മ': 1, 'അ': 1, 'ം': 2,
  'പ': 2, 'ൂ': 1, 'ന': 1, 'ച': 2, 'ങ': 3, 'ട': 1, 'ണ': 2, 'ത': 1, 'ഫ': 3, 'ബ': 2, 'ഭ': 3, 'യ': 2, 'ര': 1, 'ശ': 3, 'ഷ': 3, 'സ': 1, 'ഹ': 3, 'ഴ': 4, 'റ': 2,
};

const BOARD_BONUSES = [
  ['TW', null, null, 'DL', null, null, 'TW'],
  [null, 'DW', null, null, null, 'DW', null],
  [null, null, 'DL', null, 'DL', null, null],
  ['DL', null, null, 'DW', null, null, 'DL'],
  [null, null, 'DL', null, 'DL', null, null],
  [null, 'DW', null, null, null, 'DW', null],
  ['TW', null, null, 'DL', null, null, 'TW'],
];


// Helper: normalize Malayalam strings lightly (trim + NFKC if needed)
const normalize = (s: string) => (s || '').trim().normalize('NFC');

const isCombiningMark = (char: string) => {
  // This list can be expanded based on observed behavior
  const combiningMarks = ['ാ', 'ി', 'ീ', 'ു', 'ൂ', 'ൃ', 'െ', 'േ', 'ൈ', 'ൊ', 'ോ', 'ൗ', '്', 'ം', 'ഃ'];
  return combiningMarks.includes(char);
};

const renderDisplayChar = (char: string) => {
  if (isCombiningMark(char)) {
    return <>{'\u200C'}{char}</>; // Prepend with ZWNJ
  }
  return <>{char}</>;
};


export default function MalayalamScrabbleGame() {
  // 7x7 board for the base design (adjust size as needed)
  const BOARD_SIZE = 7;
  const emptyBoard = Array(BOARD_SIZE * BOARD_SIZE).fill(null);


  const [rack, setRack] = useState(LEVEL_20.rack);
  const [board, setBoard] = useState<(string | null)[]>(emptyBoard);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('Drag letters from rack to board cells to form words.');
  const [foundWords, setFoundWords] = useState<{ word: string; score: number }[]>([]);
  const [currentTurnPlacements, setCurrentTurnPlacements] = useState<{ letter: string; originalRackIndex: number; boardIndex: number }[]>([]);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showLegends, setShowLegends] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [normalizedLevelWords, setNormalizedLevelWords] = useState<string[]>([]);


  useEffect(() => {
    setNormalizedLevelWords(LEVEL_20.words.map(word => normalize(word)));
  }, []);

  useEffect(() => {
    // reset message after a few seconds
    if (!message) return;
    const t = setTimeout(() => setMessage(''), 3000);
    return () => clearTimeout(t);
  }, [message]);


  // Drag handlers
  function onDragStart(e: React.DragEvent, tileIndex: number) {
    e.dataTransfer.setData('text/plain', tileIndex.toString());
  }


  function onDropCell(e: React.DragEvent, cellIndex: number) {
    e.preventDefault();
    const tileIndexStr = e.dataTransfer.getData('text/plain');
    if (!tileIndexStr) return;
    const tileIndex = parseInt(tileIndexStr, 10);
    // if tileIndex is -1, it indicates moving from board to board (not used here)
    const tile = rack[tileIndex];
    if (!tile) return;


    // place letter if cell empty
    setBoard((prev) => {
      if (prev[cellIndex]) {
        setMessage('Cell already occupied');
        return prev;
      }
      const copy = [...prev];
      copy[cellIndex] = tile; // Store just the letter, not an object
      return copy;
    });


    // remove tile from rack
    setRack((prev) => {
      const copy = [...prev];
      copy.splice(tileIndex, 1);
      return copy;
    });

    setCurrentTurnPlacements(prev => [...prev, { letter: tile, originalRackIndex: tileIndex, boardIndex: cellIndex }]);
  }


  function onDragOver(e: React.DragEvent) {
    e.preventDefault();
  }

  // Put a tile back from board to rack
  function removeTileFromBoard(cellIndex: number) {
    setBoard((prev) => {
      const copy = [...prev];
      const letter = copy[cellIndex];
      if (letter) {
        copy[cellIndex] = null;
        setRack(prevRack => [...prevRack, letter]);
      }
      return copy; 
    });
  }

  function calculateWordScore(wordLetters: { letter: string; row: number; col: number }[]): number {
    let currentWordScore = 0;
    let wordMultiplier = 1;

    wordLetters.forEach(({ letter, row, col }) => {
      let letterValue = LETTER_SCORES[letter] || 0;
      const bonus = BOARD_BONUSES[row][col];

      if (bonus === 'DL') {
        letterValue *= 2;
      } else if (bonus === 'TL') {
        letterValue *= 3;
      }

      currentWordScore += letterValue;

      if (bonus === 'DW') {
        wordMultiplier *= 2;
      } else if (bonus === 'TW') {
        wordMultiplier *= 3;
      }
    });

    return currentWordScore * wordMultiplier;
  }

  function handleValidate() {
    let totalNewScore = 0;
    const newlyFoundWords: { word: string; score: number }[] = [];
    const validPlacedBoardIndices = new Set<number>();

    // Collect all potential words formed by current turn placements
    const potentialWords: { word: string; letters: { letter: string; row: number; col: number }[] }[] = [];

    currentTurnPlacements.forEach(placement => {
      const row = Math.floor(placement.boardIndex / BOARD_SIZE);
      const col = placement.boardIndex % BOARD_SIZE;

      // Check horizontal word
      let hWordLetters: { letter: string; row: number; col: number }[] = [];
      let tempCol = col;
      while (tempCol >= 0 && board[row * BOARD_SIZE + tempCol]) {
        tempCol--;
      }
      tempCol++; // Move back to the start of the word
      while (tempCol < BOARD_SIZE && board[row * BOARD_SIZE + tempCol]) {
        hWordLetters.push({ letter: board[row * BOARD_SIZE + tempCol]!, row, col: tempCol });
        tempCol++;
      }
      if (hWordLetters.length > 1) {
        potentialWords.push({ word: normalize(hWordLetters.map(wl => wl.letter).join('')), letters: hWordLetters });
      }

      // Check vertical word
      let vWordLetters: { letter: string; row: number; col: number }[] = [];
      let tempRow = row;
      while (tempRow >= 0 && board[tempRow * BOARD_SIZE + col]) {
        tempRow--;
      }
      tempRow++; // Move back to the start of the word
      while (tempRow < BOARD_SIZE && board[tempRow * BOARD_SIZE + col]) {
        vWordLetters.push({ letter: board[tempRow * BOARD_SIZE + col]!, row: tempRow, col });
        tempRow++;
      }
      if (vWordLetters.length > 1) {
        potentialWords.push({ word: normalize(vWordLetters.map(wl => wl.letter).join('')), letters: vWordLetters });
      }
    });

    // Filter and score unique valid words
    const uniquePotentialWords = Array.from(new Set(potentialWords.map(pw => pw.word)))
      .map(wordStr => potentialWords.find(pw => pw.word === wordStr)!);

    uniquePotentialWords.forEach(pw => {
      if (normalizedLevelWords.includes(pw.word) && !foundWords.some(fw => fw.word === pw.word)) {
        const wordScore = calculateWordScore(pw.letters);
        totalNewScore += wordScore;
        newlyFoundWords.push({ word: pw.word, score: wordScore });
        pw.letters.forEach(letter => {
          validPlacedBoardIndices.add(letter.row * BOARD_SIZE + letter.col);
        });
      }
    });

    // Handle invalid placements
    let newBoard = [...board];
    let newRack = [...rack];
    const returnedLetters: string[] = [];

    currentTurnPlacements.forEach(placement => {
      if (!validPlacedBoardIndices.has(placement.boardIndex)) {
        // This letter was placed but didn't contribute to a valid word
        newBoard[placement.boardIndex] = null; // Remove from board
        newRack.push(placement.letter); // Return to rack
        returnedLetters.push(placement.letter);
      }
    });

    setBoard(newBoard);
    setRack(newRack);

    if (newlyFoundWords.length > 0) {
      setScore(prevScore => prevScore + totalNewScore);
      setFoundWords(prevFoundWords => [...prevFoundWords, ...newlyFoundWords]);
      setMessage(`Found ${newlyFoundWords.map(fw => fw.word).join(', ')}!`);
    } else {
      setMessage('No new valid words found. Invalid letters returned to rack.');
    }

    setCurrentTurnPlacements([]); // Clear placements for next turn
  }

  const submitWord = () => {
    handleValidate();
  };

  const clearSelection = () => {
    // Logic to clear current word selection and return tiles to hand
    currentTurnPlacements.forEach(placement => {
      removeTileFromBoard(placement.boardIndex);
    });
    setCurrentTurnPlacements([]);
  };

  const shuffleHand = () => {
    setRack(prevRack => [...prevRack].sort(() => Math.random() - 0.5));
  };

  const handleBoardTileClick = (index: number) => {
    // Logic for selecting/deselecting a tile on the board
  };

  const handleHandTileClick = (index: number) => {
    // Logic for selecting/deselecting a tile in hand
  };

  const handleDropOnBoard = (e: React.DragEvent, cellIndex: number) => {
    onDropCell(e, cellIndex);
  };

  const handleDropOnHand = (e: React.DragEvent, handIndex: number) => {
    // Logic for dropping a tile back into hand (e.g., from board)
  };

  const handleReset = () => {
    setRack(LEVEL_20.rack);
    setBoard(emptyBoard);
    setScore(0);
    setFoundWords([]);
    setMessage('Board reset.');
    setShowHowToPlay(false);
    setShowLegends(false);
    setError(null);
    setCurrentTurnPlacements([]);
  };

  // ScrabbleBoard Component (Reconstructed)
  interface ScrabbleBoardProps {
    board: (string | null)[];
    onTileClick: (index: number) => void;
    selectedTile: { type: 'board' | 'hand'; index: number } | null;
    onDrop: (e: React.DragEvent, cellIndex: number) => void;
  }

  const ScrabbleBoard: React.FC<ScrabbleBoardProps> = ({ board, onTileClick, selectedTile, onDrop }) => {
    const getBonusClass = (bonus: string | null) => {
      switch (bonus) {
        case 'TW': return 'bg-kerala-green-500 text-white';
        case 'DW': return 'bg-marigold-400 text-white';
        case 'TL': return 'bg-backwater-blue-500 text-white';
        case 'DL': return 'bg-backwater-blue-300 text-white';
        default: return 'bg-cream-100';
      }
    };

    return (
      <div className="grid grid-cols-7 gap-1 p-2 border-2 border-border bg-secondary rounded-lg">
        {board.map((letter, index) => {
          const row = Math.floor(index / 7);
          const col = index % 7;
          const bonus = BOARD_BONUSES[row][col];
          const isSelected = selectedTile?.type === 'board' && selectedTile.index === index;

          return (
            <div
              key={index}
              className={`w-10 h-10 flex items-center justify-center text-lg font-bold border border-border rounded
                ${letter ? 'bg-kasavu-gold-500 text-primary-foreground' : getBonusClass(bonus)}
                ${isSelected ? 'ring-2 ring-blue-500' : ''}
                ${bonus ? 'relative' : ''}
              `}
              onClick={() => onTileClick(index)}
              onDrop={(e) => onDrop(e, index)}
              onDragOver={(e) => e.preventDefault()}
            >
              {letter && renderDisplayChar(letter)}
              {bonus && !letter && (
                <span className="absolute bottom-0.5 right-0.5 text-xs font-semibold opacity-75">
                  {bonus}
                </span>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // PlayerHand Component (Reconstructed)
  interface PlayerHandProps {
    hand: (string | null)[];
    onTileClick: (index: number) => void;
    selectedTile: { type: 'board' | 'hand'; index: number } | null;
    onDrop: (e: React.DragEvent, handIndex: number) => void;
  }

  const PlayerHand: React.FC<PlayerHandProps> = ({ hand, onTileClick, selectedTile, onDrop }) => {
    return (
      <div className="flex justify-center mt-4 p-2 border-2 border-border bg-secondary rounded-lg">
        {hand.map((letter, index) => {
          const isSelected = selectedTile?.type === 'hand' && selectedTile.index === index;
          return (
            <div
              key={index}
              className={`w-10 h-10 relative flex items-center justify-center text-lg font-bold border border-gray-300 rounded bg-kasavu-gold-300 text-foreground mx-0.5
                ${isSelected ? 'ring-2 ring-blue-500' : ''}
              `}
              onClick={() => onTileClick(index)}
              draggable
              onDragStart={(e) => e.dataTransfer.setData('text/plain', index.toString())}
              onDrop={(e) => onDrop(e, index)}
              onDragOver={(e) => e.preventDefault()}
            >
              {letter && renderDisplayChar(letter)}
              <span className="absolute top-0.5 right-0.5 text-xs font-semibold opacity-75">
                {letter ? LETTER_SCORES[letter] : 0}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">




      <div className="flex flex-col lg:flex-row justify-between gap-4 p-4 bg-card rounded-lg shadow-md">
        {/* Left Column: Found Words */}
        <div className="w-full lg:w-1/4 order-1 lg:order-1 pt-16">
          <div className="mt-4">
            <h3 className="text-xl font-semibold mb-2 text-black">
              Found Words:
            </h3>
            {foundWords.length === 0 ? (
              <p className="text-foreground">No words found yet.</p>
            ) : (
              <ul className="list-disc list-inside">
                {foundWords.map((word, index) => (
                  <li key={index} className="text-green-600">
                    {word.word} ({word.score})
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Center Column: Main Game */}
        <div className="w-full lg:w-2/4 order-2 lg:order-2 flex flex-col items-center">
          <div className="text-center mb-4">
            <p className="text-2xl font-bold text-kerala-green-700">Score: {score}</p>
          </div>
          <div className="flex justify-center space-x-4 mb-6">
            <Button onClick={() => setShowHowToPlay(!showHowToPlay)}>
              {showHowToPlay ? "Hide Instructions" : "How to Play"}
            </Button>
            <Button onClick={() => setShowLegends(!showLegends)}>
              {showLegends ? "Hide Legends" : "Show Legends"}
            </Button>
            <Button onClick={handleReset} variant="destructive">
              Reset Game
            </Button>
          </div>

          {error && <p className="text-destructive text-center mb-4">{error}</p>}
          {message && <p className="text-kerala-green-500 text-center mb-4">{message}</p>}
          <ScrabbleBoard
            board={board}
            onTileClick={handleBoardTileClick}
            selectedTile={null} // Placeholder
            onDrop={handleDropOnBoard}
          />
          <PlayerHand
            hand={rack}
            onTileClick={handleHandTileClick}
            selectedTile={null} // Placeholder
            onDrop={handleDropOnHand}
          />
          <div className="flex space-x-2 mt-4">
            <Button onClick={submitWord} disabled={currentTurnPlacements.length === 0}>
              Submit Word
            </Button>
            <Button onClick={clearSelection} variant="outline">
              Clear Selection
            </Button>
            <Button onClick={shuffleHand} variant="secondary">
              Shuffle Hand
            </Button>
          </div>
        </div>

        {/* Right Column: How to Play & Legends */}
        <div className="w-full lg:w-1/4 order-3 lg:order-3">
          {showHowToPlay && (
            <div className="mt-8 p-4 bg-backwater-blue-100 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4 text-backwater-blue-800">
                How to Play:
              </h2>
              <ul className="list-disc list-inside text-backwater-blue-700 space-y-2">
                <li>
                  Objective: Form Malayalam words using letters from your hand on the board.
                </li>
                <li>
                  Board: 7x7 grid with special bonus squares (DL, TL, DW, TW).
                </li>
                <li>
                  Tiles: Each Malayalam letter has a point value. Start with 7 tiles.
                </li>
                <li>
                  Forming Words: Words must be horizontal or vertical, connected, and valid. The first word covers the center star. Subsequent words connect to existing letters.
                </li>
                <li>
                  Playing a Turn: Select a tile, place it on an empty board square, form a word, then click "Submit Word". New tiles are drawn.
                </li>
                <li>
                  Scoring: Letter values are multiplied by letter/word bonuses. Using all 7 tiles in one turn gives a 50-point bonus.
                </li>
                <li>
                  Winning: Highest score wins when all tiles are used or no more moves are possible.
                </li>
              </ul>
            </div>
          )}

          {showLegends && (
            <div className="mt-8 p-4 bg-kerala-green-100 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4 text-kerala-green-800">
                Legends:
              </h2>
              <div className="grid grid-cols-2 gap-4 text-kerala-green-700">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Letter Values:</h3>
                  <ul className="list-disc list-inside">
                    <li>അ, ഇ, ഉ, എ, ഒ: 1</li>
                    <li>ക, ച, ട, ത, പ: 2</li>
                    <li>ഗ, ജ, ഡ, ദ, ബ: 3</li>
                    <li>ങ, ഞ, ണ, ന, മ: 4</li>
                    <li>യ, ര, ല, വ: 5</li>
                    <li>ശ, ഷ, സ, ഹ, ള, ഴ, റ: 8</li>
                    <li>ഌ, ൠ, ൡ: 10</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    Board Bonuses:
                  </h3>
                  <ul className="list-disc list-inside">
                    <li>DL: Double Letter</li>
                    <li>TL: Triple Letter</li>
                    <li>DW: Double Word</li>
                    <li>TW: Triple Word</li>
                    <li>⭐: Center Star (DW for first word)</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}