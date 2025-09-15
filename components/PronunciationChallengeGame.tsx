'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic } from 'lucide-react';

interface PronunciationChallengeGameProps {
  onComplete: (success: boolean) => void;
}

const wordsToPronounce: string[] = [
  'അമ്മ', 'ആന', 'ഇല', 'പുഴ', 'മരം', 'വീട്', 'കപ്പൽ', 'മീൻ', 'കുട്ടി', 'പൂച്ച'
];

const PronunciationChallengeGame: React.FC<PronunciationChallengeGameProps> = ({ onComplete }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [listening, setListening] = useState(false);
  const [score, setScore] = useState(0);

  const currentWord = wordsToPronounce[currentWordIndex];

  const handlePronounce = () => {
    setListening(true);
    setFeedback(null);
    // Simulate speech recognition and feedback
    setTimeout(() => {
      setListening(false);
      const isCorrect = Math.random() > 0.2; // 80% chance of being correct for simulation
      if (isCorrect) {
        setFeedback('correct');
        setScore(score + 1);
      } else {
        setFeedback('incorrect');
      }

      setTimeout(() => {
        if (currentWordIndex < wordsToPronounce.length - 1) {
          setCurrentWordIndex(currentWordIndex + 1);
        } else {
          // Game over
          onComplete(score === wordsToPronounce.length); // All correct for success
          setCurrentWordIndex(0); // Reset for next play
          setScore(0);
        }
      }, 1500);
    }, 2000); // Simulate 2 seconds of listening/processing
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center justify-center">
          <p className="text-xl mb-4 text-kerala-green-700">Say the word:</p>
          <div className="text-5xl font-bold text-marigold-500 mb-6">{currentWord}</div>
          <Button
            onClick={handlePronounce}
            className="px-8 py-3 text-lg bg-gradient-to-r from-marigold-500 to-marigold-600 hover:from-marigold-600 hover:to-marigold-700 text-white shadow-lg hover:shadow-xl transition-all"
            disabled={listening}
          >
            {listening ? 'Listening...' : <><Mic className="mr-2" /> Pronounce</>}
          </Button>
        </div>

        {feedback && (
          <div className={`text-center text-2xl font-bold mt-4 ${feedback === 'correct' ? 'text-green-600' : 'text-red-600'}`}>
            {feedback === 'correct' ? 'Correct!' : 'Try again!'}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PronunciationChallengeGame;
