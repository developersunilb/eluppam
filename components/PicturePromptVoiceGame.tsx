'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const LANGUAGE = 'ml-IN';

interface PicturePromptVoiceGameProps {
  imageUrl: string;
  validWords: string[];
  onComplete: (score: number) => void;
}

const PicturePromptVoiceGame: React.FC<PicturePromptVoiceGameProps> = ({ imageUrl, validWords, onComplete }) => {
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [foundWords, setFoundWords] = useState<string[]>([]);
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
      const transcript = event.results[0][0].transcript.trim();
      setRecognizedText(transcript);

      if (validWords.includes(transcript) && !foundWords.includes(transcript)) {
        setFeedback('correct');
        setFoundWords([...foundWords, transcript]);
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
  }, [isListening, validWords, foundWords]);

  useEffect(() => {
    if (foundWords.length === validWords.length) {
      onComplete(foundWords.length);
    }
  }, [foundWords, validWords, onComplete]);

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
    <Card className="w-full max-w-4xl mx-auto bg-white shadow-xl rounded-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-kerala-green-700">What do you see?</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center p-6">
        <div className="w-full h-96 relative mb-6">
          <Image src={imageUrl} alt="Picture prompt for voice game" layout="fill" objectFit="contain" />
        </div>
        <div className="flex items-center space-x-4 mb-4">
          <Button
            onClick={isListening ? stopListening : startListening}
            className={`p-4 rounded-full text-white shadow-lg transition-colors duration-200 ${isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}>
            {isListening ? <MicOff size={32} /> : <Mic size={32} />}
          </Button>
          <Button
            onClick={() => {
              setRecognizedText('');
              setFeedback(null);
              setFoundWords([]);
              if (recognitionRef.current) recognitionRef.current.stop();
            }}
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
          <div className={`flex items-center justify-center text-xl font-bold mt-4 ${feedback === 'correct' ? 'text-green-600' : 'text-red-600'}`}>
            {feedback === 'correct' ? <CheckCircle className="mr-2" /> : <XCircle className="mr-2" />}
            {feedback === 'correct' ? 'Correct!' : 'Incorrect. Try again.'}
          </div>
        )}
        <div className="w-full mt-6">
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
