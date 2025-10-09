import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useProgress } from '@/context/ProgressContext';
import MobileGameControls from './MobileGameControls';
import Image from 'next/image';

// --- Constants ---
export const MALAYALAM_CONSONANTS = [
  'ക', 'ഖ', 'ഗ', 'ഘ', 'ങ', 'ച', 'ഛ', 'ജ', 'ഝ', 'ഞ', 'ട', 'ഠ', 'ഡ', 'ഢ', 'ണ',
  'ത', 'ഥ', 'ദ', 'ധ', 'ന', 'പ', 'ഫ', 'ബ', 'ഭ', 'മ', 'യ', 'ര', 'ല', 'വ',
  'ശ', 'ഷ', 'സ', 'ഹ', 'ള', 'ഴ', 'റ'
];
const GOOD_COLORS = ['#22c55e', '#3b82f6', '#8b5cf6', '#eab308']; // Green, Blue, Purple, Yellow
const BLACK_HOLE_COLOR = '#000000';
const ACCRETION_DISK_COLOR = '#FFA500'; // Glowing Orange
const NEON_CYAN = '#00ffff';
const MAX_LIVES = 5;
const BONUS_POINTS_PERFECT_RUN = 500;

const ConsonantGame = () => {
  // --- Refs ---
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<any>(null);
  const animationFrameId = useRef<number | null>(null);

  // Audio Refs
  const bgmusicAudioRef = useRef<HTMLAudioElement>(null);
  const jumpAudioRef = useRef<HTMLAudioElement>(null);
  const collectAudioRef = useRef<HTMLAudioElement>(null);
  const failAudioRef = useRef<HTMLAudioElement>(null);
  const successAudioRef = useRef<HTMLAudioElement>(null);

  // State
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [gameOver, setGameOver] = useState(false);
  const [levelComplete, setLevelComplete] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [gameSummary, setGameSummary] = useState<{ collected: string[]; missed: string[]; hasBadge: boolean }>({ collected: [], missed: [], hasBadge: false });

  // Mobile controls state
  const [isUpPressed, setIsUpPressed] = useState(false);
  const [isLeftPressed, setIsLeftPressed] = useState(false);
  const [isRightPressed, setIsRightPressed] = useState(false);

  const isPlayingRef = useRef(isPlaying);
  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);
  const gameOverRef = useRef(gameOver);
  useEffect(() => { gameOverRef.current = gameOver; }, [gameOver]);

  const resetGame = useCallback(() => {
    setGameOver(false);
    setLevelComplete(false);
    setIsPlaying(false);
    setScore(0);
    setLives(MAX_LIVES);
    setGameSummary({ collected: [], missed: [], hasBadge: false });

    bgmusicAudioRef.current?.pause();

    const canvas = canvasRef.current;
    if (!canvas) return;

    gameRef.current = {
        player: { x: 100, y: canvas.height / 2, width: 40, height: 20, velocityY: 0, invincibility: 0, isJumping: false },
        obstacles: [],
        floatingLetters: [],
        stars: [],
        collectedConsonants: [],
        camera: { x: 0 },
        keys: { up: false, down: false },
        verticalSpeed: 0.8,
        jumpPower: -13,
        gameSpeed: 3,
        levelEndX: 0,
    };

    for (let i = 0; i < 100; i++) {
        gameRef.current.stars.push({
            x: Math.random() * canvas.width * 2,
            y: Math.random() * canvas.height,
            speed: Math.random() * 0.5 + 0.25,
            size: Math.random() * 2 + 1,
            opacity: Math.random() * 0.5 + 0.2
        });
    }

    let currentX = 400;
    let lastObstacleX = 0;
    MALAYALAM_CONSONANTS.forEach((consonant, index) => {
        const planetX = currentX + 300 + Math.random() * 100;
        const planetY = Math.random() * (canvas.height - 100) + 50;
        gameRef.current.obstacles.push({ x: planetX, y: planetY, radius: 25, type: 'planet', color: GOOD_COLORS[index % GOOD_COLORS.length], letter: consonant });
        currentX = planetX;
        lastObstacleX = currentX;

        if (index > 0 && index % 3 === 0) {
            const blackHoleX = currentX + 200 + Math.random() * 100;
            const blackHoleY = Math.random() * (canvas.height - 100) + 50;
            gameRef.current.obstacles.push({ x: blackHoleX, y: blackHoleY, radius: 20, type: 'black_hole' });
            currentX = blackHoleX;
            lastObstacleX = currentX;
        }
    });
    gameRef.current.levelEndX = lastObstacleX;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const drawHearts = (ctx: CanvasRenderingContext2D) => {
        for (let i = 0; i < MAX_LIVES; i++) {
            const x = 30 + i * 35;
            const y = 40;
            ctx.save();
            ctx.fillStyle = 'red';
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 2;
            ctx.shadowColor = 'red';
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.bezierCurveTo(x, y - 10, x - 15, y - 10, x - 15, y);
            ctx.bezierCurveTo(x - 15, y + 10, x, y + 15, x, y + 25);
            ctx.bezierCurveTo(x, y + 15, x + 15, y + 10, x + 15, y);
            ctx.bezierCurveTo(x + 15, y - 10, x, y - 10, x, y);
            ctx.closePath();
            if (i < lives) {
                ctx.fill();
            } else {
                ctx.stroke();
            }
            ctx.restore();
        }
    }

    const render = () => {
        if (!gameRef.current || !canvasRef.current) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const game = gameRef.current;

        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#FFFFFF';
        game.stars.forEach((star: any) => {
            ctx.globalAlpha = star.opacity;
            ctx.fillRect(star.x - game.camera.x, star.y, star.size, star.size);
        });
        ctx.globalAlpha = 1;

        ctx.save();
        ctx.strokeStyle = NEON_CYAN;
        ctx.shadowColor = NEON_CYAN;
        ctx.shadowBlur = 10;
        ctx.globalAlpha = 0.3;
        const gridSize = 50;
        const offsetX = game.camera.x % gridSize;
        for (let i = 0; i < canvas.width / gridSize + 2; i++) {
            ctx.beginPath();
            ctx.moveTo(i * gridSize - offsetX, 0);
            ctx.lineTo(i * gridSize - offsetX, canvas.height);
            ctx.stroke();
        }
        for (let i = 0; i < canvas.height / gridSize + 1; i++) {
            const offsetY = (game.player.y * 0.1) % gridSize;
            ctx.beginPath();
            ctx.moveTo(game.camera.x, i * gridSize - offsetY);
            ctx.lineTo(game.camera.x + canvas.width, i * gridSize - offsetY);
            ctx.stroke();
        }
        ctx.restore();

        ctx.save();
        ctx.translate(-game.camera.x, 0);

        game.obstacles.forEach((obstacle: any) => {
            if (obstacle.type === 'planet') {
                ctx.fillStyle = obstacle.color;
                ctx.shadowColor = obstacle.color;
                ctx.shadowBlur = 15;
                ctx.beginPath();
                ctx.arc(obstacle.x, obstacle.y, obstacle.radius, 0, Math.PI * 2);
                ctx.fill();
            } else if (obstacle.type === 'black_hole') {
                ctx.strokeStyle = ACCRETION_DISK_COLOR;
                ctx.lineWidth = 12; // Thicker ring
                ctx.shadowColor = ACCRETION_DISK_COLOR;
                ctx.shadowBlur = 15;
                ctx.beginPath();
                ctx.arc(obstacle.x, obstacle.y, obstacle.radius, 0, Math.PI * 2);
                ctx.stroke();
                ctx.shadowBlur = 0;
                ctx.fillStyle = BLACK_HOLE_COLOR;
                ctx.beginPath();
                ctx.arc(obstacle.x, obstacle.y, obstacle.radius - 6, 0, Math.PI * 2);
                ctx.fill();
            }
        });
        ctx.shadowBlur = 0;

        game.floatingLetters.forEach((letter: any) => {
            ctx.fillStyle = `rgba(255, 255, 255, ${letter.life / 120})`;
            ctx.font = "120px Noto Serif Malayalam";
            ctx.textAlign = "center";
            ctx.shadowColor = '#FFFFFF';
            ctx.shadowBlur = 10;
            ctx.fillText(letter.letter, letter.x, letter.y);
        });
        ctx.shadowBlur = 0;

        const player = game.player;
        ctx.save();
        ctx.translate(player.x + player.width / 2, player.y + player.height / 2);
        if (player.invincibility > 0 && Math.floor(player.invincibility / 10) % 2 === 0) {
        } else {
            ctx.shadowColor = '#10B981';
            ctx.shadowBlur = 20;
            ctx.fillStyle = '#cccccc';
            ctx.beginPath();
            ctx.ellipse(0, 5, player.width / 2, player.height / 2, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#10B981';
            ctx.beginPath();
            ctx.arc(0, 0, player.width / 4, 0, Math.PI, true);
            ctx.fill();
        }
        ctx.restore();
        ctx.shadowBlur = 0;

        ctx.restore();

        drawHearts(ctx);
    };

    const update = () => {
        if (!gameRef.current) return;
        const game = gameRef.current;
        const player = game.player;

        if (player.invincibility > 0) player.invincibility--;

        const isGameActive = isPlaying && !gameOver && !levelComplete;

        if (isGameActive) {
            if (game.keys.up || isUpPressed) player.velocityY -= game.verticalSpeed;
            if (game.keys.down || isLeftPressed) player.velocityY += game.verticalSpeed;
            if (isRightPressed) {
                // Trigger jump only once per press
                if (!game.player.isJumping) {
                    jumpAudioRef.current?.play();
                    player.velocityY = game.jumpPower;
                    game.player.isJumping = true; // Set a flag to prevent continuous jumping
                }
            } else {
                game.player.isJumping = false; // Reset jump flag when button is released
            }
        }
        
        player.velocityY *= 0.94;
        player.y += player.velocityY;

        if (player.y < 0) {
            player.y = 0;
            player.velocityY = 0;
        }
        if (player.y > canvas.height - player.height) {
            player.y = canvas.height - player.height;
            player.velocityY = 0;
        }

        if (isGameActive) {
            player.x += game.gameSpeed;
        }

        game.camera.x = player.x - 150;

        game.stars.forEach((star: any) => {
            star.x -= star.speed * game.gameSpeed;
            if (star.x < game.camera.x) {
                star.x = game.camera.x + canvas.width + Math.random() * 100;
                star.y = Math.random() * canvas.height;
            }
        });

        if (isGameActive) {
            let collectedObstacleIndex = -1;
            game.obstacles.forEach((obstacle: any, index: number) => {
                const closestX = Math.max(player.x, Math.min(obstacle.x, player.x + player.width));
                const closestY = Math.max(player.y, Math.min(obstacle.y, player.y + player.height));
                const dx = obstacle.x - closestX;
                const dy = obstacle.y - closestY;
                const distanceSquared = (dx * dx) + (dy * dy);

                if (distanceSquared < (obstacle.radius * obstacle.radius)) {
                    if (obstacle.type === 'black_hole' && player.invincibility === 0) {
                        failAudioRef.current?.play();
                        const newLives = lives - 1;
                        if (newLives <= 0) {
                            setLives(0);
                            setGameOver(true);
                            setIsPlaying(false);
                            bgmusicAudioRef.current?.pause();
                        } else {
                            setLives(newLives);
                            gameRef.current.player.invincibility = 180;
                        }
                    } else if (obstacle.type === 'planet') {
                        collectAudioRef.current?.play();
                        game.floatingLetters.push({ x: obstacle.x, y: obstacle.y, letter: obstacle.letter, life: 120 });
                        game.collectedConsonants.push(obstacle.letter);
                        collectedObstacleIndex = index;
                    }
                }
            });

            if (collectedObstacleIndex > -1) {
                game.obstacles.splice(collectedObstacleIndex, 1);
            }

            if (player.x > game.levelEndX + 400) {
                const missed = MALAYALAM_CONSONANTS.filter(c => !game.collectedConsonants.includes(c));
                const currentLives = lives; // Capture current lives
                const hasBadge = missed.length === 0 && currentLives === MAX_LIVES; // Use captured lives
                setGameSummary({ collected: game.collectedConsonants, missed, hasBadge });
                setScore(prevScore => prevScore + (hasBadge ? BONUS_POINTS_PERFECT_RUN : 0)); // Add bonus points
                setLevelComplete(true);
                setIsPlaying(false);
                bgmusicAudioRef.current?.pause();
                successAudioRef.current?.play();
            }

            game.floatingLetters.forEach((letter: any) => { letter.y -= 0.5; letter.life--; });
            game.floatingLetters = game.floatingLetters.filter((l: any) => l.life > 0);

            setScore(Math.floor(player.x / 10));
        }
    };

    const gameLoop = () => {
      update();
      render();
      animationFrameId.current = requestAnimationFrame(gameLoop);
    };

    animationFrameId.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [isPlaying, gameOver, levelComplete, lives, resetGame, isUpPressed, isLeftPressed, isRightPressed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = 800;
    canvas.height = 400;

    resetGame();

    const handleJump = () => {
        if (!gameRef.current || !isPlayingRef.current || gameOverRef.current) return;
        jumpAudioRef.current?.play();
        gameRef.current.player.velocityY = gameRef.current.jumpPower;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleJump();
      }
      if (gameRef.current && gameRef.current.keys) {
        if (e.code === 'ArrowUp') { e.preventDefault(); gameRef.current.keys.up = true; }
        if (e.code === 'ArrowDown') { e.preventDefault(); gameRef.current.keys.down = true; }
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
        if (gameRef.current && gameRef.current.keys) {
            if (e.code === 'ArrowUp') gameRef.current.keys.up = false;
            if (e.code === 'ArrowDown') gameRef.current.keys.down = false;
        }
    }

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [resetGame]);

  const startGame = () => {
    if (gameOver || levelComplete) {
        resetGame();
    }
    setIsPlaying(true);
    if (bgmusicAudioRef.current) {
      bgmusicAudioRef.current.currentTime = 0;
      bgmusicAudioRef.current.play().catch(e => console.error("Audio play failed:", e));
    }
  };

  const pauseGame = () => {
    setIsPlaying(false);
    bgmusicAudioRef.current?.pause();
  };

  const toggleMute = () => {
    const allAudio = [bgmusicAudioRef, jumpAudioRef, collectAudioRef, failAudioRef, successAudioRef];
    const newMuted = !isMuted;
    allAudio.forEach(ref => {
        if(ref.current) ref.current.muted = newMuted;
    });
    setIsMuted(newMuted);
  };

  const router = useRouter();
  const { updateModuleProgress, updateLessonProgress } = useProgress();

  const handleNextLevelUnlock = () => {
    // Mark the current game (consonant-runner) as completed
    updateLessonProgress('games', 'consonant-runner', true, score); // Mark 'consonant-runner' lesson as completed within 'games' module
    router.push('/games?completed=consonant-runner'); // Navigate back to the level selection page
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-900 text-white p-4 pt-4">
      <audio ref={bgmusicAudioRef} src="/audio/bgmusic.mp3" loop />
      <audio ref={jumpAudioRef} src="/audio/springjump.mp3" />
      <audio ref={collectAudioRef} src="/audio/collect.mp3" />
      <audio ref={failAudioRef} src="/audio/fail.mp3" />
      <audio ref={successAudioRef} src="/audio/successfinish.mp3" />

      <div className="mb-4 text-center">
        <h1 className="text-4xl font-bold text-emerald-400">Consonants വ്യഞ്ജനാക്ഷരങ്ങൾ Runner</h1>
      </div>

      <div className="flex gap-8 mb-4 text-lg font-mono justify-center">
        <div>Score: <span className="text-emerald-400">{score}</span></div>
        <div>Consonants: <span className="text-blue-400">{gameSummary.collected.length > 0 ? gameSummary.collected.length : (gameRef.current?.collectedConsonants.length || 0)} / {MALAYALAM_CONSONANTS.length}</span></div>
      </div>

      <div className="mb-4 border-4 border-gray-700 rounded-lg overflow-hidden shadow-lg w-full max-w-[800px]">
        <canvas ref={canvasRef} className="w-full h-auto cursor-pointer" />
        {(gameOver || levelComplete) && (
          <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center text-center p-4">
            {gameOver && (
              <div>
                <h2 className="font-bold text-red-500 mb-4 [font-size:clamp(1.5rem,6vw,2.25rem)]">Game Over</h2>
                <button onClick={startGame} className="px-6 py-3 bg-emerald-500 text-white font-bold rounded-lg [font-size:clamp(1rem,4vw,1.125rem)]">
                  Try Again
                </button>
              </div>
            )}
            {levelComplete && (
              <div className="bg-gray-800 p-1 sm:p-4 rounded-lg shadow-2xl max-w-lg w-full relative">
                <h2 className="font-bold text-green-400 mb-1 [font-size:clamp(0.9rem,3.5vw,1.3rem)]">Great job!</h2>
                {gameSummary.hasBadge ? (
                    <p className="mb-2 [font-size:clamp(0.65rem,2vw,0.8rem)]">You&apos;ve earned the Consonants Badge for a perfect run!</p>
                ) : (
                    <p className="mb-2 [font-size:clamp(0.65rem,2vw,0.8rem)]">Try to get all of them next time and earn a consonants badge.</p>
                )}
                {gameSummary.hasBadge && (
                    <div className="mb-2 p-1 bg-yellow-600 text-white rounded-lg [font-size:clamp(0.8rem,3vw,1rem)] font-bold">
                        Consonants Badge Earned! (+{BONUS_POINTS_PERFECT_RUN} points)
                    </div>
                )}
                <div className="text-left text-xs sm:text-sm">
                    <h3 className="font-semibold mb-1 [font-size:clamp(0.8rem,3vw,0.95rem)] text-blue-300">Collected: {gameSummary.collected.length}</h3>
                    <div className="flex flex-wrap gap-1 mb-2">
                        {gameSummary.collected.map(c => <span key={c} className="p-0.5 sm:p-1 bg-green-600 rounded [font-size:clamp(0.65rem,3vw,1rem)]">{c}</span>)}
                    </div>
                    {gameSummary.missed.length > 0 && (<>
                        <h3 className="font-semibold mb-1 [font-size:clamp(0.8rem,3vw,0.95rem)] text-red-400">Missed: {gameSummary.missed.length}</h3>
                        <div className="flex flex-wrap gap-1">
                            {gameSummary.missed.map(c => <span key={c} className="p-0.5 sm:p-1 bg-red-700 rounded [font-size:clamp(0.65rem,3vw,1rem)]">{c}</span>)}
                        </div>
                    </>)}
                </div>
                <button
                    onClick={handleNextLevelUnlock}
                    className="mt-2 sm:mt-4 px-4 py-2 bg-green-500 text-white font-bold rounded-lg [font-size:clamp(0.8rem,3vw,0.95rem)]"
                >
                    Congrats, Next Level Unlocked!
                </button>
                {gameSummary.hasBadge && (
                    <div className="absolute bottom-2 right-2 w-16 h-16 sm:w-20 sm:h-20 z-0">
                        <Image src="/badges/kaabadge.png" alt="Consonants Badge" fill className="absolute inset-0 w-full h-full" />
                        <div className="absolute inset-0 flex items-center justify-center text-blue-700 font-bold text-2xl sm:text-3xl z-10 shadow-blue-500 shadow-lg">ക</div>
                    </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-4 items-center justify-center">
        {!isPlaying && !gameOver && !levelComplete ? (
          <button onClick={startGame} className="w-24 h-24 flex items-center justify-center bg-emerald-500 rounded-full text-white shadow-lg" title="Start Game">
            <Play size={40} />
          </button>
        ) : null}
        {isPlaying && (
          <button onClick={pauseGame} className="w-24 h-24 flex items-center justify-center bg-yellow-500 rounded-full text-white shadow-lg" title="Pause Game">
            <Pause size={40} />
          </button>
        )}
        <button onClick={resetGame} className="w-16 h-16 flex items-center justify-center bg-gray-700 rounded-full text-white shadow-lg" title="Reset Game">
            <RotateCcw size={28} />
        </button>
        <button onClick={toggleMute} className="w-16 h-16 flex items-center justify-center bg-blue-500 rounded-full text-white shadow-lg" title={isMuted ? 'Unmute' : 'Mute'}>
          {isMuted ? <VolumeX size={28} /> : <Volume2 size={28} />}
        </button>
      </div>

      {/* Mobile Game Controls */}
      <MobileGameControls
        onUpPress={() => setIsUpPressed(true)}
        onUpRelease={() => setIsUpPressed(false)}
        onLeftPress={() => setIsLeftPressed(true)}
        onLeftRelease={() => setIsLeftPressed(false)}
        onRightPress={() => setIsRightPressed(true)}
        onRightRelease={() => setIsRightPressed(false)}
      />
    </div>
  );
};

export default ConsonantGame;
