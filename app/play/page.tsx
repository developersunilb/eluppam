'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import type { NextPage } from 'next';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useProgress } from '@/context/ProgressContext';
import { useAuth } from '@/context/AuthContext';
import { X, BookOpen } from 'lucide-react';
import WordFindGame from '@/components/WordFindGame';

const GamePage: NextPage = () => {
  const [isClient, setIsClient] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const { updateModuleProgress } = useProgress();
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const gameId = searchParams.get('id');

  const handleGameComplete = useCallback(async (success: boolean, score?: number) => {
    if (success && gameId) {
      console.log(`Game "${gameId}" completed successfully! Updating progress...`);
      try {
        await updateModuleProgress(gameId, 'practice', 'completed', score !== undefined ? score : 100);
        console.log("Progress updated, navigating back to games page.");
        router.push(`/games?completed=${gameId}`);
      } catch (error) {
        console.error("Failed to update progress:", error);
      }
    } else {
      console.log(`Game "${gameId}" failed or no gameId provided.`);
    }
  }, [gameId, updateModuleProgress, router]);

  const handleWordFormationLevelComplete = useCallback(async (score: number) => {
    // This will call the generic handleGameComplete with success=true and the score
    handleGameComplete(true, score);
  }, [handleGameComplete]);

  const handleWordFormationNextLevel = useCallback(() => {
    // For now, just redirect to games page after a level in WordFormationGame
    // In a multi-level WordFormationGame, this would advance to the next level
    router.push(`/games?completed=${gameId}`);
  }, [router, gameId]);

  const gameProps: { [key: string]: any } = {
    'word-formation': {
      level: 1,
      letters: ['അ', 'മ', 'ല', 'വ', 'ൻ'],
      validWords: ['അമ്മ', 'അവൻ', 'മല', 'വനം'],
      isLastLevel: false,
      onLevelComplete: handleWordFormationLevelComplete,
      onNextLevel: handleWordFormationNextLevel,
    },
  };

  const GameComponent = useMemo(() => {
    if (!gameId) return null;
    // A simple mapping from gameId to component name for security
    const componentMap: { [key: string]: any } = {
      'letter-hunt': dynamic(() => import('@/components/LetterHuntGame'), { ssr: false }),
      'consonant-adventure': dynamic(() => import('@/components/ConsonantsGame'), { ssr: false }),
      'consonant-space-runner': dynamic(() => import('@/components/ConsonantSpaceRunnerGame'), { ssr: false }),
      'magic-tracing': dynamic(() => import('@/components/MagicTracingGame'), { ssr: false }),
      'memory-match': dynamic(() => import('@/components/MemoryMatchGame'), { ssr: false }),
      'whack-a-vowel': dynamic(() => import('@/components/WhackAVowelGame'), { ssr: false }),
      'pookkalam-coloring': dynamic(() => import('@/components/PookkalamColoringGame'), { ssr: false }),
      'mahjong-game': dynamic(() => import('@/components/Mahjong3DGame'), { ssr: false }),
      'flashcard-battle': dynamic(() => import('@/components/FlashcardBattleGame'), { ssr: false }),
      'word-formation': dynamic(() => import('@/components/WordFormationGame'), { ssr: false }),
      'word-jigsaw': dynamic(() => import('@/components/WordJigsawGame'), { ssr: false }),
      'picture-prompt-voice': dynamic(() => import('@/components/PicturePromptVoiceGame'), { ssr: false }),
      'pronunciation-challenge': dynamic(() => import('@/components/PronunciationChallengeGame'), { ssr: false }),
      'voice-command-game': dynamic(() => import('@/components/VoiceCommandGame'), { ssr: false }),
      'sound-match': dynamic(() => import('@/components/SoundMatchGame'), { ssr: false }),
      'speed-typing': dynamic(() => import('@/components/SpeedTypingRaceGame'), { ssr: false }),
      'emoji-word-match': dynamic(() => import('@/components/EmojiWordMatchGame'), { ssr: false }),
      'fill-in-the-blanks': dynamic(() => import('@/components/FillInTheBlanksGame'), { ssr: false }),
      'quiz-battle': dynamic(() => import('@/components/QuizBattleGame'), { ssr: false }),
      'festival-quest': dynamic(() => import('@/components/FestivalQuestGame'), { ssr: false }),
      'cultural-trivia': dynamic(() => import('@/components/CulturalTriviaGame'), { ssr: false }),
      'word-search': dynamic(() => import('@/components/WordSearchGame'), { ssr: false }),
      'crossword-puzzle': dynamic(() => import('@/components/CrosswordPuzzleGame'), { ssr: false }),
      'malayalam-scrabble': dynamic(() => import('@/components/MalayalamScrabbleGame'), { ssr: false }),
      'wordfind': WordFindGame,
      'consonant-arrow-game': dynamic(() => import('@/components/ConsonantArrowGame'), { ssr: false }),
      'find-cat-mom': dynamic(() => import('@/components/FindCatMomGame'), { ssr: false }),
      'consonant-christmas-tree': dynamic(() => import('@/components/ConsonantChristmasTreeGame'), { ssr: false }),      
      'consonant-flower-bloom': dynamic(() => import('@/components/ConsonantFlowerBloomGame'), { ssr: false }),
      'consonant-house': dynamic(() => import('@/components/ConsonantHouseGame'), { ssr: false }),
      'consonant-hornbill': dynamic(() => import('@/components/ConsonantHornbillGame'), { ssr: false }),
      'FruitCatch': dynamic(() => import('@/components/FruitCatchVocabularyGame'), { ssr: false }),
    };
    return componentMap[gameId] || null;
  }, [gameId]);

  useEffect(() => {
    setIsClient(true);
  }, []);



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
    <div className="relative w-full flex items-center justify-center bg-marigold-600 flex-grow">
      <button
        onClick={handleExitGame}
        className="absolute top-4 right-4 z-50 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
        aria-label="Exit Game"
      >
        <X className="h-6 w-6" />
      </button>
      <button
        onClick={() => setShowHowToPlay(!showHowToPlay)}
        className="absolute top-16 right-4 z-50 bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 transition-colors"
        aria-label="How to Play"
      >
        <BookOpen className="h-6 w-6" />
      </button>
      {isClient ? <GameComponent onComplete={handleGameComplete} setShowHowToPlay={setShowHowToPlay} showHowToPlay={showHowToPlay} {...gameProps[gameId]} /> : <p className="text-white">Loading game...</p>}    </div>
  );
};

export default GamePage;
