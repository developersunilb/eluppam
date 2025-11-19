import React from 'react';



import ConsonantArrowGame from '@/components/ConsonantArrowGame';
import ConsonantBowlingGame from '@/components/ConsonantBowlingGame';
import ConsonantChristmasTreeGame from '@/components/ConsonantChristmasTreeGame';
import ConsonantFlowerBloomGame from '@/components/ConsonantFlowerBloomGame';
import ConsonantHornbillGame from '@/components/ConsonantHornbillGame';
import ConsonantHouseGame from '@/components/ConsonantHouseGame';
import FindCatMomGame from '@/components/FindCatMomGame';
import ConsonantsGame from '@/components/ConsonantsGame';
import ConsonantSpaceRunnerGame from '@/components/ConsonantSpaceRunnerGame';
import CrosswordPuzzleGame from '@/components/CrosswordPuzzleGame';
import CulturalTriviaGame from '@/components/CulturalTriviaGame';

import EmojiWordMatchGame from '@/components/EmojiWordMatchGame';
import FestivalQuestGame from '@/components/FestivalQuestGame';
import FillInTheBlanksGame from '@/components/FillInTheBlanksGame';
import FlashcardBattleGame from '@/components/FlashcardBattleGame';
import FruitCatchVocabularyGame from '@/components/FruitCatchVocabularyGame';
import GrammarSortingFactoryGame from '@/components/GrammarSortingFactoryGame';

import LetterHuntGame from '@/components/LetterHuntGame';
import MagicTracingGame from '@/components/MagicTracingGame';
import Mahjong3DGame from '@/components/Mahjong3DGame';
import Mahjong3DGame2 from '@/components/Mahjong3DGame2';
import MalayalamDanceSimonGame from '@/components/MalayalamDanceSimonGame';


import MalayalamScrabbleGame from '@/components/MalayalamScrabbleGame';
import MemoryMatchGame from '@/components/MemoryMatchGame';

import PicturePromptVoiceGame from '@/components/PicturePromptVoiceGame';
import PookkalamColoringGame from '@/components/PookkalamColoringGame';
import PronunciationChallengeGame from '@/components/PronunciationChallengeGame';

import QuizBattleGame from '@/components/QuizBattleGame';



import SentenceBuilderBlocksGame from '@/components/SentenceBuilderBlocksGame';
import SoundMatchGame from '@/components/SoundMatchGame';
import SoundscapeExplorerGame from '@/components/SoundscapeExplorerGame';
import SpeedTypingRaceGame from '@/components/SpeedTypingRaceGame';
import SpinAWheelGame from '@/components/SpinAWheelGame';



import VoiceCommandGame from '@/components/VoiceCommandGame';
import VowelOrderFindGame from '@/components/VowelOrderFindGame';
import WhackAVowelGame from '@/components/WhackAVowelGame';



import WordFindGame from '@/components/WordFindGame';
import WordFindMemoryTestGame from '@/components/WordFindMemoryTestGame';
import WordFormationGame from '@/components/WordFormationGame';
import WordJigsawGame from '@/components/WordJigsawGame';
import WordSearchGame from '@/components/WordSearchGame';
import ConsonantMemoryGridGame from '@/components/ConsonantMemoryGridGame';
import VowelLegoMatchGame from '@/components/VowelLegoMatchGame';
import MalayalamVowelMaze from '@/components/MalayalamVowelMaze';

export const wordFormationGameData = {
  levels: [
    {
      level: 1,
      letters: ['ക', 'ട', 'ൽ'],
      validWords: ['കട', 'കടൽ', 'കൽ'],
    },
    {
      level: 2,
      letters: ['ത', 'റ', 'വ'],
      validWords: ['തറ', 'റവ', 'വറ', 'തവ'],
    },
  ],
};

export interface Game {
  name: string;
  slug: string;
  icon: string | JSX.Element; // Allow string or JSX.Element
  level: 'Novice' | 'Intermediate' | 'Advanced';
  component: React.ComponentType<any>;
}

export const gamesData: Game[] = [
  { name: 'Sound Match Game', slug: 'sound-match', icon: '🔊', level: 'Novice', component: SoundMatchGame },



  { name: 'Soundscape Explorer', slug: 'soundscape-explorer', icon: '🏞️', level: 'Intermediate', component: SoundscapeExplorerGame },
  { name: 'Fruit Catch Vocabulary Game', slug: 'fruit-catch-vocabulary', icon: '🍎', level: 'Intermediate', component: FruitCatchVocabularyGame },


  { name: 'Pronunciation Challenge', slug: 'pronunciation-challenge', icon: '🗣️', level: 'Novice', component: PronunciationChallengeGame },
  { name: 'Voice Command Game', slug: 'voice-command', icon: '🤖', level: 'Advanced', component: VoiceCommandGame },
  { name: 'Picture Prompt Voice Game', slug: 'picture-prompt-voice', icon: '🖼️', level: 'Intermediate', component: PicturePromptVoiceGame },

  { name: 'Magic Tracing Game', slug: 'magic-tracing', icon: '✍️', level: 'Novice', component: MagicTracingGame },

  { name: 'Speed Typing Race', slug: 'speed-typing-race', icon: '🏎️', level: 'Advanced', component: SpeedTypingRaceGame },



  { name: 'Vowel Order Find', slug: 'vowel-order-find', icon: '🎈', level: 'Novice', component: VowelOrderFindGame },
  { name: 'Whack-A-Vowel', slug: 'whack-a-vowel', icon: '🔨', level: 'Novice', component: WhackAVowelGame },
  { name: 'Memory Match Game', slug: 'memory-match', icon: '🧠', level: 'Novice', component: MemoryMatchGame },
  { name: 'Letter Hunt Game', slug: 'letter-hunt', icon: '🔍', level: 'Novice', component: LetterHuntGame},
  { name: 'Find Cat Mom', slug: 'find-cat-mom', icon: '🐱', level: 'Novice', component: FindCatMomGame },
  { name: 'Flashcard Battle', slug: 'flashcard-battle', icon: '💥', level: 'Advanced', component: FlashcardBattleGame },
  { name: 'Emoji Word Match', slug: 'emoji-word-match', icon: '😀', level: 'Advanced', component: EmojiWordMatchGame },
  { name: 'Word Jigsaw Game', slug: 'word-jigsaw', icon: '🧩', level: 'Intermediate', component: WordJigsawGame },
  { name: 'Consonants Game', slug: 'consonants-game', icon: '👾', level: 'Novice', component: ConsonantsGame },
  { name: 'Consonant Space Runner', slug: 'consonant-space-runner', icon: '🚀', level: 'Novice', component: ConsonantSpaceRunnerGame },
  { name: 'Consonant Arrow Game', slug: 'consonant-arrow', icon: '🏹', level: 'Novice', component: ConsonantArrowGame },
  { name: 'Consonant Bowling', slug: 'consonant-bowling', icon: '🎳', level: 'Novice', component: ConsonantBowlingGame },
  { name: 'Consonant Christmas Tree', slug: 'consonant-christmas-tree', icon: '🎄', level: 'Novice', component: ConsonantChristmasTreeGame},
  { name: 'Consonant Flower Bloom', slug: 'consonant-flower-bloom', icon: '🌸', level: 'Novice', component: ConsonantFlowerBloomGame },
  { name: 'Consonant Hornbill', slug: 'consonant-hornbill', icon: '🐦', level: 'Novice', component: ConsonantHornbillGame },
  { name: 'Consonant House', slug: 'consonant-house', icon: '🏠', level: 'Novice', component: ConsonantHouseGame },

  { name: 'Malayalam Mahjong', slug: 'malayalam-mahjong', icon: '/game/assets/image/gamespagecommonicon/malayalam-mahjong.png', level: 'Novice', component: Mahjong3DGame2 },
  { name: 'Consonant Memory Grid', slug: 'consonant-memory-grid', icon: '🧠', level: 'Novice', component: ConsonantMemoryGridGame },
  { name: 'Vowel Lego Match', slug: 'vowel-lego-match', icon: <img src="/game/assets/image/vowellegoicon.png" alt="Vowel Lego Match Icon" width={64} height={64} className="object-contain" />, level: 'Novice', component: VowelLegoMatchGame },
  { name: 'Malayalam Vowel Maze', slug: 'malayalam-vowel-maze', icon: '🗺️', level: 'Novice', component: MalayalamVowelMaze },
  { name: 'Fill In The Blanks', slug: 'fill-in-the-blanks', icon: '✏️', level: 'Advanced', component: FillInTheBlanksGame },
  { name: 'Word Formation Game', slug: 'word-formation', icon: '🛠️', level: 'Intermediate', component: WordFormationGame },
  { name: 'Word Search Game', slug: 'word-search', icon: '🕵️‍♀️', level: 'Intermediate', component: WordSearchGame },
  { name: 'Word Find Game', slug: 'word-find', icon: '🗺️', level: 'Intermediate', component: WordFindGame },
  { name: 'Spin A Wheel Game', slug: 'spin-a-wheel', icon: '🎡', level: 'Novice', component: SpinAWheelGame },
  { name: 'Sentence Builder Blocks', slug: 'sentence-builder-blocks', icon: '🧱', level: 'Advanced', component: SentenceBuilderBlocksGame },
  { name: 'Quiz Battle', slug: 'quiz-battle', icon: '⚔️', level: 'Advanced', component: QuizBattleGame },
  { name: 'Festival Quest', slug: 'festival-quest', icon: '🎉', level: 'Advanced', component: FestivalQuestGame },
  { name: 'Cultural Trivia', slug: 'cultural-trivia', icon: '🌍', level: 'Advanced', component: CulturalTriviaGame },

  { name: 'Crossword Puzzle', slug: 'crossword-puzzle', icon: '📝', level: 'Advanced', component: CrosswordPuzzleGame },





  { name: 'Malayalam Scrabble', slug: 'malayalam-scrabble', icon: '🎲', level: 'Intermediate', component: MalayalamScrabbleGame },

  { name: 'Malayalam Dance Simon', slug: 'malayalam-dance-simon', icon: '💃', level: 'Novice', component: MalayalamDanceSimonGame },

  { name: 'Word Find Memory Test', slug: 'word-find-memory-test', icon: '🤔', level: 'Intermediate', component: WordFindMemoryTestGame},


  { name: 'Pookkalam Coloring App', slug: 'pookkalam-coloring', icon: '🌼', level: 'Advanced', component: PookkalamColoringGame },


];




export interface GameObject {
    id: string;
    nameMalayalam: string;
    nameEnglish: string;
    audioSrc: string;
    imageSrc: string;
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface GameLocation {
    id: string;
    name: string;
    image: string;
    objects: GameObject[];
}

export const LOCATIONS: GameLocation[] = [
    {
      id: 'beach',
      name: 'കടൽത്തീരം', // Beach
      image: '/game/assets/image/soundscapeexplore/beachcococrabboat.jpg',
      objects: [
        { id: 'coconut_tree', nameMalayalam: 'തെങ്ങ്', nameEnglish: 'Coconut Tree', audioSrc: '/audio/malayalam/thengu.mp3', imageSrc: '/images/coconut_tree.png', x: 10, y: 30, width: 15, height: 40 },
        { id: 'boat', nameMalayalam: 'വഞ്ചി', nameEnglish: 'Boat', audioSrc: '/audio/malayalam/vanchi.mp3', imageSrc: '/images/boat.png', x: 70, y: 60, width: 20, height: 20 },
        { id: 'crab', nameMalayalam: 'ഞണ്ട്', nameEnglish: 'Crab', audioSrc: '/audio/malayalam/nandu.mp3', imageSrc: '/images/crab.png', x: 40, y: 80, width: 10, height: 10 },
      ],
    },
    {
      id: 'temple',
      name: 'ക്ഷേത്രം', // Temple
      image: '/game/assets/image/soundscapeexplore/templecomplex.jpg',
      objects: [
        { id: 'bell', nameMalayalam: 'മണി', nameEnglish: 'Bell', audioSrc: '/audio/malayalam/mani.mp3', imageSrc: '/images/bell.png', x: 30, y: 40, width: 10, height: 15 },
        { id: 'lamp', nameMalayalam: 'വിളക്ക്', nameEnglish: 'Lamp', audioSrc: '/audio/malayalam/vilakku.mp3', imageSrc: '/images/lamp.png', x: 50, y: 70, width: 8, height: 12 },
      ],
    },
];
