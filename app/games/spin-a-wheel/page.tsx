'use client';

import React from 'react';
import SpinAWheelGame from '@/components/SpinAWheelGame';

export default function SpinAWheelPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 flex items-center justify-center">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Spin a Wheel</h1>
        <SpinAWheelGame />
      </div>
    </main>
  );
}