import React, { useState, useEffect, useRef } from 'react';

const ConsonantHornbillGame = () => {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('ready');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [dragStart, setDragStart] = useState(null);
  const [dragCurrent, setDragCurrent] = useState(null);
  const [projectile, setProjectile] = useState(null);
  const [connectedDots, setConnectedDots] = useState([]);
  const [targetConsonant, setTargetConsonant] = useState('');
  const [feedback, setFeedback] = useState('');
  const [gameComplete, setGameComplete] = useState(false);
  const [animationFrame, setAnimationFrame] = useState(0);
  const hornbillImage = useRef(new Image());
  const finalHornbillImage = useRef(new Image());

  const consonants = ['യ', 'ര', 'ല', 'വ', 'ശ', 'ഷ', 'സ', 'ഹ', 'ള', 'ഴ', 'റ'];
  const shooterPos = { x: 480, y: 240 };

  const hornbillDots = [
    { x: 200, y: 90, label: '', order: 0 }, // Head top
    { x: 320, y: 60, label: '', order: 1 }, // Beak tip
    { x: 520, y: 60, label: '', order: 2 }, // Beak base
    { x: 480, y: 150, label: '', order: 3 }, // Neck
    { x: 560, y: 180, label: '', order: 4 }, // Body top
    { x: 640, y: 270, label: '', order: 5 }, // Body middle
    { x: 600, y: 480, label: '', order: 6 }, // Body bottom
    { x: 520, y: 570, label: '', order: 7 }, // Tail start
    { x: 480, y: 360, label: '', order: 8 }, // Tail middle
    { x: 400, y: 300, label: '', order: 9 }, // Tail end
    { x: 400, y: 120, label: '', order: 10 }, // Wing
  ];

  const [dots, setDots] = useState([]);

  useEffect(() => {
    hornbillImage.current.src = '/game/assets/image/hornbill/hornbilloutline.png';
    finalHornbillImage.current.src = '/game/assets/image/hornbill/greathornbill.png';
    hornbillImage.current.onload = () => {
      initializeGame();
    };
  }, []);

  const initializeGame = () => {
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
  }, [gameState, dragCurrent, projectile, dots, connectedDots, targetConsonant, gameComplete, animationFrame]);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationFrame(prev => prev + 1);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const drawGame = (ctx) => {
    ctx.clearRect(0, 0, 800, 600);

    // Sky background
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#E0F6FF');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 600);

    // Sun
    ctx.fillStyle = '#FFD700';
    ctx.shadowBlur = 30;
    ctx.shadowColor = '#FFA500';
    ctx.beginPath();
    ctx.arc(650, 80, 40, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Clouds
    drawCloud(ctx, 500, 90);
    drawCloud(ctx, 100, 70);

    // Trees in background
    drawTree(ctx, 600, 400);
    drawTree(ctx, 700, 420);

    // Ground
    const groundGradient = ctx.createLinearGradient(0, 400, 0, 600);
    groundGradient.addColorStop(0, '#90EE90');
    groundGradient.addColorStop(1, '#228B22');
    ctx.fillStyle = groundGradient;
    ctx.fillRect(0, 400, 800, 200);

    // Draw grid
    drawGrid(ctx);

    if (gameComplete) {
        ctx.drawImage(finalHornbillImage.current, 40, 0, 750, 600);
        drawCompleteHornbill(ctx);
    } else {
        // Draw hornbill image
        ctx.globalAlpha = 0.3;
        ctx.drawImage(hornbillImage.current, 40, 0, 750, 600);
        ctx.globalAlpha = 1;

        // Draw connecting lines between dots
        drawConnections(ctx);

        // Draw dots
        dots.forEach(dot => {
            drawDot(ctx, dot);
        });
    }

    // Draw shooter
    if (!gameComplete) {
        drawShooter(ctx);
    }

    // Draw trajectory if aiming
    if (gameState === 'aiming' && dragStart && dragCurrent) {
      drawTrajectory(ctx);
    }

    // Draw projectile if shooting
    if (projectile && gameState === 'shooting') {
      drawProjectile(ctx, projectile.x, projectile.y);
    }
  };

  const drawGrid = (ctx) => {
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.font = '10px Arial';
    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const gridSizeX = 800 / 20;
    const gridSizeY = 600 / 20;

    for (let i = 0; i <= 20; i++) {
      // Draw vertical lines
      const x = i * gridSizeX;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 600);
      ctx.stroke();
      if (i < 20) {
        ctx.fillText(i.toString().padStart(2, '0'), x + gridSizeX / 2, 10);
      }

      // Draw horizontal lines
      const y = i * gridSizeY;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(800, y);
      ctx.stroke();
      if (i < 20) {
        ctx.fillText(i.toString().padStart(2, '0'), 10, y + gridSizeY / 2);
      }
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

  const drawTree = (ctx, x, y) => {
    // Trunk
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(x - 10, y, 20, 80);

    // Foliage
    ctx.fillStyle = '#228B22';
    ctx.beginPath();
    ctx.arc(x, y, 40, 0, Math.PI * 2);
    ctx.arc(x - 25, y + 10, 30, 0, Math.PI * 2);
    ctx.arc(x + 25, y + 10, 30, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawConnections = (ctx) => {
    if (connectedDots.length < 2) return;

    ctx.strokeStyle = '#FF6347';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.shadowBlur = 5;
    ctx.shadowColor = '#FF6347';

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
  };

  const drawDot = (ctx, dot) => {
    const isConnected = connectedDots.includes(dot.label);
    const isTarget = dot.label === targetConsonant;

    // Dot circle
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

    // Dot border
    ctx.strokeStyle = isConnected ? '#228B22' : (isTarget ? '#FF8C00' : '#36648B');
    ctx.lineWidth = 3;
    ctx.stroke();

    // Number indicator for connected dots
    if (isConnected) {
      const dotNumber = connectedDots.indexOf(dot.label) + 1;
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(dotNumber, dot.x - 18, dot.y - 18);
    }

    // Malayalam letter
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 26px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(dot.label, dot.x, dot.y);

    // Pulsing effect for target
    if (isTarget && !isConnected) {
      const pulse = Math.sin(animationFrame * 0.15) * 5 + 30;
      ctx.strokeStyle = 'rgba(255, 215, 0, 0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, pulse, 0, Math.PI * 2);
      ctx.stroke();
    }
  };

  const drawCompleteHornbill = (ctx) => {
    // Draw all connections
    drawConnections(ctx);
  };

  const drawShooter = (ctx) => {
    const x = shooterPos.x;
    const y = shooterPos.y;

    if (gameState === 'aiming' && dragStart && dragCurrent) {
      ctx.strokeStyle = '#FF6347';
      ctx.lineWidth = 3;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(dragCurrent.x, dragCurrent.y);
      ctx.stroke();
      ctx.setLineDash([]);

      drawProjectile(ctx, dragCurrent.x, dragCurrent.y);
    }

    // Launcher base
    ctx.fillStyle = '#4682B4';
    ctx.beginPath();
    ctx.arc(x, y, 25, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#36648B';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Launcher barrel
    ctx.fillStyle = '#5F9EA0';
    ctx.fillRect(x - 5, y - 35, 10, 35);

    ctx.strokeStyle = '#36648B';
    ctx.lineWidth = 2;
    ctx.strokeRect(x - 5, y - 35, 10, 35);
  };

  const drawProjectile = (ctx, x, y) => {
    const gradient = ctx.createRadialGradient(x, y, 2, x, y, 10);
    gradient.addColorStop(0, '#FF6347');
    gradient.addColorStop(0.5, '#FF7F50');
    gradient.addColorStop(1, '#FFA07A');

    ctx.fillStyle = gradient;
    ctx.shadowBlur = 12;
    ctx.shadowColor = '#FF6347';
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Trail effect
    for (let i = 0; i < 3; i++) {
      const angle = (i / 3) * Math.PI * 2 + animationFrame * 0.2;
      const tx = x + Math.cos(angle) * 12;
      const ty = y + Math.sin(angle) * 12;
      ctx.fillStyle = 'rgba(255, 99, 71, 0.4)';
      ctx.beginPath();
      ctx.arc(tx, ty, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const drawTrajectory = (ctx) => {
    const dx = dragStart.x - dragCurrent.x;
    const dy = dragStart.y - dragCurrent.y;
    const power = Math.min(Math.sqrt(dx * dx + dy * dy) / 50, 2);

    const vx = dx * power;
    const vy = dy * power;

    ctx.strokeStyle = 'rgba(255, 99, 71, 0.5)';
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
    const newX = projectile.x + projectile.vx;
    const newY = projectile.y + projectile.vy + 0.5 * gravity;
    const newVy = projectile.vy + gravity;

    // Check collision with dots
    for (const dot of dots) {
      if (!connectedDots.includes(dot.label)) {
        const dist = Math.sqrt((newX - dot.x) ** 2 + (newY - dot.y) ** 2);
        if (dist < 30) {
          if (dot.label === targetConsonant) {
            handleCorrectHit(dot);
          } else {
            setFeedback('❌ Wrong dot! Follow the order.');
            setProjectile(null);
            setTimeout(() => {
              setGameState('ready');
              setFeedback(`Connect: ${targetConsonant}`);
            }, 1000);
          }
          return;
        }
      }
    }

    // Check if projectile is out of bounds
    if (newX < 0 || newX > 800 || newY > 600 || newY < 0) {
      setFeedback('💨 Missed! Try again.');
      setProjectile(null);
      setTimeout(() => {
        setGameState('ready');
        setFeedback(`Connect: ${targetConsonant}`);
      }, 1000);
      return;
    }

    setProjectile({
      x: newX,
      y: newY,
      vx: projectile.vx,
      vy: newVy,
      time: projectile.time + 1
    });
  };

  const handleCorrectHit = (dot) => {
    setConnectedDots(prevConnected => {
      const newConnected = [...prevConnected, dot.label];

      setScore(prev => prev + 10);
      setProjectile(null);

      if (newConnected.length === consonants.length) {
        setFeedback('Congrats, You have discovered the Great Hornbill!(Buceros bicornis), the Kerala State Bird');
        setGameComplete(true);
      } else {
        const nextIndex = newConnected.length;
        const nextTarget = consonants[nextIndex];

        setTargetConsonant(nextTarget);
        setFeedback(`✨ Dot ${newConnected.length} connected! Next: ${nextTarget}`);
        setTimeout(() => {
          setGameState('ready');
        }, 1000);
      }

      return newConnected;
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-sky-100 to-green-100 p-4">
      <div className="bg-gradient-to-b from-blue-50 to-white rounded-lg shadow-2xl p-6 max-w-4xl w-full border-4 border-blue-400">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-blue-800 drop-shadow-lg">🦅 Great Hornbill Connect 🦅</h1>
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
          <p className="text-sm font-semibold">🎯 Click and drag the launcher to connect dots in order!</p>
          <p className="text-sm mt-1 font-semibold">🔗 Connected: {connectedDots.length} / {consonants.length}</p>
        </div>

        {gameComplete && (
            <div className="absolute top-4 right-4 flex flex-col space-y-2">
                <button onClick={initializeGame} className="bg-blue-500 text-white rounded-lg px-4 py-2">Play Again</button>
                <button onClick={() => { /* Navigate to next game */ }} className="bg-green-500 text-white rounded-lg px-4 py-2">Next Game</button>
            </div>
        )}
      </div>
    </div>
  );
};

export default ConsonantHornbillGame;
