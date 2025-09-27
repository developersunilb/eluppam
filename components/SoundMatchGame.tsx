'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Volume2, Play } from 'lucide-react';

interface SoundMatchGameProps {
  onComplete: (success: boolean) => void;
}

interface VowelData {
  letter: string;
  audio: string; // Path to the audio file
}

const allVowels: VowelData[] = [
  { letter: 'അ', audio: '/audio/malayalam/vowels/അ.mp3' },
  { letter: 'ആ', audio: '/audio/malayalam/vowels/ആ.mp3' },
  { letter: 'ഇ', audio: '/audio/malayalam/vowels/ഇ.mp3' },
  { letter: 'ഈ', audio: '/audio/malayalam/vowels/ഈ.mp3' },
  { letter: 'ഉ', audio: '/audio/malayalam/vowels/ഉ.mp3' },
  { letter: 'ഊ', audio: '/audio/malayalam/vowels/ഊ.mp3' },
  { letter: 'ഋ', audio: '/audio/malayalam/vowels/ഋ.mp3' },
  { letter: 'എ', audio: '/audio/malayalam/vowels/എ.mp3' },
  { letter: 'ഏ', audio: '/audio/malayalam/vowels/ഏ.mp3' },
  { letter: 'ഐ', audio: '/audio/malayalam/vowels/ഐ.mp3' },
  { letter: 'ഒ', audio: '/audio/malayalam/vowels/ഒ.mp3' },
  { letter: 'ഓ', audio: '/audio/malayalam/vowels/ഓ.mp3' },
  { letter: 'ഔ', audio: '/audio/malayalam/vowels/ഔ.mp3' },
];

const MAX_ROUNDS = 5;

const SoundMatchGame: React.FC<SoundMatchGameProps> = ({ onComplete }) => {
  const [gameState, setGameState] = useState<'idle' | 'playing'>('idle');
  const [currentVowel, setCurrentVowel] = useState<VowelData | null>(null);
  const [options, setOptions] = useState<VowelData[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio();
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  const playAudio = (audioSrc: string) => {
    if (audioRef.current) {
      audioRef.current.src = audioSrc;
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          if (error.name !== 'AbortError') {
            console.error("Audio play failed:", error);
          }
        });
      }
    }
  };

  useEffect(() => {
    if (gameState === 'playing' && currentVowel) {
      playAudio(currentVowel.audio);
    }
  }, [currentVowel, gameState]);

  const generateRound = () => {
    setFeedback(null);
    setSelectedOption(null);
    const shuffledVowels = [...allVowels].sort(() => 0.5 - Math.random());
    const targetVowel = shuffledVowels[0];
    const incorrectOptions = shuffledVowels.slice(1, 4);
    const currentOptions = [...incorrectOptions, targetVowel].sort(() => 0.5 - Math.random());
    
    setCurrentVowel(targetVowel);
    setOptions(currentOptions);
  };

  const startGame = () => {
    setRound(0);
    setScore(0);
    setGameState('playing');
    generateRound();
  };

  const replaySound = () => {
    if (currentVowel) {
      playAudio(currentVowel.audio);
    }
  };

  const handleOptionClick = (selectedLetter: string) => {
    if (feedback) return;

    setSelectedOption(selectedLetter);
    let isCorrect = false;
    if (currentVowel && selectedLetter === currentVowel.letter) {
      setFeedback('correct');
      setScore(prev => prev + 1);
      isCorrect = true;
    } else {
      setFeedback('incorrect');
    }

    setTimeout(() => {
      const nextRound = round + 1;
      if (nextRound >= MAX_ROUNDS) {
        const finalScore = isCorrect ? score + 1 : score;
        onComplete(finalScore === MAX_ROUNDS);
      } else {
        setRound(nextRound);
        generateRound();
      }
    }, 1500);
  };

  const getButtonClassName = (letter: string) => {
    if (selectedOption === letter) {
      return feedback === 'correct' ? 'bg-green-500 text-white' : 'bg-red-500 text-white';
    }
    if (feedback === 'incorrect' && currentVowel && letter === currentVowel.letter) {
      return 'bg-green-300 text-white';
    }
    return 'bg-marigold-200 text-marigold-800 hover:bg-marigold-300';
  };

  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardHeader>
        {gameState === 'playing' && (
          <CardTitle className="text-center text-2xl text-kerala-green-800">Round {round + 1} of {MAX_ROUNDS}</CardTitle>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {gameState === 'idle' && (
          <div className="text-center">
            {/*<h2 className="text-2xl font-bold text-kerala-green-700 mb-4">Sound Match</h2>*/}
            <p className="text-lg mb-6 text-marigold-600">Listen to the sound and match it to the correct vowel. Get 5 in a row to win!</p>
            <Button onClick={startGame} className="px-8 py-4 text-xl bg-marigold-500 hover:bg-marigold-600 text-white">
              <Play className="mr-2" /> Start Game
            </Button>
          </div>
        )}

        {gameState === 'playing' && (
          <>
            <div className="flex flex-col items-center justify-center">
              <p className="text-xl mb-4 text-kerala-green-700">Listen and select the correct vowel:</p>
              <Button
                onClick={replaySound}
                className="rounded-full bg-marigold-500 hover:bg-marigold-600 text-white shadow-lg"
                size="icon"
                disabled={!!feedback}
              >
                <Volume2 size={24} />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {options.map((vowel) => (
                <Button
                  key={vowel.letter}
                  onClick={() => handleOptionClick(vowel.letter)}
                  className={`text-4xl p-6 ${getButtonClassName(vowel.letter)}`}
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
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SoundMatchGame;
