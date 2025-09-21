'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Unlock } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useProgress } from '@/context/ProgressContext';

import { GameLevel } from '@/lib/types/progress';
import { GAME_LEVELS } from '@/lib/game-levels';

export default function GamesPage() {
  const { userProgress } = useProgress();
  const [unlockedLevels, setUnlockedLevels] = useState<Set<string>>(new Set());
  const [highlightedLevel, setHighlightedLevel] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const completedLessons = new Set<string>();
    userProgress?.modules.forEach(module => {
      if (module.moduleId === 'games') {
        module.lessons.forEach(lesson => {
          if (lesson.completed) {
            completedLessons.add(lesson.lessonId);
          }
        });
      }
    });

    const newUnlocked = new Set<string>();
    if (GAME_LEVELS.length > 0) {
      newUnlocked.add(GAME_LEVELS[0].id);
    }
    GAME_LEVELS.forEach(level => {
      if (level.prerequisite && completedLessons.has(level.prerequisite)) {
        newUnlocked.add(level.id);
      }
    });
    setUnlockedLevels(newUnlocked);

    const completedGameId = searchParams.get('completed');
    if (completedGameId) {
      const newlyUnlockedLevel = GAME_LEVELS.find(level => level.prerequisite === completedGameId);
      if (newlyUnlockedLevel && newUnlocked.has(newlyUnlockedLevel.id)) {
        setHighlightedLevel(newlyUnlockedLevel.id);
        const timer = setTimeout(() => {
          setHighlightedLevel(null);
        }, 5000);
        return () => clearTimeout(timer);
      }
    }
  }, [userProgress, searchParams]);

  return (
    <TooltipProvider>
      <main className="min-h-screen bg-gradient-to-br from-cream-50 to-marigold-50 p-4">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold text-kerala-green-700 mb-8 text-center">Game Challenge</h1>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-10 gap-4">
            {GAME_LEVELS.map((level, index) => {
              const isUnlocked = unlockedLevels.has(level.id);
              const isHighlighted = level.id === highlightedLevel;
              return (
                <div key={level.id} className="flex flex-col items-center text-center">
                  <div className="relative">
                    {isHighlighted && (
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-marigold-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-lg z-10 whitespace-nowrap">
                        New Level Unlocked!
                      </div>
                    )}
                    {isUnlocked ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link href={level.href} passHref>
                            <div className="relative w-full max-w-6 mx-auto aspect-square rounded-lg flex items-center justify-center cursor-pointer overflow-hidden">
                              <img src="/lockicons/unlocked.png" alt={level.title} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Unlock className="h-12 w-12 text-white drop-shadow-md" />
                              </div>
                            </div>
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{level.title}</p>
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <div className="relative w-full max-w-6 mx-auto aspect-square rounded-lg overflow-hidden">
                        <img src="/lockicons/lock2.png" alt={level.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Lock className="h-12 w-12 text-white opacity-75 drop-shadow-md" />
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="text-center font-semibold mt-1 text-kerala-green-800">Level {index + 1}</p>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </TooltipProvider>
  );
}
