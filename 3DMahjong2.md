'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { Pause, Play, Lightbulb, Shuffle, RotateCcw, Trophy } from 'lucide-react';

const TILE_TYPES = [
  'അ', 'ആ', 'ഇ', 'ഈ', 'ഉ', 'ഊ', 'എ', 'ഏ', 'ഐ', 'ഒ', 'ഓ', 'ഔ',
  'ക', 'ഖ', 'ഗ', 'ഘ', 'ങ', 'ച', 'ഛ', 'ജ', 'ഝ', 'ഞ', 'ട', 'ഠ',
  'ഡ', 'ഢ', 'ണ', 'ത', 'ഥ', 'ദ', 'ധ', 'ന', 'പ', 'ഫ', 'ബ', 'ഭ',
  'മ', 'യ', 'ര', 'ല', 'വ', 'ശ', 'ഷ', 'സ', 'ഹ', 'ള', 'ഴ', 'റ'
];

interface Tile {
  id: number;
  x: number;
  z: number;
  layer: number;
  type: string | null;
  matched: boolean;
}

const LAYOUT = [
  { layer: 0, positions: [
    [0,0],[1,0],[2,0],[3,0],[4,0],[5,0],
    [0,1],[1,1],[2,1],[3,1],[4,1],[5,1],
    [0,2],[1,2],[2,2],[3,2],[4,2],[5,2],
    [0,3],[1,3],[2,3],[3,3],[4,3],[5,3],
    [0,4],[1,4],[2,4],[3,4],[4,4],[5,4],
    [0,5],[1,5],[2,5],[3,5],[4,5],[5,5]
  ]},
  { layer: 1, positions: [
    [1,1],[2,1],[3,1],[4,1],
    [1,2],[2,2],[3,2],[4,2],
    [1,3],[2,3],[3,3],[4,3],
    [1,4],[2,4],[3,4],[4,4]
  ]},
  { layer: 2, positions: [
    [2,2],[3,2],
    [2,3],[3,3]
  ]}
];

function generateTiles(): Tile[] {
  const tiles: Tile[] = [];
  let id = 0;
  
  LAYOUT.forEach(({ layer, positions }) => {
    positions.forEach(([x, z]) => {
      tiles.push({ id: id++, x, z, layer, type: null, matched: false });
    });
  });
  
  const types = [];
  for (let i = 0; i < tiles.length / 2; i++) {
    const type = TILE_TYPES[Math.floor(Math.random() * TILE_TYPES.length)];
    types.push(type, type);
  }

  const shuffledTypes = types.sort(() => Math.random() - 0.5);

  for (let i = 0; i < tiles.length; i++) {
    tiles[i].type = shuffledTypes[i];
  }
  
  return tiles;
}

function createTileTexture(type: string | null): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (ctx && type) {
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 80px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(type, 64, 64);
  }
  return canvas;
}

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function isTileClickable(tile: Tile, allTiles: Tile[]): boolean {
  if (tile.matched) return false;
  
  // Check if there are any tiles directly above this one
  const hasTileAbove = allTiles.some(t => 
    !t.matched && 
    t.layer === tile.layer + 1 &&
    t.x === tile.x && 
    t.z === tile.z
  );
  
  // If there's a tile directly above, this tile is blocked
  if (hasTileAbove) return false;
  
  // For Mahjong Solitaire, a tile is free if:
  // 1. It has no tile directly above it, AND
  // 2. It has at least one free side (left OR right)
  const hasFreeLeft = !allTiles.some(t => 
    !t.matched && 
    t.layer === tile.layer && 
    t.z === tile.z && 
    t.x === tile.x - 1
  );
  
  const hasFreeRight = !allTiles.some(t => 
    !t.matched && 
    t.layer === tile.layer && 
    t.z === tile.z && 
    t.x === tile.x + 1
  );
  
  return hasFreeLeft || hasFreeRight;
}

export default function Mahjong3DGame2() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const tilesRef = useRef<THREE.Group[]>([]);
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());
  const animationFrameRef = useRef<number | null>(null);

  const [tiles, setTiles] = useState<Tile[]>([]);
  const [selectedTiles, setSelectedTiles] = useState<number[]>([]);
  const [hintedTiles, setHintedTiles] = useState<number[]>([]);
  const [gameState, setGameState] = useState('ready');
  const [time, setTime] = useState(0);
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [history, setHistory] = useState<number[][]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [debugMode, setDebugMode] = useState(false);
  const [availablePairs, setAvailablePairs] = useState(0);
  const [noMoreMoves, setNoMoreMoves] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Simplified tile click handler
  const handleTileClick = useCallback((tileId: number) => {
    if (gameState !== 'playing') return;
    
    const tile = tiles.find(t => t.id === tileId);
    if (!tile) {
      return;
    }
    
    const clickable = isTileClickable(tile, tiles);
    
    if (!clickable) return;
    
    if (selectedTiles.includes(tileId)) {
      setSelectedTiles([]);
      return;
    }
    
    if (selectedTiles.length === 0) {
      setSelectedTiles([tileId]);
    } else {
      const firstTile = tiles.find(t => t.id === selectedTiles[0]);
      if (firstTile && firstTile.type === tile.type) {
        // Match found!
        const newTiles = tiles.map(t => {
          if (t.id === firstTile.id || t.id === tileId) {
            return { ...t, matched: true };
          }
          return t;
        });
        setTiles(newTiles);
        setHistory([...history, [firstTile.id, tileId]]);
        setMoves(m => m + 1);
        setScore(s => s + 100);
        setSelectedTiles([]);
      } else {
        // No match, select new tile
        setSelectedTiles([tileId]);
      }
    }
  }, [gameState, selectedTiles, tiles, history]);

  const handleTileClickRef = useRef(handleTileClick);
  useEffect(() => {
    handleTileClickRef.current = handleTileClick;
  }, [handleTileClick]);

  // Initialize the game
  useEffect(() => {
    if (gameState === 'ready') {
      setTiles(generateTiles());
    }
  }, [gameState]);

  // Timer effect
  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = setInterval(() => {
        setTime(t => t + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState]);
  
  // Win condition effect
  useEffect(() => {
    if (gameState === 'playing') {
      const remaining = tiles.filter(t => !t.matched).length;
      if (remaining === 0) {
        setGameState('won');
        const finalScore = score + Math.max(0, 10000 - time * 10);
        setScore(finalScore);
      }
    }
  }, [tiles, gameState, score, time]);

  // Check for available moves and update pair count
  useEffect(() => {
    if (gameState === 'playing') {
      const pairCount = countAvailablePairs();
      setAvailablePairs(pairCount);
      if (pairCount === 0) {
        setNoMoreMoves(true);
      } else {
        setNoMoreMoves(false);
      }
    }
  }, [tiles, gameState]);

  // Three.js scene setup
  useEffect(() => {
    if (!containerRef.current) return;

    const currentContainer = containerRef.current;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x2d5016);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      45, // Increased FOV for better visibility
      currentContainer.clientWidth / currentContainer.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 12, 12); // Better camera position
    camera.lookAt(0, 2, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(currentContainer.clientWidth, currentContainer.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Better performance
    currentContainer.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight1.position.set(10, 10, 5);
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
    directionalLight2.position.set(-10, 10, -5);
    scene.add(directionalLight2);

    const groundGeometry = new THREE.PlaneGeometry(30, 20);
    const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x2d5016 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.1;
    scene.add(ground);

    // Improved click handler
    const handleClick = (event: MouseEvent) => {
      console.log('=== 🖱️ CLICK EVENT START ===');

      if (gameState !== 'playing') return;

      const rect = currentContainer.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycasterRef.current.setFromCamera(new THREE.Vector2(x, y), camera);

      // Directly intersect with tile groups (not their children)
      const intersects = raycasterRef.current.intersectObjects(tilesRef.current, true);
      console.log('🔍 Intersects found:', intersects.length);

      if (intersects.length > 0) {
        // The first intersect should be with a tile group
        let tileObject = intersects[0].object;
        let tileId = tileObject.userData?.tileId;

        // If not found on object, check parent
        if (tileId === undefined && tileObject.parent) {
          tileId = tileObject.parent.userData?.tileId;
        }

        console.log('✅ Tile ID found:', tileId);
        console.log('✅ Intersected object:', tileObject);

        if (tileId !== undefined) {
          handleTileClickRef.current(tileId);
        } else {
          console.log('❌ No tile ID on intersected object');
        }
      } else {
        console.log('❌ No intersections with tiles');
      }
      console.log('=== 🖱️ CLICK EVENT END ===\n');
    };

    renderer.domElement.addEventListener('click', handleClick);

    const handleResize = () => {
      if (!containerRef.current) return;
      const width = currentContainer.clientWidth;
      const height = currentContainer.clientHeight;
      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = width / height;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(width, height);
      }
    };
    window.addEventListener('resize', handleResize);

    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement) {
        renderer.domElement.removeEventListener('click', handleClick);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (currentContainer && renderer.domElement) {
        currentContainer.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [gameState]);
  
  // Tile rendering effect
  useEffect(() => {
    if (!sceneRef.current) return;

    // Clear existing tiles
    tilesRef.current.forEach(mesh => {
      sceneRef.current!.remove(mesh);
    });
    tilesRef.current = [];

    // Add new tiles
    const unmatchedTiles = tiles.filter(tile => !tile.matched);
    
    unmatchedTiles.forEach(tile => {
      const tileMesh = createTileMesh(tile);
      if (tileMesh) {
        tilesRef.current.push(tileMesh);
        sceneRef.current!.add(tileMesh);
        
        // Log the problematic tile for debugging
        if (tile.x === 0 && tile.z === 0 && tile.layer === 0) {
        }
      }
    });

    // Force a render
    if (rendererRef.current && sceneRef.current && cameraRef.current) {
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    }
  }, [tiles, selectedTiles, hintedTiles]);
  
    function createTileMesh(tile: Tile) {
      try {
        const group = new THREE.Group();
        
        // Store tile data directly on the group
        group.userData.tileId = tile.id;
        
        const isSelected = selectedTiles.includes(tile.id);
        const isHinted = hintedTiles.includes(tile.id);
        const isClickable = isTileClickable(tile, tiles);
  
        let color;
        const baseColor = 0xf5e6d3;
        const layerColorVariation = tile.layer * 0.05;
        const baseColorWithLayer = baseColor - (layerColorVariation * 0x101010);
  
        if (debugMode) {
          color = isClickable ? 0x00ff00 : 0xff0000;
        } else {
          color = isSelected ? 0xffd700 : isHinted ? 0xff6b6b : baseColorWithLayer;
        }
        
        // Main tile body - make it the primary click target
        const geometry = new THREE.BoxGeometry(1.05, 0.25, 1.05); // Increased size
        const material = new THREE.MeshStandardMaterial({ 
          color,
          transparent: true,
          opacity: isClickable ? 1.0 : 0.8
        });
        const mesh = new THREE.Mesh(geometry, material);
        
        // Also store tile ID on the main mesh for easier access
        mesh.userData.tileId = tile.id;
        
        group.add(mesh);
        
        // Top face
        const topGeometry = new THREE.PlaneGeometry(0.8, 0.8);
        const topMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const topMesh = new THREE.Mesh(topGeometry, topMaterial);
        topMesh.rotation.x = -Math.PI / 2;
        topMesh.position.y = 0.126;
        group.add(topMesh);
        
        if (tile.type) {
          const texture = new THREE.CanvasTexture(createTileTexture(tile.type));
          const symbolGeometry = new THREE.PlaneGeometry(0.6, 0.6);
          const symbolMaterial = new THREE.MeshBasicMaterial({ 
            map: texture, 
            transparent: true,
            side: THREE.DoubleSide
          });
          const symbolMesh = new THREE.Mesh(symbolGeometry, symbolMaterial);
          symbolMesh.rotation.x = -Math.PI / 2;
          symbolMesh.position.y = 0.127;
          group.add(symbolMesh);
        }
        
        // Positioning
        const boardWidth = 6;
        const boardDepth = 6;
        const x = (tile.x - boardWidth/2 + 0.5) * 1.1;
        const y = tile.layer * 0.3 + (isSelected ? 0.2 : 0);
        const z = (tile.z - boardDepth/2 + 0.5) * 1.1;
        
        group.position.set(x, y, z);
        
        return group;
      } catch (error) {
        console.error('Error creating tile mesh:', error);
        return null;
      }
    }  
  function newGame() {
    const newTiles = generateTiles();
    setTiles(newTiles);
    setSelectedTiles([]);
    setHintedTiles([]);
    setGameState('playing');
    setTime(0);
    setMoves(0);
    setScore(0);
    setHistory([]);
    setShowLeaderboard(false);
    setNoMoreMoves(false);
  }
  
  function togglePause() {
    setGameState(gameState === 'playing' ? 'paused' : 'playing');
  }
  
  function findAvailablePairs() {
    const available = tiles.filter(tile => isTileClickable(tile, tiles));
    
    for (let i = 0; i < available.length; i++) {
      for (let j = i + 1; j < available.length; j++) {
        if (available[i].type === available[j].type) {
          return [available[i], available[j]];
        }
      }
    }
    return null;
  }

  function countAvailablePairs() {
    const available = tiles.filter(tile => isTileClickable(tile, tiles));
    const typeCounts = new Map<string, number>();

    available.forEach(tile => {
      if (tile.type) {
        typeCounts.set(tile.type, (typeCounts.get(tile.type) || 0) + 1);
      }
    });

    let pairCount = 0;
    typeCounts.forEach(count => {
      pairCount += Math.floor(count / 2);
    });

    return pairCount;
  }

  function showHint() {
    const pair = findAvailablePairs();
    if (pair) {
      setHintedTiles([pair[0].id, pair[1].id]);
      setTimeout(() => setHintedTiles([]), 2000);
      setScore(s => Math.max(0, s - 50));
    }
  }
  
  function shuffleTiles() {
    const unmatched = tiles.filter(t => !t.matched);
    const types = unmatched.map(t => t.type);
    
    for (let i = types.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [types[i], types[j]] = [types[j], types[i]];
    }
    
    const newTiles = tiles.map((t) => {
      if (t.matched) return t;
      const type = types.shift();
      return { ...t, type: type || null };
    });
    
    setTiles(newTiles);
    setScore(s => Math.max(0, s - 100));
    setSelectedTiles([]);
  }
  
  function undo() {
    if (history.length === 0) return;
    
    const lastMove = history[history.length - 1];
    const newTiles = tiles.map(t => {
      if (lastMove.includes(t.id)) {
        return { ...t, matched: false };
      }
      return t;
    });
    
    setTiles(newTiles);
    setHistory(history.slice(0, -1));
    setMoves(m => m - 1);
    setScore(s => Math.max(0, s - 50));
    setSelectedTiles([]);
  }

  function setCameraView(view: 'top' | 'side' | 'corner') {
    if (!cameraRef.current) return;
    
    switch (view) {
      case 'top':
        cameraRef.current.position.set(0, 15, 0.1);
        cameraRef.current.lookAt(0, 0, 0);
        break;
      case 'side':
        cameraRef.current.position.set(0, 8, 12);
        cameraRef.current.lookAt(0, 2, 0);
        break;
      case 'corner':
        cameraRef.current.position.set(8, 10, 8);
        cameraRef.current.lookAt(0, 2, 0);
        break;
    }
  }

  // Rest of your UI code remains the same...
  return (
    <div className="w-full h-screen bg-gradient-to-b from-green-900 to-green-700 flex flex-col relative"> {/* Added relative */}
      {/* Header */}
      <div className="bg-amber-900 text-amber-100 p-4 shadow-lg z-10"> {/* Added z-10 */}
        <h1 className="text-3xl font-bold text-center mb-2">Malayalam Mahjong Solitaire</h1>
        <div className="flex justify-around max-w-4xl mx-auto text-sm">
          <div className="text-center">
            <div className="font-semibold">Time</div>
            <div className="text-xl font-mono">{formatTime(time)}</div>
          </div>
          <div className="text-center">
            <div className="font-semibold">Moves</div>
            <div className="text-xl font-mono">{moves}</div>
          </div>
          <div className="text-center">
            <div className="font-semibold">Score</div>
            <div className="text-xl font-mono">{score}</div>
          </div>
          <div className="text-center">
            <div className="font-semibold">Tiles</div>
            <div className="text-xl font-mono">{tiles.filter(t => !t.matched).length}</div>
          </div>
          <div className="text-center">
            <div className="font-semibold">Matches</div>
            <div className="text-xl font-mono">{availablePairs}</div>
          </div>
        </div>
      </div>
      
      {/* Game Container */}
      <div className="flex-1 relative min-h-0 z-0"> {/* Added z-0 */}
        <div ref={containerRef} className="w-full h-full" />
        {/* ... overlays ... */}
        {gameState === 'paused' && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
            <div className="text-white text-4xl font-bold">PAUSED</div>
          </div>
        )}

        {noMoreMoves && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
            <div className="text-white text-4xl font-bold">No more moves! Please shuffle.</div>
          </div>
        )}
        
        {gameState === 'won' && !showLeaderboard && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4">
            <div className="bg-amber-100 p-8 rounded-lg shadow-2xl max-w-md w-full">
              <h2 className="text-3xl font-bold text-center mb-4 text-amber-900">🎉 Congratulations! 🎉</h2>
              <div className="space-y-2 mb-6 text-lg">
                <div className="flex justify-between">
                  <span className="font-semibold">Final Score:</span>
                  <span>{score}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Time:</span>
                  <span>{formatTime(time)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Moves:</span>
                  <span>{moves}</span>
                </div>
              </div>
              <input
                type="text"
                placeholder="Enter your name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full p-2 border-2 border-amber-500 rounded mb-4"
                maxLength={20}
              />
              <div className="flex gap-2">
                <button
                  // onClick={submitScore}
                  disabled={!playerName.trim()}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded disabled:opacity-50"
                >
                  Save Score
                </button>
                <button
                  onClick={newGame}
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded"
                >
                  New Game
                </button>
              </div>
            </div>
          </div>
        )}
        
        {showLeaderboard && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4">
            <div className="bg-amber-100 p-8 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
              <h2 className="text-3xl font-bold text-center mb-6 text-amber-900 flex items-center justify-center gap-2">
                <Trophy className="w-8 h-8" />
                Leaderboard
              </h2>
              <div className="space-y-2 mb-6">
                {leaderboard.map((entry, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-white rounded shadow">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-amber-600 w-8">{idx + 1}</span>
                      <span className="font-semibold">{entry.name}</span>
                    </div>
                    <div className="flex gap-6 text-sm">
                      <span className="font-mono">{entry.score} pts</span>
                      <span className="font-mono">{formatTime(entry.time)}</span>
                      <span className="font-mono">{entry.moves} moves</span>
                    </div>
                  </div>
                ))}
                {leaderboard.length === 0 && (
                  <div className="text-center text-gray-500 py-8">No scores yet. Be the first!</div>
                )}
              </div>
              <button
                onClick={() => { setShowLeaderboard(false); newGame(); }}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded"
              >
                New Game
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Controls - Fixed positioning */}
      <div className="bg-amber-900 p-3 flex justify-center gap-2 flex-wrap z-20 relative"> {/* Added z-20 and relative */}
        {gameState === 'ready' ? (
          <button
            onClick={newGame}
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-lg font-semibold"
          >
            New Game
          </button>
        ) : (
          <>
            <button
              onClick={newGame}
              className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-semibold"
            >
              New Game
            </button>
            <button
              onClick={togglePause}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center gap-2"
            >
              {gameState === 'paused' ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              {gameState === 'paused' ? 'Resume' : 'Pause'}
            </button>
            <button
              onClick={showHint}
              disabled={gameState !== 'playing'}
              className="bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-lg flex items-center gap-2 disabled:opacity-50"
            >
              <Lightbulb className="w-4 h-4" />
              Hint (-50)
            </button>
            <button
              onClick={shuffleTiles}
              disabled={gameState !== 'playing'}
              className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg flex items-center gap-2 disabled:opacity-50"
            >
              <Shuffle className="w-4 h-4" />
              Shuffle (-100)
            </button>
            <button
              onClick={undo}
              disabled={gameState !== 'playing' || history.length === 0}
              className="bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-lg flex items-center gap-2 disabled:opacity-50"
            >
              <RotateCcw className="w-4 h-4" />
              Undo (-50)
            </button>
            <button
              onClick={() => setShowLeaderboard(true)}
              className="bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-lg flex items-center gap-2"
            >
              <Trophy className="w-4 h-4" />
              Leaderboard
            </button>
            <button
              onClick={() => setDebugMode(!debugMode)}
              className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg"
            >
              {debugMode ? 'Debug: ON' : 'Debug: OFF'}
            </button>
            <div className="flex gap-1">
              <button onClick={() => setCameraView('top')} className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-2 rounded text-sm">
                Top View
              </button>
              <button onClick={() => setCameraView('side')} className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-2 rounded text-sm">
                Side View
              </button>
              <button onClick={() => setCameraView('corner')} className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-2 rounded text-sm">
                Corner View
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}


Later enhancements, A 3D Mahjong-inspired game rendered in a Roblox-style environment with Malayalam characters instead of Chinese characters. The game blends traditional Mahjong rules with an educational Malayalam twist in a Kerala-inspired setting.

Players match tiles; when matched:

The tile pronounces the Malayalam letter.

The tiles animate (fly off) to a side panel for matched-tile display.

Background music and effects enrich the atmosphere.

atching pair logic:

Play Malayalam pronunciation audio.

Animate matched tiles (bounce + fly off to side panel).

Add to scoreboard and matched-tile display.

4. Audio System (Background & Effects)

Background Music:

Light instrumental loop (flute, veena, or calm temple ambiance).

Toggle button in UI (On/Off).

Default: ON at low volume.

Sound Effects:

Tile click: soft “tap” sound.

Tile fly-off: whoosh or swish sound.

Tile match confirmed: subtle chime + pronunciation audio.

Background ambient sounds (optional layering): birds, bells, water trickle.

Malayalam Pronunciations:

Pre-record each Malayalam letter in a clear native voice.

Play immediately on tile click and again on match.

5. UI / UX

Side Panel:

Displays matched tiles in order.

Small glowing highlight when a new pair arrives.

Top HUD:

Score counter.

Timer.

Buttons: Restart, Shuffle, Music Toggle, Tutorial.

Responsive controls:

Orbit, zoom, and reset camera.

Works on both desktop and mobile browsers.

6. Animations & Visual Effects

Tile selection: glow/scale-up effect.

Matched tiles: bounce + fly-off to side panel.

Small confetti burst or particle sparkle when matches occur.

Environment animations: day–night transition (stretch goal).

7. Multiplatform Deployment

Web-first (Next.js + react-three-fiber).

Optimized for desktop & mobile WebGL.

PWA-ready (offline play + home-screen install).

8. Stretch Goals (Future)

Word mode: match tiles to form valid Malayalam words.

Multiplayer competitive mode.

Festival themes: Onam, Vishu, Pooram.

Leaderboards & achievements.

🔹 Deliverables

Full 3D Kerala-inspired Roblox-style game environment.

3D Mahjong tile system with Malayalam characters.

Mahjong gameplay mechanics with stacking & matching rules.

Audio system: background music (toggleable), sound effects (click, fly-off, match), Malayalam pronunciation audio.

UI: side panel, score, timer, shuffle, restart, tutorial, music toggle.

Smooth animations for tiles & environment.
