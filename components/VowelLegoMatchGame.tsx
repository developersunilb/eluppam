'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

interface Block {
  id: string;
  vowel: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  color: string;
  matched: boolean;
  opacity: number;
  scale: number;
}

interface VowelData {
  vowel: string;
  word: string;
  meaning: string;
  emoji: string;
}

const VowelLegoGame = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const treasureChestImageRef = useRef<HTMLImageElement | null>(null); // Ref for the closed treasure chest image
  const treasureChestOpenImageRef = useRef<HTMLImageElement | null>(null); // Ref for the open treasure chest image
  const chestOpenAudioRef = useRef<HTMLAudioElement | null>(null);
  const chestCloseAudioRef = useRef<HTMLAudioElement | null>(null);
  const isProcessingMatch = useRef(false); // Use useRef for synchronous updates
  const [isBoxOpen, setIsBoxOpen] = useState(false); // State for the treasure chest
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<VowelData[]>([]);
  const [score, setScore] = useState(0);
  const [animatingBlocks, setAnimatingBlocks] = useState<{ id: string; block: Block; progress: number }[]>([]);
  const [draggedBlock, setDraggedBlock] = useState<Block | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isSorted, setIsSorted] = useState(false); // New state for sorting
  const [isLoading, setIsLoading] = useState(true);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const canvasWrapperRef = useRef<HTMLDivElement>(null);
  
  // Custom Malayalam vowel order
  const malayalamVowelOrder = [
    'അ', 'ആ', 'ഇ', 'ഈ', 'ഉ', 'ഊ', 'ഋ', 'എ', 'ഏ', 'ഐ', 'ഒ', 'ഓ', 'ഔ', 'അം', 'അഃ'
  ];

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
    const loadAssets = async () => {
      const closedImgPromise = new Promise<HTMLImageElement>((resolve) => {
        const img = new Image();
        img.src = '/game/assets/image/legovowel/boxclose.png';
        img.onload = () => resolve(img);
      });

      const openImgPromise = new Promise<HTMLImageElement>((resolve) => {
        const img = new Image();
        img.src = '/game/assets/image/legovowel/boxopen.png';
        img.onload = () => resolve(img);
      });

      const [closedImg, openImg] = await Promise.all([closedImgPromise, openImgPromise]);

      treasureChestImageRef.current = closedImg;
      treasureChestOpenImageRef.current = openImg;

      chestOpenAudioRef.current = new Audio('/audio/chestopenfinal.mp3');
      chestCloseAudioRef.current = new Audio('/audio/chestclose.mp3');
      
      initializeBlocks();
      setIsLoading(false);
    };

    if (typeof window !== 'undefined') {
      loadAssets();
    }
  }, []);
  
    const initializeBlocks = () => {
  
      const newBlocks: Block[] = [];
  
      const heapBaseX = canvasSize.width * (200 / 800);
      const heapBaseY = canvasSize.height * (500 / 600);
      const heapWidth = canvasSize.width * (300 / 800);
      const heapHeight = canvasSize.height * (200 / 600);
  
      const maxAttempts = 100; // Max attempts to find a non-colliding position
  
  
  
      vowels.forEach((vowelData: VowelData, index: number) => {
  
        const copies = 2 + Math.floor(Math.random() * 2); // 2-3 copies
  
  
  
        for (let i = 0; i < copies; i++) {
  
          let blockX, blockY, isColliding;
  
          const angle = Math.random() * 0.4 - 0.2; // Random rotation
  
          let attempts = 0;
  
  
  
          do {
  
            isColliding = false;
  
            attempts++;
  
            // Calculate y position: closer to the base
  
            blockY = heapBaseY - Math.random() * heapHeight;
  
  
  
            // Calculate x position based on y to form a triangle
  
            const yRatio = (heapBaseY - blockY) / heapHeight; // 0 at bottom, 1 at top
  
            const currentWidth = heapWidth * (1 - yRatio * 0.8); // Reduce width towards top
  
            const minX = heapBaseX - currentWidth / 2;
  
            blockX = minX + Math.random() * currentWidth;
  
  
  
            // Check for collisions with existing blocks
  
            for (const existingBlock of newBlocks) {
  
              const dx = existingBlock.x - blockX;
  
              const dy = existingBlock.y - blockY;
  
              const distance = Math.sqrt(dx * dx + dy * dy);
  
              if (distance < existingBlock.width) { // A simple circular collision detection
  
                isColliding = true;
  
                break;
  
              }
  
            }
  
          } while (isColliding && attempts < maxAttempts);
  
  
  
          if (attempts >= maxAttempts) {
  
            console.warn('Could not find a non-colliding position for a block.');
  
          }
  
  
  
          newBlocks.push({
  
            id: `${vowelData.vowel}-${i}-${Date.now()}-${Math.random()}`,
  
            vowel: vowelData.vowel,
  
            x: blockX,
  
            y: blockY,
  
            width: canvasSize.width * (70 / 800),
  
            height: canvasSize.height * (70 / 600),
  
            rotation: angle,
  
            color: getColorForVowel(index),
  
            matched: false,
  
            opacity: 1,
  
            scale: 1,
  
          });
  
        }
  
      });
  
  
  
      // Shuffle blocks
  
      setBlocks(newBlocks.sort(() => Math.random() - 0.5));
  
    };
  
    
  
    const getColorForVowel = (index: number) => {
  
      const colors = [
  
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
  
        '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B88B', '#FAD7A0',
  
        '#AED6F1', '#A9DFBF', '#F9E79F', '#FAD7A0', '#D7BDE2'
  
      ];
  
      return colors[index % colors.length];
  
    };
  
    
  
    const drawGame = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  
      ctx.clearRect(0, 0, width, height);
  
      
  
      // Background
  
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
  
      gradient.addColorStop(0, '#E8F5E9');
  
      gradient.addColorStop(1, '#C8E6C9');
  
      ctx.fillStyle = gradient;
  
      ctx.fillRect(0, 0, width, height);
  
      
  
      // Ground
  
      ctx.fillStyle = '#8D6E63';
  
      ctx.fillRect(0, height * (520 / 600), width, height * (80 / 600));
  
      
  
      // Draw the treasure chest image
      const img = isBoxOpen ? treasureChestOpenImageRef.current : treasureChestImageRef.current;
      if (img) {
        const chestWidth = width * (250 / 800);
        const chestHeight = height * (150 / 600);
        const chestX = width - chestWidth - (width * (50 / 800));
        const chestY = height * (520 / 600) - chestHeight;
        ctx.drawImage(img, chestX, chestY, chestWidth, chestHeight);
      }
      // Commented out original Treasure Chest drawing
      // drawTreasureChest(ctx, animatingBlocks.length > 0);
  
      
  
      // Draw blocks (non-matched and non-animating)
  
      blocks
  
        .filter(block => !block.matched && !animatingBlocks.find(ab => ab.id === block.id))
  
        .forEach(block => {
  
          drawLegoBlock(ctx, block, block.id === selectedBlock?.id);
  
        });
  
      
  
      // Draw animating blocks on top
  
      animatingBlocks.forEach(anim => {
  
        drawLegoBlock(ctx, anim.block, false, anim.block.opacity, anim.block.scale);
  
      });
  
    };
  
  
  
    const drawLegoBlock = (ctx: CanvasRenderingContext2D, block: Block, isSelected: boolean, opacity: number = 1, scale: number = 1) => {
  
      ctx.save();
  
      ctx.translate(block.x, block.y);
  
      ctx.rotate(block.rotation);
  
      ctx.globalAlpha = opacity; // Apply opacity
  
      ctx.scale(scale, scale);   // Apply scale
  
      
  
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
  
    
  
    const darkenColor = (color: string, percent: number) => {
  
      const num = parseInt(color.replace('#', ''), 16);
  
      const amt = Math.round(2.55 * percent);
  
      const R = Math.max(0, (num >> 16) - amt);
  
      const G = Math.max(0, (num >> 8 & 0x00FF) - amt);
  
      const B = Math.max(0, (num & 0x0000FF) - amt);
  
      return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
  
    };
  
    
  
    const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
  
      if (animatingBlocks.length > 0 || isProcessingMatch.current) return;
  
      
  
      const canvas = canvasRef.current;
  
      if (!canvas) return;
  
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
  
    
  
            const handleMatch = (block1: Block, block2: Block) => {
  
    
  
              if (isProcessingMatch.current) return; // Prevent multiple calls
  
    
  
              isProcessingMatch.current = true;
  
    
  
        
  
    
  
              const vowelData = vowels.find(v => v.vowel === block1.vowel);
  
    
  
        
  
    
  
              playClappingSound();
  
    
  
        
  
    
  
              // Open the box
  
    
  
              setIsBoxOpen(true);
  
    
  
              playChestOpenSound();
  
    
  
        
  
    
  
              // Start animation
  
    
  
              setAnimatingBlocks([
  
    
  
                { id: block1.id, block: { ...block1, opacity: 1, scale: 1 }, progress: 0 },
  
    
  
                { id: block2.id, block: { ...block2, opacity: 1, scale: 1 }, progress: 0 }
  
    
  
              ]);
  
    
  
        
  
    
  
              setSelectedBlock(null);
  
    
  
        
  
    
  
                    // Close the box and add to matched pairs after animation
  
    
  
        
  
    
  
                    setTimeout(() => {
  
    
  
        
  
    
  
                      if (vowelData && !matchedPairs.find(p => p.vowel === vowelData.vowel)) {
  
    
  
        
  
    
  
                        setMatchedPairs(prev => [...prev, vowelData]);
  
    
  
        
  
    
  
                        setScore(prev => prev + 10);
  
    
  
        
  
    
  
                      }
  
    
  
        
  
    
  
                      setAnimatingBlocks([]);
  
    
  
        
  
    
  
                      setBlocks(prev => prev.map(b => 
  
    
  
        
  
    
  
                        b.id === block1.id || b.id === block2.id ? { ...b, matched: true } : b
  
    
  
        
  
    
  
                      ));
  
    
  
        
  
    
  
                    }, 1000); // Blocks disappear after 1 second
  
    
  
        
  
    
  
              
  
    
  
        
  
    
  
                    // Close the box and allow new matches after 2 seconds
  
    
  
        
  
    
  
                    setTimeout(() => {
  
    
  
        
  
    
  
                      setIsBoxOpen(false);
  
    
  
        
  
    
  
                      playChestCloseSound();
  
    
  
        
  
    
  
                      isProcessingMatch.current = false; // Allow new matches after everything is done
  
    
  
        
  
    
  
                    }, 2000);
  
    
  
            };
  
    
  
    const playClappingSound = () => {
  
      const audio = new Audio('/audio/chestopenclose.mp3');
  
      audio.play();
  
    };

    const playChestOpenSound = () => {
      if (chestOpenAudioRef.current) {
        chestOpenAudioRef.current.pause();
        chestOpenAudioRef.current.currentTime = 0;
        chestOpenAudioRef.current.play();
      }
    };

    const playChestCloseSound = () => {
      if (chestCloseAudioRef.current) {
        chestCloseAudioRef.current.pause();
        chestCloseAudioRef.current.currentTime = 0;
        chestCloseAudioRef.current.play();
      }
    };
  
    
  
    const animateMatching = useCallback(() => {
  
      setAnimatingBlocks(prev => {
  
        return prev.map(anim => {
  
          const newProgress = anim.progress + 0.03; // Faster animation
  
          const bucketX = canvasSize.width * (650 / 800);
          const bucketY = canvasSize.height * (400 / 600);
          const lidDisappearY = bucketY - (canvasSize.height * (20 / 600)); // Disappear just above the lid
          const targetX = bucketX + (canvasSize.width * (60 / 800));
  
          
  
          let newX, newY, newOpacity, newScale;
  
  
  
          if (newProgress < 0.5) {
  
            // Rise up and move towards bucket opening
  
            const riseProgress = newProgress / 0.5;
  
            newX = anim.block.x + (targetX - anim.block.x) * riseProgress;
  
            newY = anim.block.y - riseProgress * (anim.block.y - lidDisappearY);
  
            newOpacity = 1;
  
            newScale = 1;
  
          } else if (newProgress < 1) {
  
            // Fade out and shrink at the lid
  
            const fadeProgress = (newProgress - 0.5) / 0.5;
  
            newX = targetX;
  
            newY = lidDisappearY;
  
            newOpacity = 1 - fadeProgress;
  
            newScale = 1 - fadeProgress * 0.5; // Shrink slightly
  
          } else {
  
            // Animation complete, block should be fully transparent and tiny
  
            newX = targetX;
  
            newY = lidDisappearY;
  
            newOpacity = 0;
  
            newScale = 0;
  
          }
  
          
  
          return {
  
            ...anim,
  
            progress: newProgress,
  
            block: { ...anim.block, x: newX, y: newY, opacity: newOpacity, scale: newScale }
  
          };
  
        }).filter(anim => anim.block.opacity > 0); // Remove fully faded blocks
  
      });
  
    }, [canvasSize.width, canvasSize.height, animatingBlocks]);
  
    
  
    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
  
      if (animatingBlocks.length > 0) return;
  
      
  
      const canvas = canvasRef.current;
  
      if (!canvas) return;
  
      const rect = canvas.getBoundingClientRect();
  
      const x = e.clientX - rect.left;
  
      const y = e.clientY - rect.top;
  
      
  
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
  
    
  
            const handleMatch = (block1: Block, block2: Block) => {
  
    
  
              if (isProcessingMatch.current) return; // Prevent multiple calls
  
    
  
              isProcessingMatch.current = true;
  
    
  
        
  
    
  
              const vowelData = vowels.find(v => v.vowel === block1.vowel);
  
    
  
        
  
    
  
              playClappingSound();
  
    
  
        
  
    
  
              // Open the box
  
    
  
              setIsBoxOpen(true);
  
    
  
              playChestOpenSound();
  
    
  
        
  
    
  
              // Start animation
  
    
  
              setAnimatingBlocks([
  
    
  
                { id: block1.id, block: { ...block1, opacity: 1, scale: 1 }, progress: 0 },
  
    
  
                { id: block2.id, block: { ...block2, opacity: 1, scale: 1 }, progress: 0 }
  
    
  
              ]);
  
    
  
        
  
    
  
              setSelectedBlock(null);
  
    
  
        
  
    
  
                    // Close the box and add to matched pairs after animation
  
    
  
        
  
    
  
                    setTimeout(() => {
  
    
  
        
  
    
  
                      if (vowelData && !matchedPairs.find(p => p.vowel === vowelData.vowel)) {
  
    
  
        
  
    
  
                        setMatchedPairs(prev => [...prev, vowelData]);
  
    
  
        
  
    
  
                        setScore(prev => prev + 10);
  
    
  
        
  
    
  
                      }
  
    
  
        
  
    
  
                      setAnimatingBlocks([]);
  
    
  
        
  
    
  
                      setBlocks(prev => prev.map(b => 
  
    
  
        
  
    
  
                        b.id === block1.id || b.id === block2.id ? { ...b, matched: true } : b
  
    
  
        
  
    
  
                      ));
  
    
  
        
  
    
  
                    }, 1000); // Blocks disappear after 1 second
  
    
  
        
  
    
  
              
  
    
  
        
  
    
  
                    // Close the box and allow new matches after 2 seconds
  
    
  
        
  
    
  
                    setTimeout(() => {
  
    
  
        
  
    
  
                      setIsBoxOpen(false);
  
    
  
        
  
    
  
                      playChestCloseSound();
  
    
  
        
  
    
  
                      isProcessingMatch.current = false; // Allow new matches after everything is done
  
    
  
        
  
    
  
                    }, 2000);
  
    
  
            };
  
    
  
    const playClappingSound = () => {
  
      const audio = new Audio('/audio/chestopenclose.mp3');
  
      audio.play();
  
    };

    const playChestOpenSound = () => {
      if (chestOpenAudioRef.current) {
        chestOpenAudioRef.current.pause();
        chestOpenAudioRef.current.currentTime = 0;
        chestOpenAudioRef.current.play();
      }
    };

    const playChestCloseSound = () => {
      if (chestCloseAudioRef.current) {
        chestCloseAudioRef.current.pause();
        chestCloseAudioRef.current.currentTime = 0;
        chestCloseAudioRef.current.play();
      }
    };
  
    
  
    const animateMatching = useCallback(() => {
  
      setAnimatingBlocks(prev => {
  
        return prev.map(anim => {
  
          const newProgress = anim.progress + 0.03; // Faster animation
  
          const bucketX = canvasSize.width * (650 / 800);
          const bucketY = canvasSize.height * (400 / 600);
          const lidDisappearY = bucketY - (canvasSize.height * (20 / 600)); // Disappear just above the lid
          const targetX = bucketX + (canvasSize.width * (60 / 800));
  
          
  
          let newX, newY, newOpacity, newScale;
  
  
  
          if (newProgress < 0.5) {
  
            // Rise up and move towards bucket opening
  
            const riseProgress = newProgress / 0.5;
  
            newX = anim.block.x + (targetX - anim.block.x) * riseProgress;
  
            newY = anim.block.y - riseProgress * (anim.block.y - lidDisappearY);
  
            newOpacity = 1;
  
            newScale = 1;
  
          } else if (newProgress < 1) {
  
            // Fade out and shrink at the lid
  
            const fadeProgress = (newProgress - 0.5) / 0.5;
  
            newX = targetX;
  
            newY = lidDisappearY;
  
            newOpacity = 1 - fadeProgress;
  
            newScale = 1 - fadeProgress * 0.5; // Shrink slightly
  
          } else {
  
            // Animation complete, block should be fully transparent and tiny
  
            newX = targetX;
  
            newY = lidDisappearY;
  
            newOpacity = 0;
  
            newScale = 0;
  
          }
  
          
  
          return {
  
            ...anim,
  
            progress: newProgress,
  
            block: { ...anim.block, x: newX, y: newY, opacity: newOpacity, scale: newScale }
  
          };
  
        }).filter(anim => anim.block.opacity > 0); // Remove fully faded blocks
  
      });
  
    }, [canvasSize.width, canvasSize.height, animatingBlocks]);
  
    
  
    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
  
      if (animatingBlocks.length > 0) return;
  
      
  
      const canvas = canvasRef.current;
  
      if (!canvas) return;
  
      const rect = canvas.getBoundingClientRect();
  
      const x = e.clientX - rect.left;
  
      const y = e.clientY - rect.top;
  
      
  
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
  
    
  
            const handleMatch = (block1: Block, block2: Block) => {
  
    
  
              if (isProcessingMatch.current) return; // Prevent multiple calls
  
    
  
              isProcessingMatch.current = true;
  
    
  
        
  
    
  
              const vowelData = vowels.find(v => v.vowel === block1.vowel);
  
    
  
        
  
    
  
              playClappingSound();
  
    
  
        
  
    
  
              // Open the box
  
    
  
              setIsBoxOpen(true);
  
    
  
              playChestOpenSound();
  
    
  
        
  
    
  
              // Start animation
  
    
  
              setAnimatingBlocks([
  
    
  
                { id: block1.id, block: { ...block1, opacity: 1, scale: 1 }, progress: 0 },
  
    
  
                { id: block2.id, block: { ...block2, opacity: 1, scale: 1 }, progress: 0 }
  
    
  
              ]);
  
    
  
        
  
    
  
              setSelectedBlock(null);
  
    
  
        
  
    
  
                    // Close the box and add to matched pairs after animation
  
    
  
        
  
    
  
                    setTimeout(() => {
  
    
  
        
  
    
  
                      if (vowelData && !matchedPairs.find(p => p.vowel === vowelData.vowel)) {
  
    
  
        
  
    
  
                        setMatchedPairs(prev => [...prev, vowelData]);
  
    
  
        
  
    
  
                        setScore(prev => prev + 10);
  
    
  
        
  
    
  
                      }
  
    
  
        
  
    
  
                      setAnimatingBlocks([]);
  
    
  
        
  
    
  
                      setBlocks(prev => prev.map(b => 
  
    
  
        
  
    
  
                        b.id === block1.id || b.id === block2.id ? { ...b, matched: true } : b
  
    
  
        
  
    
  
                      ));
  
    
  
        
  
    
  
                    }, 1000); // Blocks disappear after 1 second
  
    
  
        
  
    
  
              
  
    
  
        
  
    
  
                    // Close the box and allow new matches after 2 seconds
  
    
  
        
  
    
  
                    setTimeout(() => {
  
    
  
        
  
    
  
                      setIsBoxOpen(false);
  
    
  
        
  
    
  
                      playChestCloseSound();
  
    
  
        
  
    
  
                      isProcessingMatch.current = false; // Allow new matches after everything is done
  
    
  
        
  
    
  
                    }, 2000);
  
    
  
            };
  
    
  
    const playClappingSound = () => {
  
      const audio = new Audio('/audio/chestopenclose.mp3');
  
      audio.play();
  
    };

    const playChestOpenSound = () => {
      if (chestOpenAudioRef.current) {
        chestOpenAudioRef.current.pause();
        chestOpenAudioRef.current.currentTime = 0;
        chestOpenAudioRef.current.play();
      }
    };

    const playChestCloseSound = () => {
      if (chestCloseAudioRef.current) {
        chestCloseAudioRef.current.pause();
        chestCloseAudioRef.current.currentTime = 0;
        chestCloseAudioRef.current.play();
      }
    };
  
    
  
    const animateMatching = useCallback(() => {
  
      setAnimatingBlocks(prev => {
  
        return prev.map(anim => {
  
          const newProgress = anim.progress + 0.03; // Faster animation
  
          const bucketX = canvasSize.width * (650 / 800);
          const bucketY = canvasSize.height * (400 / 600);
          const lidDisappearY = bucketY - (canvasSize.height * (20 / 600)); // Disappear just above the lid
          const targetX = bucketX + (canvasSize.width * (60 / 800));
  
          
  
          let newX, newY, newOpacity, newScale;
  
  
  
          if (newProgress < 0.5) {
  
            // Rise up and move towards bucket opening
  
            const riseProgress = newProgress / 0.5;
  
            newX = anim.block.x + (targetX - anim.block.x) * riseProgress;
  
            newY = anim.block.y - riseProgress * (anim.block.y - lidDisappearY);
  
            newOpacity = 1;
  
            newScale = 1;
  
          } else if (newProgress < 1) {
  
            // Fade out and shrink at the lid
  
            const fadeProgress = (newProgress - 0.5) / 0.5;
  
            newX = targetX;
  
            newY = lidDisappearY;
  
            newOpacity = 1 - fadeProgress;
  
            newScale = 1 - fadeProgress * 0.5; // Shrink slightly
  
          } else {
  
            // Animation complete, block should be fully transparent and tiny
  
            newX = targetX;
  
            newY = lidDisappearY;
  
            newOpacity = 0;
  
            newScale = 0;
  
          }
  
          
  
          return {
  
            ...anim,
  
            progress: newProgress,
  
            block: { ...anim.block, x: newX, y: newY, opacity: newOpacity, scale: newScale }
  
          };
  
        }).filter(anim => anim.block.opacity > 0); // Remove fully faded blocks
  
      });
  
    }, [canvasSize.width, canvasSize.height, animatingBlocks]);
  
    
  
    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
  
      if (animatingBlocks.length > 0) return;
  
      
  
      const canvas = canvasRef.current;
  
      if (!canvas) return;
  
      const rect = canvas.getBoundingClientRect();
  
      const x = e.clientX - rect.left;
  
      const y = e.clientY - rect.top;
  
      
  
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
  
    
  
            const handleMatch = (block1: Block, block2: Block) => {
  
    
  
              if (isProcessingMatch.current) return; // Prevent multiple calls
  
    
  
              isProcessingMatch.current = true;
  
    
  
        
  
    
  
              const vowelData = vowels.find(v => v.vowel === block1.vowel);
  
    
  
        
  
    
  
              playClappingSound();
  
    
  
        
  
    
  
              // Open the box
  
    
  
              setIsBoxOpen(true);
  
    
  
              playChestOpenSound();
  
    
  
        
  
    
  
              // Start animation
  
    
  
              setAnimatingBlocks([
  
    
  
                { id: block1.id, block: { ...block1, opacity: 1, scale: 1 }, progress: 0 },
  
    
  
                { id: block2.id, block: { ...block2, opacity: 1, scale: 1 }, progress: 0 }
  
    
  
              ]);
  
    
  
        
  
    
  
              setSelectedBlock(null);
  
    
  
        
  
    
  
                    // Close the box and add to matched pairs after animation
  
    
  
        
  
    
  
                    setTimeout(() => {
  
    
  
        
  
    
  
                      if (vowelData && !matchedPairs.find(p => p.vowel === vowelData.vowel)) {
  
    
  
        
  
    
  
                        setMatchedPairs(prev => [...prev, vowelData]);
  
    
  
        
  
    
  
                        setScore(prev => prev + 10);
  
    
  
        
  
    
  
                      }
  
    
  
        
  
    
  
                      setAnimatingBlocks([]);
  
    
  
        
  
    
  
                      setBlocks(prev => prev.map(b => 
  
    
  
        
  
    
  
                        b.id === block1.id || b.id === block2.id ? { ...b, matched: true } : b
  
    
  
        
  
    
  
                      ));
  
    
  
        
  
    
  
                    }, 1000); // Blocks disappear after 1 second
  
    
  
        
  
    
  
              
  
    
  
        
  
    
  
                    // Close the box and allow new matches after 2 seconds
  
    
  
        
  
    
  
                    setTimeout(() => {
  
    
  
        
  
    
  
                      setIsBoxOpen(false);
  
    
  
        
  
    
  
                      playChestCloseSound();
  
    
  
        
  
    
  
                      isProcessingMatch.current = false; // Allow new matches after everything is done
  
    
  
        
  
    
  
                    }, 2000);
  
    
  
            };
  
    
  
    const playClappingSound = () => {
  
      const audio = new Audio('/audio/chestopenclose.mp3');
  
      audio.play();
  
    };

    const playChestOpenSound = () => {
      if (chestOpenAudioRef.current) {
        chestOpenAudioRef.current.pause();
        chestOpenAudioRef.current.currentTime = 0;
        chestOpenAudioRef.current.play();
      }
    };

    const playChestCloseSound = () => {
      if (chestCloseAudioRef.current) {
        chestCloseAudioRef.current.pause();
        chestCloseAudioRef.current.currentTime = 0;
        chestCloseAudioRef.current.play();
      }
    };
  
    
  
    const animateMatching = useCallback(() => {
  
      setAnimatingBlocks(prev => {
  
        return prev.map(anim => {
  
          const newProgress = anim.progress + 0.03; // Faster animation
  
          const bucketX = canvasSize.width * (650 / 800);
          const bucketY = canvasSize.height * (400 / 600);
          const lidDisappearY = bucketY - (canvasSize.height * (20 / 600)); // Disappear just above the lid
          const targetX = bucketX + (canvasSize.width * (60 / 800));
  
          
  
          let newX, newY, newOpacity, newScale;
  
  
  
          if (newProgress < 0.5) {
  
            // Rise up and move towards bucket opening
  
            const riseProgress = newProgress / 0.5;
  
            newX = anim.block.x + (targetX - anim.block.x) * riseProgress;
  
            newY = anim.block.y - riseProgress * (anim.block.y - lidDisappearY);
  
            newOpacity = 1;
  
            newScale = 1;
  
          } else if (newProgress < 1) {
  
            // Fade out and shrink at the lid
  
            const fadeProgress = (newProgress - 0.5) / 0.5;
  
            newX = targetX;
  
            newY = lidDisappearY;
  
            newOpacity = 1 - fadeProgress;
  
            newScale = 1 - fadeProgress * 0.5; // Shrink slightly
  
          } else {
  
            // Animation complete, block should be fully transparent and tiny
  
            newX = targetX;
  
            newY = lidDisappearY;
  
            newOpacity = 0;
  
            newScale = 0;
  
          }
  
          
  
          return {
  
            ...anim,
  
            progress: newProgress,
  
            block: { ...anim.block, x: newX, y: newY, opacity: newOpacity, scale: newScale }
  
          };
  
        }).filter(anim => anim.block.opacity > 0); // Remove fully faded blocks
  
      });
  
    }, [canvasSize.width, canvasSize.height, animatingBlocks]);
  
    
  
    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
  
      if (animatingBlocks.length > 0) return;
  
      
  
      const canvas = canvasRef.current;
  
      if (!canvas) return;
  
      const rect = canvas.getBoundingClientRect();
  
      const x = e.clientX - rect.left;
  
      const y = e.clientY - rect.top;
  
      
  
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
  
    
  
            const handleMatch = (block1: Block, block2: Block) => {
  
    
  
              if (isProcessingMatch.current) return; // Prevent multiple calls
  
    
  
              isProcessingMatch.current = true;
  
    
  
        
  
    
  
              const vowelData = vowels.find(v => v.vowel === block1.vowel);
  
    
  
        
  
    
  
              playClappingSound();
  
    
  
        
  
    
  
              // Open the box
  
    
  
              setIsBoxOpen(true);
  
    
  
              playChestOpenSound();
  
    
  
        
  
    
  
              // Start animation
  
    
  
              setAnimatingBlocks([
  
    
  
                { id: block1.id, block: { ...block1, opacity: 1, scale: 1 }, progress: 0 },
  
    
  
                { id: block2.id, block: { ...block2, opacity: 1, scale: 1 }, progress: 0 }
  
    
  
              ]);
  
    
  
        
  
    
  
              setSelectedBlock(null);
  
    
  
        
  
    
  
                    // Close the box and add to matched pairs after animation
  
    
  
        
  
    
  
                    setTimeout(() => {
  
    
  
        
  
    
  
                      if (vowelData && !matchedPairs.find(p => p.vowel === vowelData.vowel)) {
  
    
  
        
  
    
  
                        setMatchedPairs(prev => [...prev, vowelData]);
  
    
  
        
  
    
  
                        setScore(prev => prev + 10);
  
    
  
        
  
    
  
                      }
  
    
  
        
  
    
  
                      setAnimatingBlocks([]);
  
    
  
        
  
    
  
                      setBlocks(prev => prev.map(b => 
  
    
  
        
  
    
  
                        b.id === block1.id || b.id === block2.id ? { ...b, matched: true } : b
  
    
  
        
  
    
  
                      ));
  
    
  
        
  
    
  
                    }, 1000); // Blocks disappear after 1 second
  
    
  
        
  
    
  
              
  
    
  
        
  
    
  
                    // Close the box and allow new matches after 2 seconds
  
    
  
        
  
    
  
                    setTimeout(() => {
  
    
  
        
  
    
  
                      setIsBoxOpen(false);
  
    
  
        
  
    
  
                      playChestCloseSound();
  
    
  
        
  
    
  
                      isProcessingMatch.current = false; // Allow new matches after everything is done
  
    
  
        
  
    
  
                    }, 2000);
  
    
  
            };
  
    
  
    const playClappingSound = () => {
  
      const audio = new Audio('/audio/chestopenclose.mp3');
  
      audio.play();
  
    };

    const playChestOpenSound = () => {
      if (chestOpenAudioRef.current) {
        chestOpenAudioRef.current.pause();
        chestOpenAudioRef.current.currentTime = 0;
        chestOpenAudioRef.current.play();
      }
    };

    const playChestCloseSound = () => {
      if (chestCloseAudioRef.current) {
        chestCloseAudioRef.current.pause();
        chestCloseAudioRef.current.currentTime = 0;
        chestCloseAudioRef.current.play();
      }
    };
  
    
  
    const animateMatching = useCallback(() => {
  
      setAnimatingBlocks(prev => {
  
        return prev.map(anim => {
  
          const newProgress = anim.progress + 0.03; // Faster animation
  
          const bucketX = canvasSize.width * (650 / 800);
          const bucketY = canvasSize.height * (400 / 600);
          const lidDisappearY = bucketY - (canvasSize.height * (20 / 600)); // Disappear just above the lid
          const targetX = bucketX + (canvasSize.width * (60 / 800));
  
          
  
          let newX, newY, newOpacity, newScale;
  
  
  
          if (newProgress < 0.5) {
  
            // Rise up and move towards bucket opening
  
            const riseProgress = newProgress / 0.5;
  
            newX = anim.block.x + (targetX - anim.block.x) * riseProgress;
  
            newY = anim.block.y - riseProgress * (anim.block.y - lidDisappearY);
  
            newOpacity = 1;
  
            newScale = 1;
  
          } else if (newProgress < 1) {
  
            // Fade out and shrink at the lid
  
            const fadeProgress = (newProgress - 0.5) / 0.5;
  
            newX = targetX;
  
            newY = lidDisappearY;
  
            newOpacity = 1 - fadeProgress;
  
            newScale = 1 - fadeProgress * 0.5; // Shrink slightly
  
          } else {
  
            // Animation complete, block should be fully transparent and tiny
  
            newX = targetX;
  
            newY = lidDisappearY;
  
            newOpacity = 0;
  
            newScale = 0;
  
          }
  
          
  
          return {
  
            ...anim,
  
            progress: newProgress,
  
            block: { ...anim.block, x: newX, y: newY, opacity: newOpacity, scale: newScale }
  
          };
  
        }).filter(anim => anim.block.opacity > 0); // Remove fully faded blocks
  
      });
  
    }, [canvasSize.width, canvasSize.height, animatingBlocks]);
  
    
  
    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
  
      if (animatingBlocks.length > 0) return;
  
      
  
      const canvas = canvasRef.current;
  
      if (!canvas) return;
  
      const rect = canvas.getBoundingClientRect();
  
      const x = e.clientX - rect.left;
  
      const y = e.clientY - rect.top;
  
      
  
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
  
    
  
            const handleMatch = (block1: Block, block2: Block) => {
  
    
  
              if (isProcessingMatch.current) return; // Prevent multiple calls
  
    
  
              isProcessingMatch.current = true;
  
    
  
        
  
    
  
              const vowelData = vowels.find(v => v.vowel === block1.vowel);
  
    
  
        
  
    
  
              playClappingSound();
  
    
  
        
  
    
  
              // Open the box
  
    
  
              setIsBoxOpen(true);
  
    
  
              playChestOpenSound();
  
    
  
        
  
    
  
              // Start animation
  
    
  
              setAnimatingBlocks([
  
    
  
                { id: block1.id, block: { ...block1, opacity: 1, scale: 1 }, progress: 0 },
  
    
  
                { id: block2.id, block: { ...block2, opacity: 1, scale: 1 }, progress: 0 }
  
    
  
              ]);
  
    
  
        
  
    
  
              setSelectedBlock(null);
  
    
  
        
  
    
  
                    // Close the box and add to matched pairs after animation
  
    
  
        
  
    
  
                    setTimeout(() => {
  
    
  
        
  
    
  
                      if (vowelData && !matchedPairs.find(p => p.vowel === vowelData.vowel)) {
  
    
  
        
  
    
  
                        setMatchedPairs(prev => [...prev, vowelData]);
  
    
  
        
  
    
  
                        setScore(prev => prev + 10);
  
    
  
        
  
    
  
                      }
  
    
  
        
  
    
  
                      setAnimatingBlocks([]);
  
    
  
        
  
    
  
                      setBlocks(prev => prev.map(b => 
  
    
  
        
  
    
  
                        b.id === block1.id || b.id === block2.id ? { ...b, matched: true } : b
  
    
  
        
  
    
  
                      ));
  
    
  
        
  
    
  
                    }, 1000); // Blocks disappear after 1 second
  
    
  
        
  
    
  
              
  
    
  
        
  
    
  
                    // Close the box and allow new matches after 2 seconds
  
    
  
        
  
    
  
                    setTimeout(() => {
  
    
  
        
  
    
  
                      setIsBoxOpen(false);
  
    
  
        
  
    
  
                      playChestCloseSound();
  
    
  
        
  
    
  
                      isProcessingMatch.current = false; // Allow new matches after everything is done
  
    
  
        
  
    
  
                    }, 2000);
  
    
  
            };
  
    
  
    const playClappingSound = () => {
  
      const audio = new Audio('/audio/chestopenclose.mp3');
  
      audio.play();
  
    };

    const playChestOpenSound = () => {
      if (chestOpenAudioRef.current) {
        chestOpenAudioRef.current.pause();
        chestOpenAudioRef.current.currentTime = 0;
        chestOpenAudioRef.current.play();
      }
    };

    const playChestCloseSound = () => {
      if (chestCloseAudioRef.current) {
        chestCloseAudioRef.current.pause();
        chestCloseAudioRef.current.currentTime = 0;
        chestCloseAudioRef.current.play();
      }
    };
  
    
  
    const animateMatching = useCallback(() => {
  
      setAnimatingBlocks(prev => {
  
        return prev.map(anim => {
  
          const newProgress = anim.progress + 0.03; // Faster animation
  
          const bucketX = canvasSize.width * (650 / 800);
          const bucketY = canvasSize.height * (400 / 600);
          const lidDisappearY = bucketY - (canvasSize.height * (20 / 600)); // Disappear just above the lid
          const targetX = bucketX + (canvasSize.width * (60 / 800));
  
          
  
          let newX, newY, newOpacity, newScale;
  
  
  
          if (newProgress < 0.5) {
  
            // Rise up and move towards bucket opening
  
            const riseProgress = newProgress / 0.5;
  
            newX = anim.block.x + (targetX - anim.block.x) * riseProgress;
  
            newY = anim.block.y - riseProgress * (anim.block.y - lidDisappearY);
  
            newOpacity = 1;
  
            newScale = 1;
  
          } else if (newProgress < 1) {
  
            // Fade out and shrink at the lid
  
            const fadeProgress = (newProgress - 0.5) / 0.5;
  
            newX = targetX;
  
            newY = lidDisappearY;
  
            newOpacity = 1 - fadeProgress;
  
            newScale = 1 - fadeProgress * 0.5; // Shrink slightly
  
          } else {
  
            // Animation complete, block should be fully transparent and tiny
  
            newX = targetX;
  
            newY = lidDisappearY;
  
            newOpacity = 0;
  
            newScale = 0;
  
          }
  
          
  
          return {
  
            ...anim,
  
            progress: newProgress,
  
            block: { ...anim.block, x: newX, y: newY, opacity: newOpacity, scale: newScale }
  
          };
  
        }).filter(anim => anim.block.opacity > 0); // Remove fully faded blocks
  
      });
  
    }, [canvasSize.width, canvasSize.height, animatingBlocks]);
  
    
  
    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
  
      if (animatingBlocks.length > 0) return;
  
      
  
      const canvas = canvasRef.current;
  
      if (!canvas) return;
  
      const rect = canvas.getBoundingClientRect();
  
      const x = e.clientX - rect.left;
  
      const y = e.clientY - rect.top;
  
      
  
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
  
    
  
            const handleMatch = (block1: Block, block2: Block) => {
  
    
  
              if (isProcessingMatch.current) return; // Prevent multiple calls
  
    
  
              isProcessingMatch.current = true;
  
    
  
        
  
    
  
              const vowelData = vowels.find(v => v.vowel === block1.vowel);
  
    
  
        
  
    
  
              playClappingSound();
  
    
  
        
  
    
  
              // Open the box
  
    
  
              setIsBoxOpen(true);
  
    
  
              playChestOpenSound();
  
    
  
        
  
    
  
              // Start animation
  
    
  
              setAnimatingBlocks([
  
    
  
                { id: block1.id, block: { ...block1, opacity: 1, scale: 1 }, progress: 0 },
  
    
  
                { id: block2.id, block: { ...block2, opacity: 1, scale: 1 }, progress: 0 }
  
    
  
              ]);
  
    
  
        
  
    
  
              setSelectedBlock(null);
  
    
  
        
  
    
  
                    // Close the box and add to matched pairs after animation
  
    
  
        
  
    
  
                    setTimeout(() => {
  
    
  
        
  
    
  
                      if (vowelData && !matchedPairs.find(p => p.vowel === vowelData.vowel)) {
  
    
  
        
  
    
  
                        setMatchedPairs(prev => [...prev, vowelData]);
  
    
  
        
  
    
  
                        setScore(prev => prev + 10);
  
    
  
        
  
    
  
                      }
  
    
  
        
  
    
  
                      setAnimatingBlocks([]);
  
    
  
        
  
    
  
                      setBlocks(prev => prev.map(b => 
  
    
  
        
  
    
  
                        b.id === block1.id || b.id === block2.id ? { ...b, matched: true } : b
  
    
  
        
  
    
  
                      ));
  
    
  
        
  
    
  
                    }, 1000); // Blocks disappear after 1 second
  
    
  
        
  
    
  
              
  
    
  
        
  
    
  
                    // Close the box and allow new matches after 2 seconds
  
    
  
        
  
    
  
                    setTimeout(() => {
  
    
  
        
  
    
  
                      setIsBoxOpen(false);
  
    
  
        
  
    
  
                      playChestCloseSound();
  
    
  
        
  
    
  
                      isProcessingMatch.current = false; // Allow new matches after everything is done
  
    
  
        
  
    
  
                    }, 2000);
  
    
  
            };
  
    
  
    const playClappingSound = () => {
  
      const audio = new Audio('/audio/chestopenclose.mp3');
  
      audio.play();
  
    };

    const playChestOpenSound = () => {
      if (chestOpenAudioRef.current) {
        chestOpenAudioRef.current.pause();
        chestOpenAudioRef.current.currentTime = 0;
        chestOpenAudioRef.current.play();
      }
    };

    const playChestCloseSound = () => {
      if (chestCloseAudioRef.current) {
        chestCloseAudioRef.current.pause();
        chestCloseAudioRef.current.currentTime = 0;
        chestCloseAudioRef.current.play();
      }
    };
  
    
  
    const animateMatching = useCallback(() => {
  
      setAnimatingBlocks(prev => {
  
        return prev.map(anim => {
  
          const newProgress = anim.progress + 0.03; // Faster animation
  
          const bucketX = canvasSize.width * (650 / 800);
          const bucketY = canvasSize.height * (400 / 600);
          const lidDisappearY = bucketY - (canvasSize.height * (20 / 600)); // Disappear just above the lid
          const targetX = bucketX + (canvasSize.width * (60 / 800));
  
          
  
          let newX, newY, newOpacity, newScale;
  
  
  
          if (newProgress < 0.5) {
  
            // Rise up and move towards bucket opening
  
            const riseProgress = newProgress / 0.5;
  
            newX = anim.block.x + (targetX - anim.block.x) * riseProgress;
  
            newY = anim.block.y - riseProgress * (anim.block.y - lidDisappearY);
  
            newOpacity = 1;
  
            newScale = 1;
  
          } else if (newProgress < 1) {
  
            // Fade out and shrink at the lid
  
            const fadeProgress = (newProgress - 0.5) / 0.5;
  
            newX = targetX;
  
            newY = lidDisappearY;
  
            newOpacity = 1 - fadeProgress;
  
            newScale = 1 - fadeProgress * 0.5; // Shrink slightly
  
          } else {
  
            // Animation complete, block should be fully transparent and tiny
  
            newX = targetX;
  
            newY = lidDisappearY;
  
            newOpacity = 0;
  
            newScale = 0;
  
          }
  
          
  
          return {
  
            ...anim,
  
            progress: newProgress,
  
            block: { ...anim.block, x: newX, y: newY, opacity: newOpacity, scale: newScale }
  
          };
  
        }).filter(anim => anim.block.opacity > 0); // Remove fully faded blocks
  
      });
  
    }, [canvasSize.width, canvasSize.height, animatingBlocks]);
  
    
  
    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
  
      if (animatingBlocks.length > 0) return;
  
      
  
      const canvas = canvasRef.current;
  
      if (!canvas) return;
  
      const rect = canvas.getBoundingClientRect();
  
      const x = e.clientX - rect.left;
  
      const y = e.clientY - rect.top;
  
      
  
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
  
    
  
            const handleMatch = (block1: Block, block2: Block) => {
  
    
  
              if (isProcessingMatch.current) return; // Prevent multiple calls
  
    
  
              isProcessingMatch.current = true;
  
    
  
        
  
    
  
              const vowelData = vowels.find(v => v.vowel === block1.vowel);
  
    
  
        
  
    
  
              playClappingSound();
  
    
  
        
  
    
  
              // Open the box
  
    
  
              setIsBoxOpen(true);
  
    
  
              playChestOpenSound();
  
    
  
        
  
    
  
              // Start animation
  
    
  
              setAnimatingBlocks([
  
    
  
                { id: block1.id, block: { ...block1, opacity: 1, scale: 1 }, progress: 0 },
  
    
  
                { id: block2.id, block: { ...block2, opacity: 1, scale: 1 }, progress: 0 }
  
    
  
              ]);
  
    
  
        
  
    
  
              setSelectedBlock(null);
  
    
  
        
  
    
  
                    // Close the box and add to matched pairs after animation
  
    
  
        
  
    
  
                    setTimeout(() => {
  
    
  
        
  
    
  
                      if (vowelData && !matchedPairs.find(p => p.vowel === vowelData.vowel)) {
  
    
  
        
  
    
  
                        setMatchedPairs(prev => [...prev, vowelData]);
  
    
  
        
  
    
  
                        setScore(prev => prev + 10);
  
    
  
        
  
    
  
                      }
  
    
  
        
  
    
  
                      setAnimatingBlocks([]);
  
    
  
        
  
    
  
                      setBlocks(prev => prev.map(b => 
  
    
  
        
  
    
  
                        b.id === block1.id || b.id === block2.id ? { ...b, matched: true } : b
  
    
  
        
  
    
  
                      ));
  
    
  
        
  
    
  
                    }, 1000); // Blocks disappear after 1 second
  
    
  
        
  
    
  
              
  
    
  
        
  
    
  
                    // Close the box and allow new matches after 2 seconds
  
    
  
        
  
    
  
                    setTimeout(() => {
  
    
  
        
  
    
  
                      setIsBoxOpen(false);
  
    
  
        
  
    
  
                      playChestCloseSound();
  
    
  
        
  
    
  
                      isProcessingMatch.current = false; // Allow new matches after everything is done
  
    
  
        
  
    
  
                    }, 2000);
  
    
  
            };
  
    
  
    const playClappingSound = () => {
  
      const audio = new Audio('/audio/chestopenclose.mp3');
  
      audio.play();
  
    };

    const playChestOpenSound = () => {
      if (chestOpenAudioRef.current) {
        chestOpenAudioRef.current.pause();
        chestOpenAudioRef.current.currentTime = 0;
        chestOpenAudioRef.current.play();
      }
    };

    const playChestCloseSound = () => {
      if (chestCloseAudioRef.current) {
        chestCloseAudioRef.current.pause();
        chestCloseAudioRef.current.currentTime = 0;
        chestCloseAudioRef.current.play();
      }
    };
  
    
  
    const animateMatching = useCallback(() => {
  
      setAnimatingBlocks(prev => {
  
        return prev.map(anim => {
  
          const newProgress = anim.progress + 0.03; // Faster animation
  
          const bucketX = canvasSize.width * (650 / 800);
          const bucketY = canvasSize.height * (400 / 600);
          const lidDisappearY = bucketY - (canvasSize.height * (20 / 600)); // Disappear just above the lid
          const targetX = bucketX + (canvasSize.width * (60 / 800));
  
          
  
          let newX, newY, newOpacity, newScale;
  
  
  
          if (newProgress < 0.5) {
  
            // Rise up and move towards bucket opening
  
            const riseProgress = newProgress / 0.5;
  
            newX = anim.block.x + (targetX - anim.block.x) * riseProgress;
  
            newY = anim.block.y - riseProgress * (anim.block.y - lidDisappearY);
  
            newOpacity = 1;
  
            newScale = 1;
  
          } else if (newProgress < 1) {
  
            // Fade out and shrink at the lid
  
            const fadeProgress = (newProgress - 0.5) / 0.5;
  
            newX = targetX;
  
            newY = lidDisappearY;
  
            newOpacity = 1 - fadeProgress;
  
            newScale = 1 - fadeProgress * 0.5; // Shrink slightly
  
          } else {
  
            // Animation complete, block should be fully transparent and tiny
  
            newX = targetX;
  
            newY = lidDisappearY;
  
            newOpacity = 0;
  
            newScale = 0;
  
          }
  
          
  
          return {
  
            ...anim,
  
            progress: newProgress,
  
            block: { ...anim.block, x: newX, y: newY, opacity: newOpacity, scale: newScale }
  
          };
  
        }).filter(anim => anim.block.opacity > 0); // Remove fully faded blocks
  
      });
  
    }, [canvasSize.width, canvasSize.height, animatingBlocks]);
  
    
  
    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
  
      if (animatingBlocks.length > 0) return;
  
      
  
      const canvas = canvasRef.current;
  
      if (!canvas) return;
  
      const rect = canvas.getBoundingClientRect();
  
      const x = e.clientX - rect.left;
  
      const y = e.clientY - rect.top;
  
      
  
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
  
    
  
            const handleMatch = (block1: Block, block2: Block) => {
  
    
  
              if (isProcessingMatch.current) return; // Prevent multiple calls
  
    
  
              isProcessingMatch.current = true;
  
    
  
        
  
    
  
              const vowelData = vowels.find(v => v.vowel === block1.vowel);
  
    
  
        
  
    
  
              playClappingSound();
  
    
  
        
  
    
  
              // Open the box
  
    
  
              setIsBoxOpen(true);
  
    
  
              playChestOpenSound();
  
    
  
        
  
    
  
              // Start animation
  
    
  
              setAnimatingBlocks([
  
    
  
                { id: block1.id, block: { ...block1, opacity: 1, scale: 1 }, progress: 0 },
  
    
  
                { id: block2.id, block: { ...block2, opacity: 1, scale: 1 }, progress: 0 }
  
    
  
              ]);
  
    
  
        
  
    
  
              setSelectedBlock(null);
  
    
  
        
  
    
  
                    // Close the box and add to matched pairs after animation
  
    
  
        
  
    
  
                    setTimeout(() => {
  
    
  
        
  
    
  
                      if (vowelData && !matchedPairs.find(p => p.vowel === vowelData.vowel)) {
  
    
  
        
  
    
  
                        setMatchedPairs(prev => [...prev, vowelData]);
  
    
  
        
  
    
  
                        setScore(prev => prev + 10);
  
    
  
        
  
    
  
                      }
  
    
  
        
  
    
  
                      setAnimatingBlocks([]);
  
    
  
        
  
    
  
                      setBlocks(prev => prev.map(b => 
  
    
  
        
  
    
  
                        b.id === block1.id || b.id === block2.id ? { ...b, matched: true } : b
  
    
  
        
  
    
  
                      ));
  
    
  
        
  
    
  
                    }, 1000); // Blocks disappear after 1 second
  
    
  
        
  
    
  
              
  
    
  
        
  
    
  
                    // Close the box and allow new matches after 2 seconds
  
    
  
        
  
    
  
                    setTimeout(() => {
  
    
  
        
  
    
  
                      setIsBoxOpen(false);
  
    
  
        
  
    
  
                      playChestCloseSound();
  
    
  
        
  
    
  
                      isProcessingMatch.current = false; // Allow new matches after everything is done
  
    
  
        
  
    
  
                    }, 2000);
  
    
  
            };
  
    
  
    const playClappingSound = () => {
  
      const audio = new Audio('/audio/chestopenclose.mp3');
  
      audio.play();
  
    };

    const playChestOpenSound = () => {
      if (chestOpenAudioRef.current) {
        chestOpenAudioRef.current.pause();
        chestOpenAudioRef.current.currentTime = 0;
        chestOpenAudioRef.current.play();
      }
    };

    const playChestCloseSound = () => {
      if (chestCloseAudioRef.current) {
        chestCloseAudioRef.current.pause();
        chestCloseAudioRef.current.currentTime = 0;
        chestCloseAudioRef.current.play();
      }
    };
  
    
  
    const animateMatching = useCallback(() => {
  
      setAnimatingBlocks(prev => {
  
        return prev.map(anim => {
  
          const newProgress = anim.progress + 0.03; // Faster animation
  
          const bucketX = canvasSize.width * (650 / 800);
          const bucketY = canvasSize.height * (400 / 600);
          const lidDisappearY = bucketY - (canvasSize.height * (20 / 600)); // Disappear just above the lid
          const targetX = bucketX + (canvasSize.width * (60 / 800));
  
          
  
          let newX, newY, newOpacity, newScale;
  
  
  
          if (newProgress < 0.5) {
  
            // Rise up and move towards bucket opening
  
            const riseProgress = newProgress / 0.5;
  
            newX = anim.block.x + (targetX - anim.block.x) * riseProgress;
  
            newY = anim.block.y - riseProgress * (anim.block.y - lidDisappearY);
  
            newOpacity = 1;
  
            newScale = 1;
  
          } else if (newProgress < 1) {
  
            // Fade out and shrink at the lid
  
            const fadeProgress = (newProgress - 0.5) / 0.5;
  
            newX = targetX;
  
            newY = lidDisappearY;
  
            newOpacity = 1 - fadeProgress;
  
            newScale = 1 - fadeProgress * 0.5; // Shrink slightly
  
          } else {
  
            // Animation complete, block should be fully transparent and tiny
  
            newX = targetX;
  
            newY = lidDisappearY;
  
            newOpacity = 0;
  
            newScale = 0;
  
          }
  
          
  
          return {
  
            ...anim,
  
            progress: newProgress,
  
            block: { ...anim.block, x: newX, y: newY, opacity: newOpacity, scale: newScale }
  
          };
  
        }).filter(anim => anim.block.opacity > 0); // Remove fully faded blocks
  
      });
  
    }, [canvasSize.width, canvasSize.height, animatingBlocks]);
  
    
  
    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
  
      if (animatingBlocks.length > 0) return;
  
      
  
      const canvas = canvasRef.current;
  
      if (!canvas) return;
  
      const rect = canvas.getBoundingClientRect();
  
      const x = e.clientX - rect.left;
  
      const y = e.clientY - rect.top;
  
      
  
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
  
    
  
            const handleMatch = (block1: Block, block2: Block) => {
  
    
  
              if (isProcessingMatch.current) return; // Prevent multiple calls
  
    
  
              isProcessingMatch.current = true;
  
    
  
        
  
    
  
              const vowelData = vowels.find(v => v.vowel === block1.vowel);
  
    
  
        
  
    
  
              playClappingSound();
  
    
  
        
  
    
  
              // Open the box
  
    
  
              setIsBoxOpen(true);
  
    
  
              playChestOpenSound();
  
    
  
        
  
    
  
              // Start animation
  
    
  
              setAnimatingBlocks([
  
    
  
                { id: block1.id, block: { ...block1, opacity: 1, scale: 1 }, progress: 0 },
  
    
  
                { id: block2.id, block: { ...block2, opacity: 1, scale: 1 }, progress: 0 }
  
    
  
              ]);
  
    
  
        
  
    
  
              setSelectedBlock(null);
  
    
  
        
  
    
  
                    // Close the box and add to matched pairs after animation
  
    
  
        
  
    
  
                    setTimeout(() => {
  
    
  
        
  
    
  
                      if (vowelData && !matchedPairs.find(p => p.vowel === vowelData.vowel)) {
  
    
  
        
  
    
  
                        setMatchedPairs(prev => [...prev, vowelData]);
  
    
  
        
  
    
  
                        setScore(prev => prev + 10);
  
    
  
        
  
    
  
                      }
  
    
  
        
  
    
  
                      setAnimatingBlocks([]);
  
    
  
        
  
    
  
                      setBlocks(prev => prev.map(b => 
  
    
  
        
  
    
  
                        b.id === block1.id || b.id === block2.id ? { ...b, matched: true } : b
  
    
  
        
  
    
  
                      ));
  
    
  
        
  
    
  
                    }, 1000); // Blocks disappear after 1 second
  
    
  
        
  
    
  
              
  
    
  
        
  
    
  
                    // Close the box and allow new matches after 2 seconds
  
    
  
        
  
    
  
                    setTimeout(() => {
  
    
  
        
  
    
  
                      setIsBoxOpen(false);
  
    
  
        
  
    
  
                      playChestCloseSound();
  
    
  
        
  
    
  
                      isProcessingMatch.current = false; // Allow new matches after everything is done
  
    
  
        
  
    
  
                    }, 2000);
  
    
  
            };
  
    
  
    const playClappingSound = () => {
  
      const audio = new Audio('/audio/chestopenclose.mp3');
  
      audio.play();
  
    };

    const playChestOpenSound = () => {
      if (chestOpenAudioRef.current) {
        chestOpenAudioRef.current.pause();
        chestOpenAudioRef.current.currentTime = 0;
        chestOpenAudioRef.current.play();
      }
    };

    const playChestCloseSound = () => {
      if (chestCloseAudioRef.current) {
        chestCloseAudioRef.current.pause();
        chestCloseAudioRef.current.currentTime = 0;
        chestCloseAudioRef.current.play();
      }
    };
  
    
  
    const animateMatching = () => {
  
      setAnimatingBlocks(prev => {
  
        return prev.map(anim => {
  
          const newProgress = anim.progress + 0.03; // Faster animation
  
          const bucketX = canvasSize.width * (650 / 800);
          const bucketY = canvasSize.height * (400 / 600);
          const lidDisappearY = bucketY - (canvasSize.height * (20 / 600)); // Disappear just above the lid
          const targetX = bucketX + (canvasSize.width * (60 / 800));
  
          
  
          let newX, newY, newOpacity, newScale;
  
  
  
          if (newProgress < 0.5) {
  
            // Rise up and move towards bucket opening
  
            const riseProgress = newProgress / 0.5;
  
            newX = anim.block.x + (targetX - anim.block.x) * riseProgress;
  
            newY = anim.block.y - riseProgress * (anim.block.y - lidDisappearY);
  
            newOpacity = 1;
  
            newScale = 1;
  
          } else if (newProgress < 1) {
  
            // Fade out and shrink at the lid
  
            const fadeProgress = (newProgress - 0.5) / 0.5;
  
            newX = targetX;
  
            newY = lidDisappearY;
  
            newOpacity = 1 - fadeProgress;
  
            newScale = 1 - fadeProgress * 0.5; // Shrink slightly
  
          } else {
  
            // Animation complete, block should be fully transparent and tiny
  
            newX = targetX;
  
            newY = lidDisappearY;
  
            newOpacity = 0;
  
            newScale = 0;
  
          }
  
          
  
          return {
  
            ...anim,
  
            progress: newProgress,
  
            block: { ...anim.block, x: newX, y: newY, opacity: newOpacity, scale: newScale }
  
          };
  
        }).filter(anim => anim.block.opacity > 0); // Remove fully faded blocks
  
      });
  
    };
  
    
  
    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
  
      if (animatingBlocks.length > 0) return;
  
      
  
      const canvas = canvasRef.current;
  
      if (!canvas) return;
  
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
  
    
  
    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
  
      if (!draggedBlock) return;
  
  
  
      const canvas = canvasRef.current;
  
      if (!canvas) return;
  
      const rect = canvas.getBoundingClientRect();
  
      const x = e.clientX - rect.left;
  
      const y = e.clientY - rect.top;
  
  
  
      const chestWidth = canvasSize.width * (150 / 800);
      const chestHeight = canvasSize.height * (100 / 600);
      const chestX = (canvasSize.width - chestWidth) / 2;
      const chestY = canvasSize.height * (520 / 600) - chestHeight;
  
  
  
      const newX = x - dragOffset.x;
  
      const newY = y - dragOffset.y;
  
  
  
      // Obstacle collision detection
  
      if (
  
        newX > chestX - draggedBlock.width / 2 &&
  
        newX < chestX + chestWidth + draggedBlock.width / 2 &&
  
        newY > chestY - draggedBlock.height / 2 &&
  
        newY < chestY + chestHeight + draggedBlock.height / 2
  
      ) {
  
        // Don't move the block if it collides with the chest
  
        return;
  
      }
  
  
  
      setBlocks(prev => prev.map(block =>
  
        block.id === draggedBlock.id
  
          ? { ...block, x: newX, y: newY }
  
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
  
      setIsSorted(false); // Reset sort state
  
    };
  
  
  
    const handleSortMatchedPairs = () => {
  
      setMatchedPairs(prev => {
  
        const sorted = [...prev].sort((a, b) => {
  
          const indexA = malayalamVowelOrder.indexOf(a.vowel);
  
          const indexB = malayalamVowelOrder.indexOf(b.vowel);
  
          return indexA - indexB;
  
        });
  
        return sorted;
  
      });
  
      setIsSorted(true);
  
    };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 via-blue-100 to-purple-100 p-4">
      <div className="flex gap-6 max-w-7xl w-full">
        {/* Game Canvas */}
        <div className="flex-1 bg-white rounded-2xl shadow-2xl p-6 border-4 border-green-400">
          <div className="mb-4 text-center">
            <h1 className="text-3xl font-bold text-green-800 mb-2">
              മലയാളം സ്വരാക്ഷരങ്ങൾ LEGO Match
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
          
          <div ref={canvasWrapperRef} className="relative w-full" style={{ paddingTop: '75%' /* 4:3 Aspect Ratio */ }}>
            <canvas
              ref={canvasRef}
              onClick={handleCanvasClick}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className="absolute top-0 left-0 w-full h-full border-4 border-green-400 rounded-lg cursor-pointer shadow-xl"
            />
          </div>
          
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
            <button
              onClick={handleSortMatchedPairs}
              className="ml-2 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors"
            >
              {isSorted ? 'Re-sort' : 'Sort അ-അഃ'}
            </button>
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