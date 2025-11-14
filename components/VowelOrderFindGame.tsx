// components/VowelOrderFindGame.tsx
'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface Vowel {
  id: string;
  malayalam: string;
  english: string;
  audioSrc: string;
}

interface Balloon {
  id: string;
  vowel: Vowel;
  x: number;
  y: number;
  disabled: boolean;
  popped: boolean;
  color: string;
}

const MALAYALAM_VOWELS: Vowel[] = [
    { id: 'a', malayalam: 'അ', english: 'a', audioSrc: '/audio/malayalam/vowels/അ.mp3' },
    { id: 'aa', malayalam: 'ആ', english: 'aa', audioSrc: '/audio/malayalam/vowels/ആ.mp3' },
    { id: 'i', malayalam: 'ഇ', english: 'i', audioSrc: '/audio/malayalam/vowels/ഇ.mp3' },
    { id: 'ee', malayalam: 'ഈ', english: 'ee', audioSrc: '/audio/malayalam/vowels/ഈ.mp3' },
    { id: 'u', malayalam: 'ഉ', english: 'u', audioSrc: '/audio/malayalam/vowels/ഉ.mp3' },
    { id: 'oo', malayalam: 'ഊ', english: 'oo', audioSrc: '/audio/malayalam/vowels/ഊ.mp3' },
    { id: 'ru', malayalam: 'ഋ', english: 'ru', audioSrc: '/audio/malayalam/vowels/ഋ.mp3' },
    { id: 'e', malayalam: 'എ', english: 'e', audioSrc: '/audio/malayalam/vowels/എ.mp3' },
    { id: 'ea', malayalam: 'ഏ', english: 'ea', audioSrc: '/audio/malayalam/vowels/ഏ.mp3' },
    { id: 'ai', malayalam: 'ഐ', english: 'ai', audioSrc: '/audio/malayalam/vowels/ഐ.mp3' },
    { id: 'o', malayalam: 'ഒ', english: 'o', audioSrc: '/audio/malayalam/vowels/ഒ.mp3' },
    { id: 'oa', malayalam: 'ഓ', english: 'oa', audioSrc: '/audio/malayalam/vowels/ഓ.mp3' },
    { id: 'au', malayalam: 'ഔ', english: 'au', audioSrc: '/audio/malayalam/vowels/ഔ.mp3' },
    { id: 'am', malayalam: 'അം', english: 'am', audioSrc: '/audio/malayalam/vowels/അം.mp3' },
    { id: 'aha', malayalam: 'അഃ', english: 'aha', audioSrc: '/audio/malayalam/vowels/അഃ.mp3' },
];

const BALLOON_COLORS = [
  'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500',
  'bg-pink-500', 'bg-indigo-500', 'bg-teal-500', 'bg-orange-500',
];

interface CloudProps {
  style: React.CSSProperties;
  scale?: number;
}

const Cloud: React.FC<CloudProps> = ({ style, scale = 1 }) => (
    <div className="absolute" style={style}>
      <div className="relative">
        <div className="absolute bg-white rounded-full" style={{ width: `${40 * scale}px`, height: `${40 * scale}px`, top: `${5 * scale}px` }}></div>
        <div className="absolute bg-white rounded-full" style={{ width: `${50 * scale}px`, height: `${50 * scale}px`, left: `${20 * scale}px` }}></div>
        <div className="absolute bg-white rounded-full" style={{ width: `${40 * scale}px`, height: `${40 * scale}px`, top: `${5 * scale}px`, left: `${50 * scale}px` }}></div>
      </div>
    </div>
  );

const VowelOrderFindGame: React.FC = () => {
  const playAreaRef = useRef<HTMLDivElement>(null);
  const [learnModeActive, setLearnModeActive] = useState<boolean>(false);
  const [playModeAvailable, setPlayModeAvailable] = useState<boolean>(false);
  const [playModeStarted, setPlayModeStarted] = useState<boolean>(false);
  const [learnBalloons, setLearnBalloons] = useState<Balloon[]>([]);
  const [playBalloons, setPlayBalloons] = useState<Balloon[]>([]);
  const [currentLearnVowelIndex, setCurrentLearnVowelIndex] = useState<number>(0);
  const [message, setMessage] = useState<string>('Click "Learn" to start learning vowels!');
  const [correctlyPopped, setCorrectlyPopped] = useState<Vowel[]>([]);
  const [mistakes, setMistakes] = useState<Vowel[]>([]);
  const [gameOver, setGameOver] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const router = useRouter();

  const playAudio = useCallback((audioSrc: string) => {
    if (audioRef.current) {
      audioRef.current.src = audioSrc;
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error("Audio playback error:", error);
        });
      }
    }
  }, []);

  const initializeLearnMode = useCallback(() => {
    const initialBalloons: Balloon[] = MALAYALAM_VOWELS.map((vowel, index) => ({
      id: vowel.id,
      vowel: vowel,
      x: 0, // No longer used for positioning
      y: 0, // No longer used for positioning
      disabled: index !== 0, // Only first vowel enabled initially
      popped: false,
      color: BALLOON_COLORS[index % BALLOON_COLORS.length], // Assign a color
    }));
    setLearnBalloons(initialBalloons);
    setCurrentLearnVowelIndex(0);
    setLearnModeActive(true);
    setPlayModeAvailable(false);
    setPlayModeStarted(false);
    setGameOver(false);
    setMessage(`Click the '${MALAYALAM_VOWELS[0].malayalam}' balloon.`);
  }, []);

  const handleLearnBalloonClick = useCallback((clickedBalloon: Balloon) => {
    if (clickedBalloon.disabled || clickedBalloon.popped || !learnModeActive) return;

    const expectedVowel = MALAYALAM_VOWELS[currentLearnVowelIndex];

    if (clickedBalloon.vowel.id === expectedVowel.id) {
      playAudio(clickedBalloon.vowel.audioSrc);
      setMessage(`Correct! You popped '${clickedBalloon.vowel.malayalam}'.`);

      setLearnBalloons(prev => prev.map(b =>
        b.id === clickedBalloon.id ? { ...b, popped: true } : b
      ));

      const nextIndex = currentLearnVowelIndex + 1;
      if (nextIndex < MALAYALAM_VOWELS.length) {
        setCurrentLearnVowelIndex(nextIndex);
        setLearnBalloons(prev => prev.map(b =>
          b.id === MALAYALAM_VOWELS[nextIndex].id ? { ...b, disabled: false } : b
        ));
        setMessage(`Now click the '${MALAYALAM_VOWELS[nextIndex].malayalam}' balloon.`);
      } else {
        setMessage('You have learned all vowels! Ready to Play!');
        setLearnModeActive(false);
        setPlayModeAvailable(true);
      }
    } else {
      setMessage(`Wrong balloon! Click the '${expectedVowel.malayalam}' balloon.`);
    }
  }, [currentLearnVowelIndex, learnModeActive, playAudio]);

  const startPlayMode = useCallback(() => {
    setPlayModeStarted(true);
    setGameOver(false);
    setCorrectlyPopped([]);
    setMistakes([]);
    setMessage('Loading Play Mode...');
  }, []);

  const retryPlayMode = useCallback(() => {
    setPlayModeStarted(false);
    setTimeout(() => {
        startPlayMode();
    }, 100);
  }, [startPlayMode]);

  useEffect(() => {
    const resizePlayArea = () => {
      if (playModeStarted && playAreaRef.current) {
        const playAreaWidth = playAreaRef.current.offsetWidth;
        const playAreaHeight = playAreaRef.current.offsetHeight;
        
        const balloonSize = Math.min(playAreaWidth / 10, playAreaHeight / 5);

        const balloons: Balloon[] = [];

        const isColliding = (newBalloon: Balloon, existingBalloons: Balloon[]) => {
          for (const existing of existingBalloons) {
            const dx = newBalloon.x - existing.x;
            const dy = newBalloon.y - existing.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < balloonSize) {
              return true;
            }
          }
          return false;
        };

        const shuffledVowels = [...MALAYALAM_VOWELS].sort(() => Math.random() - 0.5);

        shuffledVowels.forEach((vowel, index) => {
          let newBalloon: Balloon;
          let collision = true;
          let attempts = 0;

          do {
            newBalloon = {
              id: `${vowel.id}-${Date.now()}-${index}`,
              vowel: vowel,
              x: Math.random() * (playAreaWidth - balloonSize),
              y: Math.random() * (playAreaHeight - balloonSize),
              disabled: false,
              popped: false,
              color: BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)],
            };
            collision = isColliding(newBalloon, balloons);
            attempts++;
          } while (collision && attempts < 100); // Limit attempts to prevent infinite loops

          balloons.push(newBalloon);
        });

        setPlayBalloons(balloons);
        setMessage('Pop the vowels in correct Malayalam order!');
        setCurrentLearnVowelIndex(0);
      }
    };

    resizePlayArea();

    window.addEventListener('resize', resizePlayArea);
    return () => window.removeEventListener('resize', resizePlayArea);
  }, [playModeStarted]);

  const handlePlayBalloonClick = useCallback((clickedBalloon: Balloon) => {
    if (clickedBalloon.popped || !playModeStarted || gameOver) return;

    const expectedVowel = MALAYALAM_VOWELS[currentLearnVowelIndex];

    if (clickedBalloon.vowel.id === expectedVowel.id) {
      playAudio(clickedBalloon.vowel.audioSrc);
      setMessage(`Correct! You popped '${clickedBalloon.vowel.malayalam}'.`);
      setCorrectlyPopped(prev => [...prev, clickedBalloon.vowel]);

      setPlayBalloons(prev => prev.filter(b => b.id !== clickedBalloon.id));

      const nextIndex = currentLearnVowelIndex + 1;
      if (nextIndex < MALAYALAM_VOWELS.length) {
        setCurrentLearnVowelIndex(nextIndex);
      } else {
        setMessage('Congratulations! You popped all vowels in order!');
        setGameOver(true);
      }
    } else {
      setMessage(`Wrong balloon! You need to pop '${expectedVowel.malayalam}'. Try again!`);
      setMistakes(prev => [...prev, clickedBalloon.vowel]);
    }
  }, [currentLearnVowelIndex, playModeStarted, playAudio, gameOver]);

  return (
    <div className="relative flex flex-col items-center h-full bg-marigold-400 p-4 overflow-hidden">
      <h1 className="text-5xl font-extrabold text-white mb-6 drop-shadow-lg">Vowel Order Find</h1>
      <p className="text-xl text-white mb-4">{message}</p>

      <audio ref={audioRef} />

      {!learnModeActive && !playModeAvailable && !playModeStarted && (
        <button
          onClick={initializeLearnMode}
          className="px-8 py-3 bg-green-500 text-white text-xl font-semibold rounded-full shadow-xl hover:bg-green-600 transition-colors duration-300 mb-8"
        >
          Learn Vowels
        </button>
      )}

      {learnModeActive && (
        <div className="relative w-full max-w-5xl bg-gradient-to-b from-sky-300 to-sky-500 rounded-lg p-4 overflow-hidden flex items-center justify-center min-h-[20rem] md:min-h-[30rem] lg:min-h-[40rem]">
            <Cloud style={{ top: '10%', left: '5%' }} scale={0.8} />
            <Cloud style={{ top: '80%', left: '15%' }} scale={1.2} />
            <Cloud style={{ top: '30%', left: '80%' }} scale={1} />
            <Cloud style={{ top: '60%', left: '90%' }} scale={0.9} />
            <div className="flex flex-wrap justify-center items-center gap-4 relative z-10">
                {learnBalloons.map(balloon => (
                    !balloon.popped &&
                    <div key={balloon.id} className="relative">
                        <button
                            className={`w-16 h-20 rounded-[50%] flex items-center justify-center text-white text-3xl font-bold shadow-lg transition-all duration-200
                            ${balloon.disabled ? 'bg-gray-500 opacity-50 cursor-not-allowed' : `${balloon.color} hover:${balloon.color.replace('-500', '-600')}`}
                            `}
                            onClick={() => handleLearnBalloonClick(balloon)}
                            disabled={balloon.disabled || balloon.popped}
                        >
                            {balloon.vowel.malayalam}
                        </button>
                        <div
                            className={`absolute left-1/2 -translate-x-1/2 bottom-[-4px] w-3 h-3 ${balloon.disabled ? 'bg-gray-500 opacity-50' : balloon.color} transform rotate-45 transition-all duration-200`}
                        ></div>
                    </div>
                ))}
            </div>
        </div>
      )}

      {!learnModeActive && playModeAvailable && !playModeStarted && (
        <div className="flex gap-4 mb-8">
          <button
            onClick={initializeLearnMode}
            className="px-8 py-3 bg-green-500 text-white text-xl font-semibold rounded-full shadow-xl hover:bg-green-600 transition-colors duration-300"
          >
            Learn Again
          </button>
          <button
            onClick={startPlayMode}
            className={`px-8 py-3 bg-purple-500 text-white text-xl font-semibold rounded-full shadow-xl hover:bg-purple-600 transition-colors duration-300 ${!playModeAvailable ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!playModeAvailable}
          >
            Ready to Play!
          </button>
        </div>
      )}

      {playModeStarted && (
        <div className="flex flex-col md:flex-row items-start w-full gap-4 flex-grow">
          <div ref={playAreaRef} className="relative w-full h-full bg-gradient-to-b from-sky-300 to-sky-500 rounded-lg p-4 overflow-hidden">
            <Cloud style={{ top: '10%', left: '15%' }} scale={1} />
            <Cloud style={{ top: '20%', left: '70%' }} scale={1.2} />
            <Cloud style={{ top: '50%', left: '40%' }} scale={0.8} />
            <Cloud style={{ top: '75%', left: '10%' }} scale={1.5} />
            <Cloud style={{ top: '85%', left: '80%' }} scale={1} />
            {playBalloons.map(balloon => (
              <div key={balloon.id} className="absolute" style={{ left: balloon.x, top: balloon.y }}>
                <div className="relative">
                  <button
                    className={`w-10 h-12 text-xl md:w-12 md:h-16 md:text-2xl lg:w-16 lg:h-20 lg:text-3xl rounded-[50%] flex items-center justify-center text-white font-bold shadow-lg transition-all duration-200
                      ${`${balloon.color} hover:${balloon.color.replace('-500', '-600')}`}
                    `}
                    onClick={() => handlePlayBalloonClick(balloon)}
                    disabled={gameOver}
                  >
                    {balloon.vowel.malayalam}
                  </button>
                  <div
                    className={`absolute left-1/2 -translate-x-1/2 bottom-[-4px] w-2 h-2 md:w-3 md:h-3 ${balloon.color} transform rotate-45 transition-all duration-200`}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col w-full md:w-4/12 gap-4">
            <div className="w-full bg-gray-100 p-4 rounded-lg shadow-inner">
              <h3 className="text-lg font-bold mb-2">Correctly Popped</h3>
              <div className="flex flex-wrap gap-2">
                {correctlyPopped.map((v, i) => <span key={i} className="text-2xl">{v.malayalam}</span>)}
              </div>
            </div>
            {/* <div className="w-full bg-gray-100 p-4 rounded-lg shadow-inner">
              <h3 className="text-lg font-bold mb-2">Mistakes</h3>
              <div className="flex flex-wrap gap-2">
                {mistakes.map((v, i) => <span key={i} className="text-2xl text-red-500">{v.malayalam}</span>)}
              </div>
            </div> */}
            {gameOver && (
              <div className="flex gap-4 mt-4">
                <button
                  onClick={retryPlayMode}
                  className="px-8 py-3 bg-blue-500 text-white text-xl font-semibold rounded-full shadow-xl hover:bg-blue-600 transition-colors duration-300"
                >
                  Retry
                </button>
                <button
                  onClick={() => router.push('/games')}
                  className="px-8 py-3 bg-green-500 text-white text-xl font-semibold rounded-full shadow-xl hover:bg-green-600 transition-colors duration-300"
                >
                  Next Challenge
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VowelOrderFindGame;
