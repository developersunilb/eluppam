'use client';

import { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ConsonantGame = dynamic(() => import('@/components/ConsonantSpaceRunnerGame'), {
  ssr: false,
});

const ConsonantRunnerPage: NextPage = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="w-full min-h-screen bg-green-900 text-white p-4 md:p-8">
      <h1 className="text-4xl font-bold text-emerald-400 mb-8 text-center">Consonant Runner</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {isClient ? <ConsonantGame /> : <p className="text-white text-center">Loading game...</p>}
        </div>
        <div className="lg:col-span-1">
          <Card className="bg-gray-800 border-gray-800 h-full">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-emerald-400">How to Play</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-4">
              <div>
                <h3 className="font-semibold text-lg text-emerald-300">Objective</h3>
                <p>Collect all the Malayalam consonants (വ്യഞ്ജനാക്ഷരങ്ങൾ) while navigating through space.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-emerald-300">Controls</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li><span className="font-bold">Up Arrow:</span> Move up.</li>
                  <li><span className="font-bold">Down Arrow:</span> Move down.</li>
                  <li><span className="font-bold">Spacebar:</span> Jump.</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-emerald-300">Gameplay</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Fly through the colorful planets to collect consonants.</li>
                  <li>Avoid the spinning <span className="font-bold text-orange-400">Black Holes</span>! Hitting one will cost you a life.</li>
                  <li>You have 5 lives to complete your mission.</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-emerald-300">Scoring</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Your score increases as you travel through space.</li>
                  <li>Collect all consonants without losing any lives for a perfect run and a special badge!</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ConsonantRunnerPage;
