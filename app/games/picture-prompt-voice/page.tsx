'use client';

import React from 'react';
import PicturePromptVoiceGame from '@/components/PicturePromptVoiceGame';

const PicturePromptVoicePage: React.FC = () => {
  const validWords = ['മരം', 'പൂവ്', 'പൂമ്പാറ്റ', 'ചിത്രശലഭം', 'മാല', 'വെള്ളം', 'ജലം', 'പുഴ', 'വഴി', 'ചെടി', 'സൂര്യൻ', 'പുല്ല്', 'കുട്ടികൾ', 'പട്ടി', 'കൊമ്പ്', 'ചില്ല', 'മരച്ചില്ല', 'കിളി', 'പക്ഷി', 'മഞ്ഞ്', 'പറവ', 'വെളിച്ചം', 'വെട്ടം', 'മേഘം', 'ശാഖ', 'മരക്കൊമ്പ്', 'കൊമ്പ്', 'കുട്ടി', 'കാട്'];
  const imageUrl = '/image/scenery.jpg';
  const currentGameId = 'picture-prompt-voice';

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 to-marigold-50 p-4 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-kerala-green-800 mb-8">Level 19: Picture Prompt Voice Game</h1>
      <PicturePromptVoiceGame 
        imageUrl={imageUrl} 
        validWords={validWords} 
        currentGameId={currentGameId} 
      />
    </div>
  );
};

export default PicturePromptVoicePage;
