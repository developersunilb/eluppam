'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useProgress } from '@/context/ProgressContext';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const LANGUAGE = 'ml-IN';

// This component is now standalone as requested by the user.
const PicturePromptVoiceGame: React.FC = () => {
  // Data is now hardcoded inside the component.
  const validWords = ['മരം', 'പൂവ്', 'പൂമ്പാറ്റ', 'ചിത്രശലഭം', 'മാല', 'മല', 'വെള്ളം', 'മല', 'ഇല', 'പർവ്വതം', 'തടാകം', 'കായൽ', 'ചെരുപ്പ്', 'ആകാശം',                                                       'ജലം', 'പുഴ', 'വഴി', 'ചെടി', 'സൂര്യൻ', 'പുല്ല്', 'കുട്ടികൾ', 'പട്ടി', 'കൊമ്പ്', 'ചില്ല', 'മരച്ചില്ല', 'കിളി', 'പക്ഷി', 'മഞ്ഞ്', 'പറവ', 'വെളിച്ചം', 'വെട്ടം', 'മേഘം', 'ശാഖ', 'മരക്കൊമ്പ്', 'കൊമ്പ്', 'കുട്ടി', 'കാട്'];
  const imageUrl = '/image/scenery.jpg';
  const currentGameId = 'picture-prompt-voice';                                                                                                    

  const { updateModuleProgress } = useProgress();
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | 'already_found' | null>(null);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [canProceedToNextLevel, setCanProceedToNextLevel] = useState(false);
  const [isApiSupported, setIsApiSupported] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const recognitionRef = useRef<any>(null);

  const resetGame = useCallback(() => {
    setRecognizedText('');
    setFeedback(null);
    setFoundWords([]);
    setCanProceedToNextLevel(false);
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  }, [isListening]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error('Web Speech API not supported by this browser.');
      setIsApiSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = LANGUAGE;

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setFeedback('incorrect');
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.trim();
        setRecognizedText(transcript);

        if (validWords.includes(transcript)) {
          if (!foundWords.includes(transcript)) {
            setFeedback('correct');
            setFoundWords(prev => [...prev, transcript]);
          } else {
            setFeedback('already_found');
          }
        } else {
          setFeedback('incorrect');
        }
        setIsListening(false);
      };
    }
  }, [foundWords, validWords]);

  useEffect(() => {
    const completionThreshold = Math.floor(validWords.length * 0.66);
    if (foundWords.length >= completionThreshold && foundWords.length < validWords.length) {
      setCanProceedToNextLevel(true);
    } else {
      setCanProceedToNextLevel(false);
    }

    if (foundWords.length === validWords.length && !isCompleted && currentGameId) {
      updateModuleProgress(currentGameId, 'practice', 'completed', 100);
      setIsCompleted(true);
    }
  }, [foundWords, validWords, currentGameId, updateModuleProgress, isCompleted]);

  const startListening = () => {
    if (recognitionRef.current) {
      setRecognizedText('');
      setFeedback(null);
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  if (!isApiSupported) {
    return (
      <div className="text-center text-red-500">
        <p>Speech recognition is not supported by your browser.</p>
        <p>Please try using Google Chrome.</p>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white shadow-xl rounded-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-kerala-green-700">What do you see?</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center p-6">
        <div className="w-full h-96 relative mb-6">
          <img src={imageUrl} alt="Picture prompt for voice game" className="absolute top-0 left-0 w-full h-full object-contain" />
        </div>
        <div className="flex items-center space-x-4 mb-4">
          <Button
            onClick={isListening ? stopListening : startListening}
            className={`p-4 rounded-full text-white shadow-lg transition-colors duration-200 ${isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}>
            {isListening ? <MicOff size={32} /> : <Mic size={32} />}
          </Button>
          <Button
            onClick={resetGame}
            className="p-3 bg-gray-600 text-white rounded-lg text-lg font-semibold hover:bg-gray-700 transition-colors duration-200 flex items-center">
            <RefreshCw className="mr-2" /> Reset
          </Button>
        </div>
        {isListening && (
          <p className="text-lg text-indigo-500 mt-4">Listening...</p>
        )}
        {recognizedText && !isListening && (
          <p className="text-lg text-gray-700 mt-4">Heard: <span className="font-semibold">{recognizedText}</span></p>
        )}
        {feedback && !isListening && (
          <div className={`flex items-center justify-center text-xl font-bold mt-4 ${feedback === 'correct' ? 'text-green-600' : (feedback === 'already_found' ? 'text-blue-600' : 'text-red-600')}`}>
            {feedback === 'correct' ? <CheckCircle className="mr-2" /> : (feedback === 'already_found' ? <CheckCircle className="mr-2" /> : <XCircle className="mr-2" />)}
            {feedback === 'correct' ? 'Correct!' : (feedback === 'already_found' ? 'You already got that one!' : 'Incorrect. Try again.')}
          </div>
        )}

        {canProceedToNextLevel && foundWords.length < validWords.length && (
          <div className="mt-6 text-center">
            <p className="text-xl font-bold text-kerala-green-700 mb-4">
              You've found enough words to proceed!
            </p>
            <div className="flex justify-center gap-4">
              <Button
                onClick={() => updateModuleProgress(currentGameId, 'practice', 'completed', 100)}
                className="px-8 py-3 text-lg bg-marigold-500 hover:bg-marigold-600 text-white"
              >
                Proceed to Next Level
              </Button>
              <Button
                onClick={() => setCanProceedToNextLevel(false)} // Keep playing
                variant="outline"
                className="px-8 py-3 text-lg border-marigold-500 text-marigold-700 hover:bg-marigold-100"
              >
                Keep Playing
              </Button>
            </div>
          </div>
        )}
        <div className="w-full mt-6">
          <p className="text-lg text-gray-600 mb-2">Words found: {foundWords.length} / {validWords.length}</p>
          <h3 className="text-xl font-bold text-kerala-green-700 mb-2">Found Words:</h3>
          <ul className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 text-center">
            {foundWords.map((word, index) => (
              <li key={index} className="p-2 bg-marigold-100 text-marigold-800 rounded-md">{word}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default PicturePromptVoiceGame;
