Built a foundational 3D maze game
### Key Features Included:
- Malayalam vowels 'അ', 'ആ', 'ഇ', 'ഈ', 'ഉ' will be displayed on round block on top in a random order, 
- 3D graphics with Three.js showing block / tiles will be arranged in a grid pattern with the exception that blocks move or disappear to make a new path each time. I might need to replace the tiles with the tiles of my own design which i will do later myself.
- Core game logic following tile matching rules
- Controls for new game, pause/resume, hint, shuffle, right, left, up, down and undo
- A box with the name vowels written on it
- Game statistics such as timer, move counter, and score
- Responsive adjustments for mobile screens
- Game play is like this the player clicks on one of the vowels, then uses the right, left, up, down keys to move it through the mazes correct path of which there are other wrong paths as well like in maze games and if played correctly reached the vowel box.
- Once a vowel reaches the vowel box, the message appears congrats, and the maze configuration automatically changes after 2 secs and then the next vowel has to be chosen from the above round blocks and so on until the player finishes the game. 
### Technology Stack:
- Frontend: React 18, Three.js, @react-three/fiber


import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const vowels = ['അ', 'ആ', 'ഇ', 'ഈ', 'ഉ'];

// Maze generator - creates a solvable maze with one correct path
const generateMaze = (size = 7) => {
  const maze = Array(size).fill().map(() => Array(size).fill(0));
  
  // Start position (top-left area)
  const start = { x: 0, y: 0 };
  // Goal position (bottom-right area)
  const goal = { x: size - 1, y: size - 1 };
  
  // Create a random path from start to goal
  const path = [];
  let current = { ...start };
  path.push({ ...current });
  
  while (current.x !== goal.x || current.y !== goal.y) {
    const moves = [];
    if (current.x < goal.x) moves.push({ dx: 1, dy: 0 });
    if (current.y < goal.y) moves.push({ dx: 0, dy: 1 });
    if (current.x > 0 && Math.random() > 0.7) moves.push({ dx: -1, dy: 0 });
    if (current.y > 0 && Math.random() > 0.7) moves.push({ dx: 0, dy: -1 });
    
    const move = moves[Math.floor(Math.random() * moves.length)];
    current.x += move.dx;
    current.y += move.dy;
    current.x = Math.max(0, Math.min(size - 1, current.x));
    current.y = Math.max(0, Math.min(size - 1, current.y));
    
    if (!path.some(p => p.x === current.x && p.y === current.y)) {
      path.push({ ...current });
    }
  }
  
  // Mark the correct path
  path.forEach(p => {
    maze[p.y][p.x] = 1;
  });
  
  // Add some random paths (wrong paths)
  for (let i = 0; i < size * 2; i++) {
    const x = Math.floor(Math.random() * size);
    const y = Math.floor(Math.random() * size);
    if (Math.random() > 0.5) {
      maze[y][x] = 1;
    }
  }
  
  // Ensure start and goal are walkable
  maze[start.y][start.x] = 1;
  maze[goal.y][goal.x] = 2; // Goal tile
  
  return { maze, start, goal };
};

// Vowel selector at the top
const VowelSelector = ({ vowels, selectedVowel, onSelect, completedVowels }) => {
  return (
    <group position={[0, 4, 0]}>
      {vowels.map((vowel, idx) => {
        const isCompleted = completedVowels.includes(vowel);
        const isSelected = selectedVowel === vowel;
        const x = (idx - 2) * 1.5;
        
        return (
          <group key={vowel} position={[x, 0, 0]}>
            <mesh 
              onClick={() => !isCompleted && onSelect(vowel)}
              onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
              onPointerOut={(e) => { e.stopPropagation(); document.body.style.cursor = 'auto'; }}
            >
              <cylinderGeometry args={[0.5, 0.5, 0.3, 32]} />
              <meshStandardMaterial 
                color={isCompleted ? '#666' : isSelected ? '#4CAF50' : '#2196F3'} 
                emissive={isSelected ? '#4CAF50' : '#000'}
                emissiveIntensity={isSelected ? 0.3 : 0}
              />
            </mesh>
            <Text
              position={[0, 0, 0.16]}
              fontSize={0.4}
              color={isCompleted ? '#333' : '#fff'}
              anchorX="center"
              anchorY="middle"
            >
              {vowel}
            </Text>
            {isCompleted && (
              <Text
                position={[0, -0.8, 0]}
                fontSize={0.2}
                color="#4CAF50"
                anchorX="center"
                anchorY="middle"
              >
                ✓
              </Text>
            )}
          </group>
        );
      })}
    </group>
  );
};

// Vowel box (goal)
const VowelBox = ({ position }) => {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#FF9800" />
      </mesh>
      <Text
        position={[0, 0, 0.51]}
        fontSize={0.2}
        color="#fff"
        anchorX="center"
        anchorY="middle"
      >
        Vowels
      </Text>
    </group>
  );
};

// Maze tile
const MazeTile = ({ position, type, isPlayerOn }) => {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current && isPlayerOn) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 3) * 0.1;
    }
  });
  
  const color = type === 2 ? '#FF9800' : type === 1 ? '#4CAF50' : '#333';
  
  return (
    <mesh ref={meshRef} position={position} receiveShadow castShadow>
      <boxGeometry args={[0.9, 0.2, 0.9]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

// Player piece
const Player = ({ position, vowel }) => {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.2;
    }
  });
  
  return (
    <group position={[position.x, position.y + 0.5, position.z]}>
      <mesh ref={meshRef} castShadow>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color="#2196F3" emissive="#2196F3" emissiveIntensity={0.2} />
      </mesh>
      <Text
        position={[0, 0.5, 0]}
        fontSize={0.3}
        color="#fff"
        anchorX="center"
        anchorY="middle"
      >
        {vowel}
      </Text>
    </group>
  );
};

// Main game scene
const GameScene = ({ 
  mazeData, 
  playerPos, 
  selectedVowel, 
  onVowelSelect, 
  completedVowels,
  moveHistory 
}) => {
  const { maze, goal } = mazeData;
  const size = maze.length;
  const offset = (size - 1) / 2;
  
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <pointLight position={[0, 5, 0]} intensity={0.5} />
      
      <VowelSelector 
        vowels={vowels} 
        selectedVowel={selectedVowel}
        onSelect={onVowelSelect}
        completedVowels={completedVowels}
      />
      
      {/* Maze tiles */}
      {maze.map((row, y) => 
        row.map((cell, x) => {
          if (cell > 0) {
            const pos = [x - offset, 0, y - offset];
            const isPlayerOn = playerPos && playerPos.x === x && playerPos.y === y;
            return (
              <MazeTile 
                key={`${x}-${y}`} 
                position={pos} 
                type={cell}
                isPlayerOn={isPlayerOn}
              />
            );
          }
          return null;
        })
      )}
      
      {/* Goal box */}
      <VowelBox position={[goal.x - offset, 0.5, goal.y - offset]} />
      
      {/* Player */}
      {playerPos && selectedVowel && (
        <Player 
          position={[playerPos.x - offset, 0, playerPos.y - offset]} 
          vowel={selectedVowel}
        />
      )}
      
      <OrbitControls 
        enablePan={false}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.5}
        minDistance={8}
        maxDistance={15}
      />
    </>
  );
};

// Main game component
const MalayalamVowelMaze = () => {
  const [mazeData, setMazeData] = useState(() => generateMaze());
  const [playerPos, setPlayerPos] = useState(null);
  const [selectedVowel, setSelectedVowel] = useState(null);
  const [completedVowels, setCompletedVowels] = useState([]);
  const [moveHistory, setMoveHistory] = useState([]);
  const [gameState, setGameState] = useState('ready'); // ready, playing, paused, won
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [timer, setTimer] = useState(0);
  const [showCongrats, setShowCongrats] = useState(false);
  
  const timerRef = useRef(null);
  
  // Timer
  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = setInterval(() => {
        setTimer(t => t + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState]);
  
  // Handle vowel selection
  const handleVowelSelect = (vowel) => {
    if (completedVowels.includes(vowel)) return;
    setSelectedVowel(vowel);
    setPlayerPos({ ...mazeData.start });
    setMoveHistory([{ ...mazeData.start }]);
    if (gameState === 'ready') {
      setGameState('playing');
    }
  };
  
  // Move player
  const movePlayer = (dx, dy) => {
    if (!playerPos || !selectedVowel || gameState !== 'playing') return;
    
    const newX = playerPos.x + dx;
    const newY = playerPos.y + dy;
    const size = mazeData.maze.length;
    
    // Check bounds
    if (newX < 0 || newX >= size || newY < 0 || newY >= size) return;
    
    // Check if tile is walkable
    if (mazeData.maze[newY][newX] === 0) return;
    
    const newPos = { x: newX, y: newY };
    setPlayerPos(newPos);
    setMoveHistory([...moveHistory, newPos]);
    setMoves(m => m + 1);
    
    // Check if reached goal
    if (newX === mazeData.goal.x && newY === mazeData.goal.y) {
      handleVowelComplete();
    }
  };
  
  // Handle vowel completion
  const handleVowelComplete = () => {
    setCompletedVowels([...completedVowels, selectedVowel]);
    setScore(s => s + 100);
    setShowCongrats(true);
    setGameState('paused');
    
    setTimeout(() => {
      setShowCongrats(false);
      
      if (completedVowels.length + 1 === vowels.length) {
        setGameState('won');
      } else {
        // Generate new maze
        setMazeData(generateMaze());
        setPlayerPos(null);
        setSelectedVowel(null);
        setMoveHistory([]);
        setGameState('ready');
      }
    }, 2000);
  };
  
  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (gameState !== 'playing') return;
      
      switch(e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          movePlayer(0, -1);
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          movePlayer(0, 1);
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          movePlayer(-1, 0);
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          movePlayer(1, 0);
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [playerPos, gameState, selectedVowel]);
  
  // New game
  const handleNewGame = () => {
    setMazeData(generateMaze());
    setPlayerPos(null);
    setSelectedVowel(null);
    setCompletedVowels([]);
    setMoveHistory([]);
    setGameState('ready');
    setScore(0);
    setMoves(0);
    setTimer(0);
    setShowCongrats(false);
  };
  
  // Pause/Resume
  const togglePause = () => {
    if (gameState === 'playing') {
      setGameState('paused');
    } else if (gameState === 'paused') {
      setGameState('playing');
    }
  };
  
  // Undo
  const handleUndo = () => {
    if (moveHistory.length > 1 && gameState === 'playing') {
      const newHistory = moveHistory.slice(0, -1);
      setMoveHistory(newHistory);
      setPlayerPos(newHistory[newHistory.length - 1]);
      setMoves(m => m + 1);
    }
  };
  
  // Hint - show next correct move
  const handleHint = () => {
    if (!playerPos || gameState !== 'playing') return;
    // Simple hint: show direction to goal
    const dx = mazeData.goal.x - playerPos.x;
    const dy = mazeData.goal.y - playerPos.y;
    alert(`Hint: Try moving ${Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up')}`);
  };
  
  // Shuffle (regenerate maze)
  const handleShuffle = () => {
    if (gameState === 'ready' || gameState === 'paused') {
      setMazeData(generateMaze());
      setPlayerPos(null);
      setMoveHistory([]);
    }
  };
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="w-full h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-black bg-opacity-50 text-white p-4">
        <h1 className="text-3xl font-bold text-center mb-4">Malayalam Vowel Maze</h1>
        
        {/* Stats */}
        <div className="flex justify-around items-center mb-4 flex-wrap gap-2">
          <div className="bg-blue-600 px-4 py-2 rounded">
            <span className="font-semibold">Time: </span>{formatTime(timer)}
          </div>
          <div className="bg-green-600 px-4 py-2 rounded">
            <span className="font-semibold">Moves: </span>{moves}
          </div>
          <div className="bg-yellow-600 px-4 py-2 rounded">
            <span className="font-semibold">Score: </span>{score}
          </div>
          <div className="bg-purple-600 px-4 py-2 rounded">
            <span className="font-semibold">Completed: </span>{completedVowels.length}/{vowels.length}
          </div>
        </div>
        
        {/* Controls */}
        <div className="flex justify-center gap-2 flex-wrap">
          <button 
            onClick={handleNewGame}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded font-semibold transition"
          >
            New Game
          </button>
          <button 
            onClick={togglePause}
            disabled={gameState === 'ready' || gameState === 'won'}
            className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded font-semibold transition disabled:opacity-50"
          >
            {gameState === 'playing' ? 'Pause' : 'Resume'}
          </button>
          <button 
            onClick={handleHint}
            disabled={gameState !== 'playing'}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-semibold transition disabled:opacity-50"
          >
            Hint
          </button>
          <button 
            onClick={handleShuffle}
            disabled={gameState === 'playing'}
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded font-semibold transition disabled:opacity-50"
          >
            Shuffle
          </button>
          <button 
            onClick={handleUndo}
            disabled={gameState !== 'playing' || moveHistory.length <= 1}
            className="bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded font-semibold transition disabled:opacity-50"
          >
            Undo
          </button>
        </div>
        
        {/* Mobile controls */}
        <div className="flex justify-center gap-2 mt-4 md:hidden">
          <button 
            onClick={() => movePlayer(0, -1)}
            className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded font-bold"
          >
            ↑
          </button>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <button 
                onClick={() => movePlayer(-1, 0)}
                className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded font-bold"
              >
                ←
              </button>
              <button 
                onClick={() => movePlayer(0, 1)}
                className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded font-bold"
              >
                ↓
              </button>
              <button 
                onClick={() => movePlayer(1, 0)}
                className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded font-bold"
              >
                →
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Congratulations message */}
      {showCongrats && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 bg-green-500 text-white px-8 py-6 rounded-lg shadow-2xl text-center">
          <h2 className="text-4xl font-bold mb-2">🎉 Congratulations! 🎉</h2>
          <p className="text-xl">You completed {selectedVowel}!</p>
        </div>
      )}
      
      {/* Game won message */}
      {gameState === 'won' && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 bg-yellow-500 text-white px-8 py-6 rounded-lg shadow-2xl text-center">
          <h2 className="text-5xl font-bold mb-4">🏆 You Won! 🏆</h2>
          <p className="text-2xl mb-2">All vowels completed!</p>
          <p className="text-xl mb-4">
            Time: {formatTime(timer)} | Moves: {moves} | Score: {score}
          </p>
          <button 
            onClick={handleNewGame}
            className="bg-white text-yellow-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition"
          >
            Play Again
          </button>
        </div>
      )}
      
      {/* Instructions */}
      {gameState === 'ready' && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 bg-black bg-opacity-70 text-white px-6 py-3 rounded-lg text-center">
          <p className="text-lg">Click on a vowel above to start! Use arrow keys or WASD to move.</p>
        </div>
      )}
      
      {/* 3D Canvas */}
      <Canvas 
        camera={{ position: [0, 8, 8], fov: 50 }}
        shadows
        className="absolute inset-0"
      >
        <GameScene 
          mazeData={mazeData}
          playerPos={playerPos}
          selectedVowel={selectedVowel}
          onVowelSelect={handleVowelSelect}
          completedVowels={completedVowels}
          moveHistory={moveHistory}
        />
      </Canvas>
    </div>
  );
};

export default MalayalamVowelMaze;