import React, { useState, useEffect, useRef } from 'react';

const VowelLegoGame = () => {
  const canvasRef = useRef(null);
  const [blocks, setBlocks] = useState([]);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [score, setScore] = useState(0);
  const [animatingBlocks, setAnimatingBlocks] = useState([]);
  const [draggedBlock, setDraggedBlock] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  const vowels = [
    { vowel: 'അ', word: 'അണ്ണാൻ', meaning: 'Squirrel', emoji: '🐿️' },
    { vowel: 'ആ', word: 'ആമ', meaning: 'Tortoise', emoji: '🐢' },
    { vowel: 'ഇ', word: 'ഇല', meaning: 'Leaf', emoji: '🍃' },
    { vowel: 'ഈ', word: 'ഈച്ച', meaning: 'Fly', emoji: '🪰' },
    { vowel: 'ഉ', word: 'ഉണക്കം', meaning: 'Drying', emoji: '☀️' },
    { vowel: 'ഊ', word: 'ഊഞ്ഞാല്‍', meaning: 'Swing', emoji: '🎪' },
    { vowel: 'ഋ', word: 'ഋതു', meaning: 'Season', emoji: '🌸' },
    { vowel: 'എ', word: 'എലി', meaning: 'Rat', emoji: '🐀' },
    { vowel: 'ഏ', word: 'ഏണി', meaning: 'Ladder', emoji: '🪜' },
    { vowel: 'ഐ', word: 'ഐസ്', meaning: 'Ice', emoji: '🧊' },
    { vowel: 'ഒ', word: 'ഒട്ടകം', meaning: 'Camel', emoji: '🐫' },
    { vowel: 'ഓ', word: 'ഓല', meaning: 'Palm Leaf', emoji: '🌿' },
    { vowel: 'ഔ', word: 'ഔഷധം', meaning: 'Medicine', emoji: '💊' },
    { vowel: 'അം', word: 'അംഗം', meaning: 'Body Part', emoji: '🖐️' },
    { vowel: 'അഃ', word: 'അഃശുദ്ധം', meaning: 'Impure', emoji: '❌' },
  ];
  
  useEffect(() => {
    initializeBlocks();
  }, []);
  
  const initializeBlocks = () => {
    const newBlocks = [];
    const pileArea = { x: 150, y: 150, width: 500, height: 350 };
    
    vowels.forEach((vowelData, index) => {
      const copies = 2 + Math.floor(Math.random() * 2); // 2-3 copies
      
      for (let i = 0; i < copies; i++) {
        const angle = Math.random() * 0.4 - 0.2; // Random rotation
        newBlocks.push({
          id: `${vowelData.vowel}-${i}-${Date.now()}-${Math.random()}`,
          vowel: vowelData.vowel,
          x: pileArea.x + Math.random() * pileArea.width,
          y: pileArea.y + Math.random() * pileArea.height,
          width: 70,
          height: 70,
          rotation: angle,
          color: getColorForVowel(index),
          matched: false
        });
      }
    });
    
    // Shuffle blocks
    setBlocks(newBlocks.sort(() => Math.random() - 0.5));
  };
  
  const getColorForVowel = (index) => {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
      '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B88B', '#FAD7A0',
      '#AED6F1', '#A9DFBF', '#F9E79F', '#FAD7A0', '#D7BDE2'
    ];
    return colors[index % colors.length];
  };
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    drawGame(ctx);
    
    if (animatingBlocks.length > 0) {
      const animationId = requestAnimationFrame(animateMatching);
      return () => cancelAnimationFrame(animationId);
    }
  }, [blocks, selectedBlock, matchedPairs, animatingBlocks, draggedBlock]);
  
  const drawGame = (ctx) => {
    ctx.clearRect(0, 0, 800, 600);
    
    // Background
    const gradient = ctx.createLinearGradient(0, 0, 0, 600);
    gradient.addColorStop(0, '#E8F5E9');
    gradient.addColorStop(1, '#C8E6C9');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 600);
    
    // Ground
    ctx.fillStyle = '#8D6E63';
    ctx.fillRect(0, 520, 800, 80);
    
    // Bucket
    drawBucket(ctx, animatingBlocks.length > 0);
    
    // Draw blocks (non-matched and non-animating)
    blocks
      .filter(block => !block.matched && !animatingBlocks.find(ab => ab.id === block.id))
      .forEach(block => {
        drawLegoBlock(ctx, block, block.id === selectedBlock?.id);
      });
    
    // Draw animating blocks on top
    animatingBlocks.forEach(anim => {
      drawLegoBlock(ctx, anim.block, false);
    });
  };
  
  const drawBucket = (ctx, isOpen) => {
    const bucketX = 650;
    const bucketY = 400;
    const bucketWidth = 120;
    const bucketHeight = 100;
    
    // Bucket body
    ctx.fillStyle = '#795548';
    ctx.beginPath();
    ctx.moveTo(bucketX, bucketY);
    ctx.lineTo(bucketX + 20, bucketY + bucketHeight);
    ctx.lineTo(bucketX + bucketWidth - 20, bucketY + bucketHeight);
    ctx.lineTo(bucketX + bucketWidth, bucketY);
    ctx.closePath();
    ctx.fill();
    
    ctx.strokeStyle = '#5D4037';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Bucket rim
    ctx.fillStyle = '#6D4C41';
    ctx.fillRect(bucketX - 5, bucketY - 10, bucketWidth + 10, 15);
    ctx.strokeRect(bucketX - 5, bucketY - 10, bucketWidth + 10, 15);
    
    // Lid
    const lidY = isOpen ? bucketY - 40 : bucketY - 15;
    const lidRotation = isOpen ? -0.5 : 0;
    
    ctx.save();
    ctx.translate(bucketX + bucketWidth / 2, lidY);
    ctx.rotate(lidRotation);
    
    ctx.fillStyle = '#8D6E63';
    ctx.fillRect(-bucketWidth / 2 - 5, 0, bucketWidth + 10, 20);
    ctx.strokeStyle = '#5D4037';
    ctx.lineWidth = 2;
    ctx.strokeRect(-bucketWidth / 2 - 5, 0, bucketWidth + 10, 20);
    
    // Lid handle
    ctx.strokeStyle = '#5D4037';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 10, 15, Math.PI, 0, true);
    ctx.stroke();
    
    ctx.restore();
    
    // Label
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('മലയാളം', bucketX + bucketWidth / 2, bucketY + 50);
  };
  
  const drawLegoBlock = (ctx, block, isSelected) => {
    ctx.save();
    ctx.translate(block.x, block.y);
    ctx.rotate(block.rotation);
    
    // Shadow
    if (!isSelected) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(-block.width / 2 + 3, -block.height / 2 + 3, block.width, block.height);
    }
    
    // Main block
    ctx.fillStyle = block.color;
    ctx.fillRect(-block.width / 2, -block.height / 2, block.width, block.height);
    
    // Border
    ctx.strokeStyle = isSelected ? '#FFD700' : darkenColor(block.color, 20);
    ctx.lineWidth = isSelected ? 4 : 2;
    ctx.strokeRect(-block.width / 2, -block.height / 2, block.width, block.height);
    
    // LEGO studs (4 circles on top)
    ctx.fillStyle = darkenColor(block.color, 10);
    const studPositions = [
      [-15, -15], [15, -15], [-15, 15], [15, 15]
    ];
    
    studPositions.forEach(([sx, sy]) => {
      ctx.beginPath();
      ctx.arc(sx, sy, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = darkenColor(block.color, 30);
      ctx.lineWidth = 1;
      ctx.stroke();
    });
    
    // Vowel text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 28px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(block.vowel, 0, 0);
    
    // Selection glow
    if (isSelected) {
      ctx.strokeStyle = 'rgba(255, 215, 0, 0.5)';
      ctx.lineWidth = 8;
      ctx.strokeRect(-block.width / 2, -block.height / 2, block.width, block.height);
    }
    
    ctx.restore();
  };
  
  const darkenColor = (color, percent) => {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.max(0, (num >> 16) - amt);
    const G = Math.max(0, (num >> 8 & 0x00FF) - amt);
    const B = Math.max(0, (num & 0x0000FF) - amt);
    return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
  };
  
  const handleCanvasClick = (e) => {
    if (animatingBlocks.length > 0) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Find clicked block (check from top to bottom)
    const clickedBlock = [...blocks]
      .reverse()
      .find(block => {
        if (block.matched) return false;
        const dx = x - block.x;
        const dy = y - block.y;
        const cos = Math.cos(-block.rotation);
        const sin = Math.sin(-block.rotation);
        const rotatedX = dx * cos - dy * sin;
        const rotatedY = dx * sin + dy * cos;
        return Math.abs(rotatedX) <= block.width / 2 && Math.abs(rotatedY) <= block.height / 2;
      });
    
    if (clickedBlock) {
      if (!selectedBlock) {
        setSelectedBlock(clickedBlock);
      } else if (selectedBlock.id === clickedBlock.id) {
        setSelectedBlock(null);
      } else if (selectedBlock.vowel === clickedBlock.vowel) {
        // Match found!
        handleMatch(selectedBlock, clickedBlock);
      } else {
        setSelectedBlock(clickedBlock);
      }
    } else {
      setSelectedBlock(null);
    }
  };
  
  const handleMatch = (block1, block2) => {
    const vowelData = vowels.find(v => v.vowel === block1.vowel);
    
    // Play clapping sound (simulated)
    playClappingSound();
    
    // Start animation
    setAnimatingBlocks([
      { id: block1.id, block: { ...block1 }, progress: 0, targetY: 100 },
      { id: block2.id, block: { ...block2 }, progress: 0, targetY: 100 }
    ]);
    
    setSelectedBlock(null);
    
    // Add to matched pairs after animation
    setTimeout(() => {
      if (!matchedPairs.find(p => p.vowel === vowelData.vowel)) {
        setMatchedPairs(prev => [...prev, vowelData]);
        setScore(prev => prev + 10);
      }
      setAnimatingBlocks([]);
      setBlocks(prev => prev.map(b => 
        b.id === block1.id || b.id === block2.id ? { ...b, matched: true } : b
      ));
    }, 2000);
  };
  
  const playClappingSound = () => {
    // Create a simple beep sound
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
  };
  
  const animateMatching = () => {
    setAnimatingBlocks(prev => {
      return prev.map(anim => {
        const newProgress = anim.progress + 0.02;
        const targetX = 710;
        const targetY = 450;
        
        // First rise up, then move to bucket
        let newX, newY;
        if (newProgress < 0.3) {
          // Rise up phase
          const riseProgress = newProgress / 0.3;
          newY = anim.block.y - riseProgress * 150;
          newX = anim.block.x;
        } else {
          // Move to bucket phase
          const moveProgress = (newProgress - 0.3) / 0.7;
          const startY = anim.block.y - 150;
          newX = anim.block.x + (targetX - anim.block.x) * moveProgress;
          newY = startY + (targetY - startY) * moveProgress;
        }
        
        return {
          ...anim,
          progress: newProgress,
          block: { ...anim.block, x: newX, y: newY }
        };
      });
    });
  };
  
  const handleMouseDown = (e) => {
    if (animatingBlocks.length > 0) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const clickedBlock = [...blocks]
      .reverse()
      .find(block => {
        if (block.matched) return false;
        const dx = x - block.x;
        const dy = y - block.y;
        return Math.sqrt(dx * dx + dy * dy) <= block.width / 2;
      });
    
    if (clickedBlock) {
      setDraggedBlock(clickedBlock);
      setDragOffset({ x: x - clickedBlock.x, y: y - clickedBlock.y });
    }
  };
  
  const handleMouseMove = (e) => {
    if (!draggedBlock) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setBlocks(prev => prev.map(block =>
      block.id === draggedBlock.id
        ? { ...block, x: x - dragOffset.x, y: y - dragOffset.y }
        : block
    ));
  };
  
  const handleMouseUp = () => {
    setDraggedBlock(null);
  };
  
  const resetGame = () => {
    setSelectedBlock(null);
    setMatchedPairs([]);
    setScore(0);
    setAnimatingBlocks([]);
    initializeBlocks();
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 via-blue-100 to-purple-100 p-4">
      <div className="flex gap-6 max-w-7xl w-full">
        {/* Game Canvas */}
        <div className="flex-1 bg-white rounded-2xl shadow-2xl p-6 border-4 border-green-400">
          <div className="mb-4 text-center">
            <h1 className="text-3xl font-bold text-green-800 mb-2">
              മലയാളം സ്വരം LEGO Match
            </h1>
            <h2 className="text-xl font-semibold text-blue-600">
              Malayalam Vowel LEGO Matching Game
            </h2>
          </div>
          
          <div className="mb-4 flex justify-between items-center bg-gradient-to-r from-yellow-100 to-green-100 rounded-lg p-3 border-2 border-yellow-300">
            <div className="text-lg font-bold text-gray-700">
              Score: {score}
            </div>
            <div className="text-lg font-bold text-gray-700">
              Matched: {matchedPairs.length} / {vowels.length}
            </div>
            <button
              onClick={resetGame}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-2 px-4 rounded-lg shadow transition-all"
            >
              🔄 Reset
            </button>
          </div>
          
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            onClick={handleCanvasClick}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="border-4 border-green-400 rounded-lg cursor-pointer shadow-xl"
          />
          
          <div className="mt-4 bg-blue-50 rounded-lg p-3 border-2 border-blue-200">
            <p className="text-sm text-gray-700">
              <strong>📖 How to Play:</strong> Click two matching vowel blocks to pair them! 
              Drag blocks to see hidden vowels. Matched pairs fly to the bucket! 🪣
            </p>
          </div>
        </div>
        
        {/* Matched Pairs Sidebar */}
        <div className="w-80 bg-white rounded-2xl shadow-2xl p-6 border-4 border-purple-400">
          <h3 className="text-2xl font-bold text-purple-800 mb-4 text-center">
            Matched Pairs 🎉
          </h3>
          
          <div className="space-y-3 max-h-[650px] overflow-y-auto">
            {matchedPairs.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <div className="text-4xl mb-2">🎯</div>
                <p>Start matching vowels!</p>
              </div>
            ) : (
              matchedPairs.map((pair, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-3 border-2 border-purple-300 shadow-md hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-3xl font-bold text-purple-600 min-w-[40px]">
                      {pair.vowel}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-gray-800">
                        {pair.vowel} - {pair.word}
                      </div>
                      <div className="text-sm text-gray-600">
                        {pair.meaning}
                      </div>
                    </div>
                    <div className="text-4xl">
                      {pair.emoji}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {matchedPairs.length === vowels.length && (
            <div className="mt-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-lg p-4 text-center border-4 border-yellow-300">
              <div className="text-3xl mb-2">🏆</div>
              <div className="text-xl font-bold text-white">
                Congratulations!
              </div>
              <div className="text-white font-semibold">
                All vowels matched!
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VowelLegoGame;