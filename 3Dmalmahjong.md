Built a foundational 3D Mahjong Solitaire game resembling the classic Windows Mahjong design.

### Key Features Included:
- 3D graphics with Three.js showing tiles in pyramid layout. I will need to replace the tiles with the tiles of my own design which i will do later myself.
- Core game logic following tile matching rules
- Controls for new game, pause/resume, hint, shuffle, and undo
- Game statistics such as timer, move counter, and score
- Leaderboard backend for completed game records
- Visual styling reflecting a traditional Mahjong theme
- Responsive adjustments for mobile screens

### Technology Stack:
- Frontend: React 18, Three.js, @react-three/fiber

Code inspiration logic below,

import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Pause, Play, Lightbulb, Shuffle, RotateCcw, Trophy } from 'lucide-react';

const TILE_TYPES = [
  '🀀', '🀁', '🀂', '🀃',
  '🀄', '🀅', '🀆',
  '🀇', '🀈', '🀉', '🀊', '🀋', '🀌', '🀍', '🀎', '🀏',
  '🀐', '🀑', '🀒', '🀓', '🀔', '🀕', '🀖', '🀗', '🀘',
  '🀙', '🀚', '🀛', '🀜', '🀝', '🀞', '🀟', '🀠', '🀡',
  '🀢', '🀣', '🀤', '🀥', '🀦', '🀧', '🀨', '🀩'
];

const LAYOUT = [
  { layer: 0, positions: [
    [0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0],[9,0],[10,0],[11,0],
    [1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[7,1],[8,1],[9,1],[10,1],
    [0,2],[1,2],[2,2],[3,2],[4,2],[5,2],[6,2],[7,2],[8,2],[9,2],[10,2],[11,2],
    [1,3],[2,3],[3,3],[4,3],[5,3],[6,3],[7,3],[8,3],[9,3],[10,3],
    [0,4],[1,4],[2,4],[3,4],[4,4],[5,4],[6,4],[7,4],[8,4],[9,4],[10,4],[11,4],
    [1,5],[2,5],[3,5],[4,5],[5,5],[6,5],[7,5],[8,5],[9,5],[10,5],
    [0,6],[1,6],[2,6],[3,6],[4,6],[5,6],[6,6],[7,6],[8,6],[9,6],[10,6],[11,6],
    [1,7],[2,7],[3,7],[4,7],[5,7],[6,7],[7,7],[8,7],[9,7],[10,7]
  ]},
  { layer: 1, positions: [
    [2,1],[3,1],[4,1],[5,1],[6,1],[7,1],[8,1],[9,1],
    [2,2],[3,2],[4,2],[5,2],[6,2],[7,2],[8,2],[9,2],
    [2,3],[3,3],[4,3],[5,3],[6,3],[7,3],[8,3],[9,3],
    [2,4],[3,4],[4,4],[5,4],[6,4],[7,4],[8,4],[9,4],
    [2,5],[3,5],[4,5],[5,5],[6,5],[7,5],[8,5],[9,5],
    [2,6],[3,6],[4,6],[5,6],[6,6],[7,6],[8,6],[9,6]
  ]},
  { layer: 2, positions: [
    [3,2],[4,2],[5,2],[6,2],[7,2],[8,2],
    [3,3],[4,3],[5,3],[6,3],[7,3],[8,3],
    [3,4],[4,4],[5,4],[6,4],[7,4],[8,4],
    [3,5],[4,5],[5,5],[6,5],[7,5],[8,5]
  ]},
  { layer: 3, positions: [
    [4,3],[5,3],[6,3],[7,3],
    [4,4],[5,4],[6,4],[7,4]
  ]},
  { layer: 4, positions: [[5,3],[6,3]] }
];

function generateTiles() {
  const tiles = [];
  let id = 0;
  
  LAYOUT.forEach(({ layer, positions }) => {
    positions.forEach(([x, z]) => {
      tiles.push({ id: id++, x, z, layer, type: null, matched: false });
    });
  });
  
  const shuffled = [...tiles].sort(() => Math.random() - 0.5);
  for (let i = 0; i < shuffled.length; i += 2) {
    const type = TILE_TYPES[Math.floor(Math.random() * TILE_TYPES.length)];
    shuffled[i].type = type;
    if (i + 1 < shuffled.length) {
      shuffled[i + 1].type = type;
    }
  }
  
  return tiles;
}

function createTileTexture(type) {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, 128, 128);
  ctx.font = 'bold 80px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(type, 64, 64);
  return canvas;
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function isTileClickable(tile, allTiles, gameState) {
  if (tile.matched || gameState !== 'playing') return false;
  
  const tilesAbove = allTiles.filter(t => 
    !t.matched && t.layer === tile.layer + 1 &&
    Math.abs(t.x - tile.x) <= 1 && Math.abs(t.z - tile.z) <= 1
  );
  if (tilesAbove.length > 0) return false;
  
  const leftBlocked = allTiles.some(t => 
    !t.matched && t.layer === tile.layer && t.x === tile.x - 1 &&
    Math.abs(t.z - tile.z) <= 1
  );
  const rightBlocked = allTiles.some(t => 
    !t.matched && t.layer === tile.layer && t.x === tile.x + 1 &&
    Math.abs(t.z - tile.z) <= 1
  );
  
  return !(leftBlocked && rightBlocked);
}

export default function MahjongGame() {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const tilesRef = useRef([]);
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());
  const hoveredTileRef = useRef(null);
  const animationFrameRef = useRef(null);
  
  const [tiles, setTiles] = useState(generateTiles());
  const [selectedTiles, setSelectedTiles] = useState([]);
  const [hintedTiles, setHintedTiles] = useState([]);
  const [gameState, setGameState] = useState('ready');
  const [time, setTime] = useState(0);
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [history, setHistory] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const timerRef = useRef(null);
  
  useEffect(() => {
    loadLeaderboard();
  }, []);
  
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
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x2d5016);
    sceneRef.current = scene;
    
    const camera = new THREE.PerspectiveCamera(
      50,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1, 1000
    );
    camera.position.set(0, 12, 12);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;
    
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);
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
    
    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);
    
    const handleMouseMove = (event) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };
    renderer.domElement.addEventListener('mousemove', handleMouseMove);
    
    const handleClick = () => {
      if (hoveredTileRef.current && gameState === 'playing') {
        const tile = tiles.find(t => t.id === hoveredTileRef.current.userData.tileId);
        if (tile && isTileClickable(tile, tiles, gameState)) {
          handleTileClick(tile);
        }
      }
    };
    renderer.domElement.addEventListener('click', handleClick);
    
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      
      if (cameraRef.current && gameState === 'playing') {
        raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
        const intersects = raycasterRef.current.intersectObjects(tilesRef.current, true);
        
        if (hoveredTileRef.current) {
          const tile = tiles.find(t => t.id === hoveredTileRef.current.userData.tileId);
          if (tile && !selectedTiles.includes(tile.id) && !hintedTiles.includes(tile.id)) {
            updateTileColor(hoveredTileRef.current, tile, tiles, selectedTiles, hintedTiles, false);
          }
          hoveredTileRef.current = null;
        }
        
        if (intersects.length > 0) {
          let mesh = intersects[0].object;
          while (mesh.parent && !mesh.userData.tileId) {
            mesh = mesh.parent;
          }
          if (mesh.userData.tileId !== undefined) {
            const tile = tiles.find(t => t.id === mesh.userData.tileId);
            if (tile && isTileClickable(tile, tiles, gameState) && !selectedTiles.includes(tile.id) && !hintedTiles.includes(tile.id)) {
              hoveredTileRef.current = mesh;
              updateTileColor(mesh, tile, tiles, selectedTiles, hintedTiles, true);
            }
          }
        }
      }
      
      renderer.render(scene, camera);
    };
    animate();
    
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('mousemove', handleMouseMove);
      renderer.domElement.removeEventListener('click', handleClick);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);
  
  useEffect(() => {
    if (!sceneRef.current) return;
    
    tilesRef.current.forEach(mesh => {
      sceneRef.current.remove(mesh);
    });
    tilesRef.current = [];
    
    tiles.forEach(tile => {
      if (!tile.matched) {
        const tileMesh = createTileMesh(tile, tiles, selectedTiles, hintedTiles);
        tilesRef.current.push(tileMesh);
        sceneRef.current.add(tileMesh);
      }
    });
  }, [tiles, selectedTiles, hintedTiles]);
  
  function createTileMesh(tile, allTiles, selected, hinted) {
    const group = new THREE.Group();
    group.userData.tileId = tile.id;
    
    const isSelected = selected.includes(tile.id);
    const isHinted = hinted.includes(tile.id);
    const color = isSelected ? 0xffd700 : isHinted ? 0xff6b6b : 0xf5e6d3;
    
    const geometry = new THREE.BoxGeometry(1, 0.25, 1);
    const material = new THREE.MeshStandardMaterial({ color });
    const mesh = new THREE.Mesh(geometry, material);
    group.add(mesh);
    
    const topGeometry = new THREE.PlaneGeometry(0.8, 0.8);
    const topMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const topMesh = new THREE.Mesh(topGeometry, topMaterial);
    topMesh.rotation.x = -Math.PI / 2;
    topMesh.position.y = 0.126;
    group.add(topMesh);
    
    const texture = new THREE.CanvasTexture(createTileTexture(tile.type));
    const symbolGeometry = new THREE.PlaneGeometry(0.6, 0.6);
    const symbolMaterial = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
    const symbolMesh = new THREE.Mesh(symbolGeometry, symbolMaterial);
    symbolMesh.rotation.x = -Math.PI / 2;
    symbolMesh.position.y = 0.127;
    group.add(symbolMesh);
    
    const x = tile.x * 1.1 - 6;
    const y = tile.layer * 0.3 + (isSelected ? 0.5 : 0);
    const z = tile.z * 1.1 - 4;
    group.position.set(x, y, z);
    
    return group;
  }
  
  function updateTileColor(mesh, tile, allTiles, selected, hinted, isHovered) {
    const isSelected = selected.includes(tile.id);
    const isHintedTile = hinted.includes(tile.id);
    const color = isSelected ? 0xffd700 : isHintedTile ? 0xff6b6b : isHovered ? 0xe8d4a0 : 0xf5e6d3;
    mesh.children[0].material.color.setHex(color);
  }
  
  async function loadLeaderboard() {
    try {
      const keys = await window.storage.list('mahjong:score:', true);
      if (keys && keys.keys) {
        const scores = await Promise.all(
          keys.keys.map(async key => {
            try {
              const result = await window.storage.get(key, true);
              return result ? JSON.parse(result.value) : null;
            } catch {
              return null;
            }
          })
        );
        const validScores = scores.filter(s => s !== null);
        validScores.sort((a, b) => b.score - a.score);
        setLeaderboard(validScores.slice(0, 10));
      }
    } catch (err) {
      console.error('Error loading leaderboard:', err);
    }
  }
  
  async function saveScore(name, finalScore, finalTime, finalMoves) {
    try {
      const entry = {
        name, score: finalScore, time: finalTime,
        moves: finalMoves, date: new Date().toISOString()
      };
      const key = `mahjong:score:${Date.now()}`;
      await window.storage.set(key, JSON.stringify(entry), true);
      await loadLeaderboard();
    } catch (err) {
      console.error('Error saving score:', err);
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
  }
  
  function togglePause() {
    setGameState(gameState === 'playing' ? 'paused' : 'playing');
  }
  
  function findAvailablePairs() {
    const available = tiles.filter(tile => isTileClickable(tile, tiles, gameState));
    
    for (let i = 0; i < available.length; i++) {
      for (let j = i + 1; j < available.length; j++) {
        if (available[i].type === available[j].type) {
          return [available[i], available[j]];
        }
      }
    }
    return null;
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
      return { ...t, type };
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
  
  function handleTileClick(tile) {
    if (gameState !== 'playing') return;
    
    if (selectedTiles.includes(tile.id)) {
      setSelectedTiles([]);
      return;
    }
    
    if (selectedTiles.length === 0) {
      setSelectedTiles([tile.id]);
    } else {
      const firstTile = tiles.find(t => t.id === selectedTiles[0]);
      if (firstTile.type === tile.type) {
        const newTiles = tiles.map(t => {
          if (t.id === firstTile.id || t.id === tile.id) {
            return { ...t, matched: true };
          }
          return t;
        });
        setTiles(newTiles);
        setHistory([...history, [firstTile.id, tile.id]]);
        setMoves(m => m + 1);
        setScore(s => s + 100);
        setSelectedTiles([]);
      } else {
        setSelectedTiles([tile.id]);
      }
    }
  }
  
  async function submitScore() {
    if (playerName.trim()) {
      await saveScore(playerName, score, time, moves);
      setShowLeaderboard(true);
    }
  }
  
  return (
    <div className="w-full h-screen bg-gradient-to-b from-green-900 to-green-700 flex flex-col">
      <div className="bg-amber-900 text-amber-100 p-4 shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-2">Mahjong Solitaire</h1>
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
        </div>
      </div>
      
      <div className="flex-1 relative">
        <div ref={containerRef} className="w-full h-full" />
        
        {gameState === 'paused' && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
            <div className="text-white text-4xl font-bold">PAUSED</div>
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
                  onClick={submitScore}
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
      
      <div className="bg-amber-900 p-4 flex justify-center gap-2 flex-wrap">
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
          </>
        )}
      </div>
    </div>
  );
}