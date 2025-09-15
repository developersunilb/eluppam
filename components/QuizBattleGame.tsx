'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface QuizBattleGameProps {
  onComplete: (success: boolean) => void;
}

interface QuizQuestion {
  question: string;
  correctAnswer: string;
  options: string[];
}

const quizQuestions: QuizQuestion[] = [
  {
    question: 'What is the capital of Kerala?',
    correctAnswer: 'തിരുവനന്തപുരം',
    options: ['കൊച്ചി', 'കോഴിക്കോട്', 'തിരുവനന്തപുരം', 'തൃശ്ശൂർ'],
  },
  {
    question: 'Which is the longest river in Kerala?',
    correctAnswer: 'പെരിയാർ',
    options: ['ഭാരതപ്പുഴ', 'പെരിയാർ', 'പമ്പ', 'ചാലിയാർ'],
  },
  {
    question: 'What is the official language of Kerala?',
    correctAnswer: 'മലയാളം',
    options: ['തമിഴ്', 'കന്നഡ', 'മലയാളം', 'തെലുങ്ക്'],
  },
];

const QuizBattleGame: React.FC<QuizBattleGameProps> = ({ onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const currentQuestion = quizQuestions[currentQuestionIndex];

  const handleOptionClick = (option: string) => {
    if (feedback) return; // Prevent multiple selections

    setSelectedOption(option);
    if (option === currentQuestion.correctAnswer) {
      setFeedback('correct');
      setScore(score + 1);
    } else {
      setFeedback('incorrect');
    }

    setTimeout(() => {
      setFeedback(null);
      setSelectedOption(null);
      if (currentQuestionIndex < quizQuestions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // Game over
        onComplete(score === quizQuestions.length); // All correct for success
        setCurrentQuestionIndex(0); // Reset for next play
        setScore(0);
      }
    }, 1500);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center justify-center">
          {currentQuestion && (
            <p className="text-xl mb-4 text-kerala-green-700 text-center">{currentQuestion.question}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-6 justify-center">
          {currentQuestion?.options.map((option) => (
            <Button
              key={option}
              onClick={() => handleOptionClick(option)}
              className={`text-lg whitespace-normal h-auto w-full px-8 py-2 flex items-center justify-center text-center
                ${selectedOption === option
                  ? feedback === 'correct'
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white'
                  : feedback && option === currentQuestion.correctAnswer
                    ? 'bg-green-300 text-white' // Show correct answer if incorrect selection
                    : 'bg-white text-kerala-green-700 border border-kerala-green-700'
                }
              `}
              disabled={!!feedback}
            >
              {option}
            </Button>
          ))}
        </div>

        {feedback && (
          <div className={`text-center text-2xl font-bold mt-4 ${feedback === 'correct' ? 'text-green-600' : 'text-red-600'}`}>
            {feedback === 'correct' ? 'Correct!' : 'Incorrect!'}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuizBattleGame;
