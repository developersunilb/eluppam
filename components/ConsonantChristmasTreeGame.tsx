'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Image from 'next/image';


const ChristmasTreeGame = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState('ready'); // ready, aiming, shooting, hit
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [litBaubles, setLitBaubles] = useState<string[]>([]);
  const [targetConsonant, setTargetConsonant] = useState('');
  const [feedback, setFeedback] = useState('');
  const [starLit, setStarLit] = useState(false);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [shuffledSwitchConsonants, setShuffledSwitchConsonants] = useState<string[]>([]);
  const [switchStates, setSwitchStates] = useState<boolean[]>([false, false, false, false, false]);
  
  const consonants = useMemo(() => ['ട', 'ഠ', 'ഡ', 'ഢ', 'ണ'], []);
  
  // Bauble positions on the tree
  const baublePositions = [
    { x: 400, y: 180, letter: '' }, // Top center
    { x: 340, y: 260, letter: '' }, // Second row left
    { x: 445, y: 260, letter: '' }, // Second row right
    { x: 320, y: 360, letter: '' }, // Third row left
    { x: 480, y: 360, letter: '' }, // Third row right
  ];
  
  const [baubles, setBaubles] = useState<{ letter: string; lit: boolean; x: number; y: number; }[]>([]);
  
  const initializeGame = useCallback(() => {
    // Shuffle consonants for the switch panel
    const shuffledForSwitches = [...consonants].sort(() => Math.random() - 0.5);
    setShuffledSwitchConsonants(shuffledForSwitches);

    // Assign baubles in fixed order for the tree
    const newBaubles = baublePositions.map((pos, i) => ({
      ...pos,
      letter: consonants[i], // Assign baubles in fixed order
      lit: false
    }));
    setBaubles(newBaubles);

    setTargetConsonant(consonants[0]); // Set first target from fixed order
    setFeedback(`Light up: ${consonants[0]}`);
    setLitBaubles([]);
    setStarLit(false);
    setSwitchStates([false, false, false, false, false]); // Reset all switches to off
    setIsGameComplete(false); // Reset game completion status
  }, [consonants, setSwitchStates, setShuffledSwitchConsonants]);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);
  
  const drawBackgroundStars = useCallback((ctx: CanvasRenderingContext2D) => {
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
  }, []);
  
  const drawBauble = useCallback((ctx: CanvasRenderingContext2D, bauble: { letter: string; lit: boolean; x: number; y: number; }) => {
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
  }, [litBaubles, targetConsonant]);
  
  const drawStar = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, lit: boolean) => {
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
  }, []);
  
  const drawGame = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, 800, 600);
    
    drawBackgroundStars(ctx);
    
    baubles.forEach(bauble => drawBauble(ctx, bauble));
    
    drawStar(ctx, 395, 70, starLit);
    
    
  }, [drawBackgroundStars, baubles, drawBauble, drawStar, starLit]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    drawGame(ctx as CanvasRenderingContext2D);
    
  }, [drawGame]);
  
  const handleLightSwitchLogic = useCallback((clickedConsonant: string) => {
    if (clickedConsonant !== targetConsonant) {
      setFeedback(`Wrong switch! Try again for '${targetConsonant}'`);
      return;
    }

    if (!targetConsonant) {
      setFeedback('All baubles are already lit! Starting new game...');
      setTimeout(() => initializeGame(), 1500);
      return;
    }

    setLitBaubles(prevLit => {
      const newLitBaubles = [...prevLit, clickedConsonant];
      setTimeout(() => {
        const available = baubles.filter(b => !newLitBaubles.includes(b.letter));
        if (available.length === 0) {
          setStarLit(true);
          setFeedback('🎄✨ All baubles lit! The star shines bright! ✨🎄');
          setIsGameComplete(true); // Set game as complete
          // Removed setTimeout for auto-reset
        } else {
          const currentTargetIndex = consonants.indexOf(clickedConsonant);
          const nextTargetIndex = currentTargetIndex + 1;

          if (nextTargetIndex < consonants.length) {
            const newTarget = consonants[nextTargetIndex];
            setTargetConsonant(newTarget);
            setFeedback(`Light up: ${newTarget}`);
          } else {
            // This case should ideally be caught by available.length === 0,
            // but as a fallback, if all are lit and we somehow get here,
            // it means all baubles are lit.
            setStarLit(true);
            setFeedback('🎄✨ All baubles lit! The star shines bright! ✨🎄');
            setIsGameComplete(true);
            // Removed setTimeout for auto-reset
          }
        }
      }, 1000);
      return newLitBaubles;
    });
    setScore(prev => prev + 10);
    setFeedback(`✨ Bauble '${clickedConsonant}' lit!`);
  }, [baubles, targetConsonant, initializeGame]);

  const handleSwitchClick = useCallback((clickedConsonant: string, index: number) => {
    // Turn on the clicked switch visually
    setSwitchStates(prev => {
      const newStates = [...prev];
      newStates[index] = true;
      return newStates;
    });

    // Call the bauble lighting logic
    handleLightSwitchLogic(clickedConsonant);

    // If the clicked consonant is wrong, turn off the switch after a short delay
    if (clickedConsonant !== targetConsonant) {
      setTimeout(() => {
        setSwitchStates(prev => {
          const newStates = [...prev];
          newStates[index] = false;
          return newStates;
        });
      }, 1000); // Turn off after 1 second
    }
  }, [handleLightSwitchLogic, targetConsonant]);

  const handleRetry = useCallback(() => {
    initializeGame();
  }, [initializeGame]);

  const handlePlayNext = useCallback(() => {
    setLevel(prev => prev + 1);
    setScore(prev => prev + 100);
    initializeGame();
  }, [initializeGame]);

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
            {feedback || 'Use the light switch to light up the baubles!'}
          </div>
        </div>
        
                <div className="flex justify-center">
                  <div className="relative w-[800px] h-[600px] bg-contain bg-center bg-no-repeat"
                       style={{ backgroundImage: `url('/game/assets/image/xmastree/xmastree.png')` }}>
                    <canvas
                      ref={canvasRef}
                      width={800}
                      height={600}
                      className="border-4 border-yellow-400 rounded-lg shadow-2xl bg-transparent"
                    />
                    {/* Light Switch Panel */}
                    <div className="absolute bottom-4 right-4 z-20 w-[250px] h-[100px] bg-cover bg-center flex items-end justify-around p-2"
                         style={{ backgroundImage: `url('/game/assets/image/xmastree/blankpanel.png')` }}>
                      {/* 5 equally spaced vertical rectangular containers */}
                                  {shuffledSwitchConsonants.map((consonant, i) => (
                                    <div key={i} className="flex flex-col items-center cursor-pointer"
                                         onClick={() => handleSwitchClick(consonant, i)}>
                                      <span className="text-white text-lg font-bold mb-1">{consonant}</span>
                                      <div className="w-10 h-16 bg-cover bg-center"
                                           style={{ backgroundImage: `url('/game/assets/image/xmastree/${switchStates[i] ? 'SwitchOn.png' : 'SwitchOff.png'}')` }}>
                                      </div>
                                    </div>
                                  ))}                    </div>
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
        <div className="mt-4 text-center text-white">
          <p className="text-sm mt-1 font-semibold">✨ Lit baubles: {litBaubles.join(', ') || 'None yet'}</p>
        </div>
      </div>
    </div>
  );
};

export default ChristmasTreeGame;