'use client';

import React from 'react';
import Mahjong3D from '@/components/Mahjong3D';

export default function Mahjong3DPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-8">3D Mahjong</h1>
      <Mahjong3D />
    </div>
  );
}
