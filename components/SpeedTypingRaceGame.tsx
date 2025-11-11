'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import MalayalamKeyboard from './MalayalamKeyboard';

interface WordImagePair {
  word: string;
  imageUrl: string;
}

const GAME_DATA: WordImagePair[] = [
  { word: 'ആന', imageUrl: '🐘' },
  { word: 'മാങ്ങ', imageUrl: '🥭' },
  { word: 'മഴ', imageUrl: '☔' },
  { word: 'സൂര്യൻ', imageUrl: '☀️' },
  { word: 'പൂവ്', imageUrl: '🌸' },
  { word: 'മീൻ', imageUrl: '🐟' },
  { word: 'വീട്', imageUrl: '🏠' },
  { word: 'പുസ്തകം', imageUrl: '📚' },
  { word: 'വെള്ളം', imageUrl: '💧' },
  { word: 'മരം', imageUrl: '🌳' },
];

const ROUND_TIME_LIMIT = 25;
const MAX_ROUNDS = 5;

interface SpeedTypingRaceGameProps {
  onComplete: (success: boolean) => void;
}

const SpeedTypingRaceGame: React.FC<SpeedTypingRaceGameProps> = ({ onComplete }) => {
  const [currentPair, setCurrentPair] = useState<WordImagePair | null>(null);
  const [typedLetters, setTypedLetters] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME_LIMIT);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | 'timeout' | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [showKeyboard, setShowKeyboard] = useState(false);

  const startRound = useCallback(() => {
    if (round >= MAX_ROUNDS) {
      setGameOver(true);
      setGameActive(false);
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    setRound(prev => prev + 1);
    setTypedLetters([]);
    setFeedback(null);
    setTimeLeft(ROUND_TIME_LIMIT);

    const availablePairs = GAME_DATA.filter(pair => pair !== currentPair);
    const newPair = availablePairs[Math.floor(Math.random() * availablePairs.length)];
    setCurrentPair(newPair);

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timerRef.current!);
          setFeedback('timeout');
          setGameActive(false);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    setGameActive(true);
  }, [round, currentPair]);

  const resetGame = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setCurrentPair(null);
    setTypedLetters([]);
    setTimeLeft(ROUND_TIME_LIMIT);
    setScore(0);
    setRound(0);
    setGameActive(false);
    setGameOver(false);
    setFeedback(null);
    // Start the first round after resetting
    setTimeout(() => startRound(), 500);
  }, [startRound]);

  useEffect(() => {
    if (gameOver) {
      onComplete(score > 0);
    }
  }, [gameOver, score, onComplete]);

  useEffect(() => {
    if (gameActive && currentPair && typedLetters.join('') === currentPair.word) {
      setFeedback('correct');
      setScore(prevScore => prevScore + timeLeft);
      setGameActive(false);
      if (timerRef.current) clearInterval(timerRef.current);
      setTimeout(() => startRound(), 1500);
    }
  }, [typedLetters, gameActive, currentPair, timeLeft, startRound]);

  useEffect(() => {
    startRound(); // Start the first round on mount
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleKeyPress = useCallback((key: string) => {
    if (!gameActive || !currentPair || feedback) return;

    const newTypedLetters = [...typedLetters, key];
    const newTypedWord = newTypedLetters.join('');

    if (currentPair.word.startsWith(newTypedWord)) {
      setTypedLetters(newTypedLetters);
    } else {
      setFeedback('incorrect');
      setGameActive(false);
      if (timerRef.current) clearInterval(timerRef.current);
      setTimeout(() => startRound(), 1500);
    }
  }, [gameActive, currentPair, typedLetters, feedback, startRound]);

  const displayWordProgress = () => {
    if (!currentPair) return null;
    const segmenter = new Intl.Segmenter('ml', { granularity: 'grapheme' });
    const graphemes = [...segmenter.segment(currentPair.word)].map(s => s.segment);
    const typedGraphemes = [...segmenter.segment(typedLetters.join(''))].map(s => s.segment);

    return graphemes.map((grapheme, index) => (
      <span
        key={index}
        className={`text-5xl font-bold mx-1 ${
          index < typedGraphemes.length ? 'text-green-600' : 'text-gray-400'
        }`}
      >
        {grapheme}
      </span>
    ));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-100 to-orange-100 p-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Speed Typing Race</h1>

      {gameActive && currentPair && (
        <div className={`bg-white p-8 rounded-lg shadow-xl mb-8 text-center w-full transition-all duration-300 ${showKeyboard ? 'max-w-4xl' : 'max-w-md'}`}>
          <div className="text-7xl mb-6">{currentPair.imageUrl}</div>
          <div className="mb-6 flex justify-center">{displayWordProgress()}</div>
          <p className="text-2xl font-semibold text-gray-700 mb-4">Time Left: {timeLeft}s</p>

          <button
            onClick={() => setShowKeyboard(prev => !prev)}
            className="p-2 bg-gray-300 text-gray-800 rounded-lg text-sm hover:bg-gray-400 transition-colors duration-200 mb-4"
          >
            {showKeyboard ? 'Hide Keyboard' : 'Show Keyboard'}
          </button>

          {showKeyboard && (
            <div className="mt-4 w-full border p-2 rounded-lg">
              <MalayalamKeyboard onKeyPress={handleKeyPress} />
            </div>
          )}
        </div>
      )}

      {feedback && !gameActive && feedback !== 'timeout' && (
        <div className={`flex items-center justify-center text-xl font-bold mt-4
          ${feedback === 'correct' ? 'text-green-600' : 'text-red-600'}
        `}>
          {feedback === 'correct' ? <CheckCircle className="mr-2" /> : <XCircle className="mr-2" />}
          {feedback === 'correct' ? 'Correct!' : `Incorrect. The word was ${currentPair?.word}`}
        </div>
      )}

      {feedback === 'timeout' && (
        <div className="bg-white p-8 rounded-lg shadow-xl mb-8 text-center w-full max-w-md">
          <h2 className="text-3xl font-bold text-red-600 mb-4">Time's Up!</h2>
          <p className="text-xl text-gray-700 mb-6">The word was {currentPair?.word}</p>
        </div>
      )}

      {(gameOver || feedback) && !gameActive && (
        <button
          onClick={resetGame}
          className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg text-xl font-semibold hover:bg-blue-600 transition-colors duration-200 flex items-center"
        >
          <RefreshCw className="mr-2" /> Retry
        </button>
      )}

      <p className="text-2xl font-semibold text-gray-800 mt-8">Score: {score} | Round: {round}/{MAX_ROUNDS}</p>
    </div>
  );
};

export default SpeedTypingRaceGame;