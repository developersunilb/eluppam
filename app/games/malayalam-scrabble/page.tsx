'use client';

import React from 'react';
import MalayalamScrabbleGame from '@/components/MalayalamScrabbleGame';

const MalayalamScrabblePage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Level 20: Malayalam Scrabble</h1>
      <MalayalamScrabbleGame />
    </div>
  );
};

export default MalayalamScrabblePage;
