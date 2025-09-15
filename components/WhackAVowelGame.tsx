'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface WhackAVowelGameProps {
  onComplete: (success: boolean) => void;
}

const vowels = ['അ', 'ആ', 'ഇ', 'ഈ', 'ഉ', 'ഊ', 'ഋ', 'എ', 'ഏ', 'ഐ', 'ഒ', 'ഓ', 'ഔ'];

const WhackAVowelGame: React.FC<WhackAVowelGameProps> = ({ onComplete }) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds game
  const [activeHole, setActiveHole] = useState<number | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const popUpTimerRef = useRef<NodeJS.Timeout | null>(null);

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setGameStarted(true);
    setGameOver(false);
    startPopUpTimer();
  };

  const startPopUpTimer = () => {
    if (popUpTimerRef.current) clearTimeout(popUpTimerRef.current);
    popUpTimerRef.current = setInterval(() => {
      const randomHole = Math.floor(Math.random() * 9); // 9 holes
      setActiveHole(randomHole);
      setTimeout(() => {
        setActiveHole(null);
      }, 700); // Vowel stays for 0.7 seconds
    }, 1000); // New vowel every 1 second
  };

  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setGameOver(true);
      setGameStarted(false);
      if (timerRef.current) clearInterval(timerRef.current);
      if (popUpTimerRef.current) clearInterval(popUpTimerRef.current);
      onComplete(score > 0); // Consider success if score is greater than 0
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (popUpTimerRef.current) clearInterval(popUpTimerRef.current);
    };
  }, [gameStarted, timeLeft, onComplete, score]);

  const handleWhack = (holeIndex: number) => {
    if (activeHole === holeIndex) {
      setScore((prevScore) => prevScore + 1);
      setActiveHole(null); // Make it disappear immediately after whack
    }
  };

  const getRandomVowel = () => {
    return vowels[Math.floor(Math.random() * vowels.length)];
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
      </CardHeader>
      <CardContent className="space-y-6">
        {!gameStarted && !gameOver && (
          <div className="text-center">
            <p className="text-xl mb-4 text-kerala-green-700">Tap the vowels as they appear!</p>
            <Button onClick={startGame} className="px-8 py-3 text-lg bg-marigold-500 hover:bg-marigold-600 text-white">
              Start Game
            </Button>
          </div>
        )}

        {gameStarted && (
          <div className="flex flex-col items-center">
            <div className="flex justify-between w-full mb-4 text-xl font-semibold text-kerala-green-700">
              <span>Score: {score}</span>
              <span>Time: {timeLeft}s</span>
            </div>
            <div className="grid grid-cols-3 gap-4 w-full max-w-md">
              {[...Array(9)].map((_, index) => (
                <div
                  key={index}
                  className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center relative overflow-hidden"
                  onClick={() => handleWhack(index)}
                >
                  {activeHole === index && (
                    <span className="text-5xl font-bold text-kerala-green-700 animate-bounce">
                      {getRandomVowel()}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {gameOver && (
          <div className="text-center">
            <h2 className="text-3xl font-bold text-kerala-green-700 mb-4">Game Over!</h2>
            <p className="text-xl mb-4 text-kerala-green-700">Your final score: {score}</p>
            <Button onClick={startGame} className="px-8 py-3 text-lg bg-marigold-500 hover:bg-marigold-600 text-white">
              Play Again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WhackAVowelGame;
