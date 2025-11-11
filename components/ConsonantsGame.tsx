'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';

// Malayalam consonants data
const MALAYALAM_CONSONANTS = [
  'ക', 'ഖ', 'ഗ', 'ഘ', 'ങ',
  'ച', 'ഛ', 'ജ', 'ഝ', 'ഞ',
  'ട', 'ഠ', 'ഡ', 'ഢ', 'ണ',
  'ത', 'ഥ', 'ദ', 'ധ', 'ന',
  'പ', 'ഫ', 'ബ', 'ഭ', 'മ',
  'യ', 'ര', 'ല', 'വ', 'ശ',
  'ഷ', 'സ', 'ഹ', 'ള', 'ഴ',
  'റ', 'ഩ'
];

// Game constants
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const PLAYER_SIZE = 80;
const PEARL_SIZE = 90;
const OBSTACLE_WIDTH = 40;
const GRAVITY = 0.5;
const JUMP_FORCE = -18;
const MOVE_SPEED = 5;
const INITIAL_LIVES = 5;
const LEVEL_LENGTH = MALAYALAM_CONSONANTS.length * 300;

interface GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Pearl extends GameObject {
  letter: string;
  color: string;
  collected: boolean;
  floatOffset: number;
}

interface Obstacle extends GameObject {
  type: 'coral' | 'seaweed';
  swayOffset: number;
}

interface Bubble {
  x: number;
  y: number;
  size: number;
  speed: number;
}

interface Jellyfish {
  x: number;
  y: number;
  size: number;
  color: string;
  speed: number;
  floatOffset: number;
  direction: number;
}

interface Octopus {
  x: number;
  y: number;
  speed: number;
  direction: number;
  armWave: number;
}

const UnderseaConsonantsGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'paused' | 'won' | 'lost'>('menu');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(INITIAL_LIVES);
  const [collectedLetters, setCollectedLetters] = useState<string[]>([]);
  const [isPerfectRun, setIsPerfectRun] = useState(true);
  
  const gameDataRef = useRef({
    player: {
      x: 100,
      y: CANVAS_HEIGHT - 150,
      velocityY: 0,
      width: PLAYER_SIZE,
      height: PLAYER_SIZE,
      invincible: false,
      invincibleTimer: 0
    },
    camera: { x: 0 },
    pearls: [] as Pearl[],
    obstacles: [] as Obstacle[],
    bubbles: [] as Bubble[],
    jellyfish: [] as Jellyfish[],
    octopuses: [] as Octopus[],
    keys: { up: false, down: false, left: false, right: false, space: false },
    lastTime: 0,
    distance: 0
  });

  // Generate color palette
  const generateColors = (count: number): string[] => {
    return Array.from({ length: count }, (_, i) => {
      const hue = (i * 360) / count;
      return `hsl(${hue}, 80%, 60%)`;
    });
  };

  // Initialize game
  const initGame = useCallback(() => {
    const colors = generateColors(MALAYALAM_CONSONANTS.length);
    const pearls: Pearl[] = [];
    const obstacles: Obstacle[] = [];
    
    // Create pearls for each consonant
    MALAYALAM_CONSONANTS.forEach((letter, index) => {
      const x = 400 + index * 300;
      const y = 200 + Math.sin(index * 0.5) * 100;
      
      pearls.push({
        x,
        y,
        width: PEARL_SIZE,
        height: PEARL_SIZE,
        letter,
        color: colors[index],
        collected: false,
        floatOffset: Math.random() * Math.PI * 2
      });
    });
    
    // Create obstacles
    for (let i = 0; i < MALAYALAM_CONSONANTS.length * 2; i++) {
      const x = 600 + i * 200 + Math.random() * 100;
      const type = Math.random() > 0.5 ? 'coral' : 'seaweed';
      const height = type === 'coral' ? 60 + Math.random() * 40 : 80 + Math.random() * 60;
      
      obstacles.push({
        x,
        y: CANVAS_HEIGHT - 100 - height,
        width: OBSTACLE_WIDTH,
        height,
        type,
        swayOffset: Math.random() * Math.PI * 2
      });
    }
    
    // Create bubbles
    const bubbles: Bubble[] = [];
    for (let i = 0; i < 30; i++) {
      bubbles.push({
        x: Math.random() * LEVEL_LENGTH,
        y: Math.random() * CANVAS_HEIGHT,
        size: 3 + Math.random() * 8,
        speed: 0.5 + Math.random() * 1.5
      });
    }
    
    // Create jellyfish
    const jellyfish: Jellyfish[] = [];
    const jellyfishColors = ['#ff6b9d', '#9d6bff', '#6bffff', '#ffff6b', '#6bff9d'];
    for (let i = 0; i < 15; i++) {
      jellyfish.push({
        x: 200 + (i * 800) + Math.random() * 400,
        y: 100 + Math.random() * 300,
        size: 30 + Math.random() * 20,
        color: jellyfishColors[Math.floor(Math.random() * jellyfishColors.length)],
        speed: 0.5 + Math.random() * 1,
        floatOffset: Math.random() * Math.PI * 2,
        direction: Math.random() > 0.5 ? 1 : -1
      });
    }
    
    // Create octopuses
    const octopuses: Octopus[] = [];
    for (let i = 0; i < 5; i++) {
      octopuses.push({
        x: 500 + i * 2000,
        y: 200 + Math.random() * 150,
        speed: 1 + Math.random() * 0.5,
        direction: Math.random() > 0.5 ? 1 : -1,
        armWave: Math.random() * Math.PI * 2
      });
    }
    
    gameDataRef.current = {
      player: {
        x: 100,
        y: CANVAS_HEIGHT - 150,
        velocityY: 0,
        width: PLAYER_SIZE,
        height: PLAYER_SIZE,
        invincible: false,
        invincibleTimer: 0
      },
      camera: { x: 0 },
      pearls,
      obstacles,
      bubbles,
      jellyfish,
      octopuses,
      keys: { up: false, down: false, left: false, right: false, space: false },
      lastTime: performance.now(),
      distance: 0
    };
    
    setScore(0);
    setLives(INITIAL_LIVES);
    setCollectedLetters([]);
    setIsPerfectRun(true);
  }, []);

  // Check collision
  const checkCollision = (a: GameObject, b: GameObject): boolean => {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  };

  // Draw crab
  const drawCrab = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, time: number) => {
    ctx.save();
    ctx.translate(x, y);
    
    // Invincibility flash
    if (gameDataRef.current.player.invincible && Math.floor(time / 100) % 2 === 0) {
      ctx.globalAlpha = 0.5;
    }

    // Legs
    const legWave = Math.sin(time / 100) * (width / 8);
    ctx.strokeStyle = '#e63946'; // Darker red for legs
    ctx.lineWidth = width / 8; // Increased thickness
    
    // Left legs
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(-width / 4, (i * height / 6) - (height / 8)); // Adjusted vertical spread
      ctx.lineTo(-width / 1.5, (i * height / 6) - (height / 8) + legWave); // Increased length
      ctx.stroke();
    }
    
    // Right legs
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(width / 4, (i * height / 6) - (height / 8)); // Adjusted vertical spread
      ctx.lineTo(width / 1.5, (i * height / 6) - (height / 8) - legWave); // Increased length
      ctx.stroke();
    }
    
    // Body
    ctx.fillStyle = '#ff6b6b';
    ctx.beginPath();
    ctx.ellipse(0, 0, width / 2, height / 2 * 0.75, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#e63946';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Eyes
    const eyeY = -height / 6;
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(-width / 5, eyeY, width / 8, 0, Math.PI * 2);
    ctx.arc(width / 5, eyeY, width / 8, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(-width / 5, eyeY, width / 20, 0, Math.PI * 2);
    ctx.arc(width / 5, eyeY, width / 20, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  };

  // Draw pearl
  const drawPearl = (ctx: CanvasRenderingContext2D, pearl: Pearl, time: number) => {
    if (pearl.collected) return;
    
    const floatY = Math.sin(time / 300 + pearl.floatOffset) * 10;
    
    ctx.save();
    ctx.translate(pearl.x + pearl.width / 2, pearl.y + pearl.height / 2 + floatY);
    
    // Pearl glow
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, pearl.width / 2 + 5);
    gradient.addColorStop(0, pearl.color);
    gradient.addColorStop(0.7, pearl.color);
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, pearl.width / 2 + 5, 0, Math.PI * 2);
    ctx.fill();
    
    // Pearl
    ctx.fillStyle = pearl.color;
    ctx.beginPath();
    ctx.arc(0, 0, pearl.width / 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Shine
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.beginPath();
    ctx.arc(-10, -10, 8, 0, Math.PI * 2);
    ctx.fill();
    
    // Letter
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 60px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(pearl.letter, 0, 0);
    
    ctx.restore();
  };

  // Draw obstacle
  const drawObstacle = (ctx: CanvasRenderingContext2D, obstacle: Obstacle, time: number) => {
    const sway = Math.sin(time / 500 + obstacle.swayOffset) * 5;
    
    ctx.save();
    ctx.translate(obstacle.x + obstacle.width / 2, obstacle.y + obstacle.height);
    
    if (obstacle.type === 'coral') {
      // Coral
      ctx.fillStyle = '#ff6b9d';
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.ellipse(
          (i - 1) * 12,
          -obstacle.height / 2,
          8,
          obstacle.height / 2,
          0,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
    } else {
      // Seaweed
      ctx.strokeStyle = '#4ecdc4';
      ctx.lineWidth = 8;
      ctx.lineCap = 'round';
      
      ctx.beginPath();
      ctx.moveTo(sway, 0);
      for (let i = 1; i <= 5; i++) {
        const y = -(obstacle.height * i) / 5;
        const x = sway * (1 - i / 5) + Math.sin(time / 300 + i) * 8;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    
    ctx.restore();
  };

  // Draw bubble
  const drawBubble = (ctx: CanvasRenderingContext2D, bubble: Bubble) => {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.beginPath();
    ctx.arc(bubble.x, bubble.y, bubble.size, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 1;
    ctx.stroke();
  };

  // Draw jellyfish
  const drawJellyfish = (ctx: CanvasRenderingContext2D, jelly: Jellyfish, time: number) => {
    const floatY = Math.sin(time / 400 + jelly.floatOffset) * 15;
    
    ctx.save();
    ctx.translate(jelly.x, jelly.y + floatY);
    
    // Body (bell)
    ctx.fillStyle = jelly.color;
    ctx.globalAlpha = 0.7;
    ctx.beginPath();
    ctx.ellipse(0, 0, jelly.size, jelly.size * 0.8, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Inner glow
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.beginPath();
    ctx.ellipse(0, -jelly.size * 0.2, jelly.size * 0.5, jelly.size * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.globalAlpha = 1;
    
    // Tentacles
    ctx.strokeStyle = jelly.color;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI - Math.PI / 2;
      const startX = Math.cos(angle) * jelly.size * 0.8;
      const startY = Math.sin(angle) * jelly.size * 0.6 + jelly.size * 0.5;
      
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      
      for (let j = 1; j <= 4; j++) {
        const wave = Math.sin(time / 200 + i + j) * 8;
        const y = startY + j * 12;
        ctx.lineTo(startX + wave, y);
      }
      ctx.stroke();
    }
    
    ctx.restore();
  };

  // Draw octopus
  const drawOctopus = (ctx: CanvasRenderingContext2D, octopus: Octopus, time: number) => {
    ctx.save();
    ctx.translate(octopus.x, octopus.y);
    
    if (octopus.direction < 0) {
      ctx.scale(-1, 1);
    }
    
    // Head/body
    ctx.fillStyle = '#e85d75';
    ctx.beginPath();
    ctx.ellipse(0, 0, 40, 35, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Eyes
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(-12, -8, 8, 0, Math.PI * 2);
    ctx.arc(12, -8, 8, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(-12, -8, 4, 0, Math.PI * 2);
    ctx.arc(12, -8, 4, 0, Math.PI * 2);
    ctx.fill();
    
    // Arms
    ctx.strokeStyle = '#e85d75';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    
    for (let i = 0; i < 8; i++) {
      const armAngle = ((i - 3.5) * Math.PI) / 8;
      const startX = Math.cos(armAngle) * 30;
      const startY = 20 + Math.sin(armAngle) * 15;
      
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      
      for (let j = 1; j <= 3; j++) {
        const wave = Math.sin(time / 150 + octopus.armWave + i * 0.5 + j) * 15;
        const x = startX + (octopus.direction * j * 15) + wave;
        const y = startY + j * 15;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
      
      // Suckers
      ctx.fillStyle = '#d84563';
      for (let j = 1; j <= 3; j++) {
        const wave = Math.sin(time / 150 + octopus.armWave + i * 0.5 + j) * 15;
        const x = startX + (octopus.direction * j * 15) + wave;
        const y = startY + j * 15;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    ctx.restore();
  };

  // Game loop
  const gameLoop = useCallback((currentTime: number) => {
    const canvas = canvasRef.current;
    if (!canvas || gameState !== 'playing') return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const deltaTime = currentTime - gameDataRef.current.lastTime;
    gameDataRef.current.lastTime = currentTime;
    
    const { player, camera, pearls, obstacles, bubbles, jellyfish, octopuses, keys } = gameDataRef.current;
    
    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Draw background gradient (water)
    const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    gradient.addColorStop(0, '#1a5f7a');
    gradient.addColorStop(1, '#0d2f3f');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Update and draw bubbles
    bubbles.forEach(bubble => {
      bubble.y -= bubble.speed;
      if (bubble.y < -20) {
        bubble.y = CANVAS_HEIGHT + 20;
        bubble.x = Math.random() * LEVEL_LENGTH;
      }
      
      const screenX = bubble.x - camera.x;
      if (screenX > -50 && screenX < CANVAS_WIDTH + 50) {
        drawBubble(ctx, { ...bubble, x: screenX });
      }
    });
    
    // Update and draw jellyfish
    jellyfish.forEach(jelly => {
      jelly.x += jelly.speed * jelly.direction;
      
      // Bounce off boundaries
      if (jelly.x < 0 || jelly.x > LEVEL_LENGTH) {
        jelly.direction *= -1;
      }
      
      const screenX = jelly.x - camera.x;
      if (screenX > -100 && screenX < CANVAS_WIDTH + 100) {
        drawJellyfish(ctx, { ...jelly, x: screenX }, currentTime);
      }
    });
    
    // Update and draw octopuses
    octopuses.forEach(octopus => {
      octopus.x += octopus.speed * octopus.direction;
      octopus.armWave += 0.05;
      
      // Bounce off boundaries
      if (octopus.x < 0 || octopus.x > LEVEL_LENGTH) {
        octopus.direction *= -1;
      }
      
      const screenX = octopus.x - camera.x;
      if (screenX > -150 && screenX < CANVAS_WIDTH + 150) {
        drawOctopus(ctx, { ...octopus, x: screenX }, currentTime);
      }
    });
    
    // Draw sea floor
    ctx.fillStyle = '#8b7355';
    ctx.fillRect(0, CANVAS_HEIGHT - 100, CANVAS_WIDTH, 100);
    
    ctx.fillStyle = '#a0826d';
    for (let i = 0; i < 20; i++) {
      const x = (i * 50 + camera.x * 0.5) % CANVAS_WIDTH;
      ctx.beginPath();
      ctx.arc(x, CANVAS_HEIGHT - 100, 15, 0, Math.PI, true);
      ctx.fill();
    }
    
    // Update player
    if (keys.left && player.x > 50) {
      player.x -= MOVE_SPEED;
    }
    if (keys.right && player.x < LEVEL_LENGTH - player.width) {
      player.x += MOVE_SPEED;
    }
    
    // Vertical movement (up/down)
    if (keys.up && player.y > 50) {
      player.y -= MOVE_SPEED;
    }
    if (keys.down && player.y < CANVAS_HEIGHT - 150) {
      player.y += MOVE_SPEED;
    }
    
    // Jump (space)
    if (keys.space && player.y >= CANVAS_HEIGHT - 150) {
      player.velocityY = JUMP_FORCE;
    }
    
    player.velocityY += GRAVITY;
    player.y += player.velocityY;
    
    // Ground collision
    if (player.y > CANVAS_HEIGHT - 150) {
      player.y = CANVAS_HEIGHT - 150;
      player.velocityY = 0;
    }
    
    // Invincibility timer
    if (player.invincible) {
      player.invincibleTimer--;
      if (player.invincibleTimer <= 0) {
        player.invincible = false;
      }
    }
    
    // Camera follows player
    camera.x = player.x - CANVAS_WIDTH / 2;
    camera.x = Math.max(0, Math.min(camera.x, LEVEL_LENGTH - CANVAS_WIDTH));
    gameDataRef.current.distance = player.x;
    
    // Check pearl collection
    pearls.forEach(pearl => {
      if (!pearl.collected && checkCollision(player, pearl)) {
        pearl.collected = true;
        setCollectedLetters(prev => [...prev, pearl.letter]);
        setScore(prev => prev + 100);
        
        // Play audio if available
        try {
          const audio = new Audio(`/audio/malayalam/consonants/${pearl.letter}.wav`);
          audio.play().catch(() => {});
        } catch (e) {}
      }
    });
    
    // Check obstacle collision
    if (!player.invincible) {
      obstacles.forEach(obstacle => {
        if (checkCollision(player, obstacle)) {
          player.invincible = true;
          player.invincibleTimer = 60;
          setLives(prev => {
            const newLives = prev - 1;
            if (newLives <= 0) {
              setGameState('lost');
            }
            return newLives;
          });
          setIsPerfectRun(false);
        }
      });
    }
    
    // Draw obstacles
    obstacles.forEach(obstacle => {
      const screenX = obstacle.x - camera.x;
      if (screenX > -100 && screenX < CANVAS_WIDTH + 100) {
        drawObstacle(ctx, { ...obstacle, x: screenX }, currentTime);
      }
    });
    
    // Draw pearls
    pearls.forEach(pearl => {
      const screenX = pearl.x - camera.x;
      if (screenX > -100 && screenX < CANVAS_WIDTH + 100) {
        drawPearl(ctx, { ...pearl, x: screenX }, currentTime);
      }
    });
    
    // Draw player
    const playerScreenX = player.x - camera.x;
    drawCrab(ctx, playerScreenX + player.width / 2, player.y + player.height / 2, player.width, player.height, currentTime);
    
    // Draw collected letters at top
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, CANVAS_WIDTH, 50);
    
    collectedLetters.forEach((letter, index) => {
      const pearl = pearls.find(p => p.letter === letter);
      if (pearl) {
        ctx.fillStyle = pearl.color;
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(letter, 30 + index * 25, 30);
      }
    });
    
    // Draw HUD
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${score}`, 10, CANVAS_HEIGHT - 20);
    ctx.fillText(`Lives: ${'❤️'.repeat(lives)}`, 200, CANVAS_HEIGHT - 20);
    ctx.fillText(`Letters: ${collectedLetters.length}/${MALAYALAM_CONSONANTS.length}`, 400, CANVAS_HEIGHT - 20);
    
    // Check win condition
    if (player.x > LEVEL_LENGTH - 200) {
      setGameState('won');
      return;
    }
    
    animationRef.current = requestAnimationFrame(gameLoop);
  }, [gameState, score, lives, collectedLetters]);

  // Keyboard handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const relevantKeys = ['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' ', 'w', 'a', 's', 'd'];
      if (relevantKeys.includes(key)) {
        e.preventDefault();
      }

      if (key === 'arrowup' || key === 'w') gameDataRef.current.keys.up = true;
      if (key === 'arrowdown' || key === 's') gameDataRef.current.keys.down = true;
      if (key === 'arrowleft' || key === 'a') gameDataRef.current.keys.left = true;
      if (key === 'arrowright' || key === 'd') gameDataRef.current.keys.right = true;
      if (key === ' ') gameDataRef.current.keys.space = true;
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === 'arrowup' || key === 'w') gameDataRef.current.keys.up = false;
      if (key === 'arrowdown' || key === 's') gameDataRef.current.keys.down = false;
      if (key === 'arrowleft' || key === 'a') gameDataRef.current.keys.left = false;
      if (key === 'arrowright' || key === 'd') gameDataRef.current.keys.right = false;
      if (key === ' ') gameDataRef.current.keys.space = false;
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Start game loop
  useEffect(() => {
    if (gameState === 'playing') {
      gameDataRef.current.lastTime = performance.now();
      animationRef.current = requestAnimationFrame(gameLoop);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameState, gameLoop]);

  const startGame = () => {
    initGame();
    setGameState('playing');
  };

  const restartGame = () => {
    initGame();
    setGameState('playing');
  };

  // Mobile controls
  const MobileControls = () => (
    <div className="flex justify-between items-center gap-4 mt-4">
      <div className="flex gap-2">
        <Button
          onMouseDown={() => gameDataRef.current.keys.left = true}
          onMouseUp={() => gameDataRef.current.keys.left = false}
          onTouchStart={() => gameDataRef.current.keys.left = true}
          onTouchEnd={() => gameDataRef.current.keys.left = false}
          className="px-6 py-4 text-lg"
        >
          ←
        </Button>
        <Button
          onMouseDown={() => gameDataRef.current.keys.right = true}
          onMouseUp={() => gameDataRef.current.keys.right = false}
          onTouchStart={() => gameDataRef.current.keys.right = true}
          onTouchEnd={() => gameDataRef.current.keys.right = false}
          className="px-6 py-4 text-lg"
        >
          →
        </Button>
      </div>
      <div className="flex gap-2">
        <Button
          onMouseDown={() => gameDataRef.current.keys.up = true}
          onMouseUp={() => gameDataRef.current.keys.up = false}
          onTouchStart={() => gameDataRef.current.keys.up = true}
          onTouchEnd={() => gameDataRef.current.keys.up = false}
          className="px-6 py-4 text-lg"
        >
          ↑
        </Button>
        <Button
          onMouseDown={() => gameDataRef.current.keys.down = true}
          onMouseUp={() => gameDataRef.current.keys.down = false}
          onTouchStart={() => gameDataRef.current.keys.down = true}
          onTouchEnd={() => gameDataRef.current.keys.down = false}
          className="px-6 py-4 text-lg"
        >
          ↓
        </Button>
      </div>
      <Button
        onMouseDown={() => gameDataRef.current.keys.space = true}
        onMouseUp={() => gameDataRef.current.keys.space = false}
        onTouchStart={() => gameDataRef.current.keys.space = true}
        onTouchEnd={() => gameDataRef.current.keys.space = false}
        className="px-8 py-4 text-lg bg-yellow-500 hover:bg-yellow-600"
      >
        Jump
      </Button>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-900 to-blue-950 p-4">
      <div className="w-full max-w-4xl">
        <h1 className="text-4xl font-bold text-white text-center mb-6">
          🦀 Underwater Consonants Adventure
        </h1>
        
        {gameState === 'menu' && (
          <div className="bg-blue-800 rounded-lg shadow-2xl p-8 text-center">
            <div className="text-6xl mb-6">🌊</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Welcome to the Underwater World!
            </h2>
            <p className="text-xl text-blue-200 mb-6">
              Help the crab collect all 37 Malayalam consonant pearls!
            </p>
            <div className="bg-blue-900 rounded p-4 mb-6 text-left">
              <p className="text-blue-100 mb-2"><strong>Controls:</strong></p>
              <p className="text-blue-200">• Arrow Keys / WASD - Move</p>
              <p className="text-blue-200">• Spacebar - Jump</p>
              <p className="text-blue-200">• Avoid corals and seaweed!</p>
              <p className="text-blue-200">• Collect all pearls for a perfect run!</p>
            </div>
            <Button
              onClick={startGame}
              className="px-8 py-4 text-xl bg-emerald-500 hover:bg-emerald-600"
            >
              Start Adventure
            </Button>
          </div>
        )}
        
        {gameState === 'playing' && (
          <>
            <canvas
              ref={canvasRef}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              className="border-4 border-blue-400 rounded-lg shadow-2xl bg-blue-950"
            />
            <MobileControls />
          </>
        )}
        
        {gameState === 'won' && (
          <div className="bg-emerald-800 rounded-lg shadow-2xl p-8 text-center">
            <div className="text-6xl mb-6">🏆</div>
            <h2 className="text-4xl font-bold text-white mb-4">
              {isPerfectRun ? 'Perfect Run! 🎖️' : 'Level Complete!'}
            </h2>
            <p className="text-2xl text-emerald-200 mb-4">
              Final Score: {score + (isPerfectRun ? 1000 : 0)}
            </p>
            <p className="text-xl text-emerald-300 mb-6">
              Letters Collected: {collectedLetters.length}/{MALAYALAM_CONSONANTS.length}
            </p>
            {isPerfectRun && (
              <p className="text-lg text-yellow-300 mb-6">
                ⭐ Bonus: +1000 points for perfect run!
              </p>
            )}
            <Button
              onClick={restartGame}
              className="px-8 py-4 text-xl bg-blue-500 hover:bg-blue-600"
            >
              Play Again
            </Button>
          </div>
        )}
        
        {gameState === 'lost' && (
          <div className="bg-red-800 rounded-lg shadow-2xl p-8 text-center">
            <div className="text-6xl mb-6">😢</div>
            <h2 className="text-4xl font-bold text-white mb-4">Game Over</h2>
            <p className="text-2xl text-red-200 mb-4">Final Score: {score}</p>
            <p className="text-xl text-red-300 mb-6">
              Letters Collected: {collectedLetters.length}/{MALAYALAM_CONSONANTS.length}
            </p>
            <Button
              onClick={restartGame}
              className="px-8 py-4 text-xl bg-blue-500 hover:bg-blue-600"
            >
              Try Again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UnderseaConsonantsGame;