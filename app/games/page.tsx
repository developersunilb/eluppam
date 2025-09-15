'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LetterHuntGame from '@/components/LetterHuntGame';
import FlashcardBattleGame from '@/components/FlashcardBattleGame';
import PuzzleBlocksGame from '@/components/PuzzleBlocksGame';
import WordJigsawGame from '@/components/WordJigsawGame';
import FillInTheBlanksGame from '@/components/FillInTheBlanksGame';
import PronunciationChallengeGame from '@/components/PronunciationChallengeGame';
import FestivalQuestGame from '@/components/FestivalQuestGame';
import QuizBattleGame from '@/components/QuizBattleGame';
import Link from 'next/link'; // Import Link component
import { Button } from '@/components/ui/button'; // Import Button component

const GamesPage = () => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-cream-50 to-marigold-50">
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold mb-8 text-center text-kerala-green-700">Games</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> {/* Added grid for multiple game cards */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-kerala-green-700">Letter Hunt</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-kerala-green-700">Identify the target letter within a set of words.</p>
              <LetterHuntGame />
            </CardContent>
          </Card>

          {/* New Card for Flashcard Battles */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-kerala-green-700">Flashcard Battles</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-kerala-green-700">Match images with their Malayalam words.</p>
              <FlashcardBattleGame onComplete={(success) => console.log('Flashcard Battle Complete:', success)} />
            </CardContent>
          </Card>

          {/* New Card for Puzzle Blocks */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-kerala-green-700">Puzzle Blocks</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-kerala-green-700">Drag and drop letters to form words.</p>
              <PuzzleBlocksGame onComplete={(success) => console.log('Puzzle Blocks Complete:', success)} />
            </CardContent>
          </Card>

          {/* New Card for Word Jigsaw */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-kerala-green-700">Word Jigsaw</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-kerala-green-700">Arrange syllables to form words.</p>
              <WordJigsawGame onComplete={(success) => console.log('Word Jigsaw Complete:', success)} />
            </CardContent>
          </Card>

          {/* New Card for Fill-in-the-Blanks */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-kerala-green-700">Fill-in-the-Blanks</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-kerala-green-700">Complete sentences with the correct word.</p>
              <FillInTheBlanksGame onComplete={(success) => console.log('Fill-in-the-Blanks Complete:', success)} />
            </CardContent>
          </Card>

          {/* New Card for Pronunciation Challenge */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-kerala-green-700">Pronunciation Challenge</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-kerala-green-700">Practice pronouncing Malayalam words.</p>
              <PronunciationChallengeGame onComplete={(success) => console.log('Pronunciation Challenge Complete:', success)} />
            </CardContent>
          </Card>

          {/* New Card for Festival Quest */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-kerala-green-700">Festival Quest</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-kerala-green-700">Learn about Malayalam festivals through quizzes.</p>
              <FestivalQuestGame onComplete={(success) => console.log('Festival Quest Complete:', success)} />
            </CardContent>
          </Card>

          {/* New Card for Quiz Battles */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-kerala-green-700">Quiz Battles</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-kerala-green-700">Test your Malayalam knowledge with quizzes.</p>
              <QuizBattleGame onComplete={(success) => console.log('Quiz Battle Complete:', success)} />
            </CardContent>
          </Card>

          {/* New Card for Vowels Adventure */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-kerala-green-700">Vowels Adventure</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-kerala-green-700">Embark on an adventure to learn Malayalam vowels!</p>
              <Link href="/games/vowels" passHref>
                <Button className="text-lg whitespace-normal h-auto w-full px-8 py-2 flex items-center justify-center text-center bg-marigold-500 hover:bg-marigold-600 text-white">
                  Play Now
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
        {/* Add more game cards here as they are implemented */}
      </div>
    </main>
  );
};

export default GamesPage;
