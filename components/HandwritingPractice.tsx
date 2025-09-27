'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, Check, X } from 'lucide-react';

interface HandwritingPracticeProps {
  character: string;
  onComplete?: (success: boolean) => void;
}

const HandwritingPractice: React.FC<HandwritingPracticeProps> = ({ character, onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

  const canvasWidth = 300;
  const canvasHeight = 300;

  // Function to draw the dotted guide character
  const drawGuideCharacter = useCallback(() => {
    if (!context) return;

    context.clearRect(0, 0, canvasWidth, canvasHeight);
    context.font = '200px Noto Sans Malayalam'; // Adjust font size as needed
    context.fillStyle = 'rgba(0, 0, 0, 0.1)'; // Light grey for dotted effect
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(character, canvasWidth / 2, canvasHeight / 2);
  }, [context, character, canvasWidth, canvasHeight]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        setContext(ctx);
        // Set canvas dimensions
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
      }
    }
  }, []);

  useEffect(() => {
    if (context) {
      drawGuideCharacter();
    }
  }, [context, drawGuideCharacter]);

  const getCoordinates = (event: React.MouseEvent | React.TouchEvent): { x: number; y: number } | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();

    if (event.nativeEvent instanceof MouseEvent) {
        return { x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY };
    } else if (event.nativeEvent instanceof TouchEvent) {
        if (event.nativeEvent.touches.length > 0) {
            const touch = event.nativeEvent.touches[0];
            return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
        }
    }
    return null;
  };

  const startDrawing = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    if (!context) return;
    const coords = getCoordinates(event);
    if (!coords) return;
    const { x, y } = coords;
    context.beginPath();
    context.moveTo(x, y);
    setIsDrawing(true);
  }, [context]);

  const draw = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !context) return;
    const coords = getCoordinates(event);
    if (!coords) return;
    const { x, y } = coords;
    context.lineTo(x, y);
    context.stroke();
    setHasDrawn(true);
  }, [isDrawing, context]);

  const endDrawing = useCallback(() => {
    setIsDrawing(false);
    if (hasDrawn) {
      onComplete?.(true);
    }
    setHasDrawn(false);
    // For now, let's just clear the canvas after a short delay
    setTimeout(() => {
      if (context) {
        context.clearRect(0, 0, canvasWidth, canvasHeight);
        drawGuideCharacter(); // Redraw the guide
      }
    }, 1000);
  }, [context, drawGuideCharacter, hasDrawn, onComplete]);

  const clearCanvas = useCallback(() => {
    if (context) {
      context.clearRect(0, 0, canvasWidth, canvasHeight);
      drawGuideCharacter(); // Redraw the guide
      setHasDrawn(false);
    }
  }, [context, drawGuideCharacter]);

  return (
    <div className="flex flex-col items-center p-4 bg-marigold-50 rounded-lg shadow-md">
      <h3 className="text-xl font-bold text-kerala-green-800 mb-4">Practice Writing: {character}</h3>
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseUp={endDrawing}
        onMouseLeave={endDrawing} // End drawing if mouse leaves canvas
        onMouseMove={draw}
        onTouchStart={startDrawing}
        onTouchEnd={endDrawing}
        onTouchCancel={endDrawing}
        onTouchMove={draw}
        className="border-2 border-kerala-green-300 rounded-lg bg-white touch-none handwriting-canvas"
      />
      <div className="mt-4 space-x-2">
        <Button onClick={clearCanvas} variant="outline" className="bg-traditional-red-100 hover:bg-traditional-red-200 text-traditional-red-800">
          <RotateCcw className="h-5 w-5 mr-2" />
          Clear
        </Button>
        {/* Placeholder for check/submit button */}
        <Button onClick={() => onComplete?.(true)} className="bg-green-500 hover:bg-green-600 text-white" disabled={!hasDrawn}>
          <Check className="h-5 w-5 mr-2" />
          Done
        </Button>
      </div>
    </div>
  );
};

export default HandwritingPractice;
