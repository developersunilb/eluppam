'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic } from 'lucide-react';

interface PronunciationChallengeGameProps {
  onComplete: (success: boolean) => void;
}

const wordsToPronounce: string[] = [
  'അമ്മ', 'ആന', 'ഇല', 'പുഴ', 'മരം', 'വീട്', 'കപ്പൽ', 'മീൻ', 'കുട്ടി', 'പൂച്ച'
];

const PronunciationChallengeGame: React.FC<PronunciationChallengeGameProps> = ({ onComplete }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [listening, setListening] = useState(false);
  const [score, setScore] = useState(0);
  const [transcribedText, setTranscribedText] = useState<string | null>(null);
  const [recordedAudioBlob, setRecordedAudioBlob] = useState<Blob | null>(null); // New state // New state

  // New state for recording
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null); // To store the MediaStream

  const currentWord = wordsToPronounce[currentWordIndex];

  useEffect(() => {
    const getMicrophoneAccess = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        console.log('Microphone access granted.');
      } catch (err) {
        console.error('Error accessing microphone:', err);
        alert('Microphone access denied. Please enable it in your browser settings to play this game.');
      }
    };

    getMicrophoneAccess();

    return () => {
      // Cleanup: stop microphone stream when component unmounts
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handlePronounce = async () => {
    if (!streamRef.current) {
      alert('Microphone access not granted or available.');
      return;
    }

    setFeedback(null);
    setListening(true); // Indicates processing/sending to backend

    try {
      mediaRecorderRef.current = new MediaRecorder(streamRef.current);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setRecordedAudioBlob(audioBlob); // Set the recorded audio blob
        const formData = new FormData();
        formData.append('audio_file', audioBlob, 'pronunciation.webm');
        formData.append('target_word', currentWord);

        try {
          const response = await fetch('http://127.0.0.1:8000/recognize-speech', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const result = await response.json();
          console.log('Backend response:', result);
          setTranscribedText(result.transcribed_text || null); // Set transcribed text

          if (result.is_correct) {
            setFeedback('correct');
            setScore(prevScore => prevScore + 1);
          } else {
            setFeedback('incorrect');
          }

          // Advance to next word after feedback
          setTimeout(() => {
            setFeedback(null); // Clear feedback before advancing
            setTranscribedText(null); // Clear transcribed text before advancing
            setRecordedAudioBlob(null); // Clear recorded audio blob
            if (currentWordIndex < wordsToPronounce.length - 1) {
              setCurrentWordIndex(currentWordIndex + 1);
            } else {
              // Game over
              onComplete(score + (result.is_correct ? 1 : 0) === wordsToPronounce.length); // Final score check
              setCurrentWordIndex(0); // Reset for next play
              setScore(0);
            }
          }, 2500); // Delay for feedback

        } catch (error) {
          console.error('Error sending audio to backend:', error);
          setFeedback('incorrect'); // Assume incorrect on error
          setTranscribedText(null); // Clear transcribed text on error
          setRecordedAudioBlob(null); // Clear recorded audio blob
          // Advance to next word even on error
          setTimeout(() => {
            setFeedback(null);
            setTranscribedText(null);
            setRecordedAudioBlob(null);
            if (currentWordIndex < wordsToPronounce.length - 1) {
              setCurrentWordIndex(currentWordIndex + 1);
            } else {
              onComplete(false); // Game over with failure
              setCurrentWordIndex(0);
              setScore(0);
            }
          }, 2500);
        } finally {
          setListening(false); // Stop listening indicator
          setIsRecording(false); // Stop recording indicator
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);

      // Stop recording after a fixed duration (e.g., 3 seconds)
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.stop();
          setIsRecording(false);
        }
      }, 3000); // Record for 3 seconds

    } catch (error) {
      console.error('Error starting media recorder:', error);
      setListening(false);
      setIsRecording(false);
      alert('Failed to start recording. Please check microphone permissions.');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center justify-center">
          <p className="text-xl mb-4 text-kerala-green-700">Say the word:</p>
          <div className="text-5xl font-bold text-marigold-500 mb-6">{currentWord}</div>
          <Button
            onClick={handlePronounce}
            className="px-8 py-3 text-lg bg-gradient-to-r from-marigold-500 to-marigold-600 hover:from-marigold-600 hover:to-marigold-700 text-white shadow-lg hover:shadow-xl transition-all"
            disabled={listening}
          >
            {listening ? 'Listening...' : <><Mic className="mr-2" /> Pronounce</>}
          </Button>

          {recordedAudioBlob && (
            <div className="mt-4">
              <Button
                onClick={() => {
                  const audio = new Audio(URL.createObjectURL(recordedAudioBlob));
                  audio.play();
                }}
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
              >
                Play Recorded Audio
              </Button>
            </div>
          )}
        </div>

        {feedback && (
          <div className={`text-center text-2xl font-bold mt-4 ${feedback === 'correct' ? 'text-green-600' : 'text-red-600'}`}>
            {feedback === 'correct' ? 'Correct!' : 'Try again!'}
            {transcribedText && (
              <p className="text-lg mt-2 text-gray-700">You said: "{transcribedText}"</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PronunciationChallengeGame;
