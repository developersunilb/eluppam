'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LetterHuntGame from '@/components/LetterHuntGame';
import FlashcardBattleGame from '@/components/FlashcardBattleGame';

import WordJigsawGame from '@/components/WordJigsawGame';
import EmojiWordMatchGame from '@/components/EmojiWordMatchGame';
import SpeedTypingRaceGame from '@/components/SpeedTypingRaceGame';
import FillInTheBlanksGame from '@/components/FillInTheBlanksGame';
import PronunciationChallengeGame from '@/components/PronunciationChallengeGame';
import FestivalQuestGame from '@/components/FestivalQuestGame';
import QuizBattleGame from '@/components/QuizBattleGame';
import CulturalTriviaGame from '@/components/CulturalTriviaGame';
import VoiceCommandGame from '@/components/VoiceCommandGame';
import Link from 'next/link'; // Import Link component
import { Button } from '@/components/ui/button'; // Import Button component

const GamesPage = () => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-cream-50 to-marigold-50">
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold mb-8 text-center text-kerala-green-700">Games</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> {/* Added grid for multiple game cards */}
        </div>
        {/* Add more game cards here as they are implemented */}
      </div>
    </main>
  );
};

export default GamesPage;
