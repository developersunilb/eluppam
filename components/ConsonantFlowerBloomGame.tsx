'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

interface Bee {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  angle: number;
  letter: string;
}

interface Projectile {
  x: number;
  y: number;
  vx: number;
  vy: number;
  time: number;
}

interface Flower {
  letter: string;
  bloomLevel: number;
  x: number;
  y: number;
  color: string;
}

const consonants = ['ത', 'ഥ', 'ദ', 'ധ', 'ന'];
const shooterPos = { x: 400, y: 550 };

const flowerPositions = [
  { x: 150, y: 250, color: '#FF6B9D', letter: '' },
  { x: 280, y: 200, color: '#FFA500', letter: '' },
  { x: 400, y: 180, color: '#FFD700', letter: '' },
  { x: 520, y: 200, color: '#98D8C8', letter: '' },
  { x: 650, y: 250, color: '#9B59B6', letter: '' },
];

const ConsonantFlowerBloomGame = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState('ready');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [dragCurrent, setDragCurrent] = useState<{ x: number; y: number } | null>(null);
  const [projectile, setProjectile] = useState<Projectile | null>(null);
  const [hitBuds, setHitBuds] = useState<string[]>([]);
  const [targetConsonant, setTargetConsonant] = useState('');
  const [feedback, setFeedback] = useState('');
  const [allBloomed, setAllBloomed] = useState(false);
  const [bees, setBees] = useState<Bee[]>([]);
  const [animationFrame, setAnimationFrame] = useState(0);
  
  const [flowers, setFlowers] = useState<Flower[]>([]);
  
  const initializeGame = useCallback(() => {
    const shuffled = [...consonants].sort(() => Math.random() - 0.5);
    const newFlowers = flowerPositions.map((pos, i) => ({
      ...pos,
      letter: shuffled[i],
      bloomLevel: 0
    }));
    setFlowers(newFlowers);
    setTargetConsonant(shuffled[0]);
    setFeedback(`Find: ${shuffled[0]}`);
    setHitBuds([]);
    setAllBloomed(false);
    setBees([]);
  }, [consonants]);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

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

  const drawFlower = useCallback((ctx: CanvasRenderingContext2D, flower: Flower) => {
    const isTarget = flower.letter === targetConsonant && !hitBuds.includes(flower.letter);
    const isHit = hitBuds.includes(flower.letter);

    // Stem
    ctx.fillStyle = '#228B22';
    ctx.fillRect(flower.x - 2, flower.y + 20, 4, 80);

    // Leaves
    ctx.beginPath();
    ctx.ellipse(flower.x - 10, flower.y + 50, 20, 10, -Math.PI / 4, 0, Math.PI * 2);
    ctx.ellipse(flower.x + 10, flower.y + 50, 20, 10, Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();

    if (allBloomed) {
      const pulse = Math.sin(animationFrame * 0.05) * 10 + 40; // Pulsates between 30 and 50
      ctx.shadowBlur = pulse;
      ctx.shadowColor = flower.color;
    }

    if (flower.bloomLevel === 0) {
      // Draw Bud
      ctx.fillStyle = '#558B2F'; // Bud green color
      ctx.beginPath();
      ctx.moveTo(flower.x, flower.y - 40); // Tip of the bud (lowered)
      ctx.bezierCurveTo(flower.x - 60, flower.y + 40, flower.x + 60, flower.y + 40, flower.x, flower.y - 40); // Wider and taller (lowered)
      ctx.closePath();
      ctx.fill();

      // Bud highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.beginPath();
      ctx.arc(flower.x - 10, flower.y, 10, 0, Math.PI * 2); // Adjust highlight position (lowered)
      ctx.fill();
      
      // Letter
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 24px Arial'; // Reduced font size for consonant
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(flower.letter, flower.x, flower.y + 5); // Adjust letter position (lowered)

    } else {
      // Draw Bloomed Flower
      const petalColor = isHit ? flower.color : '#CCCCCC';
      ctx.fillStyle = petalColor;
      ctx.strokeStyle = isTarget ? '#FFD700' : '#888888';
      ctx.lineWidth = 2;

      const bloomScale = 1 + flower.bloomLevel * 0.1;

      for (let i = 0; i < 6; i++) {
        ctx.beginPath();
        ctx.ellipse(flower.x + Math.cos(i * Math.PI / 3) * 20 * bloomScale,
                    flower.y + Math.sin(i * Math.PI / 3) * 20 * bloomScale,
                    20 * bloomScale, 10 * bloomScale, i * Math.PI / 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }

      // Center
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(flower.x, flower.y, 10 * bloomScale, 0, Math.PI * 2);
      ctx.fill();

      // Letter
      if (!isHit) {
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(flower.letter, flower.x, flower.y);
      }
    }

    // Pulsing effect for target
    if (isTarget) {
      const pulse = Math.sin(animationFrame * 0.1) * 5 + (flower.bloomLevel === 0 ? 20 : 30);
      ctx.strokeStyle = 'rgba(255, 215, 0, 0.8)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(flower.x, flower.y, pulse, 0, Math.PI * 2);
      ctx.stroke();
    }
    
    ctx.shadowBlur = 0; // Reset shadow for other elements

  }, [targetConsonant, hitBuds, animationFrame, allBloomed]);

  const drawBee = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, angle: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    // Body
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.ellipse(0, 0, 15, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Stripes
    ctx.fillStyle = 'black';
    ctx.fillRect(-10, -8, 5, 16);
    ctx.fillRect(0, -8, 5, 16);

    // Wings
    ctx.fillStyle = 'rgba(173, 216, 230, 0.7)';
    ctx.beginPath();
    ctx.ellipse(-5, -15, 10, 5, -Math.PI / 4, 0, Math.PI * 2);
    ctx.ellipse(5, -15, 10, 5, Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();

    // Stinger
    ctx.beginPath();
    ctx.moveTo(15, 0);
    ctx.lineTo(20, 0);
    ctx.stroke();

    ctx.restore();
  }, []);

  const drawShooter = useCallback((ctx: CanvasRenderingContext2D) => {
    const x = shooterPos.x;
    const y = shooterPos.y;

    // Net handle
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(x - 5, y - 50, 10, 50);

    // Net hoop
    ctx.strokeStyle = '#A9A9A9';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(x, y - 50, 30, 0, Math.PI * 2);
    ctx.stroke();

    // Net mesh
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      ctx.moveTo(x + Math.cos(i * Math.PI / 3) * 30, y - 50 + Math.sin(i * Math.PI / 3) * 30);
      ctx.lineTo(x + Math.cos((i + 0.5) * Math.PI / 3) * 20, y - 50 + Math.sin((i + 0.5) * Math.PI / 3) * 20);
    }
    ctx.stroke();
  }, [shooterPos]);

  const drawProjectile = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number) => {
    // Magic sparkles
    ctx.fillStyle = 'rgba(255, 255, 0, 0.8)';
    ctx.shadowBlur = 10;
    ctx.shadowColor = 'yellow';
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }, []);

  const drawTrajectory = useCallback((ctx: CanvasRenderingContext2D, dragStart: { x: number; y: number }, dragCurrent: { x: number; y: number }) => {
    const dx = dragStart.x - dragCurrent.x;
    const dy = dragStart.y - dragCurrent.y;
    const power = Math.min(Math.sqrt(dx * dx + dy * dy) / 50, 3);

    const vx = dx * power;
    const vy = dy * power;

    ctx.strokeStyle = 'rgba(255, 255, 0, 0.5)';
    ctx.lineWidth = 3;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(dragCurrent.x, dragCurrent.y);

    for (let t = 0; t < 50; t += 2) {
      const x = dragCurrent.x + vx * t;
      const y = dragCurrent.y + vy * t + 0.5 * 0.3 * t * t;
      ctx.lineTo(x, y);
      if (y > 600 || y < 0) break;
    }

    ctx.stroke();
    ctx.setLineDash([]);
  }, []);

  const drawCelebration = useCallback((ctx: CanvasRenderingContext2D) => {
    // Confetti
    for (let i = 0; i < 50; i++) {
      ctx.fillStyle = `hsl(${Math.random() * 360}, 100%, 50%)`;
      ctx.fillRect(Math.random() * 800, Math.random() * 600, 10, 10);
    }

    // Sparkles
    for (let i = 0; i < 20; i++) {
      ctx.fillStyle = 'rgba(255, 255, 200, 0.8)';
      ctx.beginPath();
      ctx.arc(Math.random() * 800, Math.random() * 600, Math.random() * 5 + 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }, []);

  const bloomFlower = useCallback((flowerLetter: string, hitCount: number) => {
    let bloomProgress = 0;
    const bloomDuration = 40;

    const bloomAnimation = setInterval(() => {
      bloomProgress++;
      const bloomLevel = Math.floor((bloomProgress / bloomDuration) * 4) + 1;

      setFlowers(prevFlowers =>
        prevFlowers.map(f =>
          f.letter === flowerLetter ? { ...f, bloomLevel: Math.min(bloomLevel, 4) } : f
        )
      );

      if (bloomProgress >= bloomDuration) {
        clearInterval(bloomAnimation);

        if (hitCount === consonants.length) {
          setTimeout(() => {
            fullBloomAll();
          }, 500);
        } else {
          setTimeout(() => {
            const available = flowers.filter(f => !hitBuds.includes(f.letter) && f.letter !== flowerLetter);
            if (available.length > 0) {
              const newTarget = available[Math.floor(Math.random() * available.length)];
              setTargetConsonant(newTarget.letter);
              setFeedback(`Find: ${newTarget.letter}`);
              setGameState('ready');
            }
          }, 500);
        }
      }
    }, 16);
  }, [consonants, flowers, hitBuds, setFlowers, setTargetConsonant, setFeedback, setGameState]);

  const fullBloomAll = useCallback(() => {
    setAllBloomed(true);
    setFeedback('🌸🌺🌼 All flowers bloomed! Beautiful! 🌼🌺🌸');

    let fullBloomProgress = 0;
    const fullBloomInterval = setInterval(() => {
      fullBloomProgress++;

      setFlowers(prevFlowers =>
        prevFlowers.map(f => ({ ...f, bloomLevel: 5 }))
      );

      if (fullBloomProgress >= 20) {
        clearInterval(fullBloomInterval);

        setTimeout(() => {
          setLevel(prev => prev + 1);
          setScore(prev => prev + 100);
          initializeGame();
          setGameState('ready');
        }, 3000);
      }
    }, 16);
  }, [setAllBloomed, setFeedback, setFlowers, setLevel, setScore, initializeGame, setGameState]);

  const handleCorrectHit = useCallback((flower: Flower, projectile: Projectile) => {
    setHitBuds(prevHits => {
      const newHitBuds = [...prevHits, flower.letter];
      const hitCount = newHitBuds.length;

      setScore(prev => prev + 10);
      setProjectile(null);

      // Bee animation
      const bee: Bee = {
        x: projectile.x,
        y: projectile.y,
        targetX: flower.x,
        targetY: flower.y,
        angle: Math.atan2(flower.y - projectile.y, flower.x - projectile.x),
        letter: flower.letter
      };
      setBees(prevBees => [...prevBees, bee]);

      let progress = 0;
      const duration = 60; // frames

      const beeAnimation = setInterval(() => {
        progress++;
        const easeT = progress / duration;

        setBees(prevBees =>
          prevBees.map(b => {
            if (b.letter === flower.letter && progress <= duration) {
              const currentX = bee.x + (bee.targetX - bee.x) * easeT;
              const currentY = bee.y + (bee.targetY - bee.y) * easeT;
              const angle = Math.atan2(bee.targetY - bee.y, bee.targetX - bee.x);
              return { ...b, x: currentX, y: currentY, angle };
            }
            return b;
          })
        );

        if (progress >= duration) {
          clearInterval(beeAnimation);
          bloomFlower(flower.letter, hitCount);
        }
      }, 16);

      return newHitBuds;
    });
  }, [setHitBuds, setScore, setProjectile, setBees, bloomFlower]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (gameState !== 'ready') return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const dist = Math.sqrt((x - shooterPos.x) ** 2 + (y - shooterPos.y) ** 2);
    if (dist < 50) {
      setDragStart({ x, y });
      setGameState('aiming');
    }
  }, [gameState, shooterPos]);
  
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (gameState !== 'aiming') return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setDragCurrent({ x, y });
  }, [gameState]);
  
  const handleMouseUp = useCallback(() => {
    if (gameState !== 'aiming' || !dragStart || !dragCurrent) return;
    
    const dx = dragStart.x - dragCurrent.x;
    const dy = dragStart.y - dragCurrent.y;
    const power = Math.min(Math.sqrt(dx * dx + dy * dy) / 50, 3);

    const vx = dx * power;
    const vy = dy * power;
    
    setProjectile({
      x: shooterPos.x, // Projectile starts from shooter
      y: shooterPos.y,
      vx,
      vy,
      time: 0
    });
    
    setGameState('shooting');
    setDragStart(null);
    setDragCurrent(null);
  }, [gameState, dragStart, dragCurrent, shooterPos]);

  const updateProjectile = useCallback(() => {
    if (!projectile) return;

    const gravity = 0.1;
    const newTime = projectile.time + 1;
    const newX = projectile.x + projectile.vx;
    const newY = projectile.y + projectile.vy + 0.5 * gravity * newTime;
    const newVy = projectile.vy + gravity;

    // Check for collision with flowers
    for (const flower of flowers) {
      if (!hitBuds.includes(flower.letter)) {
        const dist = Math.sqrt((newX - flower.x) ** 2 + (newY - flower.y) ** 2);
        if (dist < 30) { // 30 is a guess for the flower's hit radius
          if (flower.letter === targetConsonant) {
            setFeedback('🌸 Correct! A bee is on its way!');
            handleCorrectHit(flower, { ...projectile, x: newX, y: newY, vy: newVy });
          } else {
            setFeedback('Try another flower!');
            setProjectile(null);
            setTimeout(() => {
              setGameState('ready');
              setFeedback(`Find: ${targetConsonant}`);
            }, 1000);
          }
          return;
        }
      }
    }

    // Check if out of bounds
    if (newY > 600 || newX < 0 || newX > 800) {
      setProjectile(null);
      setFeedback('Missed! Try again.');
      setTimeout(() => {
        setGameState('ready');
        setFeedback(`Find: ${targetConsonant}`);
      }, 1000);
      return;
    }

    setProjectile({
      x: newX,
      y: newY,
      vx: projectile.vx,
      vy: newVy,
      time: newTime,
    });
  }, [projectile, flowers, hitBuds, targetConsonant, handleCorrectHit]);

  const drawGame = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, 800, 600);

    // Draw background elements
    drawCloud(ctx, 100, 80);
    drawCloud(ctx, 600, 120);

    // Draw flowers
    flowers.forEach(flower => drawFlower(ctx, flower));

    // Draw shooter
    drawShooter(ctx);

    // Draw aiming trajectory
    if (gameState === 'aiming' && dragStart && dragCurrent) {
      drawTrajectory(ctx, dragStart, dragCurrent);
    }

    // Draw projectile
    if (projectile) {
      drawProjectile(ctx, projectile.x, projectile.y);
    }

    // Draw bees
    bees.forEach(bee => drawBee(ctx, bee.x, bee.y, bee.angle));

    // Draw celebration
    if (allBloomed) {
      drawCelebration(ctx);
    }
  }, [flowers, drawFlower, drawShooter, gameState, dragStart, dragCurrent, drawTrajectory, projectile, drawProjectile, bees, drawBee, allBloomed, drawCelebration, drawCloud]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    drawGame(ctx as CanvasRenderingContext2D);
    
    if (gameState === 'shooting' && projectile) {
      const animationId = requestAnimationFrame(updateProjectile);
      return () => cancelAnimationFrame(animationId);
    }
    // setAnimationFrame(prev => prev + 1); // This was causing an infinite re-render loop
  }, [gameState, projectile, drawGame, updateProjectile]);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-green-100 to-green-300 p-4">
      <div className="bg-gradient-to-b from-yellow-100 to-green-200 rounded-lg shadow-2xl p-6 max-w-4xl w-full border-4 border-green-600">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-green-800 drop-shadow-lg">🌸 Garden Bloom Game 🌸</h1>
          <div className="flex gap-4">
            <div className="bg-pink-400 px-4 py-2 rounded-lg border-2 border-pink-600">
              <span className="font-semibold text-white">Level: {level}</span>
            </div>
            <div className="bg-green-500 px-4 py-2 rounded-lg border-2 border-green-700">
              <span className="font-semibold text-white">Score: {score}</span>
            </div>
          </div>
        </div>
        
        <div className="mb-4 text-center">
          <div className="text-xl font-semibold text-gray-800 bg-gradient-to-r from-pink-200 to-yellow-200 py-3 px-6 rounded-lg inline-block border-2 border-pink-400 shadow-lg">
            {feedback || 'Drag the butterfly net to send magic sparkles!'}
          </div>
        </div>
        
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="border-4 border-green-600 rounded-lg cursor-crosshair bg-gradient-to-b from-sky-200 to-green-200 shadow-2xl"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
        
        <div className="mt-4 text-center text-green-800">
          <p className="text-sm font-semibold">🦋 Click and drag the butterfly net to aim and shoot magic sparkles!</p>
          <p className="text-sm mt-1 font-semibold">🌺 Blooming: {hitBuds.join(', ') || 'None yet'}</p>
        </div>
      </div>
    </div>
  );
};

export default ConsonantFlowerBloomGame;
