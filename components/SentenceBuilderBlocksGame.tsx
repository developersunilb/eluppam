// components/SentenceBuilderBlocksGame.tsx
'use client';

import React, { useState, useCallback, useEffect } from 'react';

interface WordBlock {
  id: string;
  word: string; // Malayalam word
  originalIndex: number; // To check correctness
}

interface SentenceData {
  id: string;
  englishPrompt: string;
  malayalamSentence: string[]; // Correct order of Malayalam words
  image?: string; // Optional image prompt
}

const SENTENCES: SentenceData[] = [
  {
    id: 'sentence1',
    englishPrompt: 'The cat drinks milk.',
    malayalamSentence: ['പൂച്ച', 'പാൽ', 'കുടിക്കുന്നു'],
  },
  {
    id: 'sentence2',
    englishPrompt: 'The boy plays football.',
    malayalamSentence: ['കുട്ടി', 'ഫുട്ബോൾ', 'കളിക്കുന്നു'],
  },
  {
    id: 'sentence3',
    englishPrompt: 'The flower is beautiful.',
    malayalamSentence: ['പൂവ്', 'മനോഹരമാണ്'],
  },
];

const SentenceBuilderBlocksGame: React.FC = () => {
  const [currentSentenceData, setCurrentSentenceData] = useState<SentenceData | null>(null);
  const [jumbledBlocks, setJumbledBlocks] = useState<WordBlock[]>([]);
  const [sentenceSlots, setSentenceSlots] = useState<(WordBlock | null)[]>([]);
  const [score, setScore] = useState<number>(0);
  const [message, setMessage] = useState<string>('Arrange the words to form a sentence!');
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [hintUsed, setHintUsed] = useState<boolean>(false);

  const shuffleArray = useCallback((array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }, []);

  const startGame = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * SENTENCES.length);
    const selectedSentence = SENTENCES[randomIndex];
    setCurrentSentenceData(selectedSentence);

    const blocks: WordBlock[] = selectedSentence.malayalamSentence.map((word, index) => ({
      id: `${selectedSentence.id}-${index}`,
      word,
      originalIndex: index,
    }));
    setJumbledBlocks(shuffleArray([...blocks])); // Shuffle a copy
    setSentenceSlots(Array(selectedSentence.malayalamSentence.length).fill(null));
    setScore(0);
    setMessage('Drag the words to build the sentence.');
    setGameStarted(true);
    setHintUsed(false);
  }, [shuffleArray]);

  useEffect(() => {
    if (!gameStarted && !currentSentenceData) {
      setMessage('Press Start to begin!');
    }
  }, [gameStarted, currentSentenceData]);

  const handleDragStart = (e: React.DragEvent, block: WordBlock) => {
    e.dataTransfer.setData('application/json', JSON.stringify(block));
  };

  const handleDrop = useCallback(
    (e: React.DragEvent, slotIndex: number) => {
      e.preventDefault();
      const droppedBlock: WordBlock = JSON.parse(e.dataTransfer.getData('application/json'));

      // Remove from jumbled blocks
      setJumbledBlocks((prev) => prev.filter((block) => block.id !== droppedBlock.id));

      // Add to sentence slot
      setSentenceSlots((prev) => {
        const newSlots = [...prev];
        newSlots[slotIndex] = droppedBlock;
        return newSlots;
      });
    },
    []
  );

  const checkSentence = useCallback(() => {
    if (!currentSentenceData) return;

    const builtSentence = sentenceSlots.filter(Boolean).map((block) => block!.word);
    if (builtSentence.length !== currentSentenceData.malayalamSentence.length) {
      setMessage('Sentence not complete!');
      return;
    }

    const isCorrect = sentenceSlots.every(
      (block, index) => block && block.word === currentSentenceData.malayalamSentence[index]
    );

    if (isCorrect) {
      setScore((prev) => prev + (hintUsed ? 5 : 10)); // Less score if hint used
      setMessage('Correct! Well done!');
      setGameStarted(false); // End round
    } else {
      setMessage('Incorrect sentence. Try again!');
    }
  }, [currentSentenceData, sentenceSlots, hintUsed]);

  const getHint = useCallback(() => {
    if (!currentSentenceData) return;
    setHintUsed(true);
    // Find the first empty slot
    const emptySlotIndex = sentenceSlots.findIndex(slot => slot === null);
    if (emptySlotIndex !== -1) {
      // Find the correct word for that slot
      const correctWord = currentSentenceData.malayalamSentence[emptySlotIndex];
      const correctBlock = jumbledBlocks.find(block => block.word === correctWord);

      if (correctBlock) {
        // Automatically place the correct word in the slot
        setJumbledBlocks(prev => prev.filter(block => block.id !== correctBlock.id));
        setSentenceSlots(prev => {
          const newSlots = [...prev];
          newSlots[emptySlotIndex] = correctBlock;
          return newSlots;
        });
        setMessage(`Hint: Placed '${correctWord}' in the correct spot.`);
      } else {
        setMessage('No more hints available or word already placed.');
      }
    } else {
      setMessage('All slots are filled!');
    }
  }, [currentSentenceData, jumbledBlocks, sentenceSlots]);


  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-cream-50 to-marigold-50 p-4 text-center">
      <h1 className="text-5xl font-extrabold text-kerala-green-700 mb-6 drop-shadow-lg">Sentence Builder Blocks</h1>
      <p className="text-xl text-kerala-gold-500 mb-4">{message}</p>
      <p className="text-lg text-kerala-green-600 mb-8">Score: {score}</p>

      {!gameStarted && (
        <button
          onClick={startGame}
          className="px-8 py-3 bg-kerala-gold-500 text-white text-xl font-semibold rounded-full shadow-xl hover:bg-kerala-gold-600 transition-colors duration-300 mb-8"
        >
          Start Game
        </button>
      )}

      {gameStarted && currentSentenceData && (
        <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-xl">
          <h2 className="text-3xl font-bold text-kerala-green-800 mb-4">
            Prompt: {currentSentenceData.englishPrompt}
          </h2>
          {currentSentenceData.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={currentSentenceData.image} alt="Prompt" className="w-64 h-auto mx-auto mb-4 rounded-md" />
          )}

          {/* Sentence Slots */}
          <div className="flex flex-wrap justify-center gap-2 mb-6 p-4 border-2 border-dashed border-gray-300 rounded-lg min-h-[80px]">
            {sentenceSlots.map((slot, index) => (
              <div
                key={index}
                className="w-32 h-12 bg-gray-100 border border-gray-300 rounded-md flex items-center justify-center text-gray-700 text-lg font-semibold"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, index)}
              >
                {slot ? slot.word : 'Drop here'}
              </div>
            ))}
          </div>

          {/* Jumbled Word Blocks */}
          <div className="flex flex-wrap justify-center gap-2 mb-6 p-4 bg-gray-50 rounded-lg">
            {jumbledBlocks.map((block) => (
              <div
                key={block.id}
                className="px-4 py-2 bg-kerala-gold-300 text-gray-800 rounded-full shadow-md cursor-grab text-lg font-semibold"
                draggable
                onDragStart={(e) => handleDragStart(e, block)}
              >
                {block.word}
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={checkSentence}
              className="px-6 py-3 bg-kerala-green-500 text-white text-xl font-semibold rounded-full shadow-xl hover:bg-kerala-green-600 transition-colors duration-300"
            >
              Check Sentence
            </button>
            <button
              onClick={getHint}
              className="px-6 py-3 bg-blue-500 text-white text-xl font-semibold rounded-full shadow-xl hover:bg-blue-600 transition-colors duration-300"
            >
              Hint ({hintUsed ? 'Used' : 'Available'})
            </button>
            <button
              onClick={startGame}
              className="px-6 py-3 bg-gray-500 text-white text-xl font-semibold rounded-full shadow-xl hover:bg-gray-600 transition-colors duration-300"
            >
              Next Sentence
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SentenceBuilderBlocksGame;