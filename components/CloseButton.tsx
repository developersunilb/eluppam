'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface CloseButtonProps {
  onClose?: () => void; // Optional callback for saving progress or other actions
}

export default function CloseButton({ onClose }: CloseButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (onClose) {
      onClose();
    }
    router.push('/games');
  };

  return (
    <button
      onClick={handleClick}
      className="absolute top-4 right-4 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-red-500 hover:bg-red-600 text-white text-xl font-bold leading-none shadow-md transition-all duration-200"
      aria-label="Close Game"
    >
      &times;
    </button>
  );
}
