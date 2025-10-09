'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, Check, Lightbulb, CheckCircle, XCircle } from 'lucide-react';
import { vowels, consonants } from '@/lib/data';
import Image from 'next/image';

const TRACING_CHARACTERS = ['അ', 'ആ', 'ഇ', 'ഈ', 'ഉ'];

interface MagicTracingGameProps {
  onComplete: (success: boolean) => void;
  clearTrigger: number;
}

const MagicTracingGame: React.FC<MagicTracingGameProps> = ({ onComplete, clearTrigger }) => {
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const character = TRACING_CHARACTERS[currentCharIndex];
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [gameStatus, setGameStatus] = useState<'playing' | 'level_complete'>('playing');
  const drawCanvasRef = useRef<HTMLCanvasElement>(null);
  const guideCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showHintGif, setShowHintGif] = useState(false);

  const getGifSrc = (char: string): string | undefined => {
    const vowel = vowels.find(v => v.vowel === char);
    if (vowel && vowel.gifSrc) {
      return vowel.gifSrc;
    }
    const consonant = consonants.find(c => c.consonant === char);
    if (consonant) {
      return `/writing/consonants/${char}.gif`;
    }
    return undefined;
  };

  const canvasWidth = 400;
  const canvasHeight = 400;
  const TRACE_THRESHOLD = 0.6; // 60% of the character must be traced over

  const drawGuide = useCallback(() => {
    const canvas = guideCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.font = '200px Noto Sans Malayalam';
    ctx.fillStyle = '#E0E0E0'; // Light grey for the guide
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(character, canvasWidth / 2, canvasHeight / 2);
  }, [character]);

  useEffect(() => {
    drawGuide();
  }, [drawGuide]);

  useEffect(() => {
    clearCanvas();
  }, [clearTrigger]);

  const getCoords = (e: React.MouseEvent | React.TouchEvent): { x: number; y: number } | null => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();

    let clientX, clientY;
    if (e.nativeEvent instanceof MouseEvent) {
      clientX = e.nativeEvent.clientX;
      clientY = e.nativeEvent.clientY;
    } else if (e.nativeEvent instanceof TouchEvent) {
      if (e.nativeEvent.touches.length === 0) return null;
      clientX = e.nativeEvent.touches[0].clientX;
      clientY = e.nativeEvent.touches[0].clientY;
    } else {
        return null;
    }

    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const coords = getCoords(e);
    if (!coords) return;
    const ctx = drawCanvasRef.current?.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    ctx.strokeStyle = '#10B981'; // A nice green color
    ctx.lineWidth = 15;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const coords = getCoords(e);
    if (!coords) return;
    const ctx = drawCanvasRef.current?.getContext('2d');
    if (!ctx) return;

    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
  };

  const endDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx?.clearRect(0, 0, canvasWidth, canvasHeight);
  };

  const checkTrace = () => {
    const drawCtx = drawCanvasRef.current?.getContext('2d', { willReadFrequently: true });
    const guideCtx = guideCanvasRef.current?.getContext('2d', { willReadFrequently: true });

    if (!drawCtx || !guideCtx) {
      onComplete(false);
      return;
    }

    const guideData = guideCtx.getImageData(0, 0, canvasWidth, canvasHeight).data;
    const drawData = drawCtx.getImageData(0, 0, canvasWidth, canvasHeight).data;

    let guidePixelCount = 0;
    let tracedPixelCount = 0;

    for (let i = 0; i < guideData.length; i += 4) {
      if (guideData[i + 3] > 0) {
        guidePixelCount++;
        if (drawData[i + 3] > 0) {
          tracedPixelCount++;
        }
      }
    }

    const matchPercentage = guidePixelCount > 0 ? tracedPixelCount / guidePixelCount : 0;

    if (matchPercentage >= TRACE_THRESHOLD) {
      setFeedback('correct');
      if (currentCharIndex < TRACING_CHARACTERS.length - 1) {
        setTimeout(() => {
          setCurrentCharIndex(prev => prev + 1);
          clearCanvas();
          setFeedback(null);
        }, 1000);
      } else {
        setGameStatus('level_complete');
        onComplete(true);
      }
    } else {
      setFeedback('incorrect');
      setTimeout(() => {
        setFeedback(null);
      }, 1500);
      onComplete(false);
    }
  };

  if (gameStatus === 'level_complete') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream-50 to-marigold-50 p-4 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-xl">
          <h2 className="text-3xl font-bold text-kerala-green-700 mb-4">
            Congratulations!
          </h2>
          <p className="text-xl text-gray-700 mb-6">
            You've passed the Magic Tracing game!
          </p>
          <Button 
            onClick={() => window.location.href = '/games?completed=magic-tracing'}
            className="px-8 py-3 text-lg bg-marigold-500 hover:bg-marigold-600 text-white shadow-lg">
            Go to Games Page
          </Button>
        </div>
      </div>
    );
  }



  return (
    <div className="flex flex-col items-center p-4 bg-cream-50 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-kerala-green-800 mb-4">Trace the letter: {character}</h1>
      <p className="text-xl text-gray-600 mb-6">Character {currentCharIndex + 1} of {TRACING_CHARACTERS.length}</p>
      <div className="magic-tracing-canvas-container">
        <canvas
          ref={guideCanvasRef}
          width={canvasWidth}
          height={canvasHeight}
          className="guide-canvas"
        />
        <canvas
          ref={drawCanvasRef}
          width={canvasWidth}
          height={canvasHeight}
          onMouseDown={startDrawing}
          onMouseUp={endDrawing}
          onMouseLeave={endDrawing}
          onMouseMove={draw}
          onTouchStart={startDrawing}
          onTouchEnd={endDrawing}
          onTouchCancel={endDrawing}
          onTouchMove={draw}
          className="draw-canvas touch-none"
        />
      </div>
      <div className="mt-4 space-x-4">
        <Button onClick={clearCanvas} variant="outline">
          <RotateCcw className="h-5 w-5 mr-2" />
          Clear
        </Button>
        <Button onClick={checkTrace} className="bg-green-500 hover:bg-green-600 text-white">
          <Check className="h-5 w-5 mr-2" />
          Check Trace
        </Button>
        <Button onClick={() => setShowHintGif(true)} variant="outline">
          <Lightbulb className="h-5 w-5 mr-2" />
          Hint
        </Button>
      </div>

      {feedback && (
        <div className={`mt-4 p-4 rounded-lg flex items-center text-2xl font-bold 
          ${feedback === 'correct' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {feedback === 'correct' ? <CheckCircle className="mr-2" /> : <XCircle className="mr-2" />}
          {feedback === 'correct' ? 'Perfect!' : 'Not quite, try again!'}
        </div>
      )}

      {showHintGif && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-30"
             onClick={() => setShowHintGif(false)}>
          <Image src={getGifSrc(character) || ''} alt={`Hint for ${character}`} width={canvasWidth} height={canvasHeight} className="max-w-full max-h-full" />
        </div>
      )}
    </div>
  );
};

export default MagicTracingGame;
