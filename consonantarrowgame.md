import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';

const ConsonantArrowGame = () => {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('ready'); // ready, aiming, shooting, hit
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [dragStart, setDragStart] = useState(null);
  const [dragCurrent, setDragCurrent] = useState(null);
  const [arrow, setArrow] = useState(null);
  const [hitConsonants, setHitConsonants] = useState([]);
  const [targetConsonant, setTargetConsonant] = useState('');
  const [feedback, setFeedback] = useState('');
  
  const consonants = ['ക', 'ഖ', 'ഗ', 'ഘ', 'ങ', 'ച', 'ഛ', 'ജ', 'ഝ', 'ഞ'];
  const parrotPos = { x: 150, y: 500 };
  const boardCenter = { x: 600, y: 200 };
  
  useEffect(() => {
    console.log(consonants);
    selectNewTarget();
  }, []);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    drawGame(ctx);
    
    if (gameState === 'shooting' && arrow) {
      const animationId = requestAnimationFrame(updateArrow);
      return () => cancelAnimationFrame(animationId);
    }
  }, [gameState, dragCurrent, arrow, hitConsonants, targetConsonant]);
  
  const selectNewTarget = () => {
    const available = consonants.filter(c => !hitConsonants.includes(c));
    if (available.length === 0) {
      setFeedback('🎉 Level Complete! All consonants hit!');
      setTimeout(() => {
        setLevel(level + 1);
        setHitConsonants([]);
        setScore(score + 100);
        setFeedback('');
        const newTarget = consonants[Math.floor(Math.random() * consonants.length)];
        setTargetConsonant(newTarget);
      }, 2000);
    } else {
      const newTarget = available[Math.floor(Math.random() * available.length)];
      setTargetConsonant(newTarget);
      setFeedback(`Shoot the letter: ${newTarget}`);
    }
  };
  
  const getConsonantPositions = () => {
    const positions = [];
    const rightStartX1 = 600;
    const rightStartX2 = 700;
    const rightStartY = 100;
    const rightSpacingY = 80;

    const leftStartX1 = 100;
    const leftStartX2 = 200;
    const leftStartY = 100;
    const leftSpacingY = 100;

    const lettersToMove = ['ജ', 'ഝ', 'ഞ'];
    const rightSideConsonants = consonants.filter(c => !lettersToMove.includes(c));
    const leftSideConsonants = consonants.filter(c => lettersToMove.includes(c));

    rightSideConsonants.forEach((letter, i) => {
      const row = i;
      let x = i % 2 === 0 ? rightStartX1 : rightStartX2;
      let y = rightStartY + row * rightSpacingY;

      if (letter === 'ക' || letter === 'ഖ') {
        y -= 50;
      }

      positions.push({ letter, x, y, hit: hitConsonants.includes(letter) });
    });

    leftSideConsonants.forEach((letter, i) => {
      const row = i;
      const x = i % 2 === 0 ? leftStartX1 : leftStartX2;
      const y = leftStartY + row * leftSpacingY;
      positions.push({ letter, x, y, hit: hitConsonants.includes(letter) });
    });
    
    return positions;
  };
  
  const drawGame = (ctx) => {
    ctx.clearRect(0, 0, 800, 600);
    
    // Background
    const gradient = ctx.createLinearGradient(0, 0, 0, 600);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#E0F6FF');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 600);
    
    // Draw clouds
    drawCloud(ctx, 100, 80);
    drawCloud(ctx, 300, 60);
    drawCloud(ctx, 500, 100);
    

    
    // Draw consonants
    const positions = getConsonantPositions();
    positions.forEach(pos => {
      if (!pos.hit) {
        const isTarget = pos.letter === targetConsonant;
        ctx.fillStyle = isTarget ? '#FFD700' : '#FF6B6B';
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = isTarget ? '#FFA500' : '#FF4444';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        ctx.fillStyle = '#FFF';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(pos.letter, pos.x, pos.y);
      }
    });
    
    // Draw parrot
    drawParrot(ctx);
    
    // Draw bow
    drawBow(ctx);
    
    // Draw trajectory if aiming
    if (gameState === 'aiming' && dragStart && dragCurrent) {
      drawTrajectory(ctx);
    }
    
    // Draw arrow if shooting
    if (arrow && gameState === 'shooting') {
      drawArrow(ctx, arrow.x, arrow.y, arrow.angle);
    }
  };
  
  const drawCloud = (ctx, x, y) => {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.arc(x + 25, y, 25, 0, Math.PI * 2);
    ctx.arc(x + 50, y, 20, 0, Math.PI * 2);
    ctx.fill();
  };
  

  
  const drawParrot = (ctx) => {
    const x = parrotPos.x;
    const y = parrotPos.y;
    
    // Body
    ctx.fillStyle = '#4CAF50';
    ctx.beginPath();
    ctx.ellipse(x, y, 30, 40, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Head
    ctx.fillStyle = '#66BB6A';
    ctx.beginPath();
    ctx.arc(x, y - 35, 25, 0, Math.PI * 2);
    ctx.fill();
    
    // Beak
    ctx.fillStyle = '#FFA726';
    ctx.beginPath();
    ctx.moveTo(x + 15, y - 35);
    ctx.lineTo(x + 30, y - 35);
    ctx.lineTo(x + 15, y - 25);
    ctx.closePath();
    ctx.fill();
    
    // Eye
    ctx.fillStyle = '#FFF';
    ctx.beginPath();
    ctx.arc(x + 5, y - 40, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(x + 7, y - 40, 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Wing
    ctx.fillStyle = '#388E3C';
    ctx.beginPath();
    ctx.ellipse(x - 20, y, 15, 25, -0.3, 0, Math.PI * 2);
    ctx.fill();
    
    // Tail feathers
    ctx.fillStyle = '#FF5722';
    ctx.beginPath();
    ctx.moveTo(x - 25, y + 30);
    ctx.lineTo(x - 35, y + 50);
    ctx.lineTo(x - 20, y + 35);
    ctx.closePath();
    ctx.fill();
    
    ctx.fillStyle = '#FF9800';
    ctx.beginPath();
    ctx.moveTo(x - 20, y + 35);
    ctx.lineTo(x - 25, y + 55);
    ctx.lineTo(x - 15, y + 38);
    ctx.closePath();
    ctx.fill();
  };
  
  const drawBow = (ctx) => {
    const x = parrotPos.x + 20;
    const y = parrotPos.y - 10;
    
    if (gameState === 'aiming' && dragStart && dragCurrent) {
      const dx = dragCurrent.x - dragStart.x;
      const dy = dragCurrent.y - dragStart.y;
      const pullDist = Math.min(Math.sqrt(dx * dx + dy * dy), 100);
      const angle = Math.atan2(dy, dx);
      
      // Bow string pulled
      ctx.strokeStyle = '#8B4513';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x, y - 30);
      ctx.lineTo(dragCurrent.x, dragCurrent.y);
      ctx.lineTo(x, y + 30);
      ctx.stroke();
      
      // Arrow being pulled
      drawArrow(ctx, dragCurrent.x, dragCurrent.y, angle);
    } else {
      // Bow string relaxed
      ctx.strokeStyle = '#8B4513';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x, y - 30);
      ctx.quadraticCurveTo(x + 10, y, x, y + 30);
      ctx.stroke();
    }
    
    // Bow limbs
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(x, y - 30);
    ctx.quadraticCurveTo(x + 30, y - 20, x + 25, y);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(x, y + 30);
    ctx.quadraticCurveTo(x + 30, y + 20, x + 25, y);
    ctx.stroke();
  };
  
  const drawArrow = (ctx, x, y, angle) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    
    // Arrow shaft
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-30, 0);
    ctx.lineTo(20, 0);
    ctx.stroke();
    
    // Arrow head
    ctx.fillStyle = '#C0C0C0';
    ctx.beginPath();
    ctx.moveTo(20, 0);
    ctx.lineTo(10, -5);
    ctx.lineTo(10, 5);
    ctx.closePath();
    ctx.fill();
    
    // Fletching
    ctx.fillStyle = '#FF6B6B';
    ctx.beginPath();
    ctx.moveTo(-30, 0);
    ctx.lineTo(-25, -6);
    ctx.lineTo(-20, 0);
    ctx.closePath();
    ctx.fill();
    
    ctx.fillStyle = '#FF8888';
    ctx.beginPath();
    ctx.moveTo(-30, 0);
    ctx.lineTo(-25, 6);
    ctx.lineTo(-20, 0);
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();
  };
  
  const drawTrajectory = (ctx) => {
    const dx = dragStart.x - dragCurrent.x;
    const dy = dragStart.y - dragCurrent.y;
    const power = Math.min(Math.sqrt(dx * dx + dy * dy) / 50, 2);
    
    const vx = dx * power;
    const vy = dy * power;
    
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(dragCurrent.x, dragCurrent.y);
    
    for (let t = 0; t < 50; t += 2) {
      const x = dragCurrent.x + vx * t;
      const y = dragCurrent.y + vy * t + 0.5 * 0.3 * t * t;
      ctx.lineTo(x, y);
      if (y > 600) break;
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
    
    const dist = Math.sqrt((x - parrotPos.x) ** 2 + (y - parrotPos.y) ** 2);
    if (dist < 80) {
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
  
  const updateArrow = () => {
    if (!arrow) return;
    
    const gravity = 0.3;
    const newTime = arrow.time + 1;
    const newX = arrow.x + arrow.vx;
    const newY = arrow.y + arrow.vy + 0.5 * gravity;
    const newVy = arrow.vy + gravity;
    const newAngle = Math.atan2(newVy, arrow.vx);
    
    // Check collision with consonants
    const positions = getConsonantPositions();
    for (const pos of positions) {
      if (!pos.hit) {
        const dist = Math.sqrt((newX - pos.x) ** 2 + (newY - pos.y) ** 2);
        if (dist < 35) {
          if (pos.letter === targetConsonant) {
            setHitConsonants(prevHits => {
              const newHitConsonants = [...prevHits, pos.letter];
              // Use callback to ensure we have the latest state
              setTimeout(() => {
                const available = consonants.filter(c => !newHitConsonants.includes(c));
                if (available.length === 0) {
                  setFeedback('🎉 Level Complete! All consonants hit!');
                  setTimeout(() => {
                    setLevel(prev => prev + 1);
                    setScore(prev => prev + 100);
                    setHitConsonants([]);
                    const newTarget = consonants[Math.floor(Math.random() * consonants.length)];
                    setTargetConsonant(newTarget);
                    setFeedback(`Shoot the letter: ${newTarget}`);
                    setGameState('ready');
                  }, 2000);
                } else {
                  const newTarget = available[Math.floor(Math.random() * available.length)];
                  setTargetConsonant(newTarget);
                  setFeedback(`Shoot the letter: ${newTarget}`);
                  setGameState('ready');
                }
              }, 1000);
              return newHitConsonants;
            });
            setScore(prev => prev + 10);
            setFeedback('🎯 Perfect hit!');
            setArrow(null);
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
    if (newX < 0 || newX > 800 || newY > 600) {
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
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-100 to-blue-200 p-4">
      <div className="bg-white rounded-lg shadow-2xl p-6 max-w-4xl w-full">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-blue-600">Level 27: Consonant Arrow</h1>
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
          width={800}
          height={600}
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
    </div>
  );
};

export default ConsonantArrowGame;