'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const vowels = ['അ', 'ആ', 'ഇ', 'ഈ', 'ഉ'];
const MAZE_WIDTH = 6;
const MAZE_HEIGHT = 7;

// Proper maze generation using recursive backtracking
const generateProperMaze = (width = MAZE_WIDTH, height = MAZE_HEIGHT) => {
  const maze = Array(height).fill(0).map(() => Array(width).fill(0)); // 0 for walls
  const stack = [[0, 0]];
  maze[0][0] = 1;

  const directions = [
    [0, -2], // Up
    [2, 0],  // Right
    [0, 2],  // Down
    [-2, 0]  // Left
  ];

  while (stack.length > 0) {
    const [cx, cy] = stack[stack.length - 1];
    const neighbors = [];

    for (const [dx, dy] of directions) {
      const nx = cx + dx;
      const ny = cy + dy;
      if (nx >= 0 && nx < width && ny >= 0 && ny < height && maze[ny][nx] === 0) {
        neighbors.push([nx, ny, dx, dy]);
      }
    }

    if (neighbors.length > 0) {
      const [nx, ny, dx, dy] = neighbors[Math.floor(Math.random() * neighbors.length)];
      maze[ny][nx] = 1;
      maze[cy + dy / 2][cx + dx / 2] = 1;
      stack.push([nx, ny]);
    } else {
      stack.pop();
    }
  }

  const start = { x: 0, y: 0 };
  const goal = { x: width - 1, y: height - 1 };
  maze[goal.y][goal.x] = 2; // Mark as goal
  if (maze[goal.y - 1][goal.x] === 0 && maze[goal.y][goal.x-1] === 0) {
      maze[goal.y - 1][goal.x] = 1; // Ensure goal is reachable
  }

  return { maze, start, goal };
};

function createVowelTexture(vowel: string, size = 128) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, size, size);
    ctx.font = `bold ${size * 0.7}px Noto Sans Malayalam`;
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(vowel, size / 2, size / 2);
  }
  return new THREE.CanvasTexture(canvas);
}

export default function MalayalamVowelMaze() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const sceneRef = useRef(new THREE.Scene());
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const controlsRef = useRef<OrbitControls>();
  const playerRef = useRef<THREE.Mesh>();
  const mazeGroupRef = useRef<THREE.Group>();

  const [gameState, setGameState] = useState('ready');
  const [currentVowel, setCurrentVowel] = useState<string | null>(null);
  const [completedVowels, setCompletedVowels] = useState<string[]>([]);
  const [showInstructions, setShowInstructions] = useState(true);
  const mazeDataRef = useRef<{ maze: number[][], start: {x: number, y: number}, goal: {x: number, y: number} }>();

  // One-time scene setup
  useEffect(() => {
    if (!containerRef.current) return;
    const currentContainer = containerRef.current;

    sceneRef.current.background = new THREE.Color(0x1a2a3a);

    const camera = new THREE.PerspectiveCamera(75, currentContainer.clientWidth / currentContainer.clientHeight, 0.1, 1000);
    camera.position.set(MAZE_WIDTH / 2, 10, MAZE_HEIGHT);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(currentContainer.clientWidth, currentContainer.clientHeight);
    rendererRef.current = renderer;
    currentContainer.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(MAZE_WIDTH / 2, 0, MAZE_HEIGHT / 2);
    controls.enablePan = false;
    controls.maxPolarAngle = Math.PI / 2.2;
    controlsRef.current = controls;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    sceneRef.current.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7.5);
    sceneRef.current.add(directionalLight);

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(sceneRef.current, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = currentContainer.clientWidth / currentContainer.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(currentContainer.clientWidth, currentContainer.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Game state management
  useEffect(() => {
    const scene = sceneRef.current;

    // Clear previous game objects
    if (mazeGroupRef.current) {
      scene.remove(mazeGroupRef.current);
    }
    if (playerRef.current) {
      scene.remove(playerRef.current);
    }

    if (gameState === 'playing' && currentVowel) {
      mazeDataRef.current = generateProperMaze();
      const { maze, start } = mazeDataRef.current;

      // Render Maze
      const mazeGroup = new THREE.Group();
      for (let y = 0; y < MAZE_HEIGHT; y++) {
        for (let x = 0; x < MAZE_WIDTH; x++) {
          if (maze[y][x] > 0) {
            const isGoal = maze[y][x] === 2;
            const geometry = new THREE.BoxGeometry(1, 0.2, 1);
            const material = new THREE.MeshStandardMaterial({ color: isGoal ? 0xffa500 : 0x00cc00 });
            const cube = new THREE.Mesh(geometry, material);
            cube.position.set(x, 0, y);
            mazeGroup.add(cube);
          }
        }
      }
      scene.add(mazeGroup);
      mazeGroupRef.current = mazeGroup;

      // Create Player
      const playerGeometry = new THREE.SphereGeometry(0.4, 32, 32);
      const playerMaterial = new THREE.MeshStandardMaterial({
        map: createVowelTexture(currentVowel),
      });
      const player = new THREE.Mesh(playerGeometry, playerMaterial);
      player.position.set(start.x, 0.5, start.y);
      scene.add(player);
      playerRef.current = player;
    }
  }, [gameState, currentVowel]);

  const movePlayer = useCallback((dx: number, dz: number) => {
    if (!playerRef.current || !mazeDataRef.current) return;
    
    const { maze, goal } = mazeDataRef.current;
    const newX = Math.round(playerRef.current.position.x + dx);
    const newZ = Math.round(playerRef.current.position.z + dz);

    if (newX >= 0 && newX < MAZE_WIDTH && newZ >= 0 && newZ < MAZE_HEIGHT && maze[newZ][newX] > 0) {
      playerRef.current.position.x = newX;
      playerRef.current.position.z = newZ;

      if (newX === goal.x && newZ === goal.y) {
        if (currentVowel && !completedVowels.includes(currentVowel)) {
          setCompletedVowels(prev => [...prev, currentVowel]);
        }
        setGameState('completed');
      }
    }
  }, [currentVowel, completedVowels]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (gameState !== 'playing') return;
      switch (event.key) {
        case 'ArrowUp': movePlayer(0, -1); break;
        case 'ArrowDown': movePlayer(0, 1); break;
        case 'ArrowLeft': movePlayer(-1, 0); break;
        case 'ArrowRight': movePlayer(1, 0); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, movePlayer]);

  const startGame = (vowel: string) => {
    if (completedVowels.includes(vowel)) return;
    setCurrentVowel(vowel);
    setGameState('playing');
    setShowInstructions(false);
  };

  const retryLevel = () => {
    if (currentVowel) {
        setGameState('playing');
    }
  };

  const handleButtonClick = (key: string) => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key }));
  };

  return (
    <div className="w-full h-screen bg-gray-800 text-white flex flex-col items-center font-sans">
      <h1 className="text-3xl font-bold my-4">Malayalam Vowel Maze</h1>
      <div className="flex gap-4 mb-4 z-10">
        {vowels.map(v => (
          <button 
            key={v}
            onClick={() => startGame(v)}
            className={`px-4 py-2 rounded-lg text-2xl font-bold transition-transform duration-200 ${completedVowels.includes(v) ? 'bg-green-700 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:scale-105'}`}
            disabled={completedVowels.includes(v)}
          >
            {v}
          </button>
        ))}
      </div>
      <div ref={containerRef} className="w-full flex-1 relative -mt-16"> 
        <button onClick={() => setShowInstructions(!showInstructions)} className="absolute top-4 left-4 z-20 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg">
            How to play
        </button>

        {showInstructions && (
            <div className="absolute top-16 left-4 z-20 p-4 bg-gray-900/80 rounded-lg max-w-xs">
                <h3 className="text-xl font-bold mb-2">Instructions</h3>
                <ul className="list-disc list-inside space-y-1">
                    <li>Select a vowel from the top or press the start game button to load a maze to begin.</li>
                    <li>Use the direction buttons or arrow keys to move the ball.</li>
                    <li>Navigate the maze to reach the orange goal Vowel container tile.</li>
                    <li>Complete all vowels to win the game.</li>
                    <li>You can use the scroll wheel on your mouse to increase and decrease the size of the maze.</li>
                </ul>
            </div>
        )}

        {gameState === 'ready' && (
            <button onClick={() => startGame(vowels[0])} className="absolute top-4 right-4 z-20 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg">
                Start Game
            </button>
        )}

        {(gameState === 'completed' || completedVowels.length === vowels.length) && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-10">
            <div className="text-center p-8 bg-gray-900 rounded-xl shadow-lg">
              <h2 className="text-5xl font-bold mb-4 text-yellow-400">{completedVowels.length === vowels.length ? '🎉 You mastered all vowels! 🎉' : 'Goal Reached!'}</h2>
              <button onClick={() => { 
                if (completedVowels.length === vowels.length) setCompletedVowels([]);
                setGameState('ready'); 
              }} className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-xl">
                {completedVowels.length === vowels.length ? 'Play Again' : 'Select another vowel'}
              </button>
            </div>
          </div>
        )}

        {gameState === 'completed' && (
            <div className="absolute bottom-4 left-4 z-20 flex gap-4">
                <button onClick={retryLevel} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg">Retry</button>
                <button onClick={() => { setGameState('ready'); setCompletedVowels([]); }} className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg">New Game</button>
            </div>
        )}

        {gameState === 'playing' && (
            <div className="absolute right-12 top-1/2 -translate-y-1/2 z-20">
                <div className="grid grid-cols-3 gap-1 w-48">
                    <div className="col-start-2">
                        <button onClick={() => handleButtonClick('ArrowUp')} className="w-full pb-[100%] relative bg-gradient-to-b from-blue-500 to-blue-700 rounded-lg transform hover:scale-105 active:scale-95 transition-transform">
                            <span className="absolute inset-0 flex items-center justify-center text-xl">മുകളിൽ</span>
                        </button>
                    </div>
                    <div />
                    <div>
                        <button onClick={() => handleButtonClick('ArrowLeft')} className="w-full pb-[100%] relative bg-gradient-to-b from-blue-500 to-blue-700 rounded-lg transform hover:scale-105 active:scale-95 transition-transform">
                            <span className="absolute inset-0 flex items-center justify-center text-xl">ഇടത്</span>
                        </button>
                    </div>
                    <div />
                    <div>
                        <button onClick={() => handleButtonClick('ArrowRight')} className="w-full pb-[100%] relative bg-gradient-to-b from-blue-500 to-blue-700 rounded-lg transform hover:scale-105 active:scale-95 transition-transform">
                            <span className="absolute inset-0 flex items-center justify-center text-xl">വലത്</span>
                        </button>
                    </div>
                    <div />
                    <div className="col-start-2">
                        <button onClick={() => handleButtonClick('ArrowDown')} className="w-full pb-[100%] relative bg-gradient-to-b from-blue-500 to-blue-700 rounded-lg transform hover:scale-105 active:scale-95 transition-transform">
                            <span className="absolute inset-0 flex items-center justify-center text-xl">താഴെ</span>
                        </button>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}