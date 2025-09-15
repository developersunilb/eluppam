'use client';

import { useRef, useState, useEffect } from 'react';
import { ReactSketchCanvas } from 'react-sketch-canvas';
import { Button } from '@/components/ui/button';
import { Check, XCircle } from 'lucide-react';

interface MagicTracingGameProps {
  character: string;
  onComplete: (success: boolean) => void;
}

const MagicTracingGame = ({ character, onComplete }: MagicTracingGameProps) => {
  const canvasRef = useRef<any>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);

  // Function to generate a simple SVG for the character outline
  const generateCharacterOutline = (char: string) => {
    // This is a very basic placeholder. For real implementation, 
    // you'd need pre-rendered SVG/PNG outlines for each character.
    // For now, we'll just display the character itself.
    const svg = `
      <svg width="600" height="600" xmlns="http://www.w3.org/2000/svg">
        <rect width="600" height="600" fill="white"/>
        <text x="50%" y="50%" font-family="Noto Sans Malayalam" font-size="400" fill="gray" text-anchor="middle" dominant-baseline="middle">${char}</text>
      </svg>
    `;
    const encodedSvg = encodeURIComponent(svg)
      .replace(/'/g, '%27')
      .replace(/"/g, '%22');
    const dataUrl = `data:image/svg+xml;base64,${btoa(encodedSvg)}`;
    return dataUrl;
  };

  useEffect(() => {
    setBackgroundImage(generateCharacterOutline(character));
  }, [character]);

  const handleCheckTrace = async () => {
    if (!canvasRef.current) return;

    // For now, this is a placeholder for actual trace comparison logic.
    // In a real scenario, you'd compare the drawn path with the expected path.
    // For demonstration, let's just assume it's correct if something is drawn.
    const paths = await canvasRef.current.exportPaths();
    const minStrokes = 3; // A very basic heuristic: require at least 3 strokes

    if (paths.length >= minStrokes) {
      setFeedback('correct');
      onComplete(true);
    } else {
      setFeedback('incorrect');
      onComplete(false);
    }
  };

  const handleClear = () => {
    if (canvasRef.current) {
      canvasRef.current.clearCanvas();
      setFeedback(null);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-lg text-gray-600 mb-4">Trace the letter {character} with your finger!</p>
      
      <div className="relative border-2 border-dashed border-marigold-500 rounded-lg">
        {backgroundImage && (
          <ReactSketchCanvas
            ref={canvasRef}
            strokeWidth={10}
            strokeColor="black"
            canvasColor="white"
            backgroundImage={backgroundImage}
            width="600px"
            height="600px"
          />
        )}
      </div>

      <div className="flex gap-4 mt-4">
        <Button onClick={handleClear}>Clear</Button>
        <Button onClick={handleCheckTrace}>Check Trace</Button>
      </div>

      {feedback && (
        <div className={`mt-4 p-4 rounded-lg flex items-center ${feedback === 'correct' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {feedback === 'correct' ? 'Great job!' : 'Try again!'}
        </div>
      )}
    </div>
  );
};

export default MagicTracingGame;
