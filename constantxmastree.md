import React, { useState, useEffect, useRef } from 'react';

const ChristmasTreeGame = () => {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('ready'); // ready, aiming, shooting, hit
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [dragStart, setDragStart] = useState(null);
  const [dragCurrent, setDragCurrent] = useState(null);
  const [arrow, setArrow] = useState(null);
  const [litBaubles, setLitBaubles] = useState([]);
  const [targetConsonant, setTargetConsonant] = useState('');
  const [feedback, setFeedback] = useState('');
  const [starLit, setStarLit] = useState(false);
  
  const consonants = ['ട', 'ഠ', 'ഡ', 'ഢ', 'ണ'];
  const shooterPos = { x: 400, y: 550 };
  
  // Bauble positions on the tree
  const baublePositions = [
    { x: 400, y: 180, letter: '' }, // Top center
    { x: 340, y: 260, letter: '' }, // Second row left
    { x: 460, y: 260, letter: '' }, // Second row right
    { x: 320, y: 360, letter: '' }, // Third row left
    { x: 480, y: 360, letter: '' }, // Third row right
  ];
  
  const [baubles, setBaubles] = useState([]);
  
  useEffect(() => {
    initializeGame();
  }, []);
  
  const initializeGame = () => {
    // Shuffle consonants and assign to baubles
    const shuffled = [...consonants].sort(() => Math.random() - 0.5);
    const newBaubles = baublePositions.map((pos, i) => ({
      ...pos,
      letter: shuffled[i],
      lit: false
    }));
    setBaubles(newBaubles);
    setTargetConsonant(shuffled[0]);
    setFeedback(`Light up: ${shuffled[0]}`);
    setLitBaubles([]);
    setStarLit(false);
  };
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    drawGame(ctx);
    
    if (gameState === 'shooting' && arrow) {
      const animationId = requestAnimationFrame(updateArrow);
      return () => cancelAnimationFrame(animationId);
    }
  }, [gameState, dragCurrent, arrow, baubles, targetConsonant, starLit]);
  
  const selectNewTarget = () => {
    const available = baubles.filter(b => !litBaubles.includes(b.letter));
    if (available.length === 0) {
      setStarLit(true);
      setFeedback('🎄✨ All baubles lit! The star shines bright! ✨🎄');
      setTimeout(() => {
        setLevel(level + 1);
        setScore(score + 100);
        initializeGame();
      }, 3000);
    } else {
      const newTarget = available[Math.floor(Math.random() * available.length)];
      setTargetConsonant(newTarget.letter);
      setFeedback(`Light up: ${newTarget.letter}`);
    }
  };
  
  const drawGame = (ctx) => {
    ctx.clearRect(0, 0, 800, 600);
    
    // Night sky background
    const gradient = ctx.createLinearGradient(0, 0, 0, 600);
    gradient.addColorStop(0, '#0a1128');
    gradient.addColorStop(1, '#1e3a5f');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 600);
    
    // Draw stars in background
    drawBackgroundStars(ctx);
    
    // Draw snow on ground
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(400, 590, 350, 30, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw Christmas tree
    drawChristmasTree(ctx);
    
    // Draw baubles
    baubles.forEach(bauble => {
      drawBauble(ctx, bauble);
    });
    
    // Draw star on top
    drawStar(ctx, 400, 80, starLit);
    
    // Draw shooter (candy cane launcher)
    drawShooter(ctx);
    
    // Draw trajectory if aiming
    if (gameState === 'aiming' && dragStart && dragCurrent) {
      drawTrajectory(ctx);
    }
    
    // Draw projectile if shooting
    if (arrow && gameState === 'shooting') {
      drawProjectile(ctx, arrow.x, arrow.y);
    }
  };
  
  const drawBackgroundStars = (ctx) => {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    const stars = [
      {x: 50, y: 50}, {x: 120, y: 80}, {x: 200, y: 40},
      {x: 650, y: 60}, {x: 720, y: 90}, {x: 600, y: 45},
      {x: 100, y: 150}, {x: 700, y: 130}
    ];
    
    stars.forEach(star => {
      ctx.beginPath();
      ctx.arc(star.x, star.y, 2, 0, Math.PI * 2);
      ctx.fill();
    });
  };
  
  const drawChristmasTree = (ctx) => {
    // Tree pot
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(370, 480, 60, 70);
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = 2;
    ctx.strokeRect(370, 480, 60, 70);
    
    // Tree layers (3 triangles)
    ctx.fillStyle = '#2d5016';
    
    // Bottom layer
    ctx.beginPath();
    ctx.moveTo(400, 450);
    ctx.lineTo(280, 480);
    ctx.lineTo(520, 480);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#1a3010';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Middle layer
    ctx.fillStyle = '#3d6e1f';
    ctx.beginPath();
    ctx.moveTo(400, 320);
    ctx.lineTo(300, 420);
    ctx.lineTo(500, 420);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Top layer
    ctx.fillStyle = '#4d8e2f';
    ctx.beginPath();
    ctx.moveTo(400, 180);
    ctx.lineTo(320, 310);
    ctx.lineTo(480, 310);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Add some texture lines
    ctx.strokeStyle = 'rgba(26, 48, 16, 0.3)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.moveTo(340 + i * 30, 450 - i * 30);
      ctx.lineTo(360 + i * 30, 470 - i * 30);
      ctx.stroke();
    }
  };
  
  const drawBauble = (ctx, bauble) => {
    const isLit = litBaubles.includes(bauble.letter);
    const isTarget = bauble.letter === targetConsonant && !isLit;
    
    // String
    ctx.strokeStyle = '#C0C0C0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(bauble.x, bauble.y - 35);
    ctx.lineTo(bauble.x, bauble.y - 25);
    ctx.stroke();
    
    // Bauble hook
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(bauble.x - 4, bauble.y - 28, 8, 6);
    
    // Bauble body
    if (isLit) {
      // Lit up bauble - glowing effect
      const gradient = ctx.createRadialGradient(bauble.x, bauble.y, 5, bauble.x, bauble.y, 25);
      gradient.addColorStop(0, '#FFD700');
      gradient.addColorStop(0.5, '#FFA500');
      gradient.addColorStop(1, '#FF6B35');
      ctx.fillStyle = gradient;
      
      // Glow effect
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#FFD700';
    } else if (isTarget) {
      // Target bauble - golden highlight
      ctx.fillStyle = '#FFD700';
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#FFA500';
    } else {
      // Unlit bauble
      ctx.fillStyle = '#8B0000';
      ctx.shadowBlur = 0;
    }
    
    ctx.beginPath();
    ctx.arc(bauble.x, bauble.y, 25, 0, Math.PI * 2);
    ctx.fill();
    
    // Reset shadow
    ctx.shadowBlur = 0;
    
    // Bauble outline
    ctx.strokeStyle = isLit ? '#FFD700' : '#4a0000';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Highlight on bauble
    if (!isLit) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.beginPath();
      ctx.arc(bauble.x - 8, bauble.y - 8, 6, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Malayalam letter
    if (!isLit) {
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 28px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(bauble.letter, bauble.x, bauble.y);
    }
  };
  
  const drawStar = (ctx, x, y, lit) => {
    const spikes = 5;
    const outerRadius = 30;
    const innerRadius = 15;
    
    ctx.save();
    ctx.translate(x, y);
    
    if (lit) {
      // Glowing star
      ctx.shadowBlur = 30;
      ctx.shadowColor = '#FFD700';
      
      // Additional glow layers
      for (let i = 3; i > 0; i--) {
        ctx.fillStyle = `rgba(255, 215, 0, ${0.2 * i})`;
        ctx.beginPath();
        for (let j = 0; j < spikes * 2; j++) {
          const radius = j % 2 === 0 ? outerRadius + i * 8 : innerRadius + i * 4;
          const angle = (j * Math.PI) / spikes - Math.PI / 2;
          const px = Math.cos(angle) * radius;
          const py = Math.sin(angle) * radius;
          if (j === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
      }
      
      ctx.fillStyle = '#FFD700';
    } else {
      ctx.fillStyle = '#4a4a4a';
      ctx.shadowBlur = 0;
    }
    
    // Main star
    ctx.beginPath();
    for (let i = 0; i < spikes * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i * Math.PI) / spikes - Math.PI / 2;
      const px = Math.cos(angle) * radius;
      const py = Math.sin(angle) * radius;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    
    ctx.strokeStyle = lit ? '#FFA500' : '#2a2a2a';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.shadowBlur = 0;
    ctx.restore();
  };
  
  const drawShooter = (ctx) => {
    const x = shooterPos.x;
    const y = shooterPos.y;
    
    if (gameState === 'aiming' && dragStart && dragCurrent) {
      const dx = dragCurrent.x - dragStart.x;
      const dy = dragCurrent.y - dragStart.y;
      const angle = Math.atan2(dy, dx);
      
      // Aiming line
      ctx.strokeStyle = '#FF0000';
      ctx.lineWidth = 3;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(dragCurrent.x, dragCurrent.y);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Projectile being aimed
      drawProjectile(ctx, dragCurrent.x, dragCurrent.y);
    }
    
    // Candy cane launcher base
    ctx.fillStyle = '#DC143C';
    ctx.beginPath();
    ctx.arc(x, y, 25, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(x, y, 25, 0, Math.PI);
    ctx.stroke();
    
    // Launcher barrel
    ctx.fillStyle = '#8B0000';
    ctx.fillRect(x - 5, y - 40, 10, 40);
    
    // Striped candy cane pattern
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 3;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(x - 5, y - 35 + i * 12);
      ctx.lineTo(x + 5, y - 29 + i * 12);
      ctx.stroke();
    }
  };
  
  const drawProjectile = (ctx, x, y) => {
    // Light orb projectile
    const gradient = ctx.createRadialGradient(x, y, 2, x, y, 10);
    gradient.addColorStop(0, '#FFFFFF');
    gradient.addColorStop(0.5, '#FFD700');
    gradient.addColorStop(1, '#FFA500');
    
    ctx.fillStyle = gradient;
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#FFD700';
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  };
  
  const drawTrajectory = (ctx) => {
    const dx = dragStart.x - dragCurrent.x;
    const dy = dragStart.y - dragCurrent.y;
    const power = Math.min(Math.sqrt(dx * dx + dy * dy) / 50, 2);
    
    const vx = dx * power;
    const vy = dy * power;
    
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.5)';
    ctx.lineWidth = 3;
    ctx.setLineDash([10, 10]);
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
  };
  
  const handleMouseDown = (e) => {
    if (gameState !== 'ready') return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const dist = Math.sqrt((x - shooterPos.x) ** 2 + (y - shooterPos.y) ** 2);
    if (dist < 50) {
      setDragStart({ x, y });
      setGameState('aiming');
    }
  };
  
  const handleMouseMove = (e) => {
    if (gameState !== 'aiming') return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setDragCurrent({ x, y });
  };
  
  const handleMouseUp = () => {
    if (gameState !== 'aiming' || !dragStart || !dragCurrent) return;
    
    const dx = dragStart.x - dragCurrent.x;
    const dy = dragStart.y - dragCurrent.y;
    const power = Math.min(Math.sqrt(dx * dx + dy * dy) / 50, 2);
    
    const vx = dx * power;
    const vy = dy * power;
    
    setArrow({
      x: dragCurrent.x,
      y: dragCurrent.y,
      vx,
      vy,
      time: 0
    });
    
    setGameState('shooting');
    setDragStart(null);
    setDragCurrent(null);
  };
  
  const updateArrow = () => {
    if (!arrow) return;
    
    const gravity = 0.3;
    const newTime = arrow.time + 1;
    const newX = arrow.x + arrow.vx;
    const newY = arrow.y + arrow.vy + 0.5 * gravity;
    const newVy = arrow.vy + gravity;
    
    // Check collision with baubles
    for (const bauble of baubles) {
      if (!litBaubles.includes(bauble.letter)) {
        const dist = Math.sqrt((newX - bauble.x) ** 2 + (newY - bauble.y) ** 2);
        if (dist < 35) {
          if (bauble.letter === targetConsonant) {
            setLitBaubles(prevLit => {
              const newLitBaubles = [...prevLit, bauble.letter];
              setTimeout(() => {
                const available = baubles.filter(b => !newLitBaubles.includes(b.letter));
                if (available.length === 0) {
                  setStarLit(true);
                  setFeedback('🎄✨ All baubles lit! The star shines bright! ✨🎄');
                  setTimeout(() => {
                    setLevel(prev => prev + 1);
                    setScore(prev => prev + 100);
                    initializeGame();
                    setGameState('ready');
                  }, 3000);
                } else {
                  const newTarget = available[Math.floor(Math.random() * available.length)];
                  setTargetConsonant(newTarget.letter);
                  setFeedback(`Light up: ${newTarget.letter}`);
                  setGameState('ready');
                }
              }, 1000);
              return newLitBaubles;
            });
            setScore(prev => prev + 10);
            setFeedback('✨ Perfect! Bauble lit!');
            setArrow(null);
          } else {
            setFeedback('❌ Wrong bauble! Try again.');
            setArrow(null);
            setTimeout(() => {
              setGameState('ready');
              setFeedback(`Light up: ${targetConsonant}`);
            }, 1000);
          }
          return;
        }
      }
    }
    
    // Check if projectile is out of bounds
    if (newX < 0 || newX > 800 || newY > 600 || newY < 0) {
      setFeedback('💨 Missed! Try again.');
      setArrow(null);
      setTimeout(() => {
        setGameState('ready');
        setFeedback(`Light up: ${targetConsonant}`);
      }, 1000);
      return;
    }
    
    setArrow({
      x: newX,
      y: newY,
      vx: arrow.vx,
      vy: newVy,
      time: newTime
    });
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-900 to-blue-700 p-4">
      <div className="bg-gradient-to-b from-red-800 to-green-800 rounded-lg shadow-2xl p-6 max-w-4xl w-full border-4 border-yellow-400">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-white drop-shadow-lg">🎄 Christmas Tree Game 🎄</h1>
          <div className="flex gap-4">
            <div className="bg-red-600 px-4 py-2 rounded-lg border-2 border-white">
              <span className="font-semibold text-white">Level: {level}</span>
            </div>
            <div className="bg-green-600 px-4 py-2 rounded-lg border-2 border-white">
              <span className="font-semibold text-white">Score: {score}</span>
            </div>
          </div>
        </div>
        
        <div className="mb-4 text-center">
          <div className="text-xl font-semibold text-white bg-gradient-to-r from-red-600 to-green-600 py-3 px-6 rounded-lg inline-block border-2 border-yellow-300 shadow-lg">
            {feedback || 'Drag the launcher to aim and light up the baubles!'}
          </div>
        </div>
        
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="border-4 border-yellow-400 rounded-lg cursor-crosshair bg-gradient-to-b from-blue-900 to-blue-700 shadow-2xl"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
        
        <div className="mt-4 text-center text-white">
          <p className="text-sm font-semibold">🎯 Click and drag the candy cane launcher to aim and shoot!</p>
          <p className="text-sm mt-1 font-semibold">✨ Lit baubles: {litBaubles.join(', ') || 'None yet'}</p>
        </div>
      </div>
    </div>
  );
};

export default ChristmasTreeGame;