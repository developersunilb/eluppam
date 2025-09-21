'use client';

import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';

interface MobileGameControlsProps {
  onUpPress: () => void;
  onUpRelease: () => void;
  onLeftPress: () => void;
  onLeftRelease: () => void;
  onRightPress: () => void;
  onRightRelease: () => void;
}

const MobileGameControls: React.FC<MobileGameControlsProps> = ({
  onUpPress,
  onUpRelease,
  onLeftPress,
  onLeftRelease,
  onRightPress,
  onRightRelease,
}) => {
  const [showControls, setShowControls] = useState(false);
  const [isMobileLandscape, setIsMobileLandscape] = useState(false);

  const checkMobileLandscape = () => {
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    const isLandscape = window.matchMedia("(orientation: landscape)").matches;
    setIsMobileLandscape(isMobile && isLandscape);
  };

  useEffect(() => {
    checkMobileLandscape();
    window.addEventListener('resize', checkMobileLandscape);
    return () => window.removeEventListener('resize', checkMobileLandscape);
  }, []);

  if (!isMobileLandscape) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Toggle Button */}
      <Button
        className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg"
        onClick={() => setShowControls(!showControls)}
        aria-label="Toggle Game Controls"
      >
        {showControls ? 'X' : '🎮'}
      </Button>

      {/* Gaming Keys */}
      {showControls && (
        <div className="absolute bottom-20 right-4 flex flex-col items-center space-y-2">
          <Button
            className="w-14 h-14 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center text-xl"
            onMouseDown={onUpPress}
            onMouseUp={onUpRelease}
            onTouchStart={onUpPress}
            onTouchEnd={onUpRelease}
          >
            ↑
          </Button>
          <div className="flex space-x-2">
            <Button
              className="w-14 h-14 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center text-xl"
              onMouseDown={onLeftPress}
              onMouseUp={onLeftRelease}
              onTouchStart={onLeftPress}
              onTouchEnd={onLeftRelease}
            >
              ←
            </Button>
            <Button
              className="w-14 h-14 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center text-xl"
              onMouseDown={onRightPress}
              onMouseUp={onRightRelease}
              onTouchStart={onRightPress}
              onTouchEnd={onRightRelease}
            >
              →
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileGameControls;