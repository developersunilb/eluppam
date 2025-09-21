
'use client';

import React, { useState, useEffect, Key } from 'react';

interface Stroke {
  d: string;
  length: number;
}

interface StrokeAnimationProps {
  strokes: Stroke[];
  viewBox: string;
  className?: string;
  key?: Key;
}

const StrokeAnimation: React.FC<StrokeAnimationProps> = ({ strokes, viewBox, className, key }) => {
  const totalDuration = strokes.length * 2; // 2s per stroke
  const [animationKey, setAnimationKey] = useState(0);

  const handleAnimationEnd = (index: number) => {
    if (index === strokes.length - 1) {
      // Optional: Do something when the full animation finishes
    }
  };

  const replayAnimation = () => {
    setAnimationKey(prevKey => prevKey + 1);
  };

  useEffect(() => {
    // This effect can be used to trigger the animation on mount or other events
    replayAnimation();
  }, [key]);


  return (
    <div className="flex flex-col items-center gap-4">
      <svg
        key={animationKey}
        className={className}
        viewBox={viewBox}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {strokes.map((stroke, index) => {
          const duration = '2s'; // Duration for this single stroke
          const delay = `${index * 2}s`; // Start this stroke after the previous one finishes

          return (
            <path
              key={index}
              d={stroke.d}
              strokeDasharray={stroke.length}
              strokeDashoffset={stroke.length}
              onAnimationEnd={() => handleAnimationEnd(index)}
              style={{
                animation: `draw ${duration} ease-in-out ${delay} forwards`,
              }}
            />
          );
        })}
      </svg>
      <button onClick={replayAnimation} className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">
        Replay Animation
      </button>
    </div>
  );
};

export default StrokeAnimation;

