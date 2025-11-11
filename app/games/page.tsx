'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useProgress } from '@/context/ProgressContext'; // Import useProgress

import { gamesData, Game } from '@/lib/game-data';

const NOVICE_GAME_ORDER = [
  'vowel-order-find',
  'whack-a-vowel',
  'memory-match',
  'letter-hunt',
  'magic-tracing',
  'spin-a-wheel',
  'pronunciation-challenge',
  'vowel-lego-match',
  'find-cat-mom',
  'consonant-bowling',
  'consonant-arrow',
  'consonant-christmas-tree',
  'consonant-flower-bloom',
  'consonant-house',
  'consonant-hornbill',
  'malayalam-mahjong',
  'malayalam-dance-simon',
  'consonant-space-runner',
  'sound-match',
  'consonants-game',
  'malayalam-vowel-maze',
  'consonant-memory-grid',
];

const INTERMEDIATE_GAME_ORDER = [
  'word-formation',
  'word-search',
  'word-find',
  'word-find-memory-test',
  'malayalam-scrabble',
  'picture-prompt-voice',
  'soundscape-explorer',
  'fruit-catch-vocabulary',
];

const ADVANCED_GAME_ORDER = [
  'pookkalam-coloring',
  'flashcard-battle',
  'emoji-word-match',
  'crossword-puzzle',
  'cultural-trivia',
  'voice-command',
  'speed-typing-race',
  'quiz-battle',
  'fill-in-the-blanks',
  'sentence-builder-blocks',
  'festival-quest',
];

const GAME_LEVEL_ORDERS: Record<Game['level'], string[]> = {
  Novice: NOVICE_GAME_ORDER,
  Intermediate: INTERMEDIATE_GAME_ORDER,
  Advanced: ADVANCED_GAME_ORDER,
};

const GAME_LEVELS: Game['level'][] = ['Novice', 'Intermediate', 'Advanced'];

// --- Main Page Component ---
export default function GamesPage() {
  const { userProgress } = useProgress();

  const isGameCompleted = (gameName: string) => {
    return userProgress?.games?.some(game => game.gameName === gameName) || false;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-100 to-marigold-100 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-kerala-green-700 text-center mb-8 sm:mb-12 drop-shadow-lg">
          Games Hub
        </h1>

        <div className="space-y-12">
          {GAME_LEVELS.map((level) => {
            const gamesForLevel = gamesData.filter((game) => game.level === level);

            // Sort games according to the predefined order for the current level
            const sortedGames = gamesForLevel.sort((a, b) => {
              const order = GAME_LEVEL_ORDERS[level];
              return order.indexOf(a.slug) - order.indexOf(b.slug);
            });

            if (sortedGames.length === 0) {
              return null;
            }

            return (
              <section key={level}>
                <h2 className="text-3xl sm:text-4xl font-bold text-kerala-green-600 mb-6 flex items-center">
                  {level === 'Novice' ? 'Beginner / Novice' : level} Games
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                  {sortedGames.map((game) => {
                    const isMemoryTest = game.slug === 'word-find-memory-test';
                    const wordFindCompleted = isGameCompleted('Word Find Game');
                    const isDisabled = isMemoryTest && !wordFindCompleted;

                    const cardContent = (
                      <Card className={`bg-white ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-in-out cursor-pointer'} h-full flex flex-col`}>
                        <CardHeader className="flex-grow flex items-center justify-center p-4">
                          <div className="text-5xl sm:text-6xl">
                            {game.slug === 'malayalam-mahjong' ? (
                              <img src={'/game/assets/image/gamespagecommonicon/malmahjong.png'} alt="Malayalam Mahjong" width={64} height={64} className="object-contain" />
                            ) : (
                              typeof game.icon === 'string' ? (
                                <span className="text-5xl sm:text-6xl">{game.icon}</span>
                              ) : (
                                game.icon
                              )
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="p-3 text-center">
                          <p className="font-semibold text-sm sm:text-base text-kerala-green-800">{game.name}</p>
                          {isDisabled && (
                            <p className="text-xs text-red-500 mt-1">Complete "Word Find Game" first</p>
                          )}
                        </CardContent>
                      </Card>
                    );

                    if (isDisabled) {
                      return <div key={game.slug}>{cardContent}</div>;
                    } else {
                      return (
                        <Link href={`/games/${game.slug}`} key={game.slug} passHref>
                          {cardContent}
                        </Link>
                      );
                    }
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}