'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import type { NextPage } from 'next';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useProgress } from '@/context/ProgressContext';
import { useAuth } from '@/context/AuthContext';
import { X } from 'lucide-react';

const GamePage: NextPage = () => {
  const [isClient, setIsClient] = useState(false);
  const { updateModuleProgress } = useProgress();
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const gameId = searchParams.get('id');

  const gameProps: { [key: string]: any } = {
    'word-formation': {
      level: 1,
      letters: ['a', 'b', 'c'],
      validWords: ['cab', 'bac'],
      isLastLevel: false,
    },
  };

  const GameComponent = useMemo(() => {
    if (!gameId) return null;
    // A simple mapping from gameId to component name for security
    const componentMap: { [key: string]: string } = {
      'letter-hunt': 'LetterHuntGame',
      'consonant-adventure': 'ConsonantsGame',
      'consonant-space-runner': 'ConsonantSpaceRunnerGame',
      'magic-tracing': 'MagicTracingGame',
      'memory-match': 'MemoryMatchGame',
      'whack-a-vowel': 'WhackAVowelGame',
      'pookkalam-coloring': 'PookkalamColoringApp',
      'mahjong-game': 'Mahjong3DGame',
      'flashcard-battle': 'FlashcardBattleGame',
      'word-formation': 'WordFormationGame',
      'word-jigsaw': 'WordJigsawGame',
      'picture-prompt-voice': 'PicturePromptVoiceGame',
      'pronunciation-challenge': 'PronunciationChallengeGame',
      'voice-command-game': 'VoiceCommandGame',
      'sound-match': 'SoundMatchGame',
      'speed-typing': 'SpeedTypingRaceGame',
      'emoji-word-match': 'EmojiWordMatchGame',
      'fill-in-the-blanks': 'FillInTheBlanksGame',
      'quiz-battle': 'QuizBattleGame',
      'festival-quest': 'FestivalQuestGame',
      'cultural-trivia': 'CulturalTriviaGame',
      'word-search': 'WordSearchGame',
      'crossword-puzzle': 'CrosswordPuzzleGame',
      'malayalam-scrabble': 'MalayalamScrabbleGame',
      'wordfind': 'WordFindGame',
    };
    const componentName = componentMap[gameId];
    if (!componentName) return null;

    return dynamic(() => import(`@/components/${componentName}`), { ssr: false });
  }, [gameId]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleGameComplete = useCallback(async (success: boolean) => {
    if (success && gameId) {
      console.log(`Game "${gameId}" completed successfully! Updating progress...`);
      try {
        await updateModuleProgress(gameId, 'practice', 'completed', 100);
        console.log("Progress updated, navigating back to games page.");
        router.push(`/games?completed=${gameId}`);
      } catch (error) {
        console.error("Failed to update progress:", error);
      }
    } else {
      console.log(`Game "${gameId}" failed or no gameId provided.`);
    }
  }, [gameId, updateModuleProgress, router]);

  const handleExitGame = async () => {
    if (!gameId) return;

    if (!isLoggedIn) {
      router.push('/games');
      return;
    }

    const confirmed = window.confirm('Are you sure you want to exit? Your attempt will be marked as in-progress.');
    if (confirmed) {
      try {
        await updateModuleProgress(gameId, 'practice', 'in-progress');
        router.push('/games');
      } catch (error) {
        console.error("Failed to update progress on exit:", error);
        // Still navigate away even if progress update fails
        router.push('/games');
      }
    }
  };

  if (!gameId || !GameComponent) {
    return <p className="text-white">Game not found or loading...</p>;
  }

  return (
    <div className="relative w-full h-screen flex items-center justify-center bg-marigold-600">
      <button
        onClick={handleExitGame}
        className="absolute top-4 right-4 z-50 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
        aria-label="Exit Game"
      >
        <X className="h-6 w-6" />
      </button>
      {isClient ? <GameComponent onComplete={handleGameComplete} {...gameProps[gameId]} /> : <p className="text-white">Loading game...</p>}
    </div>
  );
};

export default GamePage;
