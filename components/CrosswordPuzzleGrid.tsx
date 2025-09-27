"use client";

import React from "react";

const crosswordLayout: number[][] = [
  [0, 0, 0, 1, 0],
  [0, 0, 0, 1, 0],
  [0, 0, 1, 1, 0],
  [1, 1, 1, 1, 0],
  [0, 0, 1, 0, 1],
  [0, 0, 1, 1, 1],
  [0, 0, 0, 0, 0],
];

export default function CrosswordPuzzleGrid() {
  let currentNumber = 0;
  return (
    <div className="flex flex-col items-center mt-8">
      {crosswordLayout.map((row, rowIndex) => (
        <div key={rowIndex} className="flex">
          {row.map((cell, colIndex) => {
            let cellNumber = null;
            if (cell === 1) {
              currentNumber++;
              cellNumber = currentNumber;
            }
            return (
              <div
                key={colIndex}
                className={`w-12 h-12 border border-black relative flex items-center justify-center
                  ${cell === 1 ? "bg-white" : "bg-transparent"}`}
              >
                {cellNumber && (
                  <span className="absolute top-0 left-0 text-xs p-1 font-bold">
                    {cellNumber}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
