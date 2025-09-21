'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Lightbulb, Heart, ChevronRight, RefreshCw } from 'lucide-react';

interface TriviaQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  category: string;
  hint?: string;
}

const TRIVIA_QUESTIONS: TriviaQuestion[] = [
  {
    question: 'Which Malayalam movie won the National Film Award for Best Feature Film in 2021?',
    options: ['Minnal Murali', 'Marakkar: Arabikadalinte Simham', 'The Great Indian Kitchen', 'Malik'],
    correctAnswer: 'Marakkar: Arabikadalinte Simham',
    category: 'Movies',
    hint: 'It starred Mohanlal and was a historical epic.',
  },
  {
    question: 'What is the traditional Kerala sadya served on?',
    options: ['Plate', 'Banana Leaf', 'Tray', 'Table'],
    correctAnswer: 'Banana Leaf',
    category: 'Food',
    hint: 'It\'s green and biodegradable.',
  },
  {
    question: 'Which city is known as the "Queen of the Arabian Sea"?',
    options: ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Alappuzha'],
    correctAnswer: 'Kochi',
    category: 'Places',
    hint: 'It\'s a major port city.',
  },
  {
    question: 'What does the Malayalam idiom "കണ്ണിൽ പൊടിയിടുക" (kannil podiyiduka) mean?',
    options: ['To put dust in the eye', 'To deceive someone', 'To cry', 'To clean the eye'],
    correctAnswer: 'To deceive someone',
    category: 'Idioms',
    hint: 'It\'s about trickery.',
  },
  {
    question: 'Which festival is celebrated with a grand boat race in Kerala?',
    options: ['Vishu', 'Onam', 'Thrissur Pooram', 'Makaravilakku'],
    correctAnswer: 'Onam',
    category: 'Culture',
    hint: 'It\'s the harvest festival.',
  },
];

const MONEY_LADDER = [100, 200, 300, 500, 1000, 2000, 4000, 8000, 16000, 32000, 64000, 125000, 250000, 500000, 1000000];

interface CulturalTriviaGameProps {
  onComplete: (success: boolean) => void;
}

const CulturalTriviaGame: React.FC<CulturalTriviaGameProps> = ({ onComplete }) => {
  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [gamePhase, setGamePhase] = useState<'playing' | 'answer_revealed' | 'game_over'>('playing');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [lifelines, setLifelines] = useState({ ammachisHint: true });
  const [hintUsed, setHintUsed] = useState(false);

  useEffect(() => {
    setQuestions(TRIVIA_QUESTIONS.sort(() => 0.5 - Math.random()));
  }, []);

  useEffect(() => {
    if (gamePhase === 'game_over') {
      onComplete(score > 0);
    }
  }, [gamePhase, score, onComplete]);

  const currentQuestion = questions[currentQuestionIndex];

  const handleOptionClick = (option: string) => {
    if (gamePhase !== 'playing' || selectedOption !== null) return;

    setSelectedOption(option);
    setGamePhase('answer_revealed');

    if (option === currentQuestion.correctAnswer) {
      setScore(MONEY_LADDER[currentQuestionIndex]);
    } else {
      setGamePhase('game_over');
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setHintUsed(false);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setGamePhase('playing');
    } else {
      setGamePhase('game_over');
    }
  };

  const handleAskAmmachi = () => {
    if (lifelines.ammachisHint && currentQuestion?.hint) {
      alert(`Ammachi says: ${currentQuestion.hint}`);
      setLifelines(prev => ({ ...prev, ammachisHint: false }));
      setHintUsed(true);
    }
  };

  if (!currentQuestion) {
    return <div className="text-white text-center">Loading questions...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-teal-100 p-4">
      <h1 className="text-4xl font-bold text-green-800 mb-8">Cultural Trivia Show</h1>
      <div className="bg-white p-8 rounded-lg shadow-xl mb-8 w-full max-w-2xl">
        <p className="text-lg text-gray-600 mb-2">Question {currentQuestionIndex + 1} of {questions.length}</p>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">{currentQuestion.question}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {currentQuestion.options.map((option) => (
            <button
              key={option}
              onClick={() => handleOptionClick(option)}
              className={`p-4 rounded-lg text-lg font-semibold transition-all duration-200 text-left
                ${selectedOption === option
                  ? option === currentQuestion.correctAnswer ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                  : gamePhase === 'answer_revealed' && option === currentQuestion.correctAnswer ? 'bg-green-500 text-white'
                  : 'bg-blue-500 text-white hover:bg-blue-600'}
                ${gamePhase === 'answer_revealed' ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}
              `}
              disabled={gamePhase === 'answer_revealed'}
            >
              {option}
            </button>
          ))}
        </div>

        <div className="flex justify-between items-center mt-6">
          <div className="flex gap-4">
            <button
              onClick={handleAskAmmachi}
              disabled={!lifelines.ammachisHint || hintUsed || gamePhase !== 'playing'}
              className={`p-3 rounded-lg text-sm font-semibold flex items-center
                ${lifelines.ammachisHint && !hintUsed && gamePhase === 'playing' ? 'bg-yellow-500 hover:bg-yellow-600 text-white' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}
              `}
            >
              <Lightbulb className="mr-2" /> Ask Ammachi
            </button>
          </div>
          <p className="text-2xl font-bold text-gray-800">${score}</p>
          {gamePhase === 'answer_revealed' && (
            <button
              onClick={handleNextQuestion}
              className="p-3 bg-green-600 text-white rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors duration-200 flex items-center"
            >
              Next Question <ChevronRight className="ml-2" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CulturalTriviaGame;