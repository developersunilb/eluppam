This is a fascinating educational game concept! The exposure-based learning approach is solid. Here are some ideas to enhance engagement:

Engagement Ideas:

Visual feedback: Animate the matched letter with a celebratory effect
Streak bonuses: Reward consecutive matches with bonus points
Sound associations: Play a unique sound for each consonant (audio learning)
Progress visualization: Show which consonants have been collected with visual progress
Daily challenges: "Today's focus letter" for bonus points
Letter frequency stats: Show players which letters they've seen most
Combo system: Multiple matches in a row = multiplier
Collection display: Visual badge gallery showing earned consonants
Learning Enhancement:

Display the consonant larger during the spin
Show example words using the consonant
Track exposure count per letter (even non-matches count as exposure)
Let me build the foundation with:

Spin wheel with 12 consonants
Random letter generator
Spin mechanism with rotation animation
Match detection & points system
15-spin limit with 24hr cooldown
Database for player progress, badges, and points
Let's start!

Here is a sample program, 

import React, { useState, useEffect } from 'react';
import { Trophy, Star, Clock, Zap, Award } from 'lucide-react';

const ConsonantSpinGame = () => {
  const consonants = ['ക', 'ങ', 'ച', 'ഞ', 'ട', 'ണ', 'ത', 'ന', 'പ', 'മ', 'യ', 'റ'];
  
  const [targetLetter, setTargetLetter] = useState('');
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinsLeft, setSpinsLeft] = useState(5);
  const [points, setPoints] = useState(0);
  const [badges, setBadges] = useState([]);
  const [lastPlayDate, setLastPlayDate] = useState(null);
  const [showResult, setShowResult] = useState(null);
  const [streak, setStreak] = useState(0);
  const [exposureCount, setExposureCount] = useState({});
  const [totalExposure, setTotalExposure] = useState(0);
  const [currentView, setCurrentView] = useState('game');

  useEffect(() => {
    loadGameState();
    generateTarget();
  }, []);

  const loadGameState = async () => {
    try {
      const state = await window.storage.get('game-state');
      if (state) {
        const data = JSON.parse(state.value);
        setPoints(data.points || 0);
        setBadges(data.badges || []);
        setExposureCount(data.exposureCount || {});
        setTotalExposure(data.totalExposure || 0);
        
        const lastPlay = data.lastPlayDate;
        if (lastPlay && isToday(lastPlay)) {
          setSpinsLeft(data.spinsLeft || 0);
          setLastPlayDate(lastPlay);
        } else {
          setSpinsLeft(5);
          setLastPlayDate(null);
        }
      }
    } catch (error) {
      console.log('No previous game state');
    }
  };

  const saveGameState = async (newState) => {
    try {
      await window.storage.set('game-state', JSON.stringify(newState));
    } catch (error) {
      console.error('Failed to save game state');
    }
  };

  const isToday = (dateString) => {
    const today = new Date().toDateString();
    const compareDate = new Date(dateString).toDateString();
    return today === compareDate;
  };

  const generateTarget = () => {
    const randomLetter = consonants[Math.floor(Math.random() * consonants.length)];
    setTargetLetter(randomLetter);
  };

  const spinWheel = () => {
    if (isSpinning || spinsLeft <= 0) return;

    setIsSpinning(true);
    setShowResult(null);

    const selectedIndex = Math.floor(Math.random() * consonants.length);
    const selectedLetter = consonants[selectedIndex];
    
    const degreesPerSlice = 360 / consonants.length;
    // Start from current position and add rotation
    const additionalRotation = 360 * 2.5 + (selectedIndex * degreesPerSlice);
    const targetRotation = rotation + additionalRotation;
    
    setRotation(targetRotation);

    const newExposureCount = { ...exposureCount };
    newExposureCount[selectedLetter] = (newExposureCount[selectedLetter] || 0) + 1;
    newExposureCount[targetLetter] = (newExposureCount[targetLetter] || 0) + 1;
    setExposureCount(newExposureCount);
    setTotalExposure(prev => prev + 2);

    setTimeout(() => {
      const isMatch = selectedLetter === targetLetter;
      const newSpinsLeft = spinsLeft - 1;
      
      if (isMatch) {
        const earnedPoints = streak > 0 ? 100 * (streak + 1) : 100;
        const newPoints = points + earnedPoints;
        const newBadges = badges.includes(selectedLetter) ? badges : [...badges, selectedLetter];
        const newStreak = streak + 1;
        
        setPoints(newPoints);
        setBadges(newBadges);
        setStreak(newStreak);
        setShowResult({ type: 'success', letter: selectedLetter, points: earnedPoints, streak: newStreak });
        
        saveGameState({
          points: newPoints,
          badges: newBadges,
          spinsLeft: newSpinsLeft,
          lastPlayDate: new Date().toISOString(),
          exposureCount: newExposureCount,
          totalExposure: totalExposure + 2
        });
      } else {
        setStreak(0);
        setShowResult({ type: 'fail', selected: selectedLetter, target: targetLetter });
        
        saveGameState({
          points,
          badges,
          spinsLeft: newSpinsLeft,
          lastPlayDate: new Date().toISOString(),
          exposureCount: newExposureCount,
          totalExposure: totalExposure + 2
        });
      }
      
      setSpinsLeft(newSpinsLeft);
      setLastPlayDate(new Date().toISOString());
      setIsSpinning(false);
      
      setTimeout(() => {
        generateTarget();
      }, 2000);
    }, 15000);
  };

  const getTimeUntilReset = () => {
    if (!lastPlayDate) return null;
    const lastPlay = new Date(lastPlayDate);
    const tomorrow = new Date(lastPlay);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const now = new Date();
    const diff = tomorrow - now;
    
    if (diff <= 0) return 'Ready to play!';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const GameView = () => (
    <div className="flex flex-col items-center gap-8">
      <div className="flex gap-6 items-center justify-center w-full">
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 shadow-2xl">
          <div className="text-white text-center mb-2 font-semibold">Target Letter</div>
          <div className="bg-white rounded-xl p-8 shadow-inner">
            <div className="text-7xl font-bold text-purple-600">{targetLetter}</div>
          </div>
        </div>

        <div className="flex flex-col gap-2 text-center">
          <div className="flex items-center gap-2 bg-yellow-100 px-4 py-2 rounded-lg">
            <Zap className="text-yellow-600" size={20} />
            <span className="font-bold text-yellow-800">Spins: {spinsLeft}/5</span>
          </div>
          <div className="flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-lg">
            <Trophy className="text-blue-600" size={20} />
            <span className="font-bold text-blue-800">Points: {points}</span>
          </div>
          {streak > 0 && (
            <div className="flex items-center gap-2 bg-orange-100 px-4 py-2 rounded-lg animate-pulse">
              <Star className="text-orange-600" size={20} />
              <span className="font-bold text-orange-800">Streak: {streak}x</span>
            </div>
          )}
        </div>
      </div>

      <div className="relative">
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
          <div className="w-0 h-0 border-l-[20px] border-r-[20px] border-t-[30px] border-l-transparent border-r-transparent border-t-red-500 drop-shadow-lg"></div>
        </div>

        <div 
          className="relative w-96 h-96 rounded-full border-8 border-white shadow-2xl overflow-hidden"
          style={{ 
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning 
              ? 'transform 15s cubic-bezier(0.05, 0.5, 0.3, 1)' 
              : 'none',
            background: 'conic-gradient(from 0deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3, #54a0ff, #00d2d3, #ff6348, #2ed573, #ff4757, #ffa502, #5f27cd, #00d8d6)'
          }}
        >
          {consonants.map((letter, index) => {
            const angle = (360 / consonants.length) * index;
            const isBadge = badges.includes(letter);
            return (
              <div
                key={letter}
                className="absolute w-full h-full flex items-start justify-center"
                style={{
                  transform: `rotate(${angle}deg)`,
                  transformOrigin: 'center'
                }}
              >
                <div className="mt-8 relative">
                  <div className="text-4xl font-bold text-white drop-shadow-lg">
                    {letter}
                  </div>
                  {isBadge && (
                    <Award className="absolute -top-2 -right-6 text-yellow-300" size={16} />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={spinWheel}
          disabled={isSpinning || spinsLeft <= 0}
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full font-bold text-xl shadow-2xl z-10 transition-all ${
            isSpinning || spinsLeft <= 0
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-br from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 hover:scale-110 cursor-pointer'
          } text-white`}
        >
          {isSpinning ? '...' : 'SPIN'}
        </button>
      </div>

      {showResult && (
        <div className={`p-6 rounded-2xl shadow-2xl ${
          showResult.type === 'success' 
            ? 'bg-gradient-to-r from-green-400 to-emerald-500' 
            : 'bg-gradient-to-r from-red-400 to-pink-500'
        } text-white text-center animate-bounce`}>
          {showResult.type === 'success' ? (
            <div>
              <div className="text-3xl font-bold mb-2">🎉 MATCH! 🎉</div>
              <div className="text-xl">You got <span className="font-bold">{showResult.letter}</span>!</div>
              <div className="text-2xl font-bold mt-2">+{showResult.points} points</div>
              {showResult.streak > 1 && (
                <div className="text-lg mt-1">🔥 {showResult.streak}x Streak Bonus!</div>
              )}
            </div>
          ) : (
            <div>
              <div className="text-2xl font-bold mb-2">Not quite!</div>
              <div className="text-lg">Spun: <span className="font-bold">{showResult.selected}</span> | Target: <span className="font-bold">{showResult.target}</span></div>
              <div className="text-sm mt-2">Keep trying! 💪</div>
            </div>
          )}
        </div>
      )}

      {spinsLeft === 0 && (
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-8 rounded-2xl shadow-2xl text-center">
          <Clock className="mx-auto mb-4" size={48} />
          <div className="text-3xl font-bold mb-2">Better Luck Next Time!</div>
          <div className="text-xl">Come back in: <span className="font-bold">{getTimeUntilReset()}</span></div>
        </div>
      )}

      <div className="text-center text-gray-600 text-sm">
        <div>Total letters seen: {totalExposure}</div>
        <div>Badges collected: {badges.length}/{consonants.length}</div>
      </div>
    </div>
  );

  const ProgressView = () => (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white p-6 rounded-2xl shadow-xl">
          <Trophy className="mb-2" size={32} />
          <div className="text-4xl font-bold">{points}</div>
          <div className="text-sm opacity-90">Total Points</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-teal-600 text-white p-6 rounded-2xl shadow-xl">
          <Award className="mb-2" size={32} />
          <div className="text-4xl font-bold">{badges.length}/{consonants.length}</div>
          <div className="text-sm opacity-90">Badges Earned</div>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-red-600 text-white p-6 rounded-2xl shadow-xl">
          <Star className="mb-2" size={32} />
          <div className="text-4xl font-bold">{totalExposure}</div>
          <div className="text-sm opacity-90">Letters Seen</div>
        </div>
        <div className="bg-gradient-to-br from-pink-500 to-purple-600 text-white p-6 rounded-2xl shadow-xl">
          <Zap className="mb-2" size={32} />
          <div className="text-4xl font-bold">{spinsLeft}</div>
          <div className="text-sm opacity-90">Spins Remaining</div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-xl mb-6">
        <h3 className="text-2xl font-bold mb-4 text-gray-800">Badge Collection</h3>
        <div className="grid grid-cols-6 gap-4">
          {consonants.map(letter => (
            <div
              key={letter}
              className={`p-4 rounded-xl text-center transition-all ${
                badges.includes(letter)
                  ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-lg scale-105'
                  : 'bg-gray-200 text-gray-400'
              }`}
            >
              <div className="text-3xl font-bold">{letter}</div>
              {badges.includes(letter) && (
                <Award className="mx-auto mt-1" size={16} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-xl">
        <h3 className="text-2xl font-bold mb-4 text-gray-800">Letter Exposure Stats</h3>
        <div className="grid grid-cols-3 gap-3">
          {consonants.map(letter => {
            const count = exposureCount[letter] || 0;
            const maxCount = Math.max(...Object.values(exposureCount), 1);
            const percentage = (count / maxCount) * 100;
            
            return (
              <div key={letter} className="bg-gray-50 p-3 rounded-lg">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-lg text-gray-700">{letter}</span>
                  <span className="text-sm text-gray-600">{count}x</span>
                </div>
                <div className="w-full bg-gray-300 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Consonant Spin Challenge
        </h1>
        <p className="text-center text-gray-600 mb-8">Learn through play! Match the letters and collect all badges.</p>

        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setCurrentView('game')}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              currentView === 'game'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Play Game
          </button>
          <button
            onClick={() => setCurrentView('progress')}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              currentView === 'progress'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Progress
          </button>
        </div>

        {currentView === 'game' ? <GameView /> : <ProgressView />}
      </div>
    </div>
  );
};

export default ConsonantSpinGame;