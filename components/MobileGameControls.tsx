import React from 'react';
import { ArrowUp, ArrowLeft, ArrowRight } from 'lucide-react';

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
          onTouchStart={onLeftPress}
          onTouchEnd={onLeftRelease}
          onMouseDown={onLeftPress}
          onMouseUp={onLeftRelease}
          onMouseLeave={onLeftRelease} // In case mouse drags off button
        >
          <ArrowLeft size={24} />
        </button>
      </div>

      {/* Right controls */}
      <div>
        <button
          className={buttonClass}
          onTouchStart={onRightPress}
          onTouchEnd={onRightRelease}
          onMouseDown={onRightPress}
          onMouseUp={onRightRelease}
          onMouseLeave={onRightRelease}
        >
          <ArrowRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default MobileGameControls;
