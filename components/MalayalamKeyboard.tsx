'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Delete, ArrowUp } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface MalayalamKeyboardProps {
  onKeyPress?: (char: string) => void;
  onBackspace?: () => void;
}

const MalayalamKeyboard = ({ onKeyPress = () => {}, onBackspace = () => {} }: MalayalamKeyboardProps) => {
  const [isShiftPressed, setIsShiftPressed] = useState(false);

  // Vowel signs and other diacritics
  const chihnangal = ['ാ', 'ി', 'ീ', 'ു', 'ൂ', 'ൃ', 'െ', 'േ', 'ൊ', 'ോ', 'ൌ', 'ം', 'ഃ', '്'];
  
  // Consonants (Vyanjanangal) - arranged in a more standard order
  const vyanjanangalRow1 = ['ക', 'ഖ', 'ഗ', 'ഘ', 'ങ'];
  const vyanjanangalRow2 = ['ച', 'ഛ', 'ജ', 'ഝ', 'ഞ'];
  const vyanjanangalRow3 = ['ട', 'ഠ', 'ഡ', 'ഢ', 'ണ'];
  const vyanjanangalRow4 = ['ത', 'ഥ', 'ദ', 'ധ', 'ന'];
  const vyanjanangalRow5 = ['പ', 'ഫ', 'ബ', 'ഭ', 'മ'];
  const vyanjanangalRow6 = ['യ', 'ര', 'ല', 'വ'];
  const vyanjanangalRow7 = ['ശ', 'ഷ', 'സ', 'ഹ', 'ള', 'ഴ', 'റ'];

  // Independent Vowels (Swaraksharangal)
  const swaraksharangal = ['അ', 'ആ', 'ഇ', 'ഈ', 'ഉ', 'ഊ', 'ഋ', 'എ', 'ഏ', 'ഐ', 'ഒ', 'ഓ', 'ഔ'];
  
  // Chillaksharangal
  const chillaksharangal = ['ൻ', 'ൽ', 'ൾ', 'ൺ', 'ർ'];
  
  const kootaksharangal = [
    'ക്ക', 'ക്ത', 'ക്ല', 'ക്വ', 'ക്ഷ', 'ക്ര', 'ഗ്ഗ', 'ഗ്ന', 'ഗ്ദ', 'ഗ്ധ', 'ഗ്ര', 'ങ്ക', 'ങ്ങ',
    'ച്ച', 'ശ്ച', 'ജ്ജ', 'ജ്ഞ', 'ജ്വ', 'ഞ്ച', 'ട്ട', 'ണ്ട', 'ത്ത', 'ന്ത', 'ദ്ധ', 'ന്ഥ',
    'ന്ന', 'ന്ര', 'പ്പ', 'പ്ര', 'പ്ല', 'ബ്ബ', 'മ്മ', 'മ്പ', 'മ്പ്ര', 'യ്യ', 'ല്ല', 'ല്പ', 'ല്മ',
    'വ്വ', 'ശ്ശ', 'ശ്വ', 'ഷ്ക', 'ഷ്ട', 'ഷ്ണ', 'സ്ഫ', 'സ്സ', 'സ്ത', 'സ്പ്ര', 'സ്വ', 'ഹ്ന', 'ഹ്ല', 'ഹ്വ',
    'റ്റ', 'ന്റ', 'ള്ള', 'ഞ്ഞ', 'ത്മ', 'ദ്ധ്യ', 'സ്ഥ'
  ];

  const mainKeys = [
    swaraksharangal,
    chihnangal,
    vyanjanangalRow1,
    vyanjanangalRow2,
    vyanjanangalRow3,
    vyanjanangalRow4,
    vyanjanangalRow5,
    vyanjanangalRow6.concat(vyanjanangalRow7),
    chillaksharangal
  ];

  const kootaksharangalRows = [];
    for (let i = 0; i < kootaksharangal.length; i += 10) {
        kootaksharangalRows.push(kootaksharangal.slice(i, i + 10));
    }

  const keysToShow = isShiftPressed ? kootaksharangalRows : mainKeys;

  return (
    <div className="p-2 md:p-4 bg-marigold-50 rounded-lg shadow-inner mt-4 flex flex-col items-center">
      <div className="w-full">
        {keysToShow.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1 my-1">
            {row.map(char => {
              let buttonClass = "text-lg p-1";
              if (chihnangal.includes(char) || swaraksharangal.includes(char)) {
                buttonClass += " bg-marigold-200 hover:bg-marigold-300 text-marigold-900";
              } else if (vyanjanangalRow1.includes(char) || vyanjanangalRow2.includes(char) || vyanjanangalRow3.includes(char) || vyanjanangalRow4.includes(char) || vyanjanangalRow5.includes(char) || vyanjanangalRow6.includes(char) || vyanjanangalRow7.includes(char)) {
                buttonClass += " bg-kerala-green-200 hover:bg-kerala-green-300 text-kerala-green-900";
              } else if (chillaksharangal.includes(char)) {
                buttonClass += " bg-cream-200 hover:bg-cream-300 text-cream-900";
              } else if (kootaksharangal.includes(char)) {
                buttonClass += " bg-kasavu-gold-200 hover:bg-kasavu-gold-300 text-kasavu-gold-900";
              }
              return (
                <Button key={char} onClick={() => onKeyPress(char)} variant="outline" className={buttonClass}>
                  {char}
                </Button>
              );
            })}
          </div>
        ))}
      </div>
      
      {/* Control Buttons */}
      <div className="flex justify-center items-center mt-2 gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={() => setIsShiftPressed(!isShiftPressed)} variant="secondary" className={`p-2 md:p-3 ${isShiftPressed ? 'bg-blue-500' : 'bg-kerala-green-500'} hover:bg-kerala-green-600 text-white`}>
                <ArrowUp className="h-6 w-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isShiftPressed ? 'Switch to Main Keyboard' : 'Switch to Kootaksharangal'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Button onClick={onBackspace} variant="destructive" className="p-2 md:p-3 bg-traditional-red-500 hover:bg-traditional-red-600 text-white">
          <Delete className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default MalayalamKeyboard;