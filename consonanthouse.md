import React, { useState, useEffect, useRef } from 'react';

const BrickHouseGame = () => {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('ready');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [dragStart, setDragStart] = useState(null);
  const [dragCurrent, setDragCurrent] = useState(null);
  const [projectile, setProjectile] = useState(null);
  const [hitBricks, setHitBricks] = useState([]);
  const [targetConsonant, setTargetConsonant] = useState('');
  const [feedback, setFeedback] = useState('');
  const [houseStage, setHouseStage] = useState(0);
  const [animationFrame, setAnimationFrame] = useState(0);
  
  const consonants = ['പ', 'ഫ', 'ബ', 'ഭ', 'മ'];
  const shooterPos = { x: 400, y: 550 };
  
  const brickMountPositions = [
    { x: 120, y: 350, color: '#CD5C5C', letter: '' },
    { x: 260, y: 300, color: '#BC8F8F', letter: '' },
    { x: 400, y: 270, color: '#D2691E', letter: '' },
    { x: 540, y: 300, color: '#A0522D', letter: '' },
    { x: 680, y: 350, color: '#8B4513', letter: '' },
  ];
  
  const [brickMounts, setBrickMounts] = useState([]);
  
  useEffect(() => {
    initializeGame();
  }, []);
  
  const initializeGame = () => {
    const shuffled = [...consonants].sort(() => Math.random() - 0.5);
    const newMounts = brickMountPositions.map((pos, i) => ({
      ...pos,
      letter: shuffled[i],
      destroyed: false
    }));
    setBrickMounts(newMounts);
    setTargetConsonant(shuffled[0]);
    setFeedback(`Hit: ${shuffled[0]}`);
    setHitBricks([]);
    setHouseStage(0);
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
  }, [gameState, dragCurrent, projectile, brickMounts, targetConsonant, houseStage, animationFrame]);
  
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
    ctx.arc(100, 80, 35, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    
    drawCloud(ctx, 600, 90);
    drawCloud(ctx, 700, 70);
    
    const groundGradient = ctx.createLinearGradient(0, 450, 0, 600);
    groundGradient.addColorStop(0, '#90EE90');
    groundGradient.addColorStop(1, '#228B22');
    ctx.fillStyle = groundGradient;
    ctx.fillRect(0, 450, 800, 150);
    
    brickMounts.forEach(mount => {
      if (!mount.destroyed) {
        drawBrickMount(ctx, mount);
      }
    });
    
    drawHouse(ctx, houseStage);
    
    drawShooter(ctx);
    
    if (gameState === 'aiming' && dragStart && dragCurrent) {
      drawTrajectory(ctx);
    }
    
    if (projectile && gameState === 'shooting') {
      drawProjectile(ctx, projectile.x, projectile.y);
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
  
  const drawBrickMount = (ctx, mount) => {
    const x = mount.x;
    const y = mount.y;
    const brickWidth = 35;
    const brickHeight = 15;
    const isTarget = mount.letter === targetConsonant;
    
    const rows = [4, 3, 2, 1];
    let currentY = y;
    
    rows.forEach((count, rowIndex) => {
      const startX = x - (count * brickWidth) / 2;
      
      for (let i = 0; i < count; i++) {
        const brickX = startX + i * brickWidth;
        
        if (isTarget) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#FFD700';
        }
        
        const gradient = ctx.createLinearGradient(brickX, currentY, brickX, currentY + brickHeight);
        gradient.addColorStop(0, mount.color);
        gradient.addColorStop(1, darkenColor(mount.color, 20));
        ctx.fillStyle = gradient;
        
        ctx.fillRect(brickX, currentY, brickWidth - 2, brickHeight);
        
        ctx.strokeStyle = darkenColor(mount.color, 40);
        ctx.lineWidth = 1;
        ctx.strokeRect(brickX, currentY, brickWidth - 2, brickHeight);
        
        ctx.shadowBlur = 0;
      }
      
      currentY -= brickHeight;
    });
    
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 28px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(mount.letter, x, y - 35);
    
    if (isTarget) {
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 3;
      ctx.strokeText(mount.letter, x, y - 35);
    }
  };
  
  const drawHouse = (ctx, stage) => {
    const houseX = 300;
    const houseY = 250;
    const houseWidth = 200;
    const houseHeight = 180;
    
    if (stage >= 1) {
      ctx.fillStyle = '#8B7355';
      ctx.fillRect(houseX, houseY + houseHeight - 20, houseWidth, 20);
      
      ctx.strokeStyle = '#654321';
      ctx.lineWidth = 3;
      ctx.strokeRect(houseX, houseY + houseHeight - 20, houseWidth, 20);
      
      ctx.fillStyle = '#A0826D';
      for (let i = 0; i < 6; i++) {
        ctx.fillRect(houseX + 10 + i * 35, houseY + houseHeight - 18, 25, 16);
      }
    }
    
    if (stage >= 2) {
      const wallGradient = ctx.createLinearGradient(houseX, houseY, houseX, houseY + houseHeight);
      wallGradient.addColorStop(0, '#F5E6D3');
      wallGradient.addColorStop(1, '#E8D4B8');
      ctx.fillStyle = wallGradient;
      ctx.fillRect(houseX, houseY, houseWidth, houseHeight - 20);
      
      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 4;
      ctx.strokeRect(houseX, houseY, houseWidth, houseHeight - 20);
      
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
      ctx.lineWidth = 2;
      for (let i = 1; i < 5; i++) {
        const lineY = houseY + i * 40;
        ctx.beginPath();
        ctx.moveTo(houseX, lineY);
        ctx.lineTo(houseX + houseWidth, lineY);
        ctx.stroke();
      }
    }
    
    if (stage >= 3) {
      const windowWidth = 40;
      const windowHeight = 50;
      
      [[houseX + 30, houseY + 40], [houseX + 130, houseY + 40], [houseX + 30, houseY + 110], [houseX + 130, houseY + 110]].forEach(([wx, wy]) => {
        const windowGradient = ctx.createRadialGradient(wx + 20, wy + 25, 5, wx + 20, wy + 25, 30);
        windowGradient.addColorStop(0, '#87CEEB');
        windowGradient.addColorStop(1, '#4682B4');
        ctx.fillStyle = windowGradient;
        ctx.fillRect(wx, wy, windowWidth, windowHeight);
        
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 3;
        ctx.strokeRect(wx, wy, windowWidth, windowHeight);
        
        ctx.beginPath();
        ctx.moveTo(wx + windowWidth / 2, wy);
        ctx.lineTo(wx + windowWidth / 2, wy + windowHeight);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(wx, wy + windowHeight / 2);
        ctx.lineTo(wx + windowWidth, wy + windowHeight / 2);
        ctx.stroke();
      });
      
      const doorWidth = 50;
      const doorHeight = 90;
      const doorX = houseX + houseWidth / 2 - doorWidth / 2;
      const doorY = houseY + houseHeight - 20 - doorHeight;
      
      const doorGradient = ctx.createLinearGradient(doorX, doorY, doorX + doorWidth, doorY);
      doorGradient.addColorStop(0, '#8B4513');
      doorGradient.addColorStop(1, '#A0522D');
      ctx.fillStyle = doorGradient;
      ctx.fillRect(doorX, doorY, doorWidth, doorHeight);
      
      ctx.strokeStyle = '#654321';
      ctx.lineWidth = 3;
      ctx.strokeRect(doorX, doorY, doorWidth, doorHeight);
      
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(doorX + doorWidth - 10, doorY + doorHeight / 2, 4, 0, Math.PI * 2);
      ctx.fill();
      
      for (let i = 1; i < 4; i++) {
        ctx.strokeStyle = '#654321';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(doorX, doorY + i * 22);
        ctx.lineTo(doorX + doorWidth, doorY + i * 22);
        ctx.stroke();
      }
    }
    
    if (stage >= 4) {
      ctx.fillStyle = '#8B0000';
      ctx.beginPath();
      ctx.moveTo(houseX - 20, houseY);
      ctx.lineTo(houseX + houseWidth / 2, houseY - 80);
      ctx.lineTo(houseX + houseWidth + 20, houseY);
      ctx.closePath();
      ctx.fill();
      
      ctx.strokeStyle = '#5C0000';
      ctx.lineWidth = 3;
      ctx.stroke();
      
      ctx.fillStyle = '#6B0000';
      for (let i = 0; i < 8; i++) {
        const tileY = houseY - 10 - i * 10;
        const tileWidth = houseWidth - i * 25;
        const tileX = houseX + (houseWidth - tileWidth) / 2;
        ctx.fillRect(tileX, tileY, tileWidth, 8);
      }
      
      const chimneyX = houseX + houseWidth - 50;
      const chimneyY = houseY - 60;
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(chimneyX, chimneyY, 25, 50);
      ctx.strokeStyle = '#654321';
      ctx.lineWidth = 2;
      ctx.strokeRect(chimneyX, chimneyY, 25, 50);
      
      ctx.fillStyle = '#D3D3D3';
      for (let i = 0; i < 3; i++) {
        const smokeY = chimneyY - 10 - i * 15;
        const smokeX = chimneyX + 12 + Math.sin(animationFrame * 0.1 + i) * 5;
        ctx.globalAlpha = 0.6 - i * 0.15;
        ctx.beginPath();
        ctx.arc(smokeX, smokeY, 6 + i * 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
    
    if (stage >= 5) {
      ctx.save();
      ctx.shadowBlur = 20;
      ctx.shadowColor = 'rgba(255, 215, 0, 0.8)';
      
      ctx.fillStyle = '#FFD700';
      ctx.font = 'bold 60px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('🏠', houseX + houseWidth / 2, houseY - 100);
      
      for (let i = 0; i < 8; i++) {
        const sparkleX = houseX + 50 + i * 25;
        const sparkleY = houseY - 120 + Math.sin(animationFrame * 0.1 + i) * 20;
        ctx.fillStyle = `hsl(${(animationFrame * 2 + i * 45) % 360}, 100%, 70%)`;
        ctx.beginPath();
        ctx.arc(sparkleX, sparkleY, 4, 0, Math.PI * 2);
        ctx.fill();
      }
      
      ctx.restore();
    }
  };
  
  const darkenColor = (color, percent) => {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.max(0, (num >> 16) - amt);
    const G = Math.max(0, (num >> 8 & 0x00FF) - amt);
    const B = Math.max(0, (num & 0x0000FF) - amt);
    return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
  };
  
  const drawShooter = (ctx) => {
    const x = shooterPos.x;
    const y = shooterPos.y;
    
    if (gameState === 'aiming' && dragStart && dragCurrent) {
      ctx.strokeStyle = '#FF4500';
      ctx.lineWidth = 3;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(dragCurrent.x, dragCurrent.y);
      ctx.stroke();
      ctx.setLineDash([]);
      
      drawProjectile(ctx, dragCurrent.x, dragCurrent.y);
    }
    
    ctx.fillStyle = '#FF6347';
    ctx.beginPath();
    ctx.arc(x, y, 25, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = '#8B0000';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(x, y - 30, 15, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = '#FFA500';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.strokeStyle = '#8B0000';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y - 30);
    ctx.stroke();
  };
  
  const drawProjectile = (ctx, x, y) => {
    const gradient = ctx.createRadialGradient(x, y, 2, x, y, 12);
    gradient.addColorStop(0, '#FF4500');
    gradient.addColorStop(0.5, '#FF6347');
    gradient.addColorStop(1, '#FF8C00');
    
    ctx.fillStyle = gradient;
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#FF4500';
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    
    for (let i = 0; i < 3; i++) {
      const angle = (i / 3) * Math.PI * 2 + animationFrame * 0.2;
      const sx = x + Math.cos(angle) * 15;
      const sy = y + Math.sin(angle) * 15;
      ctx.fillStyle = 'rgba(255, 69, 0, 0.5)';
      ctx.beginPath();
      ctx.arc(sx, sy, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  };
  
  const drawTrajectory = (ctx) => {
    const dx = dragStart.x - dragCurrent.x;
    const dy = dragStart.y - dragCurrent.y;
    const power = Math.min(Math.sqrt(dx * dx + dy * dy) / 50, 2);
    
    const vx = dx * power;
    const vy = dy * power;
    
    ctx.strokeStyle = 'rgba(255, 69, 0, 0.5)';
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
    
    for (const mount of brickMounts) {
      if (!mount.destroyed) {
        const dist = Math.sqrt((newX - mount.x) ** 2 + (newY - mount.y) ** 2);
        if (dist < 50) {
          if (mount.letter === targetConsonant) {
            handleCorrectHit(mount);
          } else {
            setFeedback('🧱 Wrong brick mount! Try again.');
            setProjectile(null);
            setTimeout(() => {
              setGameState('ready');
              setFeedback(`Hit: ${targetConsonant}`);
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
        setFeedback(`Hit: ${targetConsonant}`);
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
  
  const handleCorrectHit = (mount) => {
    setHitBricks(prevHits => {
      const newHitBricks = [...prevHits, mount.letter];
      const newStage = newHitBricks.length;
      
      setBrickMounts(prevMounts =>
        prevMounts.map(m =>
          m.letter === mount.letter ? { ...m, destroyed: true } : m
        )
      );
      
      setScore(prev => prev + 20);
      setProjectile(null);
      
      const stageMessages = [
        '🏗️ Foundation laid!',
        '🧱 Walls built!',
        '🪟 Windows and doors added!',
        '🏠 Roof constructed!',
        '🎉 Beautiful house complete!'
      ];
      
      setFeedback(stageMessages[newStage - 1]);
      
      setTimeout(() => {
        setHouseStage(newStage);
        
        if (newStage === consonants.length) {
          setTimeout(() => {
            setFeedback('🏆 House Complete! Starting new level...');
            setTimeout(() => {
              setLevel(prev => prev + 1);
              setScore(prev => prev + 100);
              initializeGame();
              setGameState('ready');
            }, 3000);
          }, 1000);
        } else {
          const available = brickMounts.filter(m => !newHitBricks.includes(m.letter));
          if (available.length > 0) {
            const newTarget = available[Math.floor(Math.random() * available.length)];
            setTargetConsonant(newTarget.letter);
            setFeedback(`Hit: ${newTarget.letter}`);
            setGameState('ready');
          }
        }
      }, 1000);
      
      return newHitBricks;
    });
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-100 to-blue-300 p-4">
      <div className="bg-gradient-to-b from-orange-100 to-yellow-100 rounded-lg shadow-2xl p-6 max-w-4xl w-full border-4 border-orange-600">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-orange-800 drop-shadow-lg">🏗️ Brick House Builder 🏗️</h1>
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
            {feedback || 'Drag the cannon to aim and build your house!'}
          </div>
        </div>
        
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="border-4 border-orange-600 rounded-lg cursor-crosshair bg-gradient-to-b from-sky-200 to-green-200 shadow-2xl"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
        
        <div className="mt-4 text-center text-orange-800">
          <p className="text-sm font-semibold">🎯 Click and drag the cannon to aim and destroy brick mounts!</p>
          <p className="text-sm mt-1 font-semibold">🏗️ Build progress: {['Foundation', 'Walls', 'Windows & Doors', 'Roof', 'Complete'][houseStage] || 'Not started'}</p>
        </div>
      </div>
    </div>
  );
};

export default BrickHouseGame;