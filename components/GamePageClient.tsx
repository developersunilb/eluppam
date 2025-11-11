'use client';

import { useParams, useRouter } from 'next/navigation';
import GameWrapper from '@/components/GameWrapper';
import { gamesData, wordFormationGameData } from '@/lib/game-data';
import Link from 'next/link';
import WordFormationGame from '@/components/WordFormationGame';

export default function GamePageClient() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const game = gamesData.find(g => g.slug === slug);

  const handleGameComplete = (success: boolean) => {
    console.log(`Game ${game?.name} completed! Success: ${success}`);
    // Optionally, update user progress here
    router.push('/games'); // Navigate back to games hub
  };

  if (!game) {
    return (
      <GameWrapper>
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-600">Game Not Found</h1>
          <p className="text-xl mt-4">The game you are looking for does not exist.</p>
          <Link href="/games" className="mt-8 inline-block px-6 py-3 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition-colors">
            Back to Games Hub
          </Link>
        </div>
      </GameWrapper>
    );
  }

  if (game.slug === 'word-formation') {
    const levelData = wordFormationGameData.levels[0]; // Default to level 1 for now
    return (
      <GameWrapper>
        <WordFormationGame
          level={levelData.level}
          letters={levelData.letters}
          validWords={levelData.validWords}
          onLevelComplete={() => {}}
          onNextLevel={() => {}}
          isLastLevel={false}
        />
      </GameWrapper>
    );
  }

  const GameComponent = game.component;

  return (
    <GameWrapper>
      <GameComponent onComplete={handleGameComplete} />
    </GameWrapper>
  );
}
