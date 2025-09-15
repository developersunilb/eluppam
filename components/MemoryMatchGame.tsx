'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MemoryMatchGameProps {
  onComplete: (success: boolean) => void;
}

interface CardItem {
  id: number;
  value: string;
  matched: boolean;
  flipped: boolean;
}

const vowelPairs = [
  { malayalam: 'അ', english: 'A' },
  { malayalam: 'ആ', english: 'Aa' },
  { malayalam: 'ഇ', english: 'I' },
  { malayalam: 'ഈ', english: 'Ee' },
  { malayalam: 'ഉ', english: 'U' },
  { malayalam: 'ഊ', english: 'Oo' },
];

const generateCards = () => {
  let id = 0;
  const cards: CardItem[] = [];
  vowelPairs.forEach(pair => {
    cards.push({ id: id++, value: pair.malayalam, matched: false, flipped: false });
    cards.push({ id: id++, value: pair.english, matched: false, flipped: false });
  });
  return cards.sort(() => Math.random() - 0.5);
};

const MemoryMatchGame: React.FC<MemoryMatchGameProps> = ({ onComplete }) => {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  const [canFlip, setCanFlip] = useState(true);

  useEffect(() => {
    setCards(generateCards());
  }, []);

  useEffect(() => {
    if (matches === vowelPairs.length) {
      onComplete(true); // All pairs matched
    }
  }, [matches, onComplete]);

  const handleCardClick = (id: number) => {
    if (!canFlip || flippedCards.length === 2) return;

    setCards(prevCards =>
      prevCards.map(card =>
        card.id === id ? { ...card, flipped: true } : card
      )
    );
    setFlippedCards(prev => [...prev, id]);
  };

  useEffect(() => {
    if (flippedCards.length === 2) {
      setCanFlip(false);
      const [firstId, secondId] = flippedCards;
      const firstCard = cards.find(card => card.id === firstId);
      const secondCard = cards.find(card => card.id === secondId);

      if (firstCard && secondCard) {
        const isMatch = 
          (vowelPairs.some(pair => 
            (pair.malayalam === firstCard.value && pair.english === secondCard.value) ||
            (pair.english === firstCard.value && pair.malayalam === secondCard.value)
          ));

        if (isMatch) {
          setCards(prevCards =>
            prevCards.map(card =>
              card.id === firstId || card.id === secondId ? { ...card, matched: true } : card
            )
          );
          setMatches(prev => prev + 1);
          setFlippedCards([]);
          setCanFlip(true);
        } else {
          setTimeout(() => {
            setCards(prevCards =>
              prevCards.map(card =>
                card.id === firstId || card.id === secondId ? { ...card, flipped: false } : card
              )
            );
            setFlippedCards([]);
            setCanFlip(true);
          }, 1000);
        }
      }
    }
  }, [flippedCards, cards, matches]);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-xl mb-4 text-center text-kerala-green-700">Match the Malayalam vowels with their English transliterations!</p>
        <div className="grid grid-cols-4 gap-4">
          {cards.map(card => (
            <Button
              key={card.id}
              onClick={() => !card.flipped && !card.matched && handleCardClick(card.id)}
              className={`w-full h-24 text-2xl font-bold
                ${card.flipped || card.matched ? 'bg-marigold-500 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}
                ${card.matched ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              disabled={card.flipped || card.matched || !canFlip}
            >
              {card.flipped || card.matched ? card.value : ''}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MemoryMatchGame;
