'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { useProgress } from '@/context/ProgressContext';
import { toast } from '@/hooks/use-toast';
import { playAudio } from '@/lib/utils';

// Define the 12 consonants for the wheel
const WHEEL_CONSONANTS = [
  'ക', 'ങ', 'ച', 'ഞ', 'ട', 'ണ', 'ത', 'ന', 'പ', 'മ', 'യ', 'റ'
];

const MAX_ATTEMPTS = 5;
const COOLDOWN_HOURS = 1;
const POINTS_PER_MATCH = 50;
const FULL_SPINS = 2;

const SpinAWheelGame: React.FC = () => {
  console.log('SpinAWheelGame component rendering.');
  const { updateModuleProgress } = useProgress();
  const [wheelConsonant, setWheelConsonant] = useState<string | null>(null);
  const [targetConsonant, setTargetConsonant] = useState<string | null>(null);
  const [attemptsLeft, setAttemptsLeft] = useState<number>(MAX_ATTEMPTS);
  const [message, setMessage] = useState<string>('');
  const [canSpin, setCanSpin] = useState<boolean>(true);
  const [lastPlayed, setLastPlayed] = useState<number>(0);

  const gameId = 'spin-a-wheel';

  // Load game state from localStorage on mount
  useEffect(() => {
    const savedAttempts = localStorage.getItem(`${gameId}-attemptsLeft`);
    const savedLastPlayed = localStorage.getItem(`${gameId}-lastPlayed`);

    if (savedAttempts) {
      setAttemptsLeft(parseInt(savedAttempts, 10));
    }
    if (savedLastPlayed) {
      const lastPlayedTime = parseInt(savedLastPlayed, 10);
      setLastPlayed(lastPlayedTime);
      const cooldownEndTime = lastPlayedTime + COOLDOWN_HOURS * 60 * 60 * 1000;
      if (Date.now() < cooldownEndTime) {
        setCanSpin(false);
        setMessage(`Come back in ${Math.ceil((cooldownEndTime - Date.now()) / (1000 * 60 * 60))} hours.`);
      } else {
        setAttemptsLeft(MAX_ATTEMPTS);
        localStorage.setItem(`${gameId}-attemptsLeft`, MAX_ATTEMPTS.toString());
        setMessage('');
      }
    }

  }, [gameId]);

  // Save attemptsLeft to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(`${gameId}-attemptsLeft`, attemptsLeft.toString());
    if (attemptsLeft === 0 && canSpin) {
      setCanSpin(false);
      setLastPlayed(Date.now());
      localStorage.setItem(`${gameId}-lastPlayed`, Date.now().toString());
      setMessage('Better luck next time! Try again tomorrow.');
    }
  }, [attemptsLeft, gameId, canSpin]);



  const [rotation, setRotation] = useState(0);
  const [showHint, setShowHint] = useState(false);

    const spinWheel = useCallback(() => {
      console.log('Spin button pressed. Current spinning:', spinning, 'attemptsLeft:', attemptsLeft, 'canSpin:', canSpin);
      if (!canSpin || attemptsLeft === 0 || spinning) {
        console.log('Spin prevented:', { canSpin, attemptsLeft, spinning });
        return;
      }
  
      setSpinning(true);
      setAttemptsLeft(prev => prev - 1);
      setMessage('');
  
      const landedIndex = Math.floor(Math.random() * WHEEL_CONSONANTS.length);
      const landedConsonant = WHEEL_CONSONANTS[landedIndex];
  
      const segmentAngle = 360 / WHEEL_CONSONANTS.length;
      const rotationNeeded = (90 - (landedIndex * segmentAngle) + 360) % 360;
      const newRotation = rotation + (360 * FULL_SPINS) + rotationNeeded;
      console.log('Spin Debug:', {
        landedIndex,
        landedConsonant,
        rotationNeeded,
        currentRotation: rotation,
        FULL_SPINS,
        newRotation,
        expectedFinalVisualAngle: (newRotation) % 360,
        expectedFinalConsonantAngle: (landedIndex * segmentAngle),
      });
      console.log('Calculating newRotation:', { currentRotation: rotation, FULL_SPINS, landedIndex, rotationNeeded, newRotation });
      setRotation(newRotation);
  
      setTimeout(() => {
        console.log('Spin animation ended. Landed on:', landedConsonant);
        setWheelConsonant(landedConsonant);
        playAudio(`/audio/malayalam/consonants/${landedConsonant}.wav`);
  
        if (landedConsonant === targetConsonant) {
          setMessage(`It's a match! You earned a badge for ${landedConsonant} and ${POINTS_PER_MATCH} points!`);
          updateModuleProgress(gameId, 'badges', 'earned', POINTS_PER_MATCH);
          toast({
            title: "Consonant Badge Earned!",
            description: `You matched ${landedConsonant}!`, 
          });
        } else {
          setMessage(`No match. The wheel landed on ${landedConsonant}.`);
        }
  
        setSpinning(false);
      }, 4000); // Corresponds to the transition duration
    }, [canSpin, attemptsLeft, targetConsonant, updateModuleProgress, gameId, rotation]);
  const handleResetCooldown = useCallback(() => {
    localStorage.removeItem(`${gameId}-lastPlayed`);
    localStorage.setItem(`${gameId}-attemptsLeft`, MAX_ATTEMPTS.toString());
    setAttemptsLeft(MAX_ATTEMPTS);
    setCanSpin(true);
    setLastPlayed(0);
    setMessage('Cooldown reset. You can spin again!');
    toast({
      title: "Cooldown Reset",
      description: "You can spin the wheel again!",
    });
  }, [gameId]);

  useEffect(() => {
    handleTryAgain();
  }, []);

  const handleTryAgain = useCallback(() => {
    const newTargetConsonant = WHEEL_CONSONANTS[Math.floor(Math.random() * WHEEL_CONSONANTS.length)];
    setTargetConsonant(newTargetConsonant);
    setAttemptsLeft(MAX_ATTEMPTS);
    setCanSpin(true);
    setMessage('');
    setWheelConsonant(null); // Clear previous landed consonant
    localStorage.setItem(`${gameId}-attemptsLeft`, MAX_ATTEMPTS.toString());
    localStorage.removeItem(`${gameId}-lastPlayed`); // Clear cooldown
    toast({
      title: "New Round!",
      description: `Find the consonant: ${newTargetConsonant}`,
    });
  }, [gameId]);

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-gray-800 rounded-lg shadow-xl max-w-md mx-auto">
      <div className="mb-12 text-center">
        <p className="text-xl text-gray-300">Attempts Left: <span className="font-bold text-yellow-400">{attemptsLeft}</span></p>
        <p className="text-xl text-gray-300">Target Consonant: <span className="font-bold text-emerald-400 text-5xl">{targetConsonant}</span></p>
      </div>

      <div className="relative w-80 h-80 flex items-center justify-center mb-6">
        {/* Stationary consonants around the wheel */}
        {WHEEL_CONSONANTS.map((consonant, index) => {
          const segmentAngle = 360 / WHEEL_CONSONANTS.length; // 30 degrees
          const rotationAngle = index * segmentAngle;
          const radius = 120; // Adjust this value to control distance from center

          // Calculate position for each consonant
          const x = radius * Math.sin(rotationAngle * Math.PI / 180);
          const y = -radius * Math.cos(rotationAngle * Math.PI / 180);

          return (
            <span
              key={index}
              className={`absolute text-2xl font-bold ${targetConsonant === consonant ? (showHint ? 'text-blue-500 text-4xl' : 'text-red-500') : 'text-white'}`}
              style={{
                left: '50%',
                top: '50%',
                transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
              }}
            >
              {consonant}
            </span>
          );
        })}

        {/* Spin button in center, which will now rotate */}
        <Button
          onClick={spinWheel}
          disabled={!canSpin || attemptsLeft === 0 || spinning || targetConsonant === null}
          className="absolute w-24 h-24 rounded-full bg-gray-900 hover:bg-gray-700 text-white text-lg font-bold flex items-center justify-center z-10"
          style={{ transform: `rotate(${rotation}deg)`, transition: 'transform 4000ms ease-out' }}
        >
          {/* Arrow inside the button, pointing right */}
          <div className="absolute w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-8 border-l-white -right-2"></div>
          {spinning ? '...' : 'Spin'}
        </Button>
      </div>

      {message && <p className="text-lg mt-8 text-center text-white">{message}</p>}

      <Button
        onClick={() => setShowHint(!showHint)}
        className="mt-4 bg-yellow-600 hover:bg-yellow-700"
      >
        {showHint ? 'Hide Hint' : 'Show Hint'}
      </Button>

      {message && <p className="text-lg mt-8 text-center text-white">{message}</p>}



      {!canSpin && attemptsLeft === 0 && lastPlayed > 0 && (
        <div>
          <p className="text-md mt-4 text-center text-red-400">
            You've used all your attempts. Come back in {Math.ceil((lastPlayed + COOLDOWN_HOURS * 60 * 60 * 1000 - Date.now()) / (1000 * 60 * 60))} hours.
          </p>
          <Button onClick={handleResetCooldown} className="mt-4 bg-blue-600 hover:bg-blue-700">
            Reset Cooldown
          </Button>
        </div>
      )}

      {(attemptsLeft === 0 || (wheelConsonant !== null && wheelConsonant === targetConsonant)) && targetConsonant !== null && (
        <Button onClick={handleTryAgain} className="mt-4 bg-green-600 hover:bg-green-700">
          Try Again
        </Button>
      )}
    </div>
  );
};

export default SpinAWheelGame;
// Added a comment to force re-render