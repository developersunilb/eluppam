'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SpeechRecognitionEvent, SpeechRecognitionErrorEvent } from '@/lib/types';

interface PronunciationChallengeGameProps {
  onComplete: (success: boolean) => void;
}

const WORDS = ['അമ്മ', 'ആന', 'ഇല', 'ഈച്ച', 'ഉറക്കം']; // Sample words

const PronunciationChallengeGame = ({ onComplete }: PronunciationChallengeGameProps) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [feedback, setFeedback] = useState('');

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  useEffect(() => {
    if (!recognition) {
      setFeedback('Speech recognition is not supported in this browser.');
      return;
    }

    recognition.lang = 'ml-IN'; // Set language to Malayalam
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const spokenText = event.results[0][0].transcript;
      setTranscript(spokenText);
      checkAnswer(spokenText);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setFeedback(`Error occurred in recognition: ${event.error}`);
      setIsRecording(false);
    };
  }, [recognition]);

  const startRecording = () => {
    if (recognition && !isRecording) {
      setTranscript('');
      setFeedback('');
      recognition.start();
      setIsRecording(true);
    }
  };

  const checkAnswer = (spokenText: string) => {
    if (spokenText.trim() === WORDS[currentWordIndex]) {
      setFeedback('Correct!');
      // Move to the next word or end the game
      setTimeout(() => {
        if (currentWordIndex < WORDS.length - 1) {
          setCurrentWordIndex(currentWordIndex + 1);
          setFeedback('');
          setTranscript('');
        } else {
          onComplete(true);
        }
      }, 2000);
    } else {
      setFeedback('Incorrect. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-md">
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardContent className="p-8 flex flex-col items-center justify-center space-y-6">
          <h2 className="text-6xl font-bold text-kerala-green-800 font-malayalam">{WORDS[currentWordIndex]}</h2>
          <Button 
            onClick={startRecording} 
            disabled={isRecording || !recognition}
            className="px-8 py-4 text-xl font-semibold bg-marigold-500 hover:bg-marigold-600 text-white rounded-full shadow-lg transition-transform transform hover:scale-105 disabled:bg-gray-400"
          >
            {isRecording ? 'Recording...' : 'Pronounce'}
          </Button>
          {transcript && <p className="text-lg text-gray-700">You said: <span className="font-semibold">{transcript}</span></p>}
          {feedback && (
            <p className={`text-xl font-bold ${feedback === 'Correct!' ? 'text-green-600' : 'text-red-600'}`}>
              {feedback}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PronunciationChallengeGame;