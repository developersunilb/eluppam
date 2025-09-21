'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Play, RefreshCw, CheckCircle, XCircle } from 'lucide-react';

declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

const TARGET_WORD = 'ഓടൂ';
const LANGUAGE = 'ml-IN';

interface VoiceCommandGameProps {
  onComplete: (success: boolean) => void;
}

const VoiceCommandGame: React.FC<VoiceCommandGameProps> = ({ onComplete }) => {
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window)) {
      console.error('Web Speech API not supported by this browser.');
      alert('Your browser does not support the Web Speech API. Please try Google Chrome.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = LANGUAGE;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setRecognizedText(transcript);

      if (transcript.toLowerCase().includes(TARGET_WORD.toLowerCase())) {
        setFeedback('correct');
      } else {
        setFeedback('incorrect');
      }
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setFeedback('incorrect');
      setIsListening(false);
    };

    recognition.onend = () => {
      if (isListening) {
        setIsListening(false);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (feedback === 'correct') {
      onComplete(true);
    } else if (feedback === 'incorrect') {
      // In this game, we allow retries, so we don't call onComplete(false) immediately.
      // The user can just try again.
    }
  }, [feedback, onComplete]);

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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 to-indigo-100 p-4">
      <h1 className="text-4xl font-bold text-indigo-800 mb-8">Voice Command Game</h1>

      <div className="bg-white p-8 rounded-lg shadow-xl mb-8 text-center w-full max-w-md">
        <p className="text-xl text-gray-700 mb-4">Say the word:</p>
        <div className="text-6xl font-bold text-indigo-600 mb-6">{TARGET_WORD}</div>

        <button
          onClick={isListening ? stopListening : startListening}
          className={`p-4 rounded-full text-white shadow-lg transition-colors duration-200
            ${isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}
          `}
        >
          {isListening ? <MicOff size={32} /> : <Mic size={32} />}
        </button>

        {isListening && (
          <p className="text-lg text-indigo-500 mt-4">Listening...</p>
        )}

        {recognizedText && !isListening && (
          <p className="text-lg text-gray-700 mt-4">Heard: <span className="font-semibold">{recognizedText}</span></p>
        )}

        {feedback && !isListening && (
          <div className={`flex items-center justify-center text-xl font-bold mt-4
            ${feedback === 'correct' ? 'text-green-600' : 'text-red-600'}
          `}>
            {feedback === 'correct' ? <CheckCircle className="mr-2" /> : <XCircle className="mr-2" />}
            {feedback === 'correct' ? 'Correct!' : 'Incorrect. Try again.'}
          </div>
        )}
      </div>

      <button
        onClick={() => {
          setRecognizedText('');
          setFeedback(null);
          setIsListening(false);
          if (recognitionRef.current) recognitionRef.current.stop();
        }}
        className="p-3 bg-gray-600 text-white rounded-lg text-lg font-semibold hover:bg-gray-700 transition-colors duration-200 flex items-center"
      >
        <RefreshCw className="mr-2" /> Reset
      </button>
    </div>
  );
};

export default VoiceCommandGame;