import GamePageClient from '@/components/GamePageClient';
import { gamesData } from '@/lib/game-data';

// This function generates the static paths and is required for `output: export`
export function generateStaticParams() {
  return gamesData.map(game => ({
    slug: game.slug,
  }));
}

// This is the Server Component page
export default function GamePage() {
  // It renders the Client Component which will handle all the logic
  return <GamePageClient />;
}