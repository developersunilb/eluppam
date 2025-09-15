'use client';

import { useRef, useState } from 'react';
import { ReactSketchCanvas } from 'react-sketch-canvas';
import { Button } from '@/components/ui/button';

export default function HandwritingRecognition() {
  const canvasRef = useRef<any>(null);
  const [recognizedText, setRecognizedText] = useState('');

  const handleRecognize = async () => {
    if (!canvasRef.current) return;

    const dataUrl = await canvasRef.current.exportImage('png');

    try {
      const response = await fetch('http://127.0.0.1:8000/recognize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: dataUrl }),
      });

      if (response.ok) {
        const data = await response.json();
        setRecognizedText(data.text);
      } else {
        console.error('Recognition failed');
      }
    } catch (error) {
      console.error('Error during recognition:', error);
    }
  };

  const handleClear = () => {
    if (canvasRef.current) {
      canvasRef.current.clearCanvas();
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative border-2 border-dashed border-gray-400 rounded-lg">
        <ReactSketchCanvas
          ref={canvasRef}
          strokeWidth={5}
          strokeColor="black"
          width="600px"
          height="600px"
        />
      </div>
      <div className="flex gap-4">
        <Button onClick={handleClear}>Clear</Button>
        <Button onClick={handleRecognize}>Recognize</Button>
      </div>
      {recognizedText && (
        <div className="mt-4 p-4 bg-green-100 rounded-lg">
          <p className="text-2xl font-bold text-black">Recognized: {recognizedText}</p>
        </div>
      )}
    </div>
  );
}
