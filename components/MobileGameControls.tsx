import React from 'react';
import { ArrowUp, ArrowDown, ChevronUp } from 'lucide-react';

interface MobileGameControlsProps {
  onUpPress: () => void;
  onUpRelease: () => void;
  onDownPress: () => void;
  onDownRelease: () => void;
  onJumpPress: () => void;
  onJumpRelease: () => void;
}

const MobileGameControls: React.FC<MobileGameControlsProps> = ({
  onUpPress,
  onUpRelease,
  onDownPress,
  onDownRelease,
  onJumpPress,
  onJumpRelease,
}) => {
  const buttonClass = "bg-gray-700 text-white p-4 rounded-full shadow-lg active:bg-gray-600 touch-action-manipulation";

  return (
    <div className="absolute bottom-4 left-4 right-4 flex justify-between z-50">
      {/* Left controls */}
      <div className="flex flex-col gap-2">
        <button
          className={buttonClass}
          onTouchStart={onUpPress}
          onTouchEnd={onUpRelease}
          onMouseDown={onUpPress}
          onMouseUp={onUpRelease}
          onMouseLeave={onUpRelease} // In case mouse drags off button
        >
          <ArrowUp size={24} />
        </button>
        <button
          className={buttonClass}
          onTouchStart={onDownPress}
          onTouchEnd={onDownRelease}
          onMouseDown={onDownPress}
          onMouseUp={onDownRelease}
          onMouseLeave={onDownRelease}
        >
          <ArrowDown size={24} />
        </button>
      </div>

      {/* Right controls */}
      <div>
        <button
          className={buttonClass}
          onTouchStart={onJumpPress}
          onTouchEnd={onJumpRelease}
          onMouseDown={onJumpPress}
          onMouseUp={onJumpRelease}
          onMouseLeave={onJumpRelease}
        >
          <ChevronUp size={24} />
        </button>
      </div>
    </div>
  );
};

export default MobileGameControls;
