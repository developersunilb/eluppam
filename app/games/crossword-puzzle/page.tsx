'use client';

import React from 'react';
import CrosswordPuzzleGrid from '@/components/CrosswordPuzzleGrid';

export default function CrosswordPuzzlePage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Crossword Puzzle</h1>
      <CrosswordPuzzleGrid />
      {/* Future: Add clues, input fields, and game logic here */}
    </div>
  );
}
