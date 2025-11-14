"use client";
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

/**
 * ConsonantArrowGame component.
 * @returns {JSX.Element} A div containing all the elements of the game.
 */
const ConsonantArrowGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState('ready'); // ready, aiming, shooting, hit
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [dragCurrent, setDragCurrent] = useState<{ x: number; y: number } | null>(null);
  const [arrow, setArrow] = useState<{ x: number; y: number; vx: number; vy: number; angle: number; time: number } | null>(null);
  const [hitConsonants, setHitConsonants] = useState<string[]>([]);
  const [targetConsonant, setTargetConsonant] = useState('');
  const [feedback, setFeedback] = useState('');
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const [parrotImage, setParrotImage] = useState<HTMLImageElement | null>(null);
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const innerContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const img = new Image();
    img.src = '/game/parrotarrow.png';
    img.onload = () => setParrotImage(img);
  }, []);

  const consonants = useMemo(() => ['ക', 'ഖ', 'ഗ', 'ഘ', 'ങ', 'ച', 'ഛ', 'ജ', 'ഝ', 'ഞ'], []);
  const parrotPos = useMemo(() => ({ x: 150, y: 500 }), []);
  const boardCenter = { x: 600, y: 200 };

  const router = useRouter();

  interface ConsonantPosition {
    letter: string;
    x: number;
    y: number;
    hit: boolean;
  }



  const selectNewTarget = (allConsonants: string[], currentHitConsonants: string[]) => {
    const availableConsonants = allConsonants.filter((c: string) => !currentHitConsonants.includes(c));

    if (availableConsonants.length === 0) {
      setFeedback('🎉 Level Complete! All consonants hit!');
    } else {
      const newTarget = availableConsonants[Math.floor(Math.random() * availableConsonants.length)];
    setTargetConsonant(newTarget);
    setFeedback(`Shoot the letter: ${newTarget}`);
    }
  };

  const getConsonantPositions = useCallback((scaleX: number, scaleY: number) => {
    const positions: ConsonantPosition[] = [];
    const rightStartX1 = 600 * scaleX;
    const rightStartX2 = 700 * scaleX;
    const rightStartY = 100 * scaleY;
    const rightSpacingY = 80 * scaleY;

    const leftStartX1 = 100 * scaleX;
    const leftStartX2 = 200 * scaleX;
    const leftStartY = 100 * scaleY;
    const leftSpacingY = 100 * scaleY;

    const lettersToMove = ['ജ', 'ഝ', 'ഞ'];
    const rightSideConsonants = consonants.filter((c: string) => !lettersToMove.includes(c));
    const leftSideConsonants = consonants.filter((c: string) => lettersToMove.includes(c));

    rightSideConsonants.forEach((letter: string, i: number) => {
      const row = i;
      let x = i % 2 === 0 ? rightStartX1 : rightStartX2;
      let y = rightStartY + row * rightSpacingY;

      if (letter === 'ക' || letter === 'ഖ') {
        y -= 50 * scaleY;
      }

      positions.push({ letter, x, y, hit: hitConsonants.includes(letter) });
    });

    leftSideConsonants.forEach((letter: string, i: number) => {
      const row = i;
      const x = i % 2 === 0 ? leftStartX1 : leftStartX2;
      const y = leftStartY + row * leftSpacingY;
      positions.push({ letter, x, y, hit: hitConsonants.includes(letter) });
    });

    return positions;
  }, [consonants, hitConsonants]);

  const drawCloud = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, scale: number) => {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.beginPath();
    ctx.arc(x, y, 20 * scale, 0, Math.PI * 2);
    ctx.arc(x + 25 * scale, y, 25 * scale, 0, Math.PI * 2);
    ctx.arc(x + 50 * scale, y, 20 * scale, 0, Math.PI * 2);
    ctx.fill();
  }, []);

  const drawParrot = useCallback((ctx: CanvasRenderingContext2D, scaleX: number, scaleY: number) => {
    const x = parrotPos.x * scaleX;
    const y = parrotPos.y * scaleY;

    if (parrotImage) {
      ctx.drawImage(parrotImage, x - 40 * scaleX, y - 50 * scaleY, 80 * scaleX, 100 * scaleY);
    } else {
      // Fallback to drawing the parrot if the image is not loaded
      // Body
      // ctx.fillStyle = '#4CAF50';
      // ctx.beginPath();
      // ctx.ellipse(x, y, 30 * scaleX, 40 * scaleY, 0, 0, Math.PI * 2);
      // ctx.fill();

      // // Head
      // ctx.fillStyle = '#66BB6A';
      // ctx.beginPath();
      // ctx.arc(x, y - 35 * scaleY, 25 * scaleX, 0, Math.PI * 2);
      // ctx.fill();

      // // Beak
      // ctx.fillStyle = '#FFA726';
      // ctx.beginPath();
      // ctx.moveTo(x + 15 * scaleX, y - 35 * scaleY);
      // ctx.lineTo(x + 30 * scaleX, y - 35 * scaleY);
      // ctx.lineTo(x + 15 * scaleX, y - 25 * scaleY);
      // ctx.closePath();
      // ctx.fill();

      // // Eye
      // ctx.fillStyle = '#FFF';
      // ctx.beginPath();
      // ctx.arc(x + 5 * scaleX, y - 40 * scaleY, 6 * scaleX, 0, Math.PI * 2);
      // ctx.fill();
      // ctx.fillStyle = '#000';
      // ctx.beginPath();
      // ctx.arc(x + 7 * scaleX, y - 40 * scaleY, 3 * scaleX, 0, Math.PI * 2);
      // ctx.fill();

      // // Wing
      // ctx.fillStyle = '#388E3C';
      // ctx.beginPath();
      // ctx.ellipse(x - 20 * scaleX, y, 15 * scaleX, 25 * scaleY, -0.3, 0, Math.PI * 2);
      // ctx.fill();

      // // Tail feathers
      // ctx.fillStyle = '#FF5722';
      // ctx.beginPath();
      // ctx.moveTo(x - 25 * scaleX, y + 30 * scaleY);
      // ctx.lineTo(x - 35 * scaleX, y + 50 * scaleY);
      // ctx.lineTo(x - 20 * scaleX, y + 35 * scaleY);
      // ctx.closePath();
      // ctx.fill();

      // ctx.fillStyle = '#FF9800';
      // ctx.beginPath();
      // ctx.moveTo(x - 20 * scaleX, y + 35 * scaleY);
      // ctx.lineTo(x - 25 * scaleX, y + 55 * scaleY);
      // ctx.lineTo(x - 15 * scaleX, y + 38 * scaleY);
      // ctx.closePath();
      // ctx.fill();
    }
  }, [parrotPos, parrotImage]);

  const drawArrow = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, angle: number, scaleX: number, scaleY: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    // Arrow shaft
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = 3 * scaleX;
    ctx.beginPath();
    ctx.moveTo(-30 * scaleX, 0);
    ctx.lineTo(20 * scaleX, 0);
    ctx.stroke();

    // Arrow head
    ctx.fillStyle = '#C0C0C0';
    ctx.beginPath();
    ctx.moveTo(20 * scaleX, 0);
    ctx.lineTo(10 * scaleX, -5 * scaleY);
    ctx.lineTo(10 * scaleX, 5 * scaleY);
    ctx.closePath();
    ctx.fill();

    // Fletching
    ctx.fillStyle = '#FF6B6B';
    ctx.beginPath();
    ctx.moveTo(-30 * scaleX, 0);
    ctx.lineTo(-25 * scaleX, -6 * scaleY);
    ctx.lineTo(-20 * scaleX, 0);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#FF8888';
    ctx.beginPath();
    ctx.moveTo(-30 * scaleX, 0);
    ctx.lineTo(-25 * scaleX, 6 * scaleY);
    ctx.lineTo(-20 * scaleX, 0);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }, []);

  const drawBow = useCallback((ctx: CanvasRenderingContext2D, scaleX: number, scaleY: number) => {
    const x = parrotPos.x * scaleX + 20 * scaleX;
    const y = parrotPos.y * scaleY - 10 * scaleY;

    if (gameState === 'aiming' && dragStart && dragCurrent) {
      const dx = dragCurrent.x - dragStart.x;
      const dy = dragCurrent.y - dragCurrent.y;
      const pullDist = Math.min(Math.sqrt(dx * dx + dy * dy), 100 * scaleX);
      const angle = Math.atan2(dy, dx);

      // Bow string pulled
      ctx.strokeStyle = '#8B4513';
      ctx.lineWidth = 3 * scaleX;
      ctx.beginPath();
      ctx.moveTo(x, y - 30 * scaleY);
      ctx.lineTo(dragCurrent.x, dragCurrent.y);
      ctx.lineTo(x, y + 30 * scaleY);
      ctx.stroke();

      // Arrow being pulled
      drawArrow(ctx, dragCurrent.x, dragCurrent.y, angle, scaleX, scaleY);
    } else {
      // Bow string relaxed
      ctx.strokeStyle = '#8B4513';
      ctx.lineWidth = 3 * scaleX;
      ctx.beginPath();
      ctx.moveTo(x, y - 30 * scaleY);
      ctx.quadraticCurveTo(x + 10 * scaleX, y, x, y + 30 * scaleY);
      ctx.stroke();
    }

    // Bow limbs
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = 6 * scaleX;
    ctx.beginPath();
    ctx.moveTo(x, y - 30 * scaleY);
    ctx.quadraticCurveTo(x + 30 * scaleX, y - 20 * scaleY, x + 25 * scaleX, y);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x, y + 30 * scaleY);
    ctx.quadraticCurveTo(x + 30 * scaleX, y + 20 * scaleY, x + 25 * scaleX, y);
    ctx.stroke();
  }, [gameState, dragStart, dragCurrent, parrotPos, drawArrow]);

  const drawTrajectory = useCallback((ctx: CanvasRenderingContext2D, scaleX: number, scaleY: number) => {
    if (!dragStart || !dragCurrent) return;
    
    const dx = dragStart.x - dragCurrent.x;
    const dy = dragStart.y - dragCurrent.y;
    const power = Math.min(Math.sqrt(dx * dx + dy * dy) / (50 * scaleX), 2);

    const vx = dx * power;
    const vy = dy * power;

    ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.lineWidth = 2 * scaleX;
    ctx.setLineDash([5 * scaleX, 5 * scaleX]);
    ctx.beginPath();
    ctx.moveTo(dragCurrent.x, dragCurrent.y);

    for (let t = 0; t < 50; t += 2) {
      const x = dragCurrent.x + vx * t;
      const y = dragCurrent.y + vy * t + 0.5 * 0.3 * t * t;
      ctx.lineTo(x, y);
      if (y > 600 * scaleY) break;
    }

    ctx.stroke();
    ctx.setLineDash([]);
  }, [dragStart, dragCurrent]);

  const drawGame = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height);

    const scaleX = width / 800;
    const scaleY = height / 600;

    // Background
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#E0F6FF');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Draw clouds
    drawCloud(ctx, 100 * scaleX, 80 * scaleY, scaleX);
    drawCloud(ctx, 300 * scaleX, 60 * scaleY, scaleX);
    drawCloud(ctx, 500 * scaleX, 100 * scaleY, scaleX);

    // Draw consonants
    const positions = getConsonantPositions(scaleX, scaleY);
    positions.forEach((pos: ConsonantPosition) => {
      if (!pos.hit) {
        ctx.fillStyle = '#FF6B6B';
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 20 * scaleX, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#FF4444';
        ctx.lineWidth = 3 * scaleX;
        ctx.stroke();

        ctx.fillStyle = '#FFF';
        ctx.font = `bold ${20 * scaleX}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(pos.letter, pos.x, pos.y);
      }
    });

    // Draw parrot
    drawParrot(ctx, scaleX, scaleY);

    // Draw bow
    drawBow(ctx, scaleX, scaleY);

    // Draw trajectory if aiming
    if (gameState === 'aiming' && dragStart && dragCurrent) {
      drawTrajectory(ctx, scaleX, scaleY);
    }

    // Draw arrow if shooting
    if (arrow && gameState === 'shooting') {
      drawArrow(ctx, arrow.x, arrow.y, arrow.angle, scaleX, scaleY);
    }
  }, [gameState, dragStart, dragCurrent, arrow, drawCloud, getConsonantPositions, drawParrot, drawBow, drawTrajectory, drawArrow]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (gameState !== 'ready') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / 800;
    const scaleY = canvas.height / 600;
    const x = (e.clientX - rect.left) / scaleX;
    const y = (e.clientY - rect.top) / scaleY;

    const dist = Math.sqrt((x - parrotPos.x) ** 2 + (y - parrotPos.y) ** 2);
    if (dist < 80 * scaleX) {
      setDragStart({ x, y });
      setGameState('aiming');
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (gameState !== 'aiming') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / 800;
    const scaleY = canvas.height / 600;
    const x = (e.clientX - rect.left) / scaleX;
    const y = (e.clientY - rect.top) / scaleY;

    setDragCurrent({ x, y });
  };

  const handleMouseUp = () => {
    if (gameState !== 'aiming' || !dragStart || !dragCurrent) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const dx = dragStart.x - dragCurrent.x;
    const dy = dragStart.y - dragCurrent.y;
    const scaleX = canvas.width / 800;
    const power = Math.min(Math.sqrt(dx * dx + dy * dy) / (50 * scaleX), 2);

    const vx = dx * power;
    const vy = dy * power;
    const angle = Math.atan2(dy, dx);

    setArrow({
      x: dragCurrent.x,
      y: dragCurrent.y,
      vx,
      vy,
      angle,
      time: 0
    });

    setGameState('shooting');
    setDragStart(null);
    setDragCurrent(null);
  };

  const updateArrow = useCallback(() => {
    if (!arrow) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const scaleX = canvas.width / 800;
    const scaleY = canvas.height / 600;

    const gravity = 0.3 * scaleY;
    const newTime = arrow.time + 1;
    const newX = arrow.x + arrow.vx;
    const newY = arrow.y + arrow.vy + 0.5 * gravity;
    const newVy = arrow.vy + gravity;
    const newAngle = Math.atan2(newVy, arrow.vx);

    // Check collision with consonants
    const positions = getConsonantPositions(scaleX, scaleY);
    for (const pos of positions) {
      if (!pos.hit) {
        const dist = Math.sqrt((newX - pos.x) ** 2 + (newY - pos.y) ** 2);
        if (dist < 35 * scaleX) {
          if (pos.letter === targetConsonant) {
            const newHitConsonants = [...hitConsonants, pos.letter];
            setHitConsonants(newHitConsonants);
            setScore((prev: number) => prev + 10);
            setFeedback('🎯 Perfect hit!');
            setArrow(null);
            setTimeout(() => {
              const available = consonants.filter((c: string) => !newHitConsonants.includes(c));
              if (available.length > 0) {
                selectNewTarget(consonants, newHitConsonants);
                setGameState('ready');
              } else {
                // Level is complete, let the useEffect handle setting gameState to 'level-complete'
                // Do nothing here, just ensure the arrow is null and feedback is set
              }
            }, 1000);
          } else {
            setFeedback('❌ Wrong letter! Try again.');
            setArrow(null);
            setTimeout(() => {
              setGameState('ready');
              setFeedback(`Shoot the letter: ${targetConsonant}`);
            }, 1000);
          }
          return;
        }
      }
    }

    // Check if arrow is out of bounds
    if (newX < 0 || newX > 800 * scaleX || newY > 600 * scaleY) {
      setFeedback('💨 Missed! Try again.');
      setArrow(null);
      setTimeout(() => {
        setGameState('ready');
        setFeedback(`Shoot the letter: ${targetConsonant}`);
      }, 1000);
      return;
    }

    setArrow({
      x: newX,
      y: newY,
      vx: arrow.vx,
      vy: newVy,
      angle: newAngle,
      time: newTime
    });
  }, [arrow, getConsonantPositions, consonants, targetConsonant, hitConsonants]);

  useEffect(() => {
    if (hitConsonants.length === consonants.length) {
      setFeedback('🎉 Level Complete! All consonants hit!');
      setGameState('level-complete');
    }
  }, [hitConsonants, consonants]);

  const handlePlayAgain = () => {
    setGameState('ready');
    setHitConsonants([]);
    setScore(0);
    setLevel((prev: number) => prev + 1);
    selectNewTarget(consonants, []);
  };

  const handleNextLevel = () => {
    router.push('/games');
  };

  useEffect(() => {
    console.log(consonants);
  }, [consonants]);

  useEffect(() => {
    selectNewTarget(consonants, []);
  }, [consonants]);

  useEffect(() => {
    const handleResize = () => {
      if (innerContainerRef.current) {
        const containerWidth = innerContainerRef.current.clientWidth;
        // Account for inner container's p-6 (24px each side) and canvas's border-4 (4px each side)
        const availableWidth = containerWidth - (2 * 24) - (2 * 4);
        const newCanvasWidth = Math.max(0, availableWidth);
        const newCanvasHeight = (newCanvasWidth / 4) * 3; // Maintain 4:3 aspect ratio
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

    

        if (gameState === 'shooting' && arrow) {

          const animationId = requestAnimationFrame(updateArrow);

          return () => cancelAnimationFrame(animationId);

        }

      }, [gameState, dragCurrent, arrow, hitConsonants, targetConsonant, canvasSize, drawGame, updateArrow]);

    

      return (

        <div ref={gameContainerRef} className="flex flex-col items-center justify-center bg-gradient-to-b from-blue-100 to-blue-200 p-4 min-h-[calc(40vh-3.375rem)] relative touch-none">

          <div ref={innerContainerRef} className="bg-white rounded-lg shadow-2xl p-6 max-w-4xl w-full overflow-hidden">

            <div className="flex items-center justify-between mb-4">

              <h1 className="text-3xl font-bold text-blue-600">Consonant Arrow Shoot</h1>

              <div className="flex gap-4">

                <div className="bg-blue-100 px-4 py-2 rounded-lg">

                  <span className="font-semibold">Level: {level}</span>

                </div>

                <div className="bg-green-100 px-4 py-2 rounded-lg">

                  <span className="font-semibold">Score: {score}</span>

                </div>

              </div>

            </div>

    

            <div className="mb-4 text-center">

              <div className="text-xl font-semibold text-gray-700 bg-yellow-100 py-3 px-6 rounded-lg inline-block">

                {feedback || 'Drag the parrot to aim and shoot!'}

              </div>

            </div>

    

            <canvas

              ref={canvasRef}

              width={canvasSize.width}

              height={canvasSize.height}

              className="border-4 border-blue-300 rounded-lg cursor-crosshair"

              onMouseDown={handleMouseDown}

              onMouseMove={handleMouseMove}

              onMouseUp={handleMouseUp}

              onMouseLeave={handleMouseUp}

            />

    

            <div className="mt-4 text-center text-gray-600">

              <p className="text-sm">Click and drag near the parrot to aim, then release to shoot!</p>

              <p className="text-sm mt-1">Hit: {hitConsonants.join(', ') || 'None yet'}</p>

            </div>

          </div>

    

          {gameState === 'level-complete' && (

            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">

              <div className="bg-white rounded-lg shadow-2xl p-6 max-w-sm w-full text-center">

                <h1 className="text-3xl font-bold text-blue-600">Level Complete!</h1>

                <div className="flex justify-center gap-4 mt-4">

                  <button onClick={handlePlayAgain} className="px-8 py-3 text-lg bg-green-600 hover:bg-green-700 text-white rounded-lg">

                    Play Again

                  </button>

                  <button onClick={handleNextLevel} className="px-8 py-3 text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-lg">

                    Back

                  </button>

                </div>

              </div>

            </div>

          )}

        </div>

      );

    };

    

    export default ConsonantArrowGame;