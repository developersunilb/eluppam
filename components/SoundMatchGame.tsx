'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Volume2 } from 'lucide-react';

interface SoundMatchGameProps {
  onComplete: (success: boolean) => void;
}

interface VowelData {
  letter: string;
  audio: string; // Path to the audio file
}

const allVowels: VowelData[] = [
  { letter: 'അ', audio: '/audio/malayalam/vowels/a.mp3' },
  { letter: 'ആ', audio: '/audio/malayalam/vowels/aa.mp3' },
  { letter: 'ഇ', audio: '/audio/malayalam/vowels/i.mp3' },
  { letter: 'ഈ', audio: '/audio/malayalam/vowels/ee.mp3' },
  { letter: 'ഉ', audio: '/audio/malayalam/vowels/u.mp3' },
  { letter: 'ഊ', audio: '/audio/malayalam/vowels/oo.mp3' },
  { letter: 'ഋ', audio: '/audio/malayalam/vowels/ru.mp3' },
  { letter: 'എ', audio: '/audio/malayalam/vowels/e.mp3' },
  { letter: 'ഏ', audio: '/audio/malayalam/vowels/ea.mp3' },
  { letter: 'ഐ', audio: '/audio/malayalam/vowels/ai.mp3' },
  { letter: 'ഒ', audio: '/audio/malayalam/vowels/o.mp3' },
  { letter: 'ഓ', audio: '/audio/malayalam/vowels/oa.mp3' },
  { letter: 'ഔ', audio: '/audio/malayalam/vowels/au.mp3' },
];

const SoundMatchGame: React.FC<SoundMatchGameProps> = ({ onComplete }) => {
  const [currentVowel, setCurrentVowel] = useState<VowelData | null>(null);
  const [options, setOptions] = useState<VowelData[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const generateRound = () => {
    setFeedback(null);
    setSelectedOption(null);
    const shuffledVowels = [...allVowels].sort(() => 0.5 - Math.random());
    const targetVowel = shuffledVowels[0];
    setCurrentVowel(targetVowel);

    const incorrectOptions = shuffledVowels.slice(1, 4); // Get 3 incorrect options
    const currentOptions = [...incorrectOptions, targetVowel].sort(() => 0.5 - Math.random());
    setOptions(currentOptions);

    if (audioRef.current) {
      audioRef.current.src = targetVowel.audio;
      audioRef.current.play();
    }
  };

  useEffect(() => {
    audioRef.current = new Audio();
    generateRound();
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const playSound = () => {
    if (audioRef.current && currentVowel) {
      audioRef.current.src = currentVowel.audio;
      audioRef.current.play();
    }
  };

  const handleOptionClick = (selectedLetter: string) => {
    setSelectedOption(selectedLetter);
    if (currentVowel && selectedLetter === currentVowel.letter) {
      setFeedback('correct');
      setTimeout(() => {
        onComplete(true);
        generateRound();
      }, 1000);
    } else {
      setFeedback('incorrect');
      setTimeout(() => {
        onComplete(false);
        // Optionally, allow retry or show correct answer
        // For now, just reset for a new round
        generateRound();
      }, 1000);
    }
  };

  const getButtonClassName = (letter: string) => {
    if (selectedOption === letter) {
      if (feedback === 'correct') {
        return 'bg-green-500 text-white';
      } else if (feedback === 'incorrect') {
        return 'bg-red-500 text-white';
      }
    } else if (feedback && currentVowel && letter === currentVowel.letter) {
      // Show correct answer if feedback is incorrect and this is the correct letter
      return 'bg-green-300 text-white';
    }
    return 'bg-gray-200 text-gray-800 hover:bg-gray-300';
  };

  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardHeader>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center justify-center">
          <p className="text-xl mb-4 text-kerala-green-700">Listen and select the correct vowel:</p>
          <Button
            onClick={playSound}
            className="p-4 rounded-full bg-marigold-500 hover:bg-marigold-600 text-white shadow-lg"
            size="icon"
          >
            <Volume2 size={48} />
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {options.map((vowel) => (
            <Button
              key={vowel.letter}
              onClick={() => handleOptionClick(vowel.letter)}
              className={`text-5xl p-6 ${getButtonClassName(vowel.letter)}`}
              disabled={!!feedback}
            >
              {vowel.letter}
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

export default SoundMatchGame;
