'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface EmojiWordPair {
  emoji: string;
  word: string;
}

// Expanded to 20 unique questions
const EMOJI_WORD_DATA: EmojiWordPair[] = [
  { emoji: '🌴', word: 'തെങ്ങ്' }, { emoji: '🥥', word: 'തേങ്ങ' },
  { emoji: '🚲', word: 'സൈക്കിൾ' }, { emoji: '🏞️', word: 'പ്രകൃതി' },
  { emoji: '🐘', word: 'ആന' }, { emoji: '🥭', word: 'മാങ്ങ' },
  { emoji: '☔', word: 'മഴ' }, { emoji: '☀️', word: 'സൂര്യൻ' },
  { emoji: '🌸', word: 'പൂവ്' }, { emoji: '🐟', word: 'മീൻ' },
  { emoji: '🏠', word: 'വീട്' }, { emoji: '🚗', word: 'കാർ' },
  { emoji: '📖', word: 'പുസ്തകം' }, { emoji: '🌶️', word: 'മുളക്' },
  { emoji: '🍚', word: 'ചോറ്' }, { emoji: '🍌', word: 'പഴം' },
  { emoji: '☕', word: 'ചായ' }, { emoji: '⚽', word: 'പന്ത്' },
  { emoji: '✈️', word: 'വിമാനം' }, { emoji: '⭐', word: 'നക്ഷത്രം' },
];

const TOTAL_QUESTIONS = 20;

interface EmojiWordMatchGameProps {
  onComplete: (success: boolean) => void;
}

export default function EmojiWordMatchGame({ onComplete }: EmojiWordMatchGameProps) {
  const [gameState, setGameState] = useState('idle'); // idle, playing, over
  const [questions, setQuestions] = useState<EmojiWordPair[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const shuffleAndStart = useCallback(() => {
    const shuffledData = [...EMOJI_WORD_DATA].sort(() => 0.5 - Math.random());
    setQuestions(shuffledData.slice(0, TOTAL_QUESTIONS));
    setCurrentQuestionIndex(0);
    setScore(0);
    setFeedback(null);
    setSelectedOption(null);
    setGameState('playing');
  }, []);

  const currentPair = questions[currentQuestionIndex];

  const generateOptions = useCallback(() => {
    if (!currentPair) return [];
    const correctWord = currentPair.word;
    const incorrectOptions = EMOJI_WORD_DATA
      .filter(pair => pair.word !== correctWord)
      .map(pair => pair.word);
    const shuffledIncorrect = incorrectOptions.sort(() => 0.5 - Math.random()).slice(0, 3);
    return [...shuffledIncorrect, correctWord].sort(() => 0.5 - Math.random());
  }, [currentPair]);

  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    if (gameState === 'playing' && currentPair) {
      setOptions(generateOptions());
    }
  }, [gameState, currentPair, generateOptions]);

  const handleOptionClick = (selectedWord: string) => {
    if (selectedOption) return;

    setSelectedOption(selectedWord);
    if (currentPair && selectedWord === currentPair.word) {
      setScore(prev => prev + 1);
      setFeedback('correct');
    } else {
      setFeedback('incorrect');
    }

    setTimeout(() => {
      if (currentQuestionIndex < TOTAL_QUESTIONS - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setFeedback(null);
        setSelectedOption(null);
      } else {
        setGameState('over');
      }
    }, 1500);
  };

  useEffect(() => {
    if (gameState === 'over') {
      onComplete(score > TOTAL_QUESTIONS / 2);
    }
  }, [gameState, onComplete, score]);

  const renderGameContent = () => {
    switch (gameState) {
      case 'playing':
        if (!currentPair) return <p>Loading...</p>;
        return (
          <div className="text-center w-full max-w-md">
            <div className="flex justify-between w-full mb-4 text-xl font-semibold text-kerala-green-700">
              <span>Score: {score}</span>
              <span>Question: {currentQuestionIndex + 1} / {TOTAL_QUESTIONS}</span>
            </div>
            <div className="text-6xl mb-6">{currentPair.emoji}</div>
            <p className="text-xl text-gray-700 mb-4">Which word matches?</p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {options.map((option) => (
                <Button
                  key={option}
                  onClick={() => handleOptionClick(option)}
                  disabled={!!selectedOption}
                  className={`p-4 h-20 text-lg font-semibold transition-all duration-200 disabled:opacity-80 
                    ${selectedOption === option 
                      ? (option === currentPair.word ? 'bg-green-500' : 'bg-red-500') 
                      : 'bg-blue-500 hover:bg-blue-600'}
                    ${selectedOption && option === currentPair.word && 'bg-green-500'}
                  `}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
        );
      case 'over':
        return (
          <div className="text-center">
            <h2 className="text-3xl font-bold text-kerala-green-700 mb-4">Game Over!</h2>
            <p className="text-xl mb-4 text-kerala-green-700">Your final score: {score} / {TOTAL_QUESTIONS}</p>
            <Button onClick={shuffleAndStart} className="px-8 py-3 text-lg bg-marigold-500 hover:bg-marigold-600 text-white">
              Play Again
            </Button>
          </div>
        );
      case 'idle':
      default:
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-kerala-green-700 mb-2">Emoji-to-Word Match</h2>
            <p className="text-lg mb-4 text-gray-600">You will be shown {TOTAL_QUESTIONS} emojis. Match them to the correct Malayalam word!</p>
            <Button onClick={shuffleAndStart} className="px-8 py-3 text-lg bg-marigold-500 hover:bg-marigold-600 text-white">
              Start Game
            </Button>
          </div>
        );
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-white">
      <CardHeader />
      <CardContent className="flex justify-center items-center p-6">
        {renderGameContent()}
      </CardContent>
    </Card>
  );
}