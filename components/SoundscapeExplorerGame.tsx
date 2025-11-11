// components/SoundscapeExplorerGame.tsx
'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';

import { LOCATIONS, GameObject } from '@/lib/game-data';

// Utility function to shuffle an array
const shuffleArray = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};


const SoundscapeExplorerGame: React.FC = () => {
  const [currentLocationIndex, setCurrentLocationIndex] = useState<number>(0);
  const [discoveredObjects, setDiscoveredObjects] = useState<Set<string>>(new Set());
  const [message, setMessage] = useState<string>('Explore the scene!');
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [quizMode, setQuizMode] = useState<boolean>(false);
  const [quizQuestion, setQuizQuestion] = useState<GameObject | null>(null);
  const [quizOptions, setQuizOptions] = useState<GameObject[]>([]);
  const [score, setScore] = useState<number>(0);
  const [imageMap, setImageMap] = useState<any>(null);
  const [hoveredObject, setHoveredObject] = useState<GameObject | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    fetch('/game-maps.json')
      .then(res => res.json())
      .then(data => setImageMap(data));
  }, []);

  const currentLocation = LOCATIONS[currentLocationIndex];

  const playAudio = useCallback((audioSrc: string) => {
    if (audioRef.current) {
      audioRef.current.src = audioSrc;
      audioRef.current.play();
    }
  }, []);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  const handleShapeMouseEnter = useCallback((object: GameObject, e: React.MouseEvent) => {
    if (quizMode) return;
    setHoveredObject(object);
    playAudio(object.audioSrc);

    // Calculate mouse position relative to the image
    if (imageRef.current) {
      const imageRect = imageRef.current.getBoundingClientRect();
      const x = e.clientX - imageRect.left;
      const y = e.clientY - imageRect.top;
      setTooltipPosition({ x: x, y: y });
    } else {
      setTooltipPosition({ x: e.clientX, y: e.clientY }); // Fallback
    }
  }, [quizMode, playAudio, imageRef]);

  const handleShapeMouseLeave = () => {
    if (quizMode) return;
    setHoveredObject(null);
    setTooltipPosition(null);
stopAudio();
  };

  const startGame = useCallback(() => {
    setCurrentLocationIndex(0);
    setDiscoveredObjects(new Set());
    setMessage('Click objects to hear their names!');
    setGameStarted(true);
    setQuizMode(false);
    setQuizQuestion(null);
    setQuizOptions([]);
    setScore(0);
  }, []);

  const handleObjectClick = useCallback(
    (object: GameObject) => {
      if (!gameStarted || quizMode) return;

      playAudio(object.audioSrc);
      setMessage(`${object.nameMalayalam} (${object.nameEnglish})`);
      setDiscoveredObjects((prev) => new Set(prev).add(object.id));
    },
    [gameStarted, quizMode, playAudio]
  );

  const checkLocationCompletion = useCallback(() => {
    if (discoveredObjects.size === currentLocation.objects.length) {
      setMessage('All objects discovered! Ready for the next location or quiz!');
      // Optionally advance to next location or start quiz
    }
  }, [discoveredObjects, currentLocation]);

  useEffect(() => {
    if (gameStarted) {
      checkLocationCompletion();
    }
  }, [discoveredObjects, gameStarted, checkLocationCompletion]);

  const startQuiz = useCallback(() => {
    if (currentLocation.objects.length < 2) { // Need at least 2 objects for a meaningful quiz
      setMessage('Not enough objects for a quiz in this location!');
      return;
    }
    setQuizMode(true);
    setMessage('Listen to the sound and identify the object!');

    const questionObject = currentLocation.objects[Math.floor(Math.random() * currentLocation.objects.length)];
    setQuizQuestion(questionObject);
    playAudio(questionObject.audioSrc);

    // Generate options (include correct answer and some random incorrect ones)
    const incorrectOptions = currentLocation.objects.filter(obj => obj.id !== questionObject.id);
    const shuffledIncorrect = incorrectOptions.sort(() => 0.5 - Math.random()).slice(0, 2); // Get up to 2 incorrect
    const options = shuffleArray([...shuffledIncorrect, questionObject]); // Use the global shuffleArray
    setQuizOptions(options);
  }, [currentLocation, playAudio]);

  const handleQuizAnswer = useCallback(
    (selectedObject: GameObject) => {
      if (!quizQuestion) return;

      if (selectedObject.id === quizQuestion.id) {
        setScore(prev => prev + 10);
        setMessage('Correct! Well done!');
      } else {
        setScore(prev => Math.max(0, prev - 5));
        setMessage(`Incorrect. It was ${quizQuestion.nameMalayalam}.`);
      }
      setQuizMode(false);
      setQuizQuestion(null);
      setQuizOptions([]);
    },
    [quizQuestion]
  );

  const nextLocation = useCallback(() => {
    if (currentLocationIndex < LOCATIONS.length - 1) {
      setCurrentLocationIndex(prev => prev + 1);
      setDiscoveredObjects(new Set());
      setMessage('New location! Explore!');
      setQuizMode(false);
      setQuizQuestion(null);
      setQuizOptions([]);
    } else {
      setMessage(`You've explored all locations! Final Score: ${score}. Press Start to play again.`);
      setGameStarted(false);
    }
  }, [currentLocationIndex, score]);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-cream-50 to-marigold-50 p-4">
      <h1 className="text-5xl font-extrabold text-kerala-green-700 mb-6 drop-shadow-lg">Soundscape Explorer</h1>
      <p className="text-xl text-kerala-gold-500 mb-4">{message}</p>
      <p className="text-lg text-kerala-green-600 mb-8">Score: {score}</p>

      {!gameStarted && (
        <button
          onClick={startGame}
          className="px-8 py-3 bg-kerala-gold-500 text-white text-xl font-semibold rounded-full shadow-xl hover:bg-kerala-gold-600 transition-colors duration-300 mb-8"
        >
          Start Exploring
        </button>
      )}

      {gameStarted && currentLocation && (
        <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-xl">
          <h2 className="text-3xl font-bold text-kerala-green-800 mb-4">Location: {currentLocation.name}</h2>
          <div className="relative w-full aspect-video bg-gray-200 rounded-lg overflow-hidden mb-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img ref={imageRef} src={currentLocation.image} alt={currentLocation.name} className="w-full h-full object-contain" />

            <svg className="absolute inset-0 w-full h-full">
              {imageMap && imageMap[currentLocation.id] && imageMap[currentLocation.id].map((shape: any, index: number) => {
                const object = currentLocation.objects.find(obj => obj.id === shape.objectId);
                if (!object) return null;

                if (shape.type === 'rect') {
                  return (
                    <rect
                      key={index}
                      x={`${shape.x}%`}
                      y={`${shape.y}%`}
                      width={`${shape.width}%`}
                      height={`${shape.height}%`}
                      className="fill-transparent cursor-pointer"
                      onClick={() => handleObjectClick(object)}
                      onMouseEnter={(e) => handleShapeMouseEnter(object, e)}
                      onMouseLeave={handleShapeMouseLeave}
                    />
                  );
                }
                if (shape.type === 'poly') {
                  return (
                    <polygon
                      key={index}
                      points={shape.points.map((p: number[]) => `${p[0]}%,${p[1]}%`).join(' ')}
                      className="fill-transparent cursor-pointer"
                      onClick={() => handleObjectClick(object)}
                      onMouseEnter={(e) => handleShapeMouseEnter(object, e)}
                      onMouseLeave={handleShapeMouseLeave}
                    />
                  );
                }
                return null;
              })}
            </svg>
          </div>

          {hoveredObject && tooltipPosition && (
            <div
              className="absolute bg-black text-white p-2 rounded-md text-sm"
              style={{ left: tooltipPosition.x, top: tooltipPosition.y }}
            >
              <p>{hoveredObject.nameMalayalam}</p>
              <p>({hoveredObject.nameEnglish})</p>
            </div>
          )}

          <audio ref={audioRef} />

          {!quizMode && (
            <div className="flex justify-center gap-4 mt-4">
              {discoveredObjects.size === currentLocation.objects.length && (
                <button
                  onClick={startQuiz}
                  className="px-6 py-3 bg-blue-500 text-white text-xl font-semibold rounded-full shadow-xl hover:bg-blue-600 transition-colors duration-300"
                >
                  Start Quiz
                </button>
              )}
              {currentLocationIndex < LOCATIONS.length - 1 && (
                <button
                  onClick={nextLocation}
                  className="px-6 py-3 bg-kerala-green-500 text-white text-xl font-semibold rounded-full shadow-xl hover:bg-kerala-green-600 transition-colors duration-300"
                >
                  Next Location
                </button>
              )}
            </div>
          )}

          {quizMode && quizQuestion && (
            <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow-md">
              <p className="text-2xl font-bold text-kerala-green-800 mb-4">Which object made this sound?</p>
              <button
                onClick={() => playAudio(quizQuestion.audioSrc)}
                className="px-6 py-3 bg-blue-500 text-white text-xl font-semibold rounded-full shadow-md hover:bg-blue-600 transition-colors duration-300 mb-4"
              >
                Replay Sound
              </button>
              <div className="grid grid-cols-2 gap-4">
                {quizOptions.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleQuizAnswer(option)}
                    className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={option.imageSrc} alt={option.nameEnglish} className="w-24 h-24 object-contain mb-2" />
                    <p className="text-xl font-semibold text-kerala-green-800">{option.nameMalayalam}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {gameStarted && (
        <div className="mt-8 text-center">
          <h3 className="text-2xl font-bold text-kerala-green-800 mb-2">Discovered Vocabulary:</h3>
          {discoveredObjects.size === 0 ? (
            <p className="text-gray-600">None yet.</p>
          ) : (
            <div className="flex flex-wrap justify-center gap-2">
              {Array.from(discoveredObjects).map(objId => {
                const obj = currentLocation.objects.find(o => o.id === objId);
                return obj ? (
                  <span key={obj.id} className="px-3 py-1 bg-gray-100 rounded-full text-gray-700 text-sm">
                    {obj.nameMalayalam} ({obj.nameEnglish})
                  </span>
                ) : null;
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SoundscapeExplorerGame;
