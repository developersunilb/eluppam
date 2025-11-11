'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const FindCatMomGame = () => {
  // Initial positions
  const KITTEN_START_POSITION = { top: '85%', left: '75%' };
  const MOM_CAT_POSITION = { top: '25%', left: '25%' };

  type Position = { top: string; left: string; };

  // Define the actual positions of the hardcoded consonants
  const consonantPositions: Record<string, Position> = {
    'ക': { top: 'calc(65% + 35px)', left: '65%' },
    'ഖ': { top: 'calc(45% + 15px)', left: '95%' },
    'ഗ': { top: 'calc(55% - 5px)', left: 'calc(35% - 10px)' },
    'ഘ': { top: 'calc(35% + 3px)', left: 'calc(65% - 35px)' },
    'ങ': { top: 'calc(35% - 25px)', left: 'calc(35% + 15px)' },
    // Add other consonants if they are present on the board
    // For now, these are the only interactable ones mentioned in the game path
  };

  // Game Path - sequence of consonants
  const gamePath = ['ക', 'ഖ', 'ഗ', 'ഘ', 'ങ'];

  // State variables
  const [kittenPosition, setKittenPosition] = useState(KITTEN_START_POSITION);
  const [currentStep, setCurrentStep] = useState(0); // Index of the next consonant to click in gamePath
  const [foundLetters, setFoundLetters] = useState<string[]>([]);
  const [isLearnCompleted, setIsLearnCompleted] = useState(false);
  const [showLearnModal, setShowLearnModal] = useState(false);
  const [message, setMessage] = useState('Help the kitten find its mom!');
  const [showWrongConsonantPopup, setShowWrongConsonantPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [isJumping, setIsJumping] = useState(false);
  const [showJumpingPopup, setShowJumpingPopup] = useState(false);
  const [kittenSize, setKittenSize] = useState({ width: 50, height: 50 });
  const [activeConsonants, setActiveConsonants] = useState<string[]>(Object.keys(consonantPositions)); // Consonants currently on board

  // Placeholder for audio function
  const playAudio = (consonant: string) => {
    console.log(`Playing audio for ${consonant}`);
    // Implement actual audio playback here
  };

  // Function to calculate grid position (assuming 600x800px game area)
  const getGridPosition = (row: number, col: number) => {
    return {
      left: `${((col + 0.5) / 8) * 100}%`,
      top: `${((row + 0.5) / 8) * 100}%`,
    };
  };

  const [currentStepLearn, setCurrentStepLearn] = useState(0);

  const resetGame = () => {
    setKittenPosition(KITTEN_START_POSITION);
    setCurrentStep(0);
    setFoundLetters([]);
    setIsLearnCompleted(false);
    setIsJumping(false);
    setMessage('Help the kitten find its mom!');
    setActiveConsonants(Object.keys(consonantPositions));
    setKittenImageSrc('/game/assets/image/consfindlvl1/sadcat.png');
    setShowSuccessPopup(false);
    setCurrentStepLearn(0);
    setKittenSize({ width: 50, height: 50 });
  };

  // Handle consonant click in the Learn Modal
  const handleLearnConsonantClick = (consonant: string, index: number) => {
    if (index === currentStepLearn) {
      playAudio(consonant);
      if (currentStepLearn < gamePath.length - 1) {
        setCurrentStepLearn(prev => prev + 1);
      } else {
        // All consonants learned
        setIsLearnCompleted(true);
        setShowLearnModal(false);
        setMessage('Learning complete! Now, find \'ക\' on the board.');
      }
    }
  };

  const [kittenImageSrc, setKittenImageSrc] = useState('/game/assets/image/consfindlvl1/sadcat.png');

  // Handle initial jump for 'ക'
  useEffect(() => {
    if (isLearnCompleted && currentStep === 0) {
      setMessage('Click on the lily pad with \'ക\' to start!');
    }
  }, [isLearnCompleted, currentStep]);

  // Handle consonant click on the game board
  const handleConsonantClick = async (consonant: string) => {
    if (isJumping) {
      setShowJumpingPopup(true);
      return;
    }

    if (!isLearnCompleted) {
      setMessage('Please click "Learn" and complete the learning section to activate the game.');
      return;
    }

    if (consonant === gamePath[currentStep]) {
      setIsJumping(true);
      // Correct consonant clicked
      setMessage('Correct!');
      playAudio(consonant); // Play audio for the correct consonant

      const targetPosition = consonantPositions[consonant];
      if (targetPosition) {
        // Remove consonant from active display
        setActiveConsonants(prev => prev.filter(c => c !== consonant));
        setFoundLetters(prev => [...prev, consonant]);

        // Specific jumping logic for 'ക'
        if (consonant === 'ക') {
          // Jump to the center of grid 48 and 56
          setKittenPosition({
            top: '75%',
            left: '93.75%',
          });
          await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds

          // Jump to grid 6, 3rd row from the bottom (row 5, col 5)
          const secondJumpPos = getGridPosition(5, 5); 
          setKittenPosition(secondJumpPos);
          setIsJumping(false);
          setMessage('Now click on the next consonant: ഖ');
        } else if (consonant === 'ഖ') {
          // Jump to 10px above bottom of grid 40
          setKittenPosition({ top: 'calc(62.5% - 20px)', left: '93.75%' });
          await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds

          // Jump to top of grid 39
          setKittenPosition({ top: '50%', left: '81.25%' });
          await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds

          // Jump to 10px above bottom of grid 32
          setKittenPosition({ top: 'calc(50% - 10px)', left: '93.75%' });
          setIsJumping(false);
          setMessage('Now click on the next consonant: ഗ');
        } else if (consonant === 'ഗ') {
          // Jump to 15px above grid 30 (row 3, col 5)
          const firstJumpPos = getGridPosition(3, 5);
          setKittenPosition({
            ...firstJumpPos,
            top: `calc(${firstJumpPos.top} - 15px)`,
          });
          await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds

          // Jump to grid 29 (row 3, col 4)
          const secondJumpPos = getGridPosition(3, 4);
          setKittenPosition(secondJumpPos);
          await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds

          // Jump to 15px above grid 35 (row 4, col 2)
          const finalJumpPos = getGridPosition(4, 2);
          setKittenPosition({
            ...finalJumpPos,
            top: `calc(${finalJumpPos.top} - 15px)`,
          });
          setIsJumping(false);
          setMessage('Now click on the next consonant: ഘ');
          await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
          setKittenImageSrc('/game/assets/image/consfindlvl1/hopefulcat.png');
        } else if (consonant === 'ഘ') {
          // Jump to grid 27 (row 3, col 2)
          const firstJumpPos = getGridPosition(3, 2);
          setKittenPosition(firstJumpPos);
          await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds

          // Jump to 20px above grid 28 (row 3, col 3)
          const secondJumpPos = getGridPosition(3, 3);
          setKittenPosition({
            ...secondJumpPos,
            top: `calc(${secondJumpPos.top} - 40px)`,
          });
          await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds

          // Jump to grid 21 (row 2, col 5)
          const finalJumpPos = getGridPosition(2, 5);
          setKittenPosition(finalJumpPos);
          setIsJumping(false);
          setMessage('Now click on the next consonant: ങ');
        } else if (consonant === 'ങ') {
          // Jump to 10px left of grid 20 (row 2, col 3)
          const firstJumpPos = getGridPosition(2, 3);
          setKittenPosition({
            ...firstJumpPos,
            left: `calc(${firstJumpPos.left} - 10px)`,
          });
          await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds

          // Jump to 10px right of grid 19 and 40px above (row 2, col 2)
          const secondJumpPos = getGridPosition(2, 2);
          setKittenPosition({
            left: `calc(${secondJumpPos.left} + 10px)`,
            top: `calc(${secondJumpPos.top} - 35px)`,
          });
          await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds

          setKittenImageSrc('/game/assets/image/consfindlvl1/happykitten.png');
          setKittenSize({ width: 38, height: 38 });
          await new Promise(resolve => setTimeout(resolve, 4000)); // Wait 4 seconds

          setIsJumping(false);
          setShowSuccessPopup(true);
        }
        
        setCurrentStep(prev => prev + 1);
        if (currentStep + 1 >= gamePath.length) {
          // The success popup now handles the final message
        }
      }
    } else {
      // Wrong consonant clicked
      setMessage('Wrong consonant chosen. Try again.');
      setShowWrongConsonantPopup(true);
    }
  };


  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <div 
        className="relative w-[600px] h-[800px] bg-cover bg-center rounded-2xl shadow-lg"
        style={{ backgroundImage: "url('/game/assets/image/consfindlvl1/catpond.jpg')" }}
      >
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-center">
          <h1 className="text-3xl font-bold text-white bg-black bg-opacity-50 px-4 py-2 rounded-lg">Find Cat Mom</h1>
          <p className="text-lg text-white bg-black bg-opacity-50 px-3 py-1 rounded-md mt-2">{message}</p>
        </div>

        {/* Learn Button */}
        <button
          className="absolute top-4 right-4 bg-pink-400 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => setShowLearnModal(true)}
        >
          Learn
        </button>

        {/* Found Letters Container */}
        <div className="absolute top-16 right-4 p-2 bg-green-500 rounded shadow-md">
          <h3 className="font-bold">Found Letters:</h3>
          <div className="flex space-x-2">
            {foundLetters.map((letter, index) => (
              <span key={index} className="text-2xl font-bold text-white">{letter}</span>
            ))}
          </div>
        </div>



        {/* Kitten */}
        <div
          className="absolute transition-all duration-1000 ease-in-out"
          style={{
            top: kittenPosition.top,
            left: kittenPosition.left,
            transform: 'translate(-50%, -50%)',
            zIndex: 20,
          }}
        >
          <img src={kittenImageSrc} alt="Kitten" width={kittenSize.width} height={kittenSize.height} />
        </div>

        {/* Mom Cat */}
        <div
          className="absolute"
          style={{
            top: MOM_CAT_POSITION.top,
            left: MOM_CAT_POSITION.left,
            transform: 'translate(-50%, -50%)',
            zIndex: 15,
          }}
        >
          <img src="/game/assets/image/consfindlvl1/momcat.png" alt="Mom Cat" width={80} height={80} />
        </div>

        {/* Consonants on the board */}
        {activeConsonants.map((consonant) => {
          const position = consonantPositions[consonant];
          if (!position) return null; // Should not happen if consonantPositions is correctly defined

          return (
            <div
              key={consonant}
              className="absolute flex items-center justify-center text-4xl font-bold text-white bg-pink-500 rounded-full w-12 h-12 cursor-pointer hover:bg-pink-400 transition-colors"
              style={{
                top: position.top,
                left: position.left,
                transform: 'translate(-50%, -50%)',
                zIndex: 18,
              }}
              onClick={() => handleConsonantClick(consonant)}
            >
              {consonant}
            </div>
          );
        })}

        {/* Learn Modal */}
        {showLearnModal && (
          <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <h2 className="text-2xl font-bold mb-4">Learn Consonants</h2>
              <p className="mb-4">Click on the consonants in order to learn them.</p>
              <div className="flex justify-center space-x-4 mb-4">
                {gamePath.map((consonant, index) => (
                  <button 
                    key={consonant}
                    className={`flex items-center justify-center text-4xl font-bold p-4 rounded-full w-16 h-16 ${index < currentStepLearn ? 'bg-gray-300' : 'bg-pink-500 hover:bg-pink-700'}`}
                    onClick={() => handleLearnConsonantClick(consonant, index)}
                    disabled={index !== currentStepLearn}
                  >
                    {consonant}
                  </button>
                ))}
              </div>
              <button
                className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => setShowLearnModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Jumping Popup */}
        {showJumpingPopup && (
            <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                    <h2 className="text-2xl font-bold mb-4">Hold on a minute!</h2>
                    <p className="mb-4">"Let me complete my jump please. You do not want me to fall in the water do you?</p>
                    <button
                        className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => setShowJumpingPopup(false)}
                    >
                        Close
                    </button>
                </div>
            </div>
        )}

        {/* Wrong Consonant Popup */}
        {showWrongConsonantPopup && (
            <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                    <h2 className="text-2xl font-bold mb-4">Oops!</h2>
                    <p className="mb-4">Wrong consonant chosen. Try again.</p>
                    <button
                        className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => setShowWrongConsonantPopup(false)}
                    >
                        Close
                    </button>
                </div>
            </div>
        )}

        {/* Success Popup */}
        {showSuccessPopup && (
          <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <h2 className="text-2xl font-bold mb-4">Congrats!</h2>
              <p className="mb-4">You helped the kitten reach its mom. Thank you.</p>
              <div className="flex justify-center space-x-4">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={resetGame}
                >
                  Retry
                </button>
                <Link href="/games/consonantfind" legacyBehavior>
                  <a className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                    Next Challenge
                  </a>
                </Link>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default FindCatMomGame;
