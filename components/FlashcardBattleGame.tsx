'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

interface FlashcardBattleGameProps {
  onComplete: (success: boolean) => void;
}

interface Flashcard {
  imageUrl: string;
  correctAnswer: string;
  options: string[];
}

const flashcards: Flashcard[] = [
  {
    imageUrl: '/image/elephant.png',
    correctAnswer: 'ആന',
    options: ['ആന', 'പുലി', 'സിംഹം', 'മാൻ'],
  },
  {
    imageUrl: '/image/apple.png',
    correctAnswer: 'ആപ്പിൾ',
    options: ['മാങ്ങ', 'ആപ്പിൾ', 'വാഴപ്പഴം', 'മുന്തിരി'],
  },
  {
    imageUrl: '/image/house.png',
    correctAnswer: 'വീട്',
    options: ['മരം', 'വീട്', 'പുഴ', 'കാർ'],
  },
];

const FlashcardBattleGame: React.FC<FlashcardBattleGameProps> = ({ onComplete }) => {
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const currentFlashcard = flashcards[currentFlashcardIndex];

  const handleOptionClick = (option: string) => {
    if (feedback) return; // Prevent multiple selections

    setSelectedOption(option);
    if (option === currentFlashcard.correctAnswer) {
      setFeedback('correct');
    } else {
      setFeedback('incorrect');
    }
  };

  const handleNextQuestion = () => {
    let updatedScore = score;
    if (feedback === 'correct') {
      updatedScore = score + 1;
      setScore(updatedScore);
    }

    if (currentFlashcardIndex < flashcards.length - 1) {
      setFeedback(null);
      setSelectedOption(null);
      setCurrentFlashcardIndex(currentFlashcardIndex + 1);
    } else {
      // Game over
      onComplete(updatedScore === flashcards.length);
      
      // Reset for next play
      setCurrentFlashcardIndex(0);
      setScore(0);
      setFeedback(null);
      setSelectedOption(null);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center justify-center">
          {currentFlashcard && (
            <div className="mb-4">
              <Image
                src={currentFlashcard.imageUrl}
                alt="Flashcard Image"
                width={200}
                height={200}
                className="rounded-lg shadow-md"
              />
            </div>
          )}
          <p className="text-xl mb-4 text-kerala-green-700">What is this in Malayalam?</p>
        </div>

        <div className="grid grid-cols-2 gap-6 justify-center">
          {currentFlashcard?.options.map((option) => (
            <Button
              key={option}
              onClick={() => handleOptionClick(option)}
              className={`text-lg whitespace-normal h-auto w-full px-8 py-2 flex items-center justify-center text-center
                ${
                  selectedOption === option
                    ? feedback === 'correct'
                      ? 'bg-green-500 text-white'
                      : 'bg-red-500 text-white'
                    : feedback && option === currentFlashcard.correctAnswer
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
          <>
            <div className={`text-center text-2xl font-bold mt-4 ${feedback === 'correct' ? 'text-green-600' : 'text-red-600'}`}>
              {feedback === 'correct' ? 'Correct!' : 'Incorrect!'}
            </div>
            <div className="flex justify-center mt-4">
              <Button onClick={handleNextQuestion} className="px-8 py-3 text-lg bg-gradient-to-r from-marigold-500 to-marigold-600 hover:from-marigold-600 hover:to-marigold-700 text-white shadow-lg hover:shadow-xl transition-all">
                Next Question
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default FlashcardBattleGame;