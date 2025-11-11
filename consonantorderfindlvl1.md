import React, { useState } from 'react';

const MalayalamConsonantGame = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [kittenPosition, setKittenPosition] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  
  const consonants = ['ക', 'ഖ', 'ഗ', 'ഘ', 'ങ'];
  
  // Randomize the display order but keep track of correct sequence
  const [displayOrder] = useState(() => {
    const indices = [0, 1, 2, 3, 4];
    // Shuffle array
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return indices;
  });
  
  const stonePositions = [
    { x: 20, y: 50, rotation: -12 },
    { x: 35, y: 40, rotation: 8 },
    { x: 50, y: 52, rotation: -5 },
    { x: 65, y: 38, rotation: 15 },
    { x: 80, y: 48, rotation: -8 }
  ];

  const lotusPositions = [
    { x: 15, y: 70 },
    { x: 45, y: 75 },
    { x: 75, y: 68 },
    { x: 28, y: 65 }
  ];

  const handleStoneClick = (displayIndex) => {
    if (gameOver || gameWon) return;
    
    // Find which consonant this is in the correct sequence
    const consonantIndex = displayOrder[displayIndex];
    
    if (consonantIndex === currentStep) {
      setKittenPosition(displayIndex + 1);
      setCurrentStep(currentStep + 1);
      
      if (consonantIndex === 4) {
        setTimeout(() => {
          setGameWon(true);
        }, 800);
      }
    } else {
      setGameOver(true);
    }
  };

  const resetGame = () => {
    setCurrentStep(0);
    setKittenPosition(0);
    setGameOver(false);
    setGameWon(false);
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-sky-200 to-sky-100 flex items-center justify-center p-8">
      <div className="relative w-full max-w-5xl h-[700px] bg-gradient-to-b from-green-100 to-green-50 rounded-3xl shadow-2xl">
        
        {/* Title */}
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-center">
          <h1 className="text-4xl font-bold text-purple-800 mb-2">Help Kitten Cross the Pond! 🐱</h1>
          <p className="text-lg text-gray-700">Click the consonants in order: ക → ഖ → ഗ → ഘ → ങ</p>
        </div>

        {/* Progress indicator */}
        <div className="absolute top-32 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-90 px-8 py-4 rounded-full shadow-lg">
          <p className="text-xl font-bold text-gray-800">
            Progress: {currentStep} / 5
          </p>
        </div>

        {/* Pond and Game Elements */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[95%] h-[85%]">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Irregular pond shape - layered for natural look - DOUBLED SIZE */}
            <path d="M 5 50 Q 8 20, 25 12 Q 50 8, 75 12 Q 92 20, 95 50 Q 93 75, 78 88 Q 50 94, 22 88 Q 7 75, 5 50 Z" 
                  fill="#3A7BC8" opacity="0.7" />
            <path d="M 7 50 Q 10 22, 26 15 Q 50 10, 74 15 Q 90 22, 93 50 Q 91 73, 76 85 Q 50 91, 24 85 Q 9 73, 7 50 Z" 
                  fill="#4A90E2" opacity="0.8" />
            <path d="M 9 50 Q 12 25, 28 18 Q 50 13, 72 18 Q 88 25, 91 50 Q 89 71, 74 82 Q 50 88, 26 82 Q 11 71, 9 50 Z" 
                  fill="#5BA3F5" opacity="0.6" />
            
            {/* Water ripples */}
            <ellipse cx="25" cy="60" rx="8" ry="5" fill="#6BB5FF" opacity="0.3" />
            <ellipse cx="60" cy="65" rx="10" ry="6" fill="#6BB5FF" opacity="0.3" />
            <ellipse cx="40" cy="72" rx="7" ry="4" fill="#6BB5FF" opacity="0.2" />
            <ellipse cx="75" cy="58" rx="6" ry="4" fill="#6BB5FF" opacity="0.25" />
            
            {/* Lotus flowers */}
            {lotusPositions.map((pos, i) => (
              <g key={i} transform={`translate(${pos.x}, ${pos.y})`}>
                <circle cx="0" cy="0" r="2" fill="#86D293" />
                <ellipse cx="-1.2" cy="0" rx="1.5" ry="1.8" fill="#F48FB1" opacity="0.8" />
                <ellipse cx="1.2" cy="0" rx="1.5" ry="1.8" fill="#F48FB1" opacity="0.8" />
                <ellipse cx="0" cy="-1.2" rx="1.8" ry="1.5" fill="#F48FB1" opacity="0.8" />
                <circle cx="0" cy="0" r="0.6" fill="#FDD835" />
              </g>
            ))}
          </svg>

          {/* Stones with consonants - irregular rock shapes */}
          {stonePositions.map((pos, displayIndex) => {
            const consonantIndex = displayOrder[displayIndex];
            const isClicked = consonantIndex < currentStep;
            
            return (
              <div
                key={displayIndex}
                style={{
                  position: 'absolute',
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  transform: `translate(-50%, -50%) rotate(${pos.rotation}deg)`,
                }}
                onClick={() => !isClicked && handleStoneClick(displayIndex)}
                className={!isClicked ? 'cursor-pointer' : 'cursor-not-allowed'}
              >
                {/* Rock base with irregular shape */}
                <svg width="70" height="70" viewBox="0 0 70 70" className="absolute top-0 left-0">
                  <defs>
                    <filter id={`shadow${displayIndex}`}>
                      <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.5"/>
                    </filter>
                  </defs>
                  {/* Multi-layered irregular rock shape */}
                  <path d="M 15 35 L 8 28 L 12 18 L 22 10 L 35 8 L 48 10 L 58 18 L 62 28 L 55 35 L 58 45 L 50 55 L 35 60 L 20 55 L 12 45 Z" 
                        fill="#2C2C2C" 
                        filter={`url(#shadow${displayIndex})`}
                        className={isClicked ? 'opacity-40' : ''} />
                  <path d="M 18 35 L 12 30 L 15 22 L 24 15 L 35 12 L 46 15 L 54 22 L 57 30 L 52 35 L 54 43 L 47 51 L 35 55 L 23 51 L 16 43 Z" 
                        fill="#3F3F3F" 
                        opacity={isClicked ? "0.4" : "0.9"} />
                  {/* Gray patches */}
                  <ellipse cx="25" cy="25" rx="8" ry="6" fill="#6B6B6B" opacity={isClicked ? "0.3" : "0.6"} transform="rotate(20 25 25)" />
                  <ellipse cx="45" cy="35" rx="7" ry="9" fill="#5C5C5C" opacity={isClicked ? "0.25" : "0.5"} transform="rotate(-15 45 35)" />
                  {/* Moss patches - green elements */}
                  <ellipse cx="20" cy="40" rx="6" ry="4" fill="#4A7C59" opacity={isClicked ? "0.35" : "0.7"} transform="rotate(30 20 40)" />
                  <ellipse cx="42" cy="22" rx="5" ry="3" fill="#5C8A6F" opacity={isClicked ? "0.3" : "0.6"} transform="rotate(-25 42 22)" />
                  <circle cx="35" cy="48" r="4" fill="#3D6B4E" opacity={isClicked ? "0.25" : "0.5"} />
                  
                  {/* Consonant letter directly on rock - white color */}
                  {!isClicked && (
                    <text 
                      x="35" 
                      y="40" 
                      fontSize="24" 
                      fontWeight="bold" 
                      fill="white" 
                      textAnchor="middle" 
                      dominantBaseline="middle"
                      style={{
                        filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.8))',
                        pointerEvents: 'none'
                      }}
                    >
                      {consonants[consonantIndex]}
                    </text>
                  )}
                </svg>
              </div>
            );
          })}

          {/* Kitten - jumps to rocks after clicking */}
          <div
            style={{
              position: 'absolute',
              left: kittenPosition === 0 ? '-8%' : `${stonePositions[kittenPosition - 1].x}%`,
              top: kittenPosition === 0 ? '50%' : `${stonePositions[kittenPosition - 1].y}%`,
              transform: 'translate(-50%, -50%)',
              transition: 'all 0.8s ease-in-out',
              zIndex: 10,
            }}
            className="text-6xl"
          >
            🐱
          </div>

          {/* Mother Cat */}
          <div
            style={{
              position: 'absolute',
              right: '-8%',
              top: '50%',
              transform: 'translate(0, -50%)',
            }}
            className="text-7xl"
          >
            🐈
          </div>
        </div>

        {/* Game Over Modal */}
        {gameOver && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center rounded-3xl">
            <div className="text-center p-10 bg-white rounded-3xl shadow-2xl max-w-md">
              <div className="text-7xl mb-4">💦</div>
              <h2 className="text-4xl font-bold text-red-600 mb-4">Oops! Kitten fell in!</h2>
              <p className="text-lg text-gray-600 mb-6">Click the consonants in the correct order</p>
              <button
                onClick={resetGame}
                className="px-10 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-2xl font-bold rounded-full shadow-lg hover:scale-110 transition-transform cursor-pointer"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Victory Modal */}
        {gameWon && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center rounded-3xl">
            <div className="text-center p-10 bg-white rounded-3xl shadow-2xl max-w-md">
              <div className="text-7xl mb-4">🎉</div>
              <h2 className="text-4xl font-bold text-green-600 mb-4">Success!</h2>
              <p className="text-xl text-gray-700 mb-6">Kitten reached Mom! 🐱❤️🐈</p>
              <button
                onClick={resetGame}
                className="px-10 py-4 bg-gradient-to-r from-green-500 to-blue-500 text-white text-2xl font-bold rounded-full shadow-lg hover:scale-110 transition-transform cursor-pointer"
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MalayalamConsonantGame;