'use client';

import React from 'react';
import { useProgress } from '@/context/ProgressContext';
import Image from 'next/image';

export default function BadgesEarnedPage() {
  const { userProgress, loading, error } = useProgress();

  if (loading) {
    return <div className="container mx-auto p-4 text-center">Loading badges...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-center text-red-500">Error: {error}</div>;
  }

  const badges = userProgress?.badges || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 to-marigold-50 p-4">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-kerala-green-700 mb-8 text-center">Your Earned Badges</h1>
        
        {badges.length === 0 ? (
          <p className="text-center text-lg text-gray-600">You haven't earned any badges yet. Keep playing!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {badges.map((badge) => (
              <div key={badge.id} className="bg-white rounded-lg shadow-lg p-4 flex flex-col items-center text-center">
                <div className="relative w-[232px] h-[232px] mb-4">
                  <Image src={badge.image} alt={badge.name} layout="fill" objectFit="contain" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-1">{badge.name}</h3>
                <p className="text-sm text-gray-600">Earned on: {new Date(badge.dateEarned).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
