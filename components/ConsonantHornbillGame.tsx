'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

interface Dot {
  label: string;
  connected: boolean;
  x: number;
  y: number;
  order: number;
}

const ConsonantHornbillGame = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState('ready');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [connectedDots, setConnectedDots] = useState<string[]>([]);
  const [targetConsonant, setTargetConsonant] = useState('');
  const [feedback, setFeedback] = useState('');
  const [gameComplete, setGameComplete] = useState(false);
  const [animationFrame, setAnimationFrame] = useState(0);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [completionState, setCompletionState] = useState('not-started');
  const [opacity, setOpacity] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartDot, setDragStartDot] = useState<Dot | null>(null);
  const hornbillImage = useRef(new Image());
  const finalHornbillImage = useRef(new Image());
  const treetrunkImage = useRef(new Image());

  const consonants = ['യ', 'ര', 'ല', 'വ', 'ശ', 'ഷ', 'സ', 'ഹ', 'ള', 'ഴ', 'റ'];

  const hornbillDots = [
    { x: 200, y: 90, label: '', order: 0 }, // Head top
    { x: 320, y: 30, label: '', order: 1 }, // Beak tip
    { x: 520, y: 60, label: '', order: 2 }, // Beak base
    { x: 480, y: 150, label: '', order: 3 }, // Neck
    { x: 600, y: 270, label: '', order: 4 }, // Body top
    { x: 560, y: 450, label: '', order: 5 }, // Body middle
    { x: 520, y: 570, label: '', order: 6 }, // Body bottom
    { x: 480, y: 450, label: '', order: 7 }, // Tail start
    { x: 360, y: 300, label: '', order: 8 }, // Tail middle
    { x: 320, y: 210, label: '', order: 9 }, // Tail end
    { x: 400, y: 120, label: '', order: 10 }, // Wing
  ];

  const [dots, setDots] = useState<Dot[]>([]);

  const initializeGame = useCallback(() => {
    const newDots = hornbillDots.map((dot, i) => ({
      ...dot,
      label: consonants[i],
      connected: false
    }));
    setDots(newDots);
    setTargetConsonant(consonants[0]);
    setFeedback(`Connect: ${consonants[0]}`);
    setConnectedDots([]);
    setGameComplete(false);
    setGameState('ready');
    setCompletionState('not-started');
    setOpacity(1);
    setIsDragging(false);
    setDragStartDot(null);
    setScore(0);
  }, [consonants]);

  useEffect(() => {
    hornbillImage.current.src = '/game/assets/image/hornbill/hornbilloutline.png';
    finalHornbillImage.current.src = '/game/assets/image/hornbill/greathornbill.png';
    treetrunkImage.current.src = '/game/assets/image/hornbill/treetrunk.png';
    
    const loadImage = async () => {
      try {
        await new Promise((resolve, reject) => {
          hornbillImage.current.onload = resolve;
          hornbillImage.current.onerror = reject;
        });
        initializeGame();
      } catch (error) {
        console.error('Failed to load images:', error);
        initializeGame();
      }
    };
    
    loadImage();
  }, [initializeGame]);

  const drawGrid = useCallback((ctx: CanvasRenderingContext2D) => {
    const gridSizeX = 800 / 20;
    const gridSizeY = 600 / 20;
    for (let i = 0; i <= 20; i++) {
      const x = i * gridSizeX;
      const y = i * gridSizeY;
    }
  }, []);

  const drawCloud = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.shadowBlur = 10;
    ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
    ctx.beginPath();
    ctx.arc(x, y, 25, 0, Math.PI * 2);
    ctx.arc(x + 30, y, 30, 0, Math.PI * 2);
    ctx.arc(x + 60, y, 25, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }, []);

  const drawTree = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(x - 10, y, 20, 80);
    ctx.fillStyle = '#228B22';
    ctx.beginPath();
    ctx.arc(x, y, 40, 0, Math.PI * 2);
    ctx.arc(x - 25, y + 10, 30, 0, Math.PI * 2);
    ctx.arc(x + 25, y + 10, 30, 0, Math.PI * 2);
    ctx.fill();
  }, []);

  const drawConnections = useCallback((ctx: CanvasRenderingContext2D, lineOpacity: number) => {
    if (connectedDots.length < 2) return;

    ctx.strokeStyle = `rgba(255, 99, 71, ${lineOpacity})`;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.shadowBlur = 5;
    ctx.shadowColor = `rgba(255, 99, 71, ${lineOpacity})`;

    for (let i = 0; i < connectedDots.length - 1; i++) {
      const dot1 = dots.find(d => d.label === connectedDots[i]);
      const dot2 = dots.find(d => d.label === connectedDots[i + 1]);

      if (dot1 && dot2) {
        ctx.beginPath();
        ctx.moveTo(dot1.x, dot1.y);
        ctx.lineTo(dot2.x, dot2.y);
        ctx.stroke();
      }
    }

    if (gameComplete) {
        const firstDot = dots.find(d => d.order === 0);
        const lastDot = dots.find(d => d.order === consonants.length - 1);
        if (firstDot && lastDot) {
            ctx.beginPath();
            ctx.moveTo(lastDot.x, lastDot.y);
            ctx.lineTo(firstDot.x, firstDot.y);
            ctx.stroke();
        }
    }

    ctx.shadowBlur = 0;
  }, [connectedDots, dots, gameComplete, consonants]);

  const drawDot = useCallback((ctx: CanvasRenderingContext2D, dot: Dot) => {
    const isConnected = connectedDots.includes(dot.label);
    const isTarget = dot.label === targetConsonant;

    if (isConnected) {
      ctx.fillStyle = '#32CD32';
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#32CD32';
    } else if (isTarget) {
      ctx.fillStyle = '#FFD700';
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#FFA500';
    } else {
      ctx.fillStyle = '#4682B4';
      ctx.shadowBlur = 0;
    }

    ctx.beginPath();
    ctx.arc(dot.x, dot.y, 25, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.strokeStyle = isConnected ? '#228B22' : (isTarget ? '#FF8C00' : '#36648B');
    ctx.lineWidth = 3;
    ctx.stroke();

    if (isConnected) {
      const dotNumber = connectedDots.indexOf(dot.label) + 1;
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(dotNumber.toString(), dot.x - 18, dot.y - 18);
    }

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 26px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(dot.label, dot.x, dot.y);

    if (isTarget && !isConnected) {
      const pulse = Math.sin(animationFrame * 0.15) * 5 + 30;
      ctx.strokeStyle = 'rgba(255, 215, 0, 0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, pulse, 0, Math.PI * 2);
      ctx.stroke();
    }
  }, [connectedDots, targetConsonant, animationFrame]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (gameComplete) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const clickedDot = dots.find(dot => {
      const dist = Math.sqrt((x - dot.x) ** 2 + (y - dot.y) ** 2);
      return dist < 25;
    });

    if (!clickedDot || clickedDot.label !== targetConsonant) return;

    // Start dragging from the clicked target dot
    setIsDragging(true);
    setDragStartDot(clickedDot);
  }, [dots, targetConsonant, gameComplete]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragStartDot(null);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });

    if (!isDragging || !dragStartDot || gameComplete) return;

    // For the first dot, connect it immediately when starting to drag away
    if (connectedDots.length === 0) {
      const newConnected = [dragStartDot.label];
      setConnectedDots(newConnected);
      const nextTarget = consonants[newConnected.length];
      setTargetConsonant(nextTarget);
      setFeedback(`✨ Dot ${newConnected.length} connected! Next: ${nextTarget}`);
      return;
    }

    // Check if we're over the target dot
    const targetDot = dots.find(dot => dot.label === targetConsonant);
    if (!targetDot) return;

    const distToTarget = Math.sqrt((x - targetDot.x) ** 2 + (y - targetDot.y) ** 2);
    
    // If close enough to target dot, connect it
    if (distToTarget < 35) {
      const newConnected = [...connectedDots, targetDot.label];
      setConnectedDots(newConnected);
      setScore(prev => prev + 10);
      setIsDragging(false);
      setDragStartDot(null);

      if (newConnected.length === consonants.length) {
        setFeedback('Congrats, You have discovered the Great Hornbill!(Buceros bicornis), the Kerala State Bird');
        setGameComplete(true);
        setCompletionState('lines-fading');
      } else {
        const nextTarget = consonants[newConnected.length];
        setTargetConsonant(nextTarget);
        setFeedback(`✨ Dot ${newConnected.length} connected! Next: ${nextTarget}`);
      }
    }
  }, [dots, consonants, gameComplete, isDragging, connectedDots, targetConsonant, dragStartDot]);

  const drawFollowingLine = useCallback((ctx: CanvasRenderingContext2D) => {
    if (!isDragging || !mousePos || !dragStartDot) return;

    ctx.strokeStyle = 'orange';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(dragStartDot.x, dragStartDot.y);
    ctx.lineTo(mousePos.x, mousePos.y);
    ctx.stroke();
    ctx.setLineDash([]);
  }, [mousePos, isDragging, dragStartDot]);

  const drawGame = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, 800, 600);

    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#E0F6FF');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 600);

    ctx.fillStyle = '#FFD700';
    ctx.shadowBlur = 30;
    ctx.shadowColor = '#FFA500';
    ctx.beginPath();
    ctx.arc(650, 80, 40, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    drawCloud(ctx, 500, 90);
    drawCloud(ctx, 100, 70);

    drawTree(ctx, 600, 400);
    drawTree(ctx, 700, 420);

    const groundGradient = ctx.createLinearGradient(0, 400, 0, 600);
    groundGradient.addColorStop(0, '#90EE90');
    groundGradient.addColorStop(1, '#228B22');
    ctx.fillStyle = groundGradient;
    ctx.fillRect(0, 400, 800, 200);

    drawGrid(ctx);

    if (gameComplete) {
        if (completionState === 'final-image-fading-in') {
            ctx.globalAlpha = opacity;
            ctx.drawImage(finalHornbillImage.current, 40, 0, 750, 600);
            ctx.globalAlpha = 1;
        } else if (completionState === 'outline-fading-in' || completionState === 'outline-visible' || completionState === 'outline-fading-out') {
            ctx.globalAlpha = opacity;
            ctx.drawImage(hornbillImage.current, 40, 0, 750, 600);
            ctx.globalAlpha = 1;
        } else if (completionState === 'lines-fading') {
            drawConnections(ctx, opacity);
        }
    } else {
        drawConnections(ctx, 1);

        dots.forEach(dot => {
            drawDot(ctx, dot);
        });

        drawFollowingLine(ctx);
    }
            
    ctx.globalAlpha = 1;
    ctx.drawImage(treetrunkImage.current, 755, 0, treetrunkImage.current.naturalWidth, treetrunkImage.current.naturalHeight);
    ctx.globalAlpha = 1;
  }, [dots, gameComplete, completionState, opacity, drawCloud, drawTree, drawGrid, drawConnections, drawDot, drawFollowingLine]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    drawGame(ctx as CanvasRenderingContext2D);
  }, [drawGame]);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationFrame(prev => prev + 1);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (completionState === 'lines-fading') {
      const fadeOut = setInterval(() => {
        setOpacity(prev => {
          if (prev <= 0) {
            clearInterval(fadeOut);
            setCompletionState('lines-faded');
            return 0;
          }
          return prev - 0.1;
        });
      }, 50);
    } else if (completionState === 'lines-faded') {
        setCompletionState('outline-fading-in');
    } else if (completionState === 'outline-fading-in') {
      const fadeIn = setInterval(() => {
        setOpacity(prev => {
          if (prev >= 1) {
            clearInterval(fadeIn);
            setCompletionState('outline-visible');
            return 1;
          }
          return prev + 0.1;
        });
      }, 50);
    } else if (completionState === 'outline-visible') {
      setTimeout(() => {
        setCompletionState('outline-fading-out');
      }, 2000);
    } else if (completionState === 'outline-fading-out') {
      const fadeOut = setInterval(() => {
        setOpacity(prev => {
          if (prev <= 0) {
            clearInterval(fadeOut);
            setCompletionState('final-image-fading-in');
            return 0;
          }
          return prev - 0.1;
        });
      }, 50);
    } else if (completionState === 'final-image-fading-in') {
        const fadeIn = setInterval(() => {
            setOpacity(prev => {
                if (prev >= 1) {
                    clearInterval(fadeIn);
                    return 1;
                }
                return prev + 0.1;
            });
        }, 50);
    }
  }, [completionState]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-sky-100 to-green-100 p-4">
      <div className="bg-gradient-to-b from-blue-50 to-white rounded-lg shadow-2xl p-6 max-w-4xl w-full border-4 border-blue-400">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-blue-800 drop-shadow-lg">🦅 Connect the Dots 🦅</h1>
          <div className="flex gap-4">
            <div className="bg-blue-500 px-4 py-2 rounded-lg border-2 border-blue-700">
              <span className="font-semibold text-white">Level: {level}</span>
            </div>
            <div className="bg-green-500 px-4 py-2 rounded-lg border-2 border-green-700">
              <span className="font-semibold text-white">Score: {score}</span>
            </div>
          </div>
        </div>
        <div className="mb-4 text-center">
          <div className="text-xl font-semibold text-gray-800 bg-gradient-to-r from-blue-200 to-green-200 py-3 px-6 rounded-lg inline-block border-2 border-blue-400 shadow-lg">
            {feedback || 'Connect the dots to reveal Kerala\'s state bird!'}
          </div>
        </div>
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="border-4 border-blue-400 rounded-lg cursor-crosshair bg-gradient-to-b from-sky-100 to-green-100 shadow-2xl"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />

        <div className="mt-4 text-center text-blue-800">
          <p className="text-sm font-semibold">🎯 Click and drag from dot to dot to connect them!</p>
          <p className="text-sm mt-1 font-semibold">🔗 Connected: {connectedDots.length} / {consonants.length}</p>
        </div>

        {gameComplete && completionState === 'final-image-fading-in' && (
            <div className="absolute top-4 right-[50px] flex flex-col space-y-2">
                <button onClick={initializeGame} className="bg-blue-500 text-white rounded-lg px-4 py-2">Play Again</button>
                <button onClick={() => { /* Navigate to next game */ }} className="bg-green-500 text-white rounded-lg px-4 py-2">Next Game</button>
            </div>
        )}
      </div>
    </div>
  );
};

export default ConsonantHornbillGame;