'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface WhackAVowelGameProps {
  onComplete: (success: boolean) => void;
}

const VOWELS = ['അ', 'ആ', 'ഇ', 'ഈ', 'ഉ', 'ഊ', 'ഋ', 'എ', 'ഏ', 'ഐ', 'ഒ', 'ഓ', 'ഔ'];
const CONSONANTS = ['ക', 'ഖ', 'ഗ', 'ഘ', 'ങ', 'ച', 'ഛ', 'ജ', 'ಝ', 'ഞ', 'ട', 'ഠ', 'ഡ', 'ഢ', 'ണ'];
const TOTAL_QUESTIONS = 20; // Increased total questions for the new challenge
const CONSONANT_CHANCE = 0.3; // 30% chance for a consonant to appear

export default function WhackAVowelGame({ onComplete }: WhackAVowelGameProps) {
  const [gameState, setGameState] = useState('idle'); // idle, playing, over
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [activeHole, setActiveHole] = useState<number | null>(null);
  const [activeChar, setActiveChar] = useState<string | null>(null);
  const [activeCharType, setActiveCharType] = useState<'vowel' | 'consonant' | null>(null);

  const charTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showNextChar = useCallback(() => {
    if (questionCount >= TOTAL_QUESTIONS) {
      setGameState('over');
      return;
    }

    if (charTimeoutRef.current) clearTimeout(charTimeoutRef.current);

    const nextHole = Math.floor(Math.random() * 9);
    let nextChar: string;
    let nextCharType: 'vowel' | 'consonant';

    if (Math.random() < CONSONANT_CHANCE) {
      nextChar = CONSONANTS[Math.floor(Math.random() * CONSONANTS.length)];
      nextCharType = 'consonant';
    } else {
      nextChar = VOWELS[Math.floor(Math.random() * VOWELS.length)];
      nextCharType = 'vowel';
    }
    
    setActiveHole(nextHole);
    setActiveChar(nextChar);
    setActiveCharType(nextCharType);
    setQuestionCount(prev => prev + 1);

    const randomTime = Math.random() * (4000 - 1500) + 1500; // Adjusted time: 1.5s to 4s
    charTimeoutRef.current = setTimeout(() => {
      showNextChar();
    }, randomTime);

  }, [questionCount]);

  useEffect(() => {
    if (gameState === 'over') {
      if (charTimeoutRef.current) clearTimeout(charTimeoutRef.current);
      onComplete(score > TOTAL_QUESTIONS / 2);
    }
  }, [gameState, onComplete, score]);

  const startGame = () => {
    setScore(0);
    setQuestionCount(0);
    setGameState('playing');
    showNextChar();
  };

  const handleWhack = (holeIndex: number) => {
    if (holeIndex === activeHole) {
      if (activeCharType === 'vowel') {
        setScore(prev => prev + 1);
      } else if (activeCharType === 'consonant') {
        setScore(prev => prev - 1);
      }
      showNextChar();
    }
  };

  const renderGameContent = () => {
    switch (gameState) {
      case 'playing':
        return (
          <div className="flex flex-col items-center">
            <div className="flex justify-between w-full mb-4 text-xl font-semibold text-kerala-green-700">
              <span>Score: {score}</span>
              <span>Character: {questionCount} / {TOTAL_QUESTIONS}</span>
            </div>
            <div className="grid grid-cols-3 gap-4 w-full max-w-md">
              {[...Array(9)].map((_, index) => (
                <div
                  key={index}
                  className="w-24 h-24 bg-marigold-300 rounded-full flex items-center justify-center cursor-pointer hover:bg-marigold-400"
                  onClick={() => handleWhack(index)}
                >
                  {activeHole === index && (
                    <span className="text-5xl font-bold text-white select-none drop-shadow-md">
                      {activeChar}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      case 'over':
        return (
          <div className="text-center">
            <h2 className="text-3xl font-bold text-kerala-green-700 mb-4">Game Over!</h2>
            <p className="text-xl mb-4 text-kerala-green-700">Your final score: {score} / {TOTAL_QUESTIONS}</p>
            <Button onClick={startGame} className="px-8 py-3 text-lg bg-marigold-500 hover:bg-marigold-600 text-white">
              Play Again
            </Button>
          </div>
        );
      case 'idle':
      default:
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-kerala-green-700 mb-2">Whack-A-Vowel!</h2>
            <p className="text-lg mb-4 text-gray-600">Tap the vowels, but avoid the consonants! You'll face {TOTAL_QUESTIONS} characters in total.</p>
            <Button onClick={startGame} className="px-8 py-3 text-lg bg-marigold-500 hover:bg-marigold-600 text-white">
              Start Game
            </Button>
          </div>
        );
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader />
      <CardContent className="space-y-6">
        {renderGameContent()}
      </CardContent>
    </Card>
  );
}
