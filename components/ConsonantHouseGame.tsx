'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

// --- CONSTANTS ---
const consonants = ['പ', 'ഫ', 'ബ', 'ഭ', 'മ'];

// Positions of the blocks on the ground
const brickMountPositions = [
  { x: 100, y: 540, color: '#CD5C5C', letter: '' },
  { x: 180, y: 540, color: '#BC8F8F', letter: '' },
  { x: 260, y: 540, color: '#D2691E', letter: '' },
  { x: 340, y: 540, color: '#A0522D', letter: '' },
  { x: 420, y: 540, color: '#8B4513', letter: '' },
];

// A single, centered spot where the crane drops the block
const PLACEMENT_ZONE = { x: 400, y: 470 }; // Centered horizontally

// Crane's static position
const CRANE_BASE_X = 720;
const CRANE_TOWER_HEIGHT = 400;
const CRANE_JIB_LENGTH = 280;
const CRANE_IDLE_ROTATION = -Math.PI / 2;
const CRANE_TRAVEL_HEIGHT = 200;
const CRANE_IDLE_HEIGHT = 300;

// --- TYPES ---
interface Brick {
  letter: string;
  isPlaced: boolean;
  x: number;
  y: number;
  color: string;
}

type AnimationState = 'idle' | 'movingToBlock' | 'liftingBlock' | 'movingToHouse' | 'placingBlock' | 'fadingBlock' | 'returning';

// --- HELPER FUNCTIONS ---
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const distance = (x1: number, y1: number, x2: number, y2: number) => Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

const ConsonantHouseGame = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  
  // Game state
  const [bricks, setBricks] = useState<Brick[]>([]);
  const [targetConsonant, setTargetConsonant] = useState('');
  const [houseStage, setHouseStage] = useState(0);
  const [houseImages, setHouseImages] = useState<HTMLImageElement[]>([]);
  const [isGameComplete, setIsGameComplete] = useState(false);


  // Animation state
  const [animationState, setAnimationState] = useState<AnimationState>('idle');
  const [craneRotation, setCraneRotation] = useState(CRANE_IDLE_ROTATION);
  const [cableEndPos, setCableEndPos] = useState({ x: CRANE_BASE_X - CRANE_JIB_LENGTH, y: CRANE_TRAVEL_HEIGHT });
  const [grabbedBlock, setGrabbedBlock] = useState<Brick | null>(null);
  const [targetPos, setTargetPos] = useState({ x: 0, y: 0 });
  
  // State for fading animation
  const [blockToFade, setBlockToFade] = useState<Brick | null>(null);
  const [fadeOpacity, setFadeOpacity] = useState(1);


  // Refs for animation loop to access fresh state
  const animationStateRef = useRef(animationState);
  const craneRotationRef = useRef(craneRotation);
  const cableEndPosRef = useRef(cableEndPos);
  const grabbedBlockRef = useRef(grabbedBlock);
  const targetPosRef = useRef(targetPos);

  useEffect(() => {
    animationStateRef.current = animationState;
    craneRotationRef.current = craneRotation;
    cableEndPosRef.current = cableEndPos;
    grabbedBlockRef.current = grabbedBlock;
    targetPosRef.current = targetPos;
  });

  useEffect(() => {
    const imagePaths = [
      '/game/assets/image/homebuild/keralahome1.png',
      '/game/assets/image/homebuild/keralahome2.png',
      '/game/assets/image/homebuild/keralahome3.png',
      '/game/assets/image/homebuild/keralahome4.png',
      '/game/assets/image/homebuild/keralahome5.png',
    ];
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;
    imagePaths.forEach(src => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
            loadedImages.push(img);
            loadedCount++;
            if (loadedCount === imagePaths.length) {
                const orderedImages = imagePaths.map(path => loadedImages.find(i => i.src.endsWith(path))!);
                setHouseImages(orderedImages);
            }
        };
    });
  }, []);

  const initializeGame = useCallback(() => {
    const shuffled = [...consonants].sort(() => Math.random() - 0.5);
    const newBricks = brickMountPositions.map((pos, i) => ({
      ...pos,
      letter: shuffled[i],
      isPlaced: false,
    }));
    setBricks(newBricks);
    setTargetConsonant(consonants[0]);
    setFeedback(`Click on: ${consonants[0]}`);
    setHouseStage(0);
    setGrabbedBlock(null);
    setBlockToFade(null);
    setAnimationState('idle');
    setCraneRotation(CRANE_IDLE_ROTATION);
    setCableEndPos({ x: CRANE_BASE_X - CRANE_JIB_LENGTH, y: CRANE_TRAVEL_HEIGHT });
    setIsGameComplete(false);
  }, []);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const handleCorrectPlacement = useCallback(() => {
    const placedBlockLetter = blockToFade?.letter; // Use the fading block's letter
    if (!placedBlockLetter) return;

    const newHouseStage = houseStage + 1;
    setHouseStage(newHouseStage);
    setBricks(prev => prev.map(b => b.letter === placedBlockLetter ? { ...b, isPlaced: true } : b));
    setScore(prev => prev + 20);

    if (newHouseStage === consonants.length) {
      setFeedback('🎉 Beautiful house complete!');
      setIsGameComplete(true);
    } else {
      const newTarget = consonants[newHouseStage];
      setTargetConsonant(newTarget);
      setFeedback(`Click on: ${newTarget}`);
    }
  }, [houseStage, blockToFade]);

  // --- Main Animation Loop ---
  useEffect(() => {
    const jibOrigin = { x: CRANE_BASE_X, y: 550 - CRANE_TOWER_HEIGHT };
    let animationFrameId: number;

    const gameLoop = () => {
      // Stop the loop only if the game is complete AND the crane is idle.
      if (isGameComplete && animationStateRef.current === 'idle') {
        cancelAnimationFrame(animationFrameId);
        return;
      }

      const state = animationStateRef.current;
      const speed = 0.03;

      switch (state) {
        case 'movingToBlock': {
          const block = grabbedBlockRef.current;
          if (!block) break;

          const targetAngle = Math.atan2(block.y - jibOrigin.y, block.x - jibOrigin.x);
          const currentRotation = craneRotationRef.current;
          const newRotation = lerp(currentRotation, targetAngle, speed * 2);
          setCraneRotation(newRotation);

          const currentCableEnd = cableEndPosRef.current;
          const newCableEnd = {
            x: lerp(currentCableEnd.x, block.x, speed),
            y: lerp(currentCableEnd.y, block.y, speed),
          };
          setCableEndPos(newCableEnd);

          if (distance(newCableEnd.x, newCableEnd.y, block.x, block.y) < 1) {
            setCableEndPos({ x: block.x, y: block.y });
            setAnimationState('liftingBlock');
          }
          break;
        }
        case 'liftingBlock': {
          const currentCableEnd = cableEndPosRef.current;
          const newCableEnd = {
            x: currentCableEnd.x,
            y: lerp(currentCableEnd.y, CRANE_TRAVEL_HEIGHT, speed),
          };
          setCableEndPos(newCableEnd);
          setGrabbedBlock(prev => prev ? { ...prev, x: newCableEnd.x, y: newCableEnd.y } : null);

          if (Math.abs(newCableEnd.y - CRANE_TRAVEL_HEIGHT) < 1) {
            setTargetPos(PLACEMENT_ZONE);
            setAnimationState('movingToHouse');
          }
          break;
        }
        case 'movingToHouse': {
          const destination = targetPosRef.current;
          const targetAngle = Math.atan2(destination.y - jibOrigin.y, destination.x - jibOrigin.x);
          const currentRotation = craneRotationRef.current;
          const newRotation = lerp(currentRotation, targetAngle, speed);
          setCraneRotation(newRotation);

          const newCableEnd = {
             x: jibOrigin.x + Math.cos(newRotation) * CRANE_JIB_LENGTH,
             y: CRANE_TRAVEL_HEIGHT
          };
          setCableEndPos(newCableEnd);
          setGrabbedBlock(prev => prev ? { ...prev, x: newCableEnd.x, y: newCableEnd.y } : null);

          if (Math.abs(newRotation - targetAngle) < 0.01) {
            setAnimationState('placingBlock');
          }
          break;
        }
        case 'placingBlock': {
          const destination = targetPosRef.current;
          const currentCableEnd = cableEndPosRef.current;
          const newCableEnd = {
            x: lerp(currentCableEnd.x, destination.x, speed),
            y: lerp(currentCableEnd.y, destination.y, speed),
          };
          setCableEndPos(newCableEnd);
          setGrabbedBlock(prev => prev ? { ...prev, x: newCableEnd.x, y: newCableEnd.y } : null);

          if (distance(newCableEnd.x, newCableEnd.y, destination.x, destination.y) < 1) {
            setBlockToFade(grabbedBlockRef.current);
            setGrabbedBlock(null);
            setFadeOpacity(1);
            setAnimationState('fadingBlock');
          }
          break;
        }
        case 'fadingBlock': {
            const newOpacity = fadeOpacity - 0.02;
            setFadeOpacity(newOpacity);

            if (newOpacity <= 0) {
                handleCorrectPlacement();
                setBlockToFade(null);
                setAnimationState('returning');
            }
            break;
        }
        case 'returning': {
          const speed = 0.03;
          
          // 1. Animate rotation to idle
          const currentRotation = craneRotationRef.current;
          const newRotation = lerp(currentRotation, CRANE_IDLE_ROTATION, speed);
          setCraneRotation(newRotation);

          // 2. Animate cable to idle position (based on FINAL rotation)
          const finalIdleX = jibOrigin.x + Math.cos(CRANE_IDLE_ROTATION) * CRANE_JIB_LENGTH;
          const finalIdlePos = { x: finalIdleX, y: CRANE_IDLE_HEIGHT };

          const currentCableEnd = cableEndPosRef.current;
          const newCableEnd = {
            x: lerp(currentCableEnd.x, finalIdlePos.x, speed),
            y: lerp(currentCableEnd.y, finalIdlePos.y, speed),
          };
          setCableEndPos(newCableEnd);

          // 3. Check for completion
          if (Math.abs(newRotation - CRANE_IDLE_ROTATION) < 0.01 && distance(newCableEnd.x, newCableEnd.y, finalIdlePos.x, finalIdlePos.y) < 1) {
            setCraneRotation(CRANE_IDLE_ROTATION);
            setCableEndPos(finalIdlePos);
            setAnimationState('idle');
          }
          break;
        }
      }
      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [handleCorrectPlacement, houseStage, fadeOpacity, isGameComplete]);

  // --- Drawing Functions ---
  const drawCrane = useCallback((ctx: CanvasRenderingContext2D) => {
    const jibOrigin = { x: CRANE_BASE_X, y: 550 - CRANE_TOWER_HEIGHT };

    // Tower
    ctx.fillStyle = '#FFD700';
    ctx.strokeStyle = '#DAA520';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(CRANE_BASE_X - 15, 550);
    ctx.lineTo(CRANE_BASE_X - 10, jibOrigin.y);
    ctx.lineTo(CRANE_BASE_X + 10, jibOrigin.y);
    ctx.lineTo(CRANE_BASE_X + 15, 550);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Jib tip position in world coordinates
    const jibTipX = jibOrigin.x + Math.cos(craneRotation) * CRANE_JIB_LENGTH;
    const jibTipY = jibOrigin.y + Math.sin(craneRotation) * CRANE_JIB_LENGTH;

    // Cabin and Jib (rotated part)
    ctx.save();
    ctx.translate(jibOrigin.x, jibOrigin.y);
    ctx.rotate(craneRotation);

    // Jib Arm
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.moveTo(0, -5);
    ctx.lineTo(CRANE_JIB_LENGTH, -15);
    ctx.lineTo(CRANE_JIB_LENGTH, 15);
    ctx.lineTo(0, 5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Cabin
    ctx.fillStyle = '#4682B4';
    ctx.fillRect(-25, -25, 50, 50);
    ctx.strokeRect(-25, -25, 50, 50);

    // Counterweight
    ctx.fillStyle = '#808080';
    ctx.fillRect(-50, -20, 25, 40);

    ctx.restore(); // Restore from rotation

    // Cable (now drawn in world space)
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(jibTipX, jibTipY);
    ctx.lineTo(cableEndPos.x, cableEndPos.y);
    ctx.stroke();

    // Magnet (drawn in world space)
    ctx.fillStyle = grabbedBlock ? '#FF4500' : '#A9A9A9';
    ctx.beginPath();
    ctx.moveTo(cableEndPos.x - 20, cableEndPos.y - 10);
    ctx.lineTo(cableEndPos.x + 20, cableEndPos.y - 10);
    ctx.lineTo(cableEndPos.x + 15, cableEndPos.y + 10);
    ctx.lineTo(cableEndPos.x - 15, cableEndPos.y + 10);
    ctx.closePath();
    ctx.fill();

  }, [craneRotation, cableEndPos, grabbedBlock]);

  const drawBrick = useCallback((ctx: CanvasRenderingContext2D, brick: Brick, opacity = 1) => {
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.fillStyle = brick.color;
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.fillRect(brick.x - 30, brick.y - 30, 60, 60);
    ctx.strokeRect(brick.x - 30, brick.y - 30, 60, 60);

    ctx.fillStyle = 'white';
    ctx.font = 'bold 28px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(brick.letter, brick.x, brick.y);
    ctx.restore();
  }, []);

  const drawHouse = useCallback((ctx: CanvasRenderingContext2D) => {
    if (houseStage > 0 && houseImages.length >= houseStage) {
      const currentImage = houseImages[houseStage - 1];
      if (currentImage) {
        const width = 500; // 2.5x original size
        const height = 500; // 2.5x original size
        const x = 400 - width / 2; // Center horizontally
        const y = 500 - height + 30; // Place on top of the ground and move down
        ctx.drawImage(currentImage, x, y, width, height);
      }
    }
  }, [houseStage, houseImages]);

  const drawGame = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, 800, 600);
    // Sky
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, 800, 550);
    // Ground
    ctx.fillStyle = '#228B22';
    ctx.fillRect(0, 500, 800, 100);

    // Draw static bricks
    bricks.forEach(brick => {
      if (!brick.isPlaced && brick.letter !== grabbedBlock?.letter && brick.letter !== blockToFade?.letter) {
        drawBrick(ctx, brick);
      }
    });
    
    // Draw house-in-progress
    drawHouse(ctx);

    // Draw crane
    drawCrane(ctx);

    // Draw grabbed block
    if (grabbedBlock) {
      drawBrick(ctx, grabbedBlock);
    }
    
    // NEW: Draw fading block
    if (blockToFade) {
        drawBrick(ctx, blockToFade, fadeOpacity);
    }

  }, [bricks, grabbedBlock, blockToFade, fadeOpacity, drawBrick, drawHouse, drawCrane]);

  // --- Main Render Loop ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const render = () => {
      drawGame(ctx);
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [drawGame]);

  // --- Event Handlers ---
  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (animationState !== 'idle' || isGameComplete) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const clickedBrick = bricks.find(brick => 
      !brick.isPlaced &&
      x > brick.x - 30 && x < brick.x + 30 &&
      y > brick.y - 30 && y < brick.y + 30
    );

    if (clickedBrick) {
      if (clickedBrick.letter === targetConsonant) {
        setFeedback('🏗️ Picking up block...');
        setGrabbedBlock(clickedBrick);
        setAnimationState('movingToBlock');
      } else {
        setFeedback('🧱 Wrong block! Try again.');
        setTimeout(() => setFeedback(`Click on: ${targetConsonant}`), 1500);
      }
    }
  }, [animationState, bricks, targetConsonant, isGameComplete]);

  const handleRetry = () => {
    initializeGame();
  };

  const handlePlayNext = () => {
    setLevel(prev => prev + 1);
    setScore(prev => prev + 100);
    initializeGame();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-100 to-blue-300 p-4">
      <div className="bg-gradient-to-b from-orange-100 to-yellow-100 rounded-lg shadow-2xl p-6 max-w-5xl w-full border-4 border-orange-600">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-orange-800 drop-shadow-lg">🏗️ House Crane Builder 🏗️</h1>
          <div className="flex gap-4">
            <div className="bg-red-500 px-4 py-2 rounded-lg border-2 border-red-700">
              <span className="font-semibold text-white">Level: {level}</span>
            </div>
            <div className="bg-green-500 px-4 py-2 rounded-lg border-2 border-green-700">
              <span className="font-semibold text-white">Score: {score}</span>
            </div>
          </div>
        </div>

        <div className="mb-4 text-center">
          <div className="text-xl font-semibold text-gray-800 bg-gradient-to-r from-orange-200 to-yellow-200 py-3 px-6 rounded-lg inline-block border-2 border-orange-400 shadow-lg">
            {feedback || 'Click the correct block to build the house!'}
          </div>
        </div>

        <div className="flex justify-center">
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={800}
              height={600}
              className="border-4 border-orange-600 rounded-lg cursor-pointer bg-gradient-to-b from-sky-200 to-green-200 shadow-2xl"
              onClick={handleCanvasClick}
            />
            {isGameComplete && (
              <div className="absolute top-1/2 -translate-y-1/2 right-[-270px] w-[220px] flex flex-col items-center justify-center bg-gray-100 p-4 rounded-lg shadow-inner">
                <button onClick={handleRetry} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-xl shadow-lg transition-transform transform hover:scale-105 mb-4 w-full">
                  Retry
                </button>
                <button onClick={handlePlayNext} className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg text-xl shadow-lg transition-transform transform hover:scale-105 w-full">
                  Play Next Game
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 text-center text-orange-800">
          <p className="text-sm font-semibold">🎯 Click the correct block to have the crane build the house!</p>
          <p className="text-sm mt-1 font-semibold">🏗️ Build progress: {houseStage}/5</p>
        </div>
      </div>
    </div>
  );
};

export default ConsonantHouseGame;