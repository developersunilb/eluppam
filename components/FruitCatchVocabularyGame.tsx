// components/FruitCatchVocabularyGame.tsx
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';

interface FallingItem {
  id: string; // Make this truly unique
  label: string; // Malayalam word
  english: string; // English translation
  category: string; // Category ID
  image: string; // Path to image
  x: number; // X position
  y: number; // Y position
  speed: number; // Falling speed
}

interface Category {
  id: string;
  label: string; // Malayalam word
  english: string; // English translation
  color: string;
}

const CATEGORIES: Category[] = [
  { id: 'fruits', label: 'പഴങ്ങൾ', english: 'Fruits', color: 'bg-red-500' },
  { id: 'vegetables', label: 'പച്ചക്കറികൾ', english: 'Vegetables', color: 'bg-green-500' },
  { id: 'animals', label: 'മൃഗങ്ങൾ', english: 'Animals', color: 'bg-blue-500' },
];

const ALL_ITEMS: Omit<FallingItem, 'id' | 'x' | 'y' | 'speed'>[] = [ // Removed 'id' from Omit
  { label: 'ആപ്പിൾ', english: 'Apple', category: 'fruits', image: '/images/apple.png' },
  { label: 'വാഴപ്പഴം', english: 'Banana', category: 'fruits', image: '/images/banana.png' },
  { label: 'കാരറ്റ്', english: 'Carrot', category: 'vegetables', image: '/images/carrot.png' },
  { label: 'ഉരുളക്കിഴങ്ങ്', english: 'Potato', category: 'vegetables', image: '/images/potato.png' },
  { label: 'സിംഹം', english: 'Lion', category: 'animals', image: '/images/lion.png' },
  { label: 'ആന', english: 'Elephant', category: 'animals', image: '/images/elephant.png' },
];

const GAME_DURATION = 60; // seconds
const ITEM_WIDTH = 80; // Approximate width of a falling item for x position calculation
const GAME_AREA_WIDTH = 800; // Fixed width for the game area to calculate x position

const FruitCatchVocabularyGame: React.FC = () => {
  const [fallingItems, setFallingItems] = useState<FallingItem[]>([]);
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(GAME_DURATION);
  const [message, setMessage] = useState<string>('Drag items to the correct basket!');
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);

  const gameIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const itemGenerationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null); // New ref for timer interval

  const generateFallingItem = useCallback(() => {
    const randomItemData = ALL_ITEMS[Math.floor(Math.random() * ALL_ITEMS.length)];
    const newItem: FallingItem = {
      ...randomItemData,
      id: `${randomItemData.label}-${Date.now()}-${Math.random()}`, // Truly unique ID
      x: Math.random() * (GAME_AREA_WIDTH - ITEM_WIDTH), // Random X position within game area
      y: -50, // Start above the screen
      speed: 1 + Math.random() * 2, // Random speed
    };
    setFallingItems(prev => [...prev, newItem]);
  }, []);

  const updateGame = useCallback(() => {
    setFallingItems(prev =>
      prev
        .map(item => ({ ...item, y: item.y + item.speed }))
        .filter(item => item.y < window.innerHeight + 50) // Remove items that fall off screen
    );
  }, []);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      // Clear any existing intervals before setting new ones
      if (gameIntervalRef.current) clearInterval(gameIntervalRef.current);
      if (itemGenerationIntervalRef.current) clearInterval(itemGenerationIntervalRef.current);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

      gameIntervalRef.current = setInterval(updateGame, 50); // Update game every 50ms
      itemGenerationIntervalRef.current = setInterval(generateFallingItem, 1500); // Generate new item every 1.5 seconds

      timerIntervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current!); 
            setGameOver(true);
            setMessage(`Time's up! Your final score: ${score}`);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (gameOver) {
      // Clear all intervals when game is over
      if (gameIntervalRef.current) clearInterval(gameIntervalRef.current);
      if (itemGenerationIntervalRef.current) clearInterval(itemGenerationIntervalRef.current);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }

    return () => {
      // Cleanup on component unmount or before re-running effect
      if (gameIntervalRef.current) clearInterval(gameIntervalRef.current);
      if (itemGenerationIntervalRef.current) clearInterval(itemGenerationIntervalRef.current);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [gameStarted, gameOver, updateGame, generateFallingItem, score]);

  const handleStartGame = () => {
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setFallingItems([]);
    setMessage('Go!');
    setGameOver(false);
    setGameStarted(true);
  };

  const handleDrop = (item: FallingItem, targetCategory: Category) => {
    if (!gameStarted || gameOver) return;

    setFallingItems(prev => prev.filter(fItem => fItem.id !== item.id)); // Remove item after drop

    if (item.category === targetCategory.id) {
      setScore(prev => prev + 10);
      setMessage('Correct!');
    } else {
      setScore(prev => Math.max(0, prev - 5)); // Deduct points, but not below 0
      setMessage('Wrong category!');
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-between min-h-screen bg-gradient-to-br from-cream-50 to-marigold-50 p-4 overflow-hidden">
      <h1 className="text-5xl font-extrabold text-kerala-green-700 mb-4 drop-shadow-lg">Fruit Catch Vocabulary</h1>
      <div className="flex justify-between w-full max-w-4xl px-4">
        <p className="text-xl text-kerala-green-800">Score: {score}</p>
        <p className="text-xl text-kerala-green-800">Time: {timeLeft}s</p>
      </div>
      <p className="text-2xl text-kerala-gold-500 font-semibold mb-8">{message}</p>

      {!gameStarted && !gameOver && (
        <button
          onClick={handleStartGame}
          className="px-8 py-3 bg-kerala-gold-500 text-black text-xl font-semibold rounded-full shadow-xl hover:bg-kerala-gold-600 transition-colors duration-300"
        >
          Start Game
        </button>
      )}

      {gameOver && (
        <button
          onClick={handleStartGame}
          className="px-8 py-3 bg-kerala-gold-500 text-black text-xl font-semibold rounded-full shadow-xl hover:bg-kerala-gold-600 transition-colors duration-300"
        >
          Play Again
        </button>
      )}

      {/* Falling Items */}
      {fallingItems.map(item => (
        <div
          key={item.id} // Ensure unique key
          className="absolute w-20 h-20 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-md"
          style={{ left: item.x, top: item.y, backgroundColor: 'rgba(0,0,0,0.5)' }} // Placeholder background
          draggable
          onDragStart={(e) => e.dataTransfer.setData('text/plain', JSON.stringify(item))}
        >
          {item.label}
        </div>
      ))}

      {/* Category Baskets */}
      <div className="flex justify-around w-full max-w-4xl mt-auto pb-4">
        {CATEGORIES.map(category => (
          <div
            key={category.id}
            className={`w-40 h-40 rounded-lg flex flex-col items-center justify-center text-white text-xl font-bold shadow-lg ${category.color}`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(JSON.parse(e.dataTransfer.getData('text/plain')), category)}
          >
            <span>{category.label}</span>
            <span className="text-sm font-normal mt-1">({category.english})</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FruitCatchVocabularyGame;
