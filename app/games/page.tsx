'use client';

import React from 'react';
import Link from 'next/link';
import { Unlock } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from 'next/image';
import { GAME_LEVELS } from '@/lib/game-levels';

export default function GamesPage() {
  return (
    <TooltipProvider>
      <main className="min-h-screen bg-gradient-to-br from-cream-50 to-marigold-50 p-4">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold text-kerala-green-700 mb-8 text-center">Game Challenge</h1>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-10 gap-4">
            {GAME_LEVELS.map((level, index) => {
              return (
                <div key={level.id} className="flex flex-col items-center text-center">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href={level.href}
                        className="relative w-24 h-24 mx-auto aspect-square rounded-lg flex items-center justify-center cursor-pointer overflow-hidden">

                        <Image src="/lockicons/unlocked.png" alt={level.title} fill className="w-full h-full object-cover" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Unlock className="h-12 w-12 text-white drop-shadow-md" />
                        </div>

                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{level.title}</p>
                    </TooltipContent>
                  </Tooltip>
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
