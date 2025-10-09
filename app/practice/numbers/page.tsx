'use client';

import { useState, useEffect, useRef } from 'react';
import LearnLayout from '@/components/LearnLayout';
import MalayalamKeyboard from '@/components/MalayalamKeyboard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronLeft, ChevronRight, Check, XCircle, MessageSquare } from 'lucide-react';
import { useProgress } from '@/context/ProgressContext';
import { addFeedback } from '@/lib/db';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from 'next/navigation';

import { practiceNumbers } from '@/lib/practice-data';

interface PracticeItem {
  originalWord: string;
  correctAnswer: string;
  meaning: string;
  transliteration: string;
  blankedWord: string;
}

interface IncorrectAnswerSummaryItem {
  question: string;
  yourAnswer: string;
  correctAnswer: string;
}

const MODULE_ID = 'numbers-practice';

export default function NumbersPracticePage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [isSessionFinished, setIsSessionFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(true);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const isModuleCompletedRef = useRef(false);
  const [feedbackInput, setFeedbackInput] = useState('');
  const [shuffledQuestions, setShuffledQuestions] = useState<PracticeItem[]>([]);
  const [incorrectAnswersSummary, setIncorrectAnswersSummary] = useState<IncorrectAnswerSummaryItem[]>([]);

  const { updateModuleProgress, userProgress, resetModuleProgress } = useProgress();
  const router = useRouter();

  const shuffle = (array: PracticeItem[]) => {
    let currentIndex = array.length,  randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;
  }

  const currentItem = shuffledQuestions[currentIndex];

  // Load saved practice state on mount
  useEffect(() => {
    setShuffledQuestions(shuffle([...practiceNumbers]));
    // The rest of the logic for loading saved practice state should be handled carefully
    // to avoid re-shuffling or resetting state unnecessarily.
    // For now, we'll assume initial load is handled by the parent component or context.
  }, []);

  // Save practice state on unmount
  useEffect(() => {
    return () => {
      if (!isModuleCompletedRef.current) { // Only save in-progress if not completed
        updateModuleProgress(
          MODULE_ID,
          'practice',
          'in-progress',
          undefined, // score
          undefined, // lastAccessedLessonId
          { currentIndex, correctAnswersCount } // practiceState
        );
      }
    };
  }, [currentIndex, correctAnswersCount, updateModuleProgress]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setUserAnswers(prev => ({ ...prev, [currentIndex]: value }));
  };

  const handleKeyPress = (char: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [currentIndex]: (prev[currentIndex] || '') + char,
    }));
  };

  const handleBackspace = () => {
    setUserAnswers(prev => ({
      ...prev,
      [currentIndex]: (prev[currentIndex] || '').slice(0, -1),
    }));
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setUserAnswers({});
    setIsSessionFinished(false);
    setScore(0);
    setCorrectAnswersCount(0);
    setIncorrectAnswersSummary([]);
    setShuffledQuestions(shuffle([...practiceNumbers])); // Reshuffle questions
    resetModuleProgress(MODULE_ID); // Reset progress in context/DB
  };

  const goToNext = () => {
    if (!shuffledQuestions.length) return;
    const nextIndex = currentIndex + 1;
    if (nextIndex < shuffledQuestions.length) {
      setCurrentIndex(nextIndex);
    }
  };

  const goToPrevious = () => {
    if (!shuffledQuestions.length) return;
    setCurrentIndex((prevIndex) => (prevIndex - 1 + shuffledQuestions.length) % shuffledQuestions.length);
  };

  const checkAnswers = () => {
    let correctCount = 0;
    const incorrects: IncorrectAnswerSummaryItem[] = [];
    shuffledQuestions.forEach((question: PracticeItem, index) => {
      if (userAnswers[index] === question.correctAnswer) {
        correctCount++;
      } else {
        incorrects.push({
          question: question.originalWord,
          yourAnswer: userAnswers[index] || '',
          correctAnswer: question.correctAnswer,
        });
      }
    });
    setCorrectAnswersCount(correctCount);
    const rawScore = (correctCount / shuffledQuestions.length) * 100;
    const roundedScore = Math.round(rawScore);
    setScore(roundedScore);
    setIsSessionFinished(true);
    setIncorrectAnswersSummary(incorrects);

    // Update user progress
    updateModuleProgress(
      MODULE_ID,
      'practice',
      'completed',
      roundedScore // score
    );
    isModuleCompletedRef.current = true;
  };

  const handleFeedbackSubmit = async () => {
    if (feedbackInput.trim() === '') return;
    try {
      await addFeedback(MODULE_ID, feedbackInput);
      alert('Thank you for your feedback!');
      setFeedbackInput('');
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    }
  };

  if (!currentItem) {
    return (
        <div className="text-center">
          <p>Loading questions...</p>
        </div>
    );
  }

  return (
    <div className="text-center">
      <div className="relative bg-marigold-100 rounded-lg p-8 mb-8">
        <p className="text-xl text-gray-600 mb-2">{currentItem.meaning} ({currentItem.transliteration})</p>
        <div className="text-5xl font-bold text-kerala-green-800 flex justify-center items-center space-x-2">
          <span>{currentItem.blankedWord.split('_')[0]}</span>
          <Input
            type="text"
            value={userAnswers[currentIndex] || ''}
            onChange={handleInputChange}
            className="w-24 text-center text-kerala-green-700 border-b-2 border-kerala-green-500 focus:border-marigold-500"
            placeholder="_"
            disabled={isSessionFinished}
          />
          <span>{currentItem.blankedWord.split('_')[1]}</span>
        </div>
        
        {isSessionFinished && (
          <>
            <div className="mt-8">
              <p className="text-2xl font-bold text-kerala-green-800">You scored: {score}%</p>
              <p className="text-lg text-gray-600">Correct answers: {correctAnswersCount} out of {shuffledQuestions.length}</p>
            </div>

            {incorrectAnswersSummary.length > 0 && (
              <div className="mt-8 text-left">
                <h3 className="text-xl font-bold text-red-600 mb-4">Incorrect Answers:</h3>
                <ul className="space-y-4">
                  {incorrectAnswersSummary.map((item, index) => (
                    <li key={index} className="bg-red-50 p-4 rounded-lg shadow-sm border border-red-200">
                      <p className="text-lg font-semibold text-gray-800">Question: {item.question}</p>
                      <p className="text-md text-red-700">Your Answer: {item.yourAnswer || '[No Answer]'}</p>
                      <p className="text-md text-green-700">Correct Answer: {item.correctAnswer}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="mt-8 flex justify-center space-x-4">
              <Button onClick={handleRestart} className="bg-kerala-green-600 hover:bg-kerala-green-700 text-white">
                Restart
              </Button>
              <Button onClick={() => router.push('/practice')} className="bg-marigold-500 hover:bg-marigold-600 text-white">
                Back to Practice Dashboard
              </Button>
            </div>
          </>
        )}
      </div>

      {!isSessionFinished && (
        <div className="flex justify-between items-center mt-8">
          <Button onClick={goToPrevious} className="bg-kerala-green-600 hover:bg-kerala-green-700 text-white" disabled={isSessionFinished}>
            <ChevronLeft className="h-6 w-6 mr-2" />
            Previous
          </Button>
          <div className="text-sm text-gray-500">
            {currentIndex + 1} / {shuffledQuestions.length}
          </div>
          {currentIndex < shuffledQuestions.length - 1 ? (
            <Button onClick={goToNext} className="bg-kerala-green-600 hover:bg-kerala-green-700 text-white" disabled={isSessionFinished}>
              Next
              <ChevronRight className="h-6 w-6 ml-2" />
            </Button>
          ) : (
            <Button onClick={checkAnswers} className="bg-marigold-500 hover:bg-marigold-600 text-white text-lg px-8 py-3" disabled={isSessionFinished}>
              Check Answers
            </Button>
          )}
        </div>
      )}

      {isSessionFinished && (
        <div className="mt-8">
          <p className="text-2xl font-bold text-kerala-green-800">You scored: {score}%</p>
          <p className="text-lg text-gray-600">Correct answers: {correctAnswersCount} out of {shuffledQuestions.length}</p>
        </div>
      )}

      <div className="mt-8">
        <Button onClick={() => setIsKeyboardVisible(!isKeyboardVisible)} variant="outline" className="mb-4">
          {isKeyboardVisible ? 'Hide Keyboard' : 'Show Keyboard'}
        </Button>
        {isKeyboardVisible && <MalayalamKeyboard onKeyPress={handleKeyPress} onBackspace={handleBackspace} />}
      </div>

      <div className="mt-8">
        <a href="mailto:developersunilb@gmail.com?subject=Feedback on Numbers Practice">
          <Button variant="outline">
            <MessageSquare className="h-4 w-4 mr-2" />
            Provide Feedback
          </Button>
        </a>
      </div>
    </div>
  );
}
