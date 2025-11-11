// components/MalayalamDanceSimonGame.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';

interface DanceMove {
  id: string;
  label: string; // Malayalam word
  english: string; // English translation
  color: string; // For visual representation
}

const DANCE_MOVES: DanceMove[] = [
  { id: 'chavittu', label: 'ചവിട്ട്', english: 'Step', color: 'bg-red-500' },
  { id: 'thalam', label: 'താളം', english: 'Rhythm', color: 'bg-blue-500' },
  { id: 'abhinayam', label: 'അഭിനയം', english: 'Expression', color: 'bg-green-500' },
  { id: 'mudra', label: 'മുദ്ര', english: 'Hand Gesture', color: 'bg-yellow-500' },
];

const MalayalamDanceSimonGame: React.FC = () => {
  const [sequence, setSequence] = useState<DanceMove[]>([]);
  const [playerSequence, setPlayerSequence] = useState<DanceMove[]>([]);
  const [level, setLevel] = useState<number>(0);
  const [isPlayerTurn, setIsPlayerTurn] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('Press Start to begin!');
  const [canClick, setCanClick] = useState<boolean>(false);
  const [highlightedMove, setHighlightedMove] = useState<string | null>(null);

  const generateSequence = useCallback(() => {
    const newMove = DANCE_MOVES[Math.floor(Math.random() * DANCE_MOVES.length)];
    setSequence(prev => [...prev, newMove]);
  }, []);

  const playSequence = useCallback(() => {
    setIsPlayerTurn(false);
    setCanClick(false);
    setMessage('Watch carefully...');
    let i = 0;
    const interval = setInterval(() => {
      setHighlightedMove(sequence[i].id);
      // Play sound here if available
      setTimeout(() => {
        setHighlightedMove(null);
        i++;
        if (i === sequence.length) {
          clearInterval(interval);
          setMessage('Now your turn!');
          setIsPlayerTurn(true);
          setCanClick(true);
          setPlayerSequence([]);
        }
      }, 500); // Highlight duration
    }, 1000); // Delay between moves
  }, [sequence]);

  useEffect(() => {
    if (level > 0 && sequence.length === level) {
      playSequence();
    }
  }, [level, sequence, playSequence]);

  const handleStartGame = () => {
    setSequence([]);
    setPlayerSequence([]);
    setLevel(1);
    setMessage('Level 1: Watch carefully...');
    generateSequence();
  };

  const handlePlayerClick = (move: DanceMove) => {
    if (!isPlayerTurn || !canClick) return;

    setPlayerSequence(prev => [...prev, move]);
    setHighlightedMove(move.id);
    // Play sound for player click
    setTimeout(() => setHighlightedMove(null), 200);

    const newPlayerSequence = [...playerSequence, move];

    if (newPlayerSequence.length === sequence.length) {
      // Check if player sequence matches game sequence
      if (newPlayerSequence.every((val, index) => val.id === sequence[index].id)) {
        setMessage('Correct! Advancing to next level...');
        setIsPlayerTurn(false);
        setCanClick(false);
        setTimeout(() => {
          setLevel(prev => prev + 1);
          generateSequence();
        }, 1500);
      } else {
        setMessage('Game Over! You made a mistake. Press Start to play again.');
        setIsPlayerTurn(false);
        setCanClick(false);
      }
    } else if (move.id !== sequence[newPlayerSequence.length - 1].id) {      setMessage('Game Over! You made a mistake. Press Start to play again.');
      setIsPlayerTurn(false);
      setCanClick(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-cream-50 to-marigold-50 p-4">
      <h1 className="text-5xl font-extrabold text-kerala-green-700 mb-6 drop-shadow-lg">Malayalam Dance Simon</h1>
      <p className="text-xl text-kerala-green-800 mb-4">{message}</p>
      <p className="text-lg text-kerala-green-600 mb-8">Level: {level}</p>

      <div className="grid grid-cols-2 gap-4 mb-8">
        {DANCE_MOVES.map((move) => (
          <button
            key={move.id}
            className={`w-40 h-40 rounded-lg flex flex-col items-center justify-center text-white text-2xl font-bold shadow-lg transition-all duration-200
              ${move.color}
              ${highlightedMove === move.id ? 'ring-8 ring-offset-4 ring-white scale-105' : ''}
              ${canClick ? 'cursor-pointer hover:opacity-80' : 'cursor-not-allowed opacity-50'}
            `}
            onClick={() => handlePlayerClick(move)}
            disabled={!canClick}
          >
            <span>{move.label}</span>
            <span className="text-sm font-normal mt-1">({move.english})</span>
          </button>
        ))}
      </div>

      <button
        onClick={handleStartGame}
        className="px-8 py-3 bg-kerala-gold-500 text-black text-xl font-semibold rounded-full shadow-xl hover:bg-kerala-gold-600 transition-colors duration-300"
      >
        Start Game
      </button>
    </div>
  );
};

export default MalayalamDanceSimonGame;