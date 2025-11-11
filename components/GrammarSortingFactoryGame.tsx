// components/GrammarSortingFactoryGame.tsx
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';

interface GameWord {
  id: string;
  malayalam: string;
  english: string;
  type: 'NOUN' | 'VERB' | 'ADJECTIVE';
  gender?: 'MASCULINE' | 'FEMININE' | 'NEUTER'; // Example property
  x: number; // Position for falling
  y: number; // Position for falling
  speed: number;
}

interface Bin {
  id: string;
  label: string; // Malayalam label
  english: string;
  accepts: 'NOUN' | 'VERB' | 'ADJECTIVE' | 'MASCULINE' | 'FEMININE' | 'NEUTER';
  color: string;
}

const GAME_WORDS: Omit<GameWord, 'x' | 'y' | 'speed'>[] = [
  { id: 'cat', malayalam: 'പൂച്ച', english: 'Cat', type: 'NOUN', gender: 'FEMININE' },
  { id: 'run', malayalam: 'ഓടുക', english: 'Run', type: 'VERB' },
  { id: 'big', malayalam: 'വലിയ', english: 'Big', type: 'ADJECTIVE' },
  { id: 'boy', malayalam: 'കുട്ടി', english: 'Boy', type: 'NOUN', gender: 'MASCULINE' },
  { id: 'eat', malayalam: 'തിന്നുക', english: 'Eat', type: 'VERB' },
  { id: 'small', malayalam: 'ചെറിയ', english: 'Small', type: 'ADJECTIVE' },
];

const BINS: Bin[] = [
  { id: 'noun_bin', label: 'നാമം', english: 'Noun', accepts: 'NOUN', color: 'bg-blue-500' },
  { id: 'verb_bin', label: 'ക്രിയ', english: 'Verb', accepts: 'VERB', color: 'bg-green-500' },
  { id: 'adjective_bin', label: 'വിശേഷണം', english: 'Adjective', accepts: 'ADJECTIVE', color: 'bg-purple-500' },
  { id: 'masculine_bin', label: 'പുല്ലിംഗം', english: 'Masculine', accepts: 'MASCULINE', color: 'bg-red-500' },
  { id: 'feminine_bin', label: 'സ്ത്രീലിംഗം', english: 'Feminine', accepts: 'FEMININE', color: 'bg-pink-500' },
];

const GAME_DURATION = 90; // seconds
const MAX_MISSED_WORDS = 5;

const GrammarSortingFactoryGame: React.FC = () => {
  const [fallingWords, setFallingWords] = useState<GameWord[]>([]);
  const [score, setScore] = useState<number>(0);
  const [missedWordsCount, setMissedWordsCount] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(GAME_DURATION);
  const [message, setMessage] = useState<string>('Sort the words into the correct bins!');
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);

  const gameIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const wordGenerationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const generateFallingWord = useCallback(() => {
    const randomWordData = GAME_WORDS[Math.floor(Math.random() * GAME_WORDS.length)];
    const newWord: GameWord = {
      ...randomWordData,
      id: `${randomWordData.id}-${Date.now()}`, // Unique ID
      x: Math.random() * (window.innerWidth * 0.8 - 100) + (window.innerWidth * 0.1), // Random X position within game area
      y: -50, // Start above the screen
      speed: 1 + Math.random() * 1.5, // Random speed
    };
    setFallingWords(prev => [...prev, newWord]);
  }, []);

  const updateGame = useCallback(() => {
    setFallingWords(prev =>
      prev
        .map(word => ({ ...word, y: word.y + word.speed }))
        .filter(word => {
          if (word.y > window.innerHeight - 100) { // If word falls off screen (adjust based on bin height)
            setMissedWordsCount(prevCount => prevCount + 1);
            setMessage(`Missed: ${word.malayalam}!`);
            return false; // Remove word
          }
          return true;
        })
    );
  }, []);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      gameIntervalRef.current = setInterval(updateGame, 50);
      wordGenerationIntervalRef.current = setInterval(generateFallingWord, 2000); // Generate new word every 2 seconds

      timerIntervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current!)
            setGameOver(true);
            setMessage(`Time's up! Final Score: ${score}`);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (gameOver) {
      if (gameIntervalRef.current) clearInterval(gameIntervalRef.current);
      if (wordGenerationIntervalRef.current) clearInterval(wordGenerationIntervalRef.current);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }

    return () => {
      if (gameIntervalRef.current) clearInterval(gameIntervalRef.current);
      if (wordGenerationIntervalRef.current) clearInterval(wordGenerationIntervalRef.current);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [gameStarted, gameOver, updateGame, generateFallingWord, score]);

  useEffect(() => {
    if (missedWordsCount >= MAX_MISSED_WORDS) {
      setGameOver(true);
      setMessage(`Too many misses! Game Over. Final Score: ${score}`);
    }
  }, [missedWordsCount, score]);

  const handleStartGame = () => {
    setFallingWords([]);
    setScore(0);
    setMissedWordsCount(0);
    setTimeLeft(GAME_DURATION);
    setMessage('Go! Sort the words!');
    setGameOver(false);
    setGameStarted(true);
  };

  const handleDrop = (word: GameWord, targetBin: Bin) => {
    if (!gameStarted || gameOver) return;

    setFallingWords(prev => prev.filter(fWord => fWord.id !== word.id)); // Remove word after drop

    let isCorrect = false;
    if (targetBin.accepts === word.type) {
      isCorrect = true;
    } else if (word.gender && targetBin.accepts === word.gender) {
      isCorrect = true;
    }

    if (isCorrect) {
      setScore(prev => prev + 10);
      setMessage(`Correct! ${word.malayalam} is a ${targetBin.english}.`);
    } else {
      setScore(prev => Math.max(0, prev - 5));
      setMessage(`Incorrect! ${word.malayalam} is not a ${targetBin.english}.`);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-between min-h-screen bg-gradient-to-br from-cream-50 to-marigold-50 p-4 overflow-hidden">
      <h1 className="text-5xl font-extrabold text-kerala-green-700 mb-4 drop-shadow-lg">Grammar Sorting Factory</h1>
      <div className="flex justify-between w-full max-w-4xl px-4">
        <p className="text-xl text-kerala-green-800">Score: {score}</p>
        <p className="text-xl text-kerala-green-800">Misses: {missedWordsCount}/{MAX_MISSED_WORDS}</p>
        <p className="text-xl text-kerala-green-800">Time: {timeLeft}s</p>
      </div>
      <p className="text-2xl text-kerala-gold-500 font-semibold mb-8">{message}</p>

      {!gameStarted && !gameOver && (
        <button
          onClick={handleStartGame}
          className="px-8 py-3 bg-kerala-gold-500 text-white text-xl font-semibold rounded-full shadow-xl hover:bg-kerala-gold-600 transition-colors duration-300"
        >
          Start Game
        </button>
      )}

      {gameOver && (
        <button
          onClick={handleStartGame}
          className="px-8 py-3 bg-kerala-gold-500 text-white text-xl font-semibold rounded-full shadow-xl hover:bg-kerala-gold-600 transition-colors duration-300"
        >
          Play Again
        </button>
      )}

      {/* Falling Words */}
      {fallingWords.map(word => (
        <div
          key={word.id}
          className="absolute w-24 h-12 rounded-md flex items-center justify-center text-white text-md font-bold shadow-md bg-gray-700"
          style={{ left: word.x, top: word.y }}
          draggable
          onDragStart={(e) => e.dataTransfer.setData('text/plain', JSON.stringify(word))}
        >
          {word.malayalam}
        </div>
      ))}

      {/* Sorting Bins */}
      <div className="flex justify-around w-full max-w-4xl mt-auto pb-4">
        {BINS.map(bin => (
          <div
            key={bin.id}
            className={`w-32 h-32 rounded-lg flex flex-col items-center justify-center text-white text-xl font-bold shadow-lg ${bin.color}`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(JSON.parse(e.dataTransfer.getData('text/plain')), bin)}
          >
            <span>{bin.label}</span>
            <span className="text-sm font-normal mt-1">({bin.english})</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GrammarSortingFactoryGame;