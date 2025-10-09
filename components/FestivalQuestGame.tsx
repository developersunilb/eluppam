'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FestivalQuestGameProps {
  onComplete: (success: boolean) => void;
}

interface FestivalQuestion {
  question: string;
  correctAnswer: string;
  options: string[];
}

const onamQuestions: FestivalQuestion[] = [
  {
    question: 'Which festival is known as the harvest festival of Kerala?',
    correctAnswer: 'ഓണം',
    options: ['വിഷു', 'തൃശ്ശൂർ പൂരം', 'ഓണം', 'ക്രിസ്മസ്'],
  },
  {
    question: 'What is the traditional flower carpet made during Onam called?',
    correctAnswer: 'പൂക്കളം',
    options: ['രംഗോളി', 'കോലം', 'പൂക്കളം', 'പൂക്കാലം'],
  },
  {
    question: 'Which legendary king is associated with Onam?',
    correctAnswer: 'മഹാബലി',
    options: ['രാമൻ', 'കൃഷ്ണൻ', 'മഹാബലി', 'വിക്രമാദിത്യൻ'],
  },
];

const FestivalQuestGame: React.FC<FestivalQuestGameProps> = ({ onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const currentQuestion = onamQuestions[currentQuestionIndex];

  const handleOptionClick = (option: string) => {
    if (feedback) return; // Prevent multiple selections

    setSelectedOption(option);
    if (option === currentQuestion.correctAnswer) {
      setFeedback('correct');
      setScore(score + 1);
    } else {
      setFeedback('incorrect');
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < onamQuestions.length - 1) {
      setFeedback(null);
      setSelectedOption(null);
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Game over - the score state is now up-to-date
      onComplete(score === onamQuestions.length);
      
      // Reset for next play
      setCurrentQuestionIndex(0);
      setScore(0);
      setFeedback(null);
      setSelectedOption(null);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
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
                ${
                  selectedOption === option
                    ? feedback === 'correct'
                      ? 'bg-green-500 text-white'
                      : 'bg-red-500 text-white'
                    : feedback && option === currentQuestion.correctAnswer
                    ? 'bg-green-300 text-white' // Show correct answer if incorrect selection
                    : 'bg-marigold-500 hover:bg-marigold-600 text-white'
                }
              `}
              disabled={!!feedback}
            >
              {option}
            </Button>
          ))}
        </div>

        {feedback && (
          <>
            <div className={`text-center text-2xl font-bold mt-4 ${feedback === 'correct' ? 'text-green-600' : 'text-red-600'}`}>
              {feedback === 'correct' ? 'Correct!' : 'Incorrect!'}
            </div>
            <div className="flex justify-center mt-4">
              <Button onClick={handleNextQuestion} className="px-8 py-3 text-lg bg-marigold-500 hover:bg-marigold-600 text-white">
                Next
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default FestivalQuestGame;