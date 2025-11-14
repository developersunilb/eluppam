'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

/**
 * Shuffles an array in place.
 * @param {any[]} array The array to shuffle.
 * @returns {any[]} A new array containing the same elements as the original array but in a different order.
 */
const shuffleArray = (array: any[]): any[] => {
  const newArray = [...array];
  // Iterate backwards through the array, swapping each element with a random element from the remaining unshuffled part of the array
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    // Swap elements at i and j
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};


/**
 * ConsonantBowlingGame component.
 * @returns {JSX.Element} A div containing all the elements of the game.
 */
const consonants = ['ച', 'ഛ', 'ജ', 'ഝ', 'ഞ'];

const ConsonantBowlingGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState('ready'); // ready, aiming, shooting, hit
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [dragCurrent, setDragCurrent] = useState<{ x: number; y: number } | null>(null);
  const [bowlingBall, setBowlingBall] = useState<{ x: number; y: number; vx: number; vy: number; time: number } | null>(null);
  const [hitConsonants, setHitConsonants] = useState<string[]>([]);
  const [targetConsonant, setTargetConsonant] = useState('');
  const [feedback, setFeedback] = useState('');
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const innerContainerRef = useRef<HTMLDivElement>(null);
  const bowlingPinImageRef = useRef<HTMLImageElement | null>(null);

  const [shuffledConsonants, setShuffledConsonants] = useState<string[]>([]);
  const ballStartPosition = { x: 400, y: 550 };

  const router = useRouter();

  interface ConsonantPosition {
    letter: string;
    x: number;
    y: number;
    hit: boolean;
  }

  /**
   * Selects a new target consonant to knock down.
   * If all consonants have been knocked down, the feedback is set to 'Level Complete'.
   * Otherwise, the first available consonant is selected as the new target and the feedback is set to 'Knock down the pin with: <newTarget>'.
   * @param {string[]} allConsonants - The array of all consonants.
   * @param {string[]} currentHitConsonants - The array of consonants that have already been knocked down.
   */
  const selectNewTarget = (allConsonants: string[], currentHitConsonants: string[]) => {
    const availableConsonants = allConsonants.filter((c: string) => !currentHitConsonants.includes(c));

    // If all consonants have been knocked down, set the feedback to 'Level Complete'
    if (availableConsonants.length === 0) {
      setFeedback('🎉 Level Complete! All pins knocked down!');
    } else {
      // Otherwise, select the first available consonant as the new target
      const newTarget = availableConsonants[0];
      setTargetConsonant(newTarget);
      setFeedback(`Knock down the pin with: ${newTarget}`);
    }
  };

  const getPinPositions = (scaleX: number, scaleY: number) => {
    const positions: ConsonantPosition[] = [];
    const pinSpacingX = 60 * scaleX;
    const totalWidth = pinSpacingX * (shuffledConsonants.length - 1);
    const startX = (canvasSize.width - totalWidth) / 2;
    const startY = 100 * scaleY; // Moved down from 50

    shuffledConsonants.forEach((letter, i) => {
        positions.push({ 
            letter, 
            x: startX + (i * pinSpacingX),
            y: startY, 
            hit: hitConsonants.includes(letter) 
        });
    });

    return positions;
  };

  /**
   * Draws the bowling alley on the canvas.
   * The bowling alley is represented by a white lane with red gutters on either side.
   * The left gutter is slightly larger than the right gutter.
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
   * @param {number} width - The width of the canvas.
   * @param {number} height - The height of the canvas.
   */
  const drawBowlingAlley = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const laneBottomWidth = 600;
    const laneTopWidth = 300;
    const laneBottomX = (width - laneBottomWidth) / 2;
    const laneTopX = (width - laneTopWidth) / 2;

    // Lane
    ctx.fillStyle = '#DEB887'; // BurlyWood color
    ctx.beginPath();
    ctx.moveTo(laneTopX, 0);
    ctx.lineTo(laneTopX + laneTopWidth, 0);
    ctx.lineTo(laneBottomX + laneBottomWidth, height);
    ctx.lineTo(laneBottomX, height);
    ctx.closePath();
    ctx.fill();

    // Wood grain texture for the lane
    ctx.strokeStyle = '#A0522D'; // Sienna color
    ctx.lineWidth = 1;
    for (let i = 0; i < laneTopWidth; i += 10) {
      const topX = laneTopX + i;
      const bottomX = laneBottomX + (i * (laneBottomWidth / laneTopWidth));
      ctx.beginPath();
      ctx.moveTo(topX, 0);
      ctx.lineTo(bottomX, height);
      ctx.stroke();
    }

    // Gutters
    ctx.fillStyle = '#FFD700';
    ctx.strokeStyle = '#3A1F0F'; // Darker shade for lines
    ctx.lineWidth = 1;

    // Left Gutter
    ctx.beginPath();
    ctx.moveTo(laneTopX - 50, 0);
    ctx.lineTo(laneTopX, 0);
    ctx.lineTo(laneBottomX, height);
    ctx.lineTo(laneBottomX - 100, height);
    ctx.closePath();
    ctx.fill();
    for (let i = 0; i < 50; i += 5) {
      ctx.beginPath();
      ctx.moveTo(laneTopX - 50 + i, 0);
      ctx.lineTo(laneBottomX - 100 + (i * 2), height);
      ctx.stroke();
    }

    // Right Gutter
    ctx.beginPath();
    ctx.moveTo(laneTopX + laneTopWidth, 0);
    ctx.lineTo(laneTopX + laneTopWidth + 50, 0);
    ctx.lineTo(laneBottomX + laneBottomWidth + 100, height);
    ctx.lineTo(laneBottomX + laneBottomWidth, height);
    ctx.closePath();
    ctx.fill();
    for (let i = 0; i < 50; i += 5) {
      ctx.beginPath();
      ctx.moveTo(laneTopX + laneTopWidth + i, 0);
      ctx.lineTo(laneBottomX + laneBottomWidth + (i * 2), height);
      ctx.stroke();
    }
  };

  /**
   * Draws a single pin on the canvas.
   * If the pin has been hit, no drawing is done.
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
   * @param {number} x - The x-coordinate of the pin.
   * @param {number} y - The y-coordinate of the pin.
   * @param {string} letter - The letter to be drawn on the pin.
   * @param {boolean} isHit - Whether the pin has been hit or not.
   */
  const drawPin = (ctx: CanvasRenderingContext2D, x: number, y: number, letter: string, isHit: boolean) => {
    if (isHit) return;

    const pinImage = bowlingPinImageRef.current;
    if (pinImage) {
      const pinWidth = 70; // Increased size
      const pinHeight = 105; // Increased size
      ctx.drawImage(pinImage, x - pinWidth / 2, y - pinHeight / 2, pinWidth, pinHeight);
    }

    // Letter
    ctx.fillStyle = 'black';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(letter, x, y - 60); // Shifted to top of the pin
  }
  
  const drawBowlingBall = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawTrajectory = useCallback((ctx: CanvasRenderingContext2D, scaleX: number, scaleY: number) => {
    if (!dragStart || !dragCurrent) return;
    
    const dx = dragStart.x - dragCurrent.x;
    const dy = dragStart.y - dragCurrent.y;
    const power = Math.min(Math.sqrt(dx * dx + dy * dy) / 50, 3);

    const vx = dx * power;
    const vy = dy * power;

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(dragCurrent.x, dragCurrent.y);

    for (let t = 0; t < 50; t += 2) {
      const x = dragCurrent.x + vx * t * 0.2;
      const y = dragCurrent.y + vy * t * 0.2;
      ctx.lineTo(x, y);
      if (y < 0) break;
    }

    ctx.stroke();
    ctx.setLineDash([]);
  }, [dragStart, dragCurrent]);

  const drawGame = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height);

    const scaleX = width / 800;
    const scaleY = height / 600;

    drawBowlingAlley(ctx, width, height);

    const positions = getPinPositions(scaleX, scaleY);
    positions.forEach((pos: ConsonantPosition) => {
      drawPin(ctx, pos.x, pos.y, pos.letter, pos.hit);
    });

    if (gameState === 'ready' || gameState === 'aiming') {
        drawBowlingBall(ctx, ballStartPosition.x * scaleX, ballStartPosition.y * scaleY);
    }

    if (gameState === 'aiming' && dragStart && dragCurrent) {
      drawTrajectory(ctx, scaleX, scaleY);
      // Draw the ball being pulled back
      drawBowlingBall(ctx, dragCurrent.x, dragCurrent.y);
    }

    if (bowlingBall && gameState === 'shooting') {
      drawBowlingBall(ctx, bowlingBall.x, bowlingBall.y);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (gameState !== 'ready') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const dist = Math.sqrt((x - ballStartPosition.x) ** 2 + (y - ballStartPosition.y) ** 2);
    if (dist < 40) {
      setDragStart({ x: ballStartPosition.x, y: ballStartPosition.y });
      setDragCurrent({ x, y });
      setGameState('aiming');
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (gameState !== 'aiming' || !dragStart) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setDragCurrent({ x, y });
  };

  const handleMouseUp = () => {
    if (gameState !== 'aiming' || !dragStart || !dragCurrent) return;

    const dx = dragStart.x - dragCurrent.x;
    const dy = dragStart.y - dragCurrent.y;
    const power = Math.min(Math.sqrt(dx * dx + dy * dy) / 50, 3);

    const vx = dx * power;
    const vy = dy * power;

    setBowlingBall({
      x: dragStart.x,
      y: dragStart.y,
      vx,
      vy,
      time: 0
    });

    setGameState('shooting');
    setDragStart(null);
    setDragCurrent(null);
  };

  const updateBowlingBall = () => {
    if (!bowlingBall) return;

    const newTime = bowlingBall.time + 1;
    const newX = bowlingBall.x + bowlingBall.vx * 0.2;
    const newY = bowlingBall.y + bowlingBall.vy * 0.2;

    const positions = getPinPositions(1, 1);
    for (const pos of positions) {
      if (!pos.hit) {
        const dist = Math.sqrt((newX - pos.x) ** 2 + (newY - pos.y) ** 2);
        if (dist < 35) {
          if (pos.letter === targetConsonant) {
            const newHitConsonants = [...hitConsonants, pos.letter];
            setHitConsonants(newHitConsonants);
            setScore((prev: number) => prev + 10);
            setFeedback('🎳 Strike! Perfect hit!');
            setBowlingBall(null);
            setTimeout(() => {
              const available = consonants.filter((c: string) => !newHitConsonants.includes(c));
              if (available.length > 0) {
                selectNewTarget(consonants, newHitConsonants);
                setGameState('ready');
              }
            }, 1000);
          } else {
            setFeedback('❌ Wrong pin! Try again.');
            setBowlingBall(null);
            setTimeout(() => {
              setGameState('ready');
              setFeedback(`Knock down the pin with: ${targetConsonant}`);
            }, 1000);
          }
          return;
        }
      }
    }

    if (newY < 0) {
      setFeedback('💨 Gutter ball! Try again.');
      setBowlingBall(null);
      setTimeout(() => {
        setGameState('ready');
        setFeedback(`Knock down the pin with: ${targetConsonant}`);
      }, 1000);
      return;
    }

    setBowlingBall({
      ...bowlingBall,
      x: newX,
      y: newY,
      time: newTime
    });
  };

  useEffect(() => {
    if (hitConsonants.length === consonants.length) {
      setFeedback('🎉 Level Complete! All pins knocked down!');
      setGameState('level-complete');
    }
  }, [hitConsonants, consonants]);

  const handlePlayAgain = () => {
    setGameState('ready');
    setHitConsonants([]);
    setScore(0);
    setLevel((prev: number) => prev + 1);
    let shuffled = shuffleArray(consonants);
    while (JSON.stringify(shuffled) === JSON.stringify(consonants)) {
      shuffled = shuffleArray(consonants);
    }
    setShuffledConsonants(shuffled);
    selectNewTarget(consonants, []);
  };

  const handleNextLevel = () => {
    router.push('/games');
  };

  useEffect(() => {
    const img = new Image();
    img.src = '/game/assets/image/bowling/bowlingpin.png';
    img.onload = () => {
      bowlingPinImageRef.current = img;
      // Force a re-render to draw the image once loaded
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) drawGame(ctx, canvasSize.width, canvasSize.height);
      }
    };
  }, [canvasSize, drawGame]);

  useEffect(() => {
    let shuffled = shuffleArray(consonants);
    while (JSON.stringify(shuffled) === JSON.stringify(consonants)) {
      shuffled = shuffleArray(consonants);
    }
    setShuffledConsonants(shuffled);
    selectNewTarget(consonants, []);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (innerContainerRef.current) {
        const containerWidth = innerContainerRef.current.clientWidth;
        const availableWidth = containerWidth - (2 * 24) - (2 * 4);
        const newCanvasWidth = Math.max(0, availableWidth);
        const newCanvasHeight = (newCanvasWidth / 4) * 3;
        setCanvasSize({ width: newCanvasWidth, height: newCanvasHeight });
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    drawGame(ctx, canvasSize.width, canvasSize.height);

    if (gameState === 'shooting' && bowlingBall) {
      const animationId = requestAnimationFrame(updateBowlingBall);
      return () => cancelAnimationFrame(animationId);
    }
  }, [gameState, dragCurrent, bowlingBall, hitConsonants, targetConsonant, canvasSize, drawGame, updateBowlingBall]);

  return (
    <div ref={gameContainerRef} className="flex flex-col items-center justify-center bg-gradient-to-b from-marigold-200 to-marigold-400 p-4 min-h-[calc(40vh-3.375rem)] relative touch-none">
      <div ref={innerContainerRef} className="bg-green-800 rounded-lg shadow-2xl p-6 max-w-4xl w-full overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-white">Consonant Bowling</h1>
          <div className="flex gap-4">
            <div className="bg-marigold-300 px-4 py-2 rounded-lg">
              <span className="font-semibold">Level: {level}</span>
            </div>
            <div className="bg-green-300 px-4 py-2 rounded-lg">
              <span className="font-semibold">Score: {score}</span>
            </div>
          </div>
        </div>

        <div className="mb-4 text-center">
          <div className="text-xl font-semibold text-white bg-marigold-500 py-3 px-6 rounded-lg inline-block">
            {feedback || 'Drag the ball to aim and shoot!'}
          </div>
        </div>

        <canvas
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          className="border-4 border-purple-300 rounded-lg cursor-pointer"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />

        <div className="mt-4 text-center text-gray-300">
          <p className="text-sm">Click and drag the bowling ball to aim, then release to shoot!</p>
          <p className="text-sm mt-1">Hit: {hitConsonants.join(', ') || 'None yet'}</p>
        </div>
      </div>

      {gameState === 'level-complete' && (
        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
          <div className="bg-gray-800 rounded-lg shadow-2xl p-6 max-w-sm w-full text-center">
            <h1 className="text-3xl font-bold text-white">Level Complete!</h1>
            <div className="flex justify-center gap-4 mt-4">
              <button onClick={handlePlayAgain} className="px-8 py-3 text-lg bg-green-600 hover:bg-green-700 text-white rounded-lg">
                Play Again
              </button>
              <button onClick={handleNextLevel} className="px-8 py-3 text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                Back to Games
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsonantBowlingGame;
