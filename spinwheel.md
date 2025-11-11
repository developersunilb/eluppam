'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { useProgress } from '@/context/ProgressContext';
import { toast } from '@/hooks';
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
  const onamColors = ['#9ED110', '#50B517', '#179067', '#476EAF', '#9f49ac', '#CC42A2', '#FF3BA7', '#FF5800', '#FF8100', '#FEAC00', '#FFCC00', '#EDE604'];
  const segmentAngle = 360 / onamColors.length;
  const colorStops = onamColors.map((color, i) => {
    const start = i * segmentAngle;
    return `${color} ${start}deg ${(start + segmentAngle)}deg`;
  }).join(', ');
  const gradient = `conic-gradient(${colorStops})`;

  console.log('SpinAWheelGame component rendering.');
  const { updateModuleProgress, addBadge } = useProgress();
  const [wheelConsonant, setWheelConsonant] = useState<string | null>(null);
  const [targetConsonant, setTargetConsonant] = useState<string | null>(null);
  const [attemptsLeft, setAttemptsLeft] = useState<number>(MAX_ATTEMPTS);
  const [message, setMessage] = useState<string>('');
  const [canSpin, setCanSpin] = useState<boolean>(true);
  const [lastPlayed, setLastPlayed] = useState<number>(0);
  const [spinning, setSpinning] = useState<boolean>(false);
  const [hasSpun, setHasSpun] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(0);

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
  

    const spinWheel = useCallback(() => {
      console.log('Spin button pressed. Current spinning:', spinning, 'attemptsLeft:', attemptsLeft, 'canSpin:', canSpin);
      if (!canSpin || attemptsLeft === 0 || spinning) {
        console.log('Spin prevented:', { canSpin, attemptsLeft, spinning });
        return;
      }
  
      setSpinning(true);
      setHasSpun(true);
      setAttemptsLeft(prev => prev - 1);
      setMessage('');
      setCountdown(0);
  
      const randomAngle = Math.floor(Math.random() * 360);
      const newRotation = rotation + (360 * FULL_SPINS) + randomAngle;
      console.log('Spin Debug:', {
        randomAngle,
        currentRotation: rotation,
        FULL_SPINS,
        newRotation,
      });
      setRotation(newRotation);
  
      setTimeout(() => {
        const finalAngle = newRotation % 360;
        const segmentAngle = 360 / WHEEL_CONSONANTS.length;
        const shiftedAngle = (finalAngle + (segmentAngle / 2) + 360) % 360;
        const landedIndex = Math.floor(shiftedAngle / segmentAngle);
        const landedConsonant = WHEEL_CONSONANTS[landedIndex];

        console.log('Spin animation ended. Final angle:', finalAngle, 'Landed on:', landedConsonant);
        setWheelConsonant(landedConsonant);
        playAudio(`/audio/malayalam/consonants/${landedConsonant}.wav`);
  
        if (landedConsonant === targetConsonant) {
          setMessage(`It's a match! You earned a badge for ${landedConsonant} and ${POINTS_PER_MATCH} points!`);
          addBadge({
            id: `${gameId}-${landedConsonant}-${Date.now()}`,
            name: `Spin & Match: ${landedConsonant}`,
            image: `/badges/default.png`, // Placeholder image
            dateEarned: Date.now(),
          });
          toast({
            title: "Consonant Badge Earned!",
            description: `You matched ${landedConsonant}!`, 
          });
        } else {
          setMessage(`No match. The wheel landed on ${landedConsonant}.`);
        }
  
        setSpinning(false);
        if (attemptsLeft > 0) { // Only re-enable if attempts are left
          setCanSpin(true);
        }

        setTimeout(() => {
          handleTryAgain();
          startCountdown();
        }, 2000);
      }, 4000); // Corresponds to the transition duration
    }, [canSpin, attemptsLeft, targetConsonant, addBadge, gameId, rotation]);

  const startCountdown = () => {
    setCountdown(2);
    const timer = setInterval(() => {
      setCountdown(prevCountdown => {
        if (prevCountdown <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevCountdown - 1;
      });
    }, 1000);
  };
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
    startCountdown();
  }, []);

  const handleTryAgain = useCallback(() => {
    const newTargetConsonant = WHEEL_CONSONANTS[Math.floor(Math.random() * WHEEL_CONSONANTS.length)];
    setTargetConsonant(newTargetConsonant);
    setCanSpin(true);
    setMessage('');
    setWheelConsonant(null); // Clear previous landed consonant
    toast({
      title: "New Target!",
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
        <div className="absolute w-full h-full rounded-full border-4 border-gray-500"></div>
        <div className="absolute w-full h-full rounded-full" style={{ backgroundImage: gradient, transform: 'rotate(-15deg)' }}></div>
        {/* Radial lines for segments */}
        {WHEEL_CONSONANTS.map((_, index) => {
          const segmentAngle = 360 / WHEEL_CONSONANTS.length;
          const lineAngle = (index - 0.5) * segmentAngle;
          return (
            <div
              key={`line-${index}`}
              className="absolute top-0 left-1/2 w-px h-1/2 bg-gray-400"
              style={{
                transform: `translateX(-50%) rotate(${lineAngle}deg)`,
                transformOrigin: 'bottom',
              }}
            >
              <div className="absolute -top-1 -left-1 w-2 h-2 bg-gray-400 rounded-full"></div>
            </div>
          );
        })}

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
              className={`absolute text-2xl font-bold ${targetConsonant === consonant ? 'text-teal-500' : 'text-white'}`}
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
          className="absolute w-24 h-24 rounded-full bg-marigold-600 hover:bg-marigold-400 text-white text-lg font-bold flex items-center justify-center z-10"
          style={{ transform: `rotate(${rotation}deg)`, transition: 'transform 4000ms ease-out' }}
        >
          {/* Arrow inside the button, pointing right */}
          <div className="absolute bottom-1/2 left-1/2 w-1 bg-white" style={{ height: '60px', transform: 'translateX(-50%)' }}>
            {/* Triangle tip at the top */}
            <div className="absolute -top-2 left-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-b-4 border-b-white" style={{ transform: 'translateX(-50%)' }}></div>
          </div>
          {spinning ? '...' : (hasSpun ? 'Press Me' : 'Press Me')}
        </Button>.
      </div>

      {countdown > 0 && (
        <p className="text-xl text-white mt-4">Next round in: {countdown}</p>
      )}





      {!canSpin && attemptsLeft === 0 && lastPlayed > 0 && (
        <div>
          <p className="text-md mt-4 text-center text-red-400">
            You have used all your attempts. Come back in {Math.ceil((lastPlayed + COOLDOWN_HOURS * 60 * 60 * 1000 - Date.now()) / (1000 * 60 * 60))} hours.
          </p>
          <Button onClick={handleResetCooldown} className="mt-4 bg-blue-600 hover:bg-blue-700">
            Reset Cooldown
          </Button>
        </div>
      )}


    </div>
  );
};

export default SpinAWheelGame;
// Added a comment to force re-render
