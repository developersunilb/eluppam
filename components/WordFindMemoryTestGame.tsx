
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, XCircle } from 'lucide-react';

// --- Data from WordFindGame ---
interface WordData {
  word: string;
  englishWord: string;
  image: string;
  audio: string;
}

const CORRECT_WORDS_DATA: WordData[] = [
    { word: 'കോണി', englishWord: 'Ladder', image: '/game/assets/image/wordfind/ladder.png', audio: '/audio/placeholder.mp3' },
    { word: 'ആഴി', englishWord: 'Sea', image: '/game/assets/image/wordfind/sea.png', audio: '/audio/placeholder.mp3' },
    { word: 'ചീവീട്', englishWord: 'Cricket', image: '/game/assets/image/wordfind/cricket.png', audio: '/audio/placeholder.mp3' },
    { word: 'അരണ', englishWord: 'Skink', image: '/game/assets/image/wordfind/skink.png', audio: '/audio/placeholder.mp3' },
    { word: 'മണി', englishWord: 'Bell', image: '/game/assets/image/wordfind/bell.png', audio: '/audio/placeholder.mp3' },
    { word: 'കോഴി', englishWord: 'Chicken', image: '/game/assets/image/wordfind/chicken.png', audio: '/audio/placeholder.mp3' },
    { word: 'ആട്', englishWord: 'Goat', image: '/game/assets/image/wordfind/goat.png', audio: '/audio/placeholder.mp3' },
    { word: 'വീണ', englishWord: 'Veena', image: '/game/assets/image/wordfind/veena.png', audio: '/audio/placeholder.mp3' },
    { word: 'ചീര', englishWord: 'Spinach', image: '/game/assets/image/wordfind/spinach.png', audio: '/audio/placeholder.mp3' },
    { word: 'അകം', englishWord: 'Inside', image: '/game/assets/image/wordfind/inside.png', audio: '/audio/placeholder.mp3' },
];

// --- Placeholder Distractor Images ---
// IMPORTANT: User needs to provide these images
const DISTRACTOR_IMAGES_DATA = [
    { image: '/game/assets/image/wordfind/distractors/bittergourd.png' },
    { image: '/game/assets/image/wordfind/distractors/cat.png' },
    { image: '/game/assets/image/wordfind/distractors/spider.png' },
    { image: '/game/assets/image/wordfind/distractors/drum.png' },
    { image: '/game/assets/image/wordfind/distractors/mosquito.png' },
    { image: '/game/assets/image/wordfind/distractors/umbrella.png' },
    { image: '/game/assets/image/wordfind/distractors/apple.png' },
    { image: '/game/assets/image/wordfind/distractors/mushroom.png' },
    { image: '/game/assets/image/wordfind/distractors/fish.png' },
    { image: '/game/assets/image/wordfind/distractors/candle.png' },
];

interface GameImage {
    src: string;
    isCorrect: boolean;
}

const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

export default function WordFindMemoryTestGame() {
    const [gridImages, setGridImages] = useState<GameImage[]>([]);
    const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
    const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
    const [timeLeft, setTimeLeft] = useState(60);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);

    useEffect(() => {
        const localHighScore = localStorage.getItem('wordFindMemoryHighScore');
        if (localHighScore) {
            setHighScore(parseInt(localHighScore, 10));
        }
        resetGame();
    }, []);

    useEffect(() => {
        if (gameState !== 'playing') return;

        if (timeLeft <= 0) {
            setGameState('lost');
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prevTime => prevTime - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, gameState]);

    const resetGame = () => {
        const correctImages = CORRECT_WORDS_DATA.map(word => ({ src: word.image, isCorrect: true }));
        const distractorImages = DISTRACTOR_IMAGES_DATA.map(img => ({ src: img.image, isCorrect: false }));
        const allImages = shuffleArray([...correctImages, ...distractorImages]);
        
        setGridImages(allImages);
        setSelectedIndices([]);
        setGameState('playing');
        setTimeLeft(60);
        setScore(0);
    };

    const handleImageClick = (index: number) => {
        if (gameState !== 'playing' || selectedIndices.includes(index)) {
            return;
        }

        const image = gridImages[index];
        const newSelectedIndices = [...selectedIndices, index];
        setSelectedIndices(newSelectedIndices);

        if (image.isCorrect) {
            setScore(prev => prev + 10);
        } else {
            setScore(prev => prev - 5);
            setTimeLeft(prev => Math.max(0, prev - 5));
        }

        const allCorrectImages = gridImages.filter(img => img.isCorrect);
        const correctlySelectedImages = newSelectedIndices.filter(i => gridImages[i].isCorrect);

        if (correctlySelectedImages.length === allCorrectImages.length) {
            setGameState('won');
            if (score + 10 > highScore) {
                setHighScore(score + 10);
                localStorage.setItem('wordFindMemoryHighScore', (score + 10).toString());
            }
        }
    };

    const isSelectedCorrect = (index: number) => {
        return selectedIndices.includes(index) && gridImages[index].isCorrect;
    };

    const isSelectedIncorrect = (index: number) => {
        return selectedIndices.includes(index) && !gridImages[index].isCorrect;
    };

    return (
        <Card className="w-full max-w-4xl mx-auto bg-white shadow-xl rounded-lg p-4">
            <CardHeader>
                <CardTitle className="text-3xl font-bold text-center text-kerala-green-700">Memory Test</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
                <div className="w-full flex justify-between items-center text-xl font-bold px-4">
                    <div>Time Left: <span className="text-red-500">{timeLeft}s</span></div>
                    <div>Score: <span className="text-blue-500">{score}</span></div>
                    <div>High Score: <span className="text-yellow-500">{highScore}</span></div>
                </div>

                {gameState === 'playing' && (
                    <div className="grid grid-cols-4 md:grid-cols-5 gap-4">
                        {gridImages.map((image, index) => (
                            <div key={index} className="relative cursor-pointer" onClick={() => handleImageClick(index)}>
                                <img src={image.src} alt={`Game image ${index}`} className="w-full h-full object-cover rounded-lg border-2 border-gray-300 hover:border-marigold-500" />
                                {isSelectedCorrect(index) && (
                                    <div className="absolute inset-0 bg-green-500 bg-opacity-50 flex items-center justify-center rounded-lg">
                                        <CheckCircle2 className="text-white w-1/2 h-1/2" />
                                    </div>
                                )}
                                {isSelectedIncorrect(index) && (
                                    <div className="absolute inset-0 bg-red-500 bg-opacity-50 flex items-center justify-center rounded-lg">
                                        <XCircle className="text-white w-1/2 h-1/2" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {gameState === 'won' && (
                    <div className="text-center flex flex-col items-center gap-4">
                        <h2 className="text-4xl font-bold text-green-600">Great job, well done!</h2>
                        {/* User will provide mascot image */}
                        <img src="/game/parrotclap.gif" alt="parrot" className="w-48 h-48" />
                        <p className="text-xl">Your final score is: {score}</p>
                    </div>
                )}

                {gameState === 'lost' && (
                    <div className="text-center">
                        <h2 className="text-4xl font-bold text-red-600">Time's Up!</h2>
                        <p className="text-xl">Your final score is: {score}</p>
                    </div>
                )}

                <Button onClick={resetGame} className="mt-4 bg-kerala-green-500 hover:bg-kerala-green-600 text-white">
                    Restart Game
                </Button>
            </CardContent>
        </Card>
    );
}
