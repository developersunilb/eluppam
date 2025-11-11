import React, { useState, useEffect, useRef } from 'react';

const MalayalamGridGame = () => {
  const [gamePhase, setGamePhase] = useState('start'); // start, learning, playing, completed, timeout
  const [learningTime, setLearningTime] = useState(60);
  const [playingTime, setPlayingTime] = useState(60);
  const [score, setScore] = useState(0);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [grid, setGrid] = useState([]);
  const [originalGrid, setOriginalGrid] = useState([]);
  
  const gridData = [
    { letter: 'ക', color: '#000000', row: 0 },
    { letter: 'ഖ', color: '#000000', row: 0 },
    { letter: 'ഗ', color: '#000000', row: 0 },
    { letter: 'ഘ', color: '#000000', row: 0 },
    { letter: 'ങ', color: '#000000', row: 0 },
    
    { letter: 'ച', color: '#DC143C', row: 1 },
    { letter: 'ഛ', color: '#DC143C', row: 1 },
    { letter: 'ജ', color: '#DC143C', row: 1 },
    { letter: 'ഝ', color: '#DC143C', row: 1 },
    { letter: 'ഞ', color: '#DC143C', row: 1 },
    
    { letter: 'ട', color: '#FFD700', row: 2 },
    { letter: 'ഠ', color: '#FFD700', row: 2 },
    { letter: 'ഡ', color: '#FFD700', row: 2 },
    { letter: 'ഢ', color: '#FFD700', row: 2 },
    { letter: 'ണ', color: '#FFD700', row: 2 },
    
    { letter: 'ത', color: '#8B4513', row: 3 },
    { letter: 'ഥ', color: '#8B4513', row: 3 },
    { letter: 'ദ', color: '#8B4513', row: 3 },
    { letter: 'ധ', color: '#8B4513', row: 3 },
    { letter: 'ന', color: '#8B4513', row: 3 },
    
    { letter: 'പ', color: '#228B22', row: 4 },
    { letter: 'ഫ', color: '#228B22', row: 4 },
    { letter: 'ബ', color: '#228B22', row: 4 },
    { letter: 'ഭ', color: '#228B22', row: 4 },
    { letter: 'മ', color: '#228B22', row: 4 },
  ];
  
  useEffect(() => {
    setOriginalGrid([...gridData]);
    setGrid([...gridData]);
  }, []);
  
  useEffect(() => {
    let timer;
    
    if (gamePhase === 'learning' && learningTime > 0) {
      timer = setInterval(() => {
        setLearningTime(prev => {
          if (prev <= 1) {
            startPlaying();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (gamePhase === 'playing' && playingTime > 0) {
      timer = setInterval(() => {
        setPlayingTime(prev => {
          if (prev <= 1) {
            handleTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(timer);
  }, [gamePhase, learningTime, playingTime]);
  
  const startLearning = () => {
    setGamePhase('learning');
    setLearningTime(60);
    setPlayingTime(60);
    setGrid([...gridData]);
    setOriginalGrid([...gridData]);
  };
  
  const startPlaying = () => {
    const shuffled = [...gridData].sort(() => Math.random() - 0.5);
    setGrid(shuffled);
    setGamePhase('playing');
  };
  
  const handleTimeout = () => {
    setGamePhase('timeout');
  };
  
  const resetGame = () => {
    setGamePhase('start');
    setLearningTime(60);
    setPlayingTime(60);
    setGrid([...gridData]);
    setScore(0);
  };
  
  const nextGame = () => {
    setGamePhase('learning');
    setLearningTime(60);
    setPlayingTime(60);
    setGrid([...gridData]);
    setOriginalGrid([...gridData]);
  };
  
  const handleDragStart = (index) => {
    if (gamePhase !== 'playing') return;
    setDraggedIndex(index);
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  
  const handleDrop = (targetIndex) => {
    if (gamePhase !== 'playing' || draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      return;
    }
    
    const newGrid = [...grid];
    const temp = newGrid[draggedIndex];
    newGrid[draggedIndex] = newGrid[targetIndex];
    newGrid[targetIndex] = temp;
    
    setGrid(newGrid);
    setDraggedIndex(null);
    
    checkWin(newGrid);
  };
  
  const handleTouchStart = (index) => {
    if (gamePhase !== 'playing') return;
    setDraggedIndex(index);
  };
  
  const handleTouchEnd = (targetIndex) => {
    if (gamePhase !== 'playing' || draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      return;
    }
    
    const newGrid = [...grid];
    const temp = newGrid[draggedIndex];
    newGrid[draggedIndex] = newGrid[targetIndex];
    newGrid[targetIndex] = temp;
    
    setGrid(newGrid);
    setDraggedIndex(null);
    
    checkWin(newGrid);
  };
  
  const checkWin = (currentGrid) => {
    const isCorrect = currentGrid.every((cell, index) => 
      cell.letter === originalGrid[index].letter
    );
    
    if (isCorrect) {
      const timeBonus = playingTime * 10;
      setScore(prev => prev + 100 + timeBonus);
      setGamePhase('completed');
    }
  };
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const getCorrectCount = () => {
    return grid.filter((cell, index) => 
      cell.letter === originalGrid[index].letter
    ).length;
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-8">
      <div className="flex gap-8 max-w-6xl w-full">
        {/* Game Container */}
        <div className="flex-1 bg-white rounded-2xl shadow-2xl p-8 border-4 border-indigo-300">
          <div className="mb-6 text-center">
            <h1 className="text-4xl font-bold text-indigo-800 mb-2">
              മലയാളം വ്യഞ്ജനം ഗ്രിഡ്
            </h1>
            <h2 className="text-2xl font-semibold text-purple-600">
              Malayalam Consonant Grid Memory
            </h2>
          </div>
          
          {/* Status Display */}
          <div className="mb-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border-2 border-indigo-200">
            <div className="flex justify-between items-center">
              <div className="text-lg font-semibold text-gray-700">
                {gamePhase === 'start' && 'Learn the consonants below'}
                {gamePhase === 'learning' && '📚 Learning Phase - Memorize!'}
                {gamePhase === 'playing' && '🎯 Playing - Arrange the Grid!'}
                {gamePhase === 'completed' && '🎉 Congratulations! Perfect!'}
                {gamePhase === 'timeout' && '⏰ Time Up! Try Again!'}
              </div>
              <div className="text-2xl font-bold text-indigo-600">
                {gamePhase === 'learning' && `⏱️ ${formatTime(learningTime)}`}
                {gamePhase === 'playing' && `⏱️ ${formatTime(playingTime)}`}
              </div>
            </div>
            {gamePhase === 'playing' && (
              <div className="mt-2 text-sm font-medium text-gray-600">
                Correct: {getCorrectCount()} / 25
              </div>
            )}
          </div>
          
          {/* 5x5 Grid */}
          <div className="grid grid-cols-5 gap-3 mb-6">
            {grid.map((cell, index) => (
              <div
                key={index}
                draggable={gamePhase === 'playing'}
                onDragStart={() => handleDragStart(index)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(index)}
                onTouchStart={() => handleTouchStart(index)}
                onTouchEnd={() => handleTouchEnd(index)}
                style={{ backgroundColor: cell.color }}
                className={`
                  aspect-square flex items-center justify-center rounded-lg
                  text-white font-bold text-4xl shadow-lg border-4 border-opacity-50
                  transition-all duration-200
                  ${gamePhase === 'playing' ? 'cursor-move hover:scale-105 hover:shadow-xl' : 'cursor-default'}
                  ${draggedIndex === index ? 'opacity-50 scale-95' : ''}
                  ${cell.letter === originalGrid[index].letter && gamePhase === 'playing' ? 'border-green-400' : 'border-white'}
                `}
              >
                {cell.letter}
              </div>
            ))}
          </div>
          
          {/* Instructions */}
          <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
            <h3 className="font-bold text-blue-800 mb-2">📖 How to Play:</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• <strong>Learning Phase:</strong> You have 1 minute to memorize the order</li>
              <li>• <strong>Playing Phase:</strong> Drag and drop to rearrange in correct order</li>
              <li>• <strong>Color Groups:</strong> Black, Red, Yellow, Brown, Green (5 rows)</li>
              <li>• <strong>Goal:</strong> Match the original grid before time runs out!</li>
            </ul>
          </div>
        </div>
        
        {/* Control Panel */}
        <div className="w-64 space-y-4">
          {/* Score Display */}
          <div className="bg-gradient-to-br from-yellow-400 to-orange-400 rounded-xl shadow-lg p-6 border-4 border-yellow-300">
            <div className="text-center">
              <div className="text-sm font-semibold text-white mb-1">SCORE</div>
              <div className="text-4xl font-bold text-white">{score}</div>
            </div>
          </div>
          
          {/* Control Buttons */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-4 border-indigo-300 space-y-3">
            {gamePhase === 'start' && (
              <button
                onClick={startLearning}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-6 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 text-lg"
              >
                ▶️ PLAY
              </button>
            )}
            
            {(gamePhase === 'completed' || gamePhase === 'timeout') && (
              <>
                <button
                  onClick={resetGame}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
                >
                  🔄 Play Again
                </button>
                <button
                  onClick={nextGame}
                  className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
                >
                  ➡️ Next Game
                </button>
              </>
            )}
          </div>
          
          {/* Legend */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-4 border-indigo-300">
            <h3 className="font-bold text-indigo-800 mb-3 text-center">Color Guide</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-black rounded"></div>
                <span className="text-sm font-medium">Row 1: ക-ങ</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded" style={{backgroundColor: '#DC143C'}}></div>
                <span className="text-sm font-medium">Row 2: ച-ഞ</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded" style={{backgroundColor: '#FFD700'}}></div>
                <span className="text-sm font-medium">Row 3: ട-ണ</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded" style={{backgroundColor: '#8B4513'}}></div>
                <span className="text-sm font-medium">Row 4: ത-ന</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded" style={{backgroundColor: '#228B22'}}></div>
                <span className="text-sm font-medium">Row 5: പ-മ</span>
              </div>
            </div>
          </div>
          
          {/* Tips */}
          <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl shadow-lg p-4 border-2 border-pink-200">
            <h3 className="font-bold text-pink-800 mb-2 text-sm">💡 Pro Tips:</h3>
            <ul className="text-xs text-gray-700 space-y-1">
              <li>• Focus on color groups</li>
              <li>• Remember the first letter of each row</li>
              <li>• Work row by row</li>
              <li>• Bonus points for faster completion!</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MalayalamGridGame;