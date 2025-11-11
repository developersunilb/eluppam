import React, { useState, useEffect, useRef } from 'react';

const GardenBloomGame = () => {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('ready');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [dragStart, setDragStart] = useState(null);
  const [dragCurrent, setDragCurrent] = useState(null);
  const [projectile, setProjectile] = useState(null);
  const [hitBuds, setHitBuds] = useState([]);
  const [targetConsonant, setTargetConsonant] = useState('');
  const [feedback, setFeedback] = useState('');
  const [allBloomed, setAllBloomed] = useState(false);
  const [bees, setBees] = useState([]);
  const [animationFrame, setAnimationFrame] = useState(0);
  
  const consonants = ['ത', 'ഥ', 'ദ', 'ധ', 'ന'];
  const shooterPos = { x: 400, y: 550 };
  
  const flowerPositions = [
    { x: 150, y: 250, color: '#FF6B9D', letter: '' },
    { x: 280, y: 200, color: '#FFA500', letter: '' },
    { x: 400, y: 180, color: '#FFD700', letter: '' },
    { x: 520, y: 200, color: '#98D8C8', letter: '' },
    { x: 650, y: 250, color: '#9B59B6', letter: '' },
  ];
  
  const [flowers, setFlowers] = useState([]);
  
  useEffect(() => {
    initializeGame();
  }, []);
  
  const initializeGame = () => {
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
  };
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    drawGame(ctx);
    
    if (gameState === 'shooting' && projectile) {
      const animationId = requestAnimationFrame(updateProjectile);
      return () => cancelAnimationFrame(animationId);
    }
  }, [gameState, dragCurrent, projectile, flowers, targetConsonant, allBloomed, bees, animationFrame]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationFrame(prev => prev + 1);
    }, 50);
    return () => clearInterval(interval);
  }, []);
  
  const drawGame = (ctx) => {
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
    ctx.arc(700, 80, 40, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    
    drawCloud(ctx, 100, 80);
    drawCloud(ctx, 600, 100);
    
    const groundGradient = ctx.createLinearGradient(0, 400, 0, 600);
    groundGradient.addColorStop(0, '#90EE90');
    groundGradient.addColorStop(1, '#228B22');
    ctx.fillStyle = groundGradient;
    ctx.fillRect(0, 400, 800, 200);
    
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(50, 350, 700, 100);
    
    ctx.fillStyle = '#654321';
    for (let i = 0; i < 20; i++) {
      ctx.fillRect(60 + i * 35, 360, 25, 80);
    }
    
    flowers.forEach(flower => {
      drawFlower(ctx, flower);
    });
    
    bees.forEach(bee => {
      drawBee(ctx, bee.x, bee.y, bee.angle);
    });
    
    drawShooter(ctx);
    
    if (gameState === 'aiming' && dragStart && dragCurrent) {
      drawTrajectory(ctx);
    }
    
    if (projectile && gameState === 'shooting') {
      drawProjectile(ctx, projectile.x, projectile.y);
    }
    
    if (allBloomed) {
      drawCelebration(ctx);
    }
  };
  
  const drawCloud = (ctx, x, y) => {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.shadowBlur = 10;
    ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
    ctx.beginPath();
    ctx.arc(x, y, 25, 0, Math.PI * 2);
    ctx.arc(x + 30, y, 30, 0, Math.PI * 2);
    ctx.arc(x + 60, y, 25, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  };
  
  const drawFlower = (ctx, flower) => {
    const x = flower.x;
    const y = flower.y;
    const bloomLevel = flower.bloomLevel;
    const isHit = hitBuds.includes(flower.letter);
    const isTarget = flower.letter === targetConsonant && !isHit;
    
    ctx.strokeStyle = '#228B22';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + 100);
    ctx.stroke();
    
    ctx.fillStyle = '#32CD32';
    ctx.beginPath();
    ctx.ellipse(x - 15, y + 40, 12, 20, -0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x + 15, y + 60, 12, 20, 0.5, 0, Math.PI * 2);
    ctx.fill();
    
    if (bloomLevel === 0) {
      ctx.fillStyle = isTarget ? '#FFD700' : '#90EE90';
      if (isTarget) {
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#FFA500';
      }
      ctx.beginPath();
      ctx.ellipse(x, y, 18, 28, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      
      ctx.strokeStyle = '#228B22';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
        ctx.fillStyle = '#228B22';
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + Math.cos(angle) * 22, y + Math.sin(angle) * 22);
        ctx.lineTo(x + Math.cos(angle + 0.3) * 20, y + Math.sin(angle + 0.3) * 20);
        ctx.closePath();
        ctx.fill();
      }
      
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(flower.letter, x, y);
      
    } else if (bloomLevel < 5) {
      const openness = bloomLevel / 5;
      const petalSize = 15 + openness * 15;
      const petalSpread = 25 + openness * 15;
      
      for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
        const petalX = x + Math.cos(angle) * petalSpread;
        const petalY = y + Math.sin(angle) * petalSpread;
        
        ctx.fillStyle = flower.color;
        ctx.globalAlpha = 0.7 + openness * 0.3;
        ctx.beginPath();
        ctx.ellipse(petalX, petalY, petalSize, petalSize * 1.5, angle, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
      
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(x, y, 10 + openness * 5, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = `rgba(0, 0, 0, ${1 - openness})`;
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(flower.letter, x, y);
      
    } else {
      const petalSize = 30;
      const petalSpread = 40;
      
      ctx.shadowBlur = 20;
      ctx.shadowColor = flower.color;
      
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2 - Math.PI / 2;
        const petalX = x + Math.cos(angle) * petalSpread;
        const petalY = y + Math.sin(angle) * petalSpread;
        
        const gradient = ctx.createRadialGradient(petalX, petalY, 0, petalX, petalY, petalSize);
        gradient.addColorStop(0, flower.color);
        gradient.addColorStop(1, lightenColor(flower.color, 40));
        ctx.fillStyle = gradient;
        
        ctx.beginPath();
        ctx.ellipse(petalX, petalY, petalSize, petalSize * 1.5, angle, 0, Math.PI * 2);
        ctx.fill();
      }
      
      ctx.shadowBlur = 0;
      
      const centerGradient = ctx.createRadialGradient(x, y, 0, x, y, 15);
      centerGradient.addColorStop(0, '#FFFF00');
      centerGradient.addColorStop(1, '#FFA500');
      ctx.fillStyle = centerGradient;
      ctx.beginPath();
      ctx.arc(x, y, 15, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#FF8C00';
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const px = x + Math.cos(angle) * 8;
        const py = y + Math.sin(angle) * 8;
        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  };
  
  const lightenColor = (color, percent) => {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.min(255, (num >> 16) + amt);
    const G = Math.min(255, (num >> 8 & 0x00FF) + amt);
    const B = Math.min(255, (num & 0x0000FF) + amt);
    return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
  };
  
  const drawBee = (ctx, x, y, angle) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    const wingFlap = Math.sin(animationFrame * 0.5) * 5;
    
    ctx.beginPath();
    ctx.ellipse(-5, -3 + wingFlap, 8, 12, -0.3, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.ellipse(-5, 3 - wingFlap, 8, 12, 0.3, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.ellipse(0, 0, 8, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-3, -8);
    ctx.lineTo(3, -8);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(-3, 0);
    ctx.lineTo(3, 0);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(-3, 8);
    ctx.lineTo(3, 8);
    ctx.stroke();
    
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(10, 0, 4, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(12, -2);
    ctx.lineTo(15, -5);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(12, 2);
    ctx.lineTo(15, 5);
    ctx.stroke();
    
    ctx.restore();
  };
  
  const drawShooter = (ctx) => {
    const x = shooterPos.x;
    const y = shooterPos.y;
    
    if (gameState === 'aiming' && dragStart && dragCurrent) {
      const dx = dragCurrent.x - dragStart.x;
      const dy = dragCurrent.y - dragStart.y;
      
      ctx.strokeStyle = '#FF69B4';
      ctx.lineWidth = 3;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(dragCurrent.x, dragCurrent.y);
      ctx.stroke();
      ctx.setLineDash([]);
      
      drawProjectile(ctx, dragCurrent.x, dragCurrent.y);
    }
    
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y - 40);
    ctx.stroke();
    
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(x, y - 40, 20, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.beginPath();
    ctx.arc(x, y - 40, 18, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#FFB6C1';
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = '#FF69B4';
    ctx.lineWidth = 3;
    ctx.stroke();
  };
  
  const drawProjectile = (ctx, x, y) => {
    const gradient = ctx.createRadialGradient(x, y, 2, x, y, 12);
    gradient.addColorStop(0, '#FFD700');
    gradient.addColorStop(0.5, '#FF69B4');
    gradient.addColorStop(1, '#DDA0DD');
    
    ctx.fillStyle = gradient;
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#FFD700';
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2 + animationFrame * 0.1;
      const sx = x + Math.cos(angle) * 12;
      const sy = y + Math.sin(angle) * 12;
      ctx.fillStyle = 'rgba(255, 215, 0, 0.5)';
      ctx.beginPath();
      ctx.arc(sx, sy, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  };
  
  const drawTrajectory = (ctx) => {
    const dx = dragStart.x - dragCurrent.x;
    const dy = dragStart.y - dragCurrent.y;
    const power = Math.min(Math.sqrt(dx * dx + dy * dy) / 50, 2);
    
    const vx = dx * power;
    const vy = dy * power;
    
    ctx.strokeStyle = 'rgba(255, 105, 180, 0.5)';
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
  
  const drawCelebration = (ctx) => {
    for (let i = 0; i < 10; i++) {
      const x = 100 + i * 70;
      const y = 100 + Math.sin(animationFrame * 0.1 + i) * 30;
      
      ctx.fillStyle = `hsl(${(animationFrame + i * 36) % 360}, 100%, 70%)`;
      ctx.shadowBlur = 10;
      ctx.shadowColor = ctx.fillStyle;
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
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
    
    setProjectile({
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
  
  const updateProjectile = () => {
    if (!projectile) return;
    
    const gravity = 0.3;
    const newTime = projectile.time + 1;
    const newX = projectile.x + projectile.vx;
    const newY = projectile.y + projectile.vy + 0.5 * gravity;
    const newVy = projectile.vy + gravity;
    
    for (const flower of flowers) {
      if (!hitBuds.includes(flower.letter)) {
        const dist = Math.sqrt((newX - flower.x) ** 2 + (newY - flower.y) ** 2);
        if (dist < 35) {
          if (flower.letter === targetConsonant) {
            handleCorrectHit(flower);
          } else {
            setFeedback('🦋 Wrong flower! Try again.');
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
    
    if (newX < 0 || newX > 800 || newY > 600 || newY < 0) {
      setFeedback('💨 Missed! Try again.');
      setProjectile(null);
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
      time: newTime
    });
  };
  
  const handleCorrectHit = (flower) => {
    setHitBuds(prevHits => {
      const newHitBuds = [...prevHits, flower.letter];
      
      const newBee = {
        x: projectile.x,
        y: projectile.y,
        targetX: flower.x,
        targetY: flower.y - 40,
        angle: 0,
        letter: flower.letter
      };
      
      setBees(prevBees => [...prevBees, newBee]);
      
      animateBeeAndBloom(newBee, flower.letter, newHitBuds.length);
      
      setScore(prev => prev + 10);
      setFeedback('🐝 Bee is flying to the flower!');
      setProjectile(null);
      
      return newHitBuds;
    });
  };
  
  const animateBeeAndBloom = (bee, flowerLetter, hitCount) => {
    let progress = 0;
    const duration = 60;
    
    const beeAnimation = setInterval(() => {
      progress++;
      const t = progress / duration;
      const easeT = 1 - Math.pow(1 - t, 3);
      
      setBees(prevBees => 
        prevBees.map(b => {
          if (b.letter === flowerLetter && progress <= duration) {
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
        bloomFlower(flowerLetter, hitCount);
      }
    }, 16);
  };
  
  const bloomFlower = (flowerLetter, hitCount) => {
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
  };
  
  const fullBloomAll = () => {
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
  };
  
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

export default GardenBloomGame;