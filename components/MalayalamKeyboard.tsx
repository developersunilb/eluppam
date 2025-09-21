'use client';

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Delete, ArrowUp } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const chunkArray = <T extends unknown>(array: T[], chunkSize: number): T[][] => {
  const result = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
};

interface MalayalamKeyboardProps {
  onKeyPress?: (char: string) => void;
  onBackspace?: () => void;
}

const MalayalamKeyboard = ({ onKeyPress = () => {}, onBackspace = () => {} }: MalayalamKeyboardProps) => {
  const [isShiftPressed, setIsShiftPressed] = useState(false);

  // Independent Vowels (Swaraksharangal) - CUSTOM LAYOUT
  const swaraksharangalRow1 = ['അ', 'ആ', 'ഇ', 'ഈ', 'ഉ', 'ഊ', 'ഋ'];
  const swaraksharangalRow2 = ['എ', 'ഏ', 'ഐ', 'ഒ', 'ഓ', 'ഔ'];
  const swaraksharangalGrouped = []; // Now empty

  // Vowel signs and other diacritics - CUSTOM COLUMNAR LAYOUT
  const allChihnangal = ['ാ', 'ി', 'ീ', 'ു', 'ൂ', 'ൃ', 'െ', 'േ', 'ൊ', 'ോ', 'ൌ', 'ം', 'ഃ', '്'];
  const chihnangalLeftColumn = allChihnangal.slice(0, Math.ceil(allChihnangal.length / 2));
  const chihnangalRightColumn = allChihnangal.slice(Math.ceil(allChihnangal.length / 2));

  // Consonants (Vyanjanangal) - CUSTOM COLUMNAR LAYOUT
  const vyanjanangalLeftColumn = [
    ['ക', 'ഖ', 'ഗ', 'ഘ', 'ങ'],
    ['ട', 'ഠ', 'ഡ', 'ഢ', 'ണ'],
    ['പ', 'ഫ', 'ബ', 'ഭ', 'മ'],
    ['ഷ', 'സ', 'ഹ'],
  ];

  const vyanjanangalRightColumn = [
    ['ച', 'ഛ', 'ജ', 'ഝ', 'ഞ'],
    ['ത', 'ഥ', 'ദ', 'ധ', 'ന'],
    ['യ', 'ര', 'ല', 'വ', 'ശ'],
    ['ള', 'ഴ', 'റ'],
  ];

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
    { // Main keyboard layout with five columns
      type: 'five-column-layout',
      farLeftColumnContent: chihnangalLeftColumn,
      leftColumnContent: vyanjanangalLeftColumn,
      middleColumnContent: chillaksharangal,
      rightColumnContent: vyanjanangalRightColumn,
      farRightColumnContent: chihnangalRightColumn,
      topVowelsInLeftColumn: swaraksharangalRow1, // New property for swaraksharangalRow1
      topVowelsInRightColumn: swaraksharangalRow2, // New property
    },
  ];

  const kootaksharangalRows = chunkArray(kootaksharangal, 10);

  const keysToShow = isShiftPressed ? kootaksharangalRows : mainKeys;

  return (
    <div className="p-2 md:p-4 bg-marigold-50 rounded-lg shadow-inner mt-4 flex flex-col items-center">
      <div className="w-full">
        {keysToShow.map((row, rowIndex) => {
          if (typeof row === 'object' && 'type' in row && row.type === 'five-column-layout') {
            const fiveColumnLayout = row as {
              type: string;
              farLeftColumnContent: string[];
              leftColumnContent: string[][];
              middleColumnContent: string[];
              rightColumnContent: string[][];
              farRightColumnContent: string[];
              topVowelsInLeftColumn: string[];
              topVowelsInRightColumn: string[];
            };
            return (
              <div key={rowIndex} className="flex justify-center gap-1 my-1 w-full">
                {/* Far Left Chihnangal Column */}
                <div className="flex flex-col justify-start gap-1 border border-gray-300 rounded-lg p-2">
                  {fiveColumnLayout.farLeftColumnContent.map(char => {
                    let buttonClass = "text-sm font-bold p-1 flex-1 aspect-square flex items-center justify-center"; // Removed w-9 h-9, added flex-1 aspect-square
                    buttonClass += " bg-backwater-blue-200 hover:bg-backwater-blue-300 text-backwater-blue-900";
                    return (
                      <Button key={char} onClick={() => onKeyPress(char)} variant="outline" className={buttonClass}>
                        {char}
                      </Button>
                    );
                  })}
                </div>

                {/* Left Consonants Column */}
                <div className="flex flex-col justify-start gap-1 border border-gray-300 rounded-lg p-2 flex-1">
                  {/* New container for swaraksharangalRow1 */}
                  <div className="flex justify-center gap-1 my-1 border border-gray-200 rounded-lg p-1">
                    {fiveColumnLayout.topVowelsInLeftColumn.map(char => {
                      let buttonClass = "text-sm font-bold p-1 flex-1 aspect-square flex items-center justify-center"; // Removed w-9 h-9, added flex-1 aspect-square
                      buttonClass += " bg-marigold-200 hover:bg-marigold-300 text-marigold-900";
                      return (
                        <Button key={char} onClick={() => onKeyPress(char)} variant="outline" className={buttonClass}>
                          {char}
                        </Button>
                      );
                    })}
                  </div>
                  {fiveColumnLayout.leftColumnContent.map((colRow, colRowIndex) => (
                    <div key={colRowIndex} className="flex justify-start gap-1">
                      {colRow.map(char => {
                        let buttonClass = "text-sm font-bold p-1 w-14 h-14 flex items-center justify-center"; // Changed w-9 h-9 to w-14 h-14
                        buttonClass += " bg-kerala-green-200 hover:bg-kerala-green-300 text-kerala-green-900";
                        return (
                          <Button key={char} onClick={() => onKeyPress(char)} variant="outline" className={buttonClass}>
                            {char}
                          </Button>
                        );
                      })}
                    </div>
                  ))}
                </div>

                {/* Middle Chillaksharangal Column */}
                <div className="flex flex-col items-center justify-start border border-gray-300 rounded-lg p-2">
                  {fiveColumnLayout.middleColumnContent.map(char => {
                    let buttonClass = "text-sm font-bold p-1 flex-1 aspect-square flex items-center justify-center"; // Removed w-9 h-9, added flex-1 aspect-square
                    if (char === 'ഋ') { // Check for ഋ and apply marigold color
                      buttonClass += " bg-marigold-200 hover:bg-marigold-300 text-marigold-900";
                    } else {
                      buttonClass += " bg-cream-200 hover:bg-cream-300 text-cream-900";
                    }
                    return (
                      <React.Fragment key={char}>
                        <Button onClick={() => onKeyPress(char)} variant="outline" className={buttonClass}>
                          {char}
                        </Button>
                        {char === 'ഋ' && <div className="my-2"></div>}
                      </React.Fragment>
                    );
                  })}
                </div>

                {/* Right Consonants Column */}
                <div className="flex flex-col justify-start gap-1 border border-gray-300 rounded-lg p-2 flex-1">
                  {/* New container for swaraksharangalRow2 */}
                  <div className="flex justify-center gap-1 my-1 border border-gray-200 rounded-lg p-1">
                    {fiveColumnLayout.topVowelsInRightColumn.map(char => {
                      let buttonClass = "text-sm font-bold p-1 flex-1 aspect-square flex items-center justify-center"; // Removed w-9 h-9, added flex-1 aspect-square
                      buttonClass += " bg-marigold-200 hover:bg-marigold-300 text-marigold-900";
                      return (
                        <Button key={char} onClick={() => onKeyPress(char)} variant="outline" className={buttonClass}>
                          {char}
                        </Button>
                      );
                    })}
                  </div>
                  {fiveColumnLayout.rightColumnContent.map((colRow, colRowIndex) => (
                    <div key={colRowIndex} className="flex justify-end gap-1">
                      {colRow.map(char => {
                        let buttonClass = "text-sm font-bold p-1 flex-1 aspect-square flex items-center justify-center"; // Removed w-14 h-14, added flex-1 aspect-square
                        buttonClass += " bg-kerala-green-200 hover:bg-kerala-green-300 text-kerala-green-900";
                        return (
                          <Button key={char} onClick={() => onKeyPress(char)} variant="outline" className={buttonClass}>
                            {char}
                          </Button>
                        );
                      })}
                    </div>
                  ))}
                </div>

                {/* Far Right Chihnangal Column */}
                <div className="flex flex-col justify-start gap-1 border border-gray-300 rounded-lg p-2">
                  {fiveColumnLayout.farRightColumnContent.map(char => {
                    let buttonClass = "text-sm font-bold p-1 flex-1 aspect-square flex items-center justify-center"; // Removed w-9 h-9, added flex-1 aspect-square
                    buttonClass += " bg-backwater-blue-200 hover:bg-backwater-blue-300 text-backwater-blue-900";
                    return (
                      <Button key={char} onClick={() => onKeyPress(char)} variant="outline" className={buttonClass}>
                        {char}
                      </Button>
                    );
                  })}
                </div>
              </div>
            );
          } else {
            // Existing rendering for kootaksharangalRows
            return (
              <div key={rowIndex} className="flex justify-center gap-1 my-1">
                {(row as string[]).map(char => {
                  let buttonClass = "text-sm font-bold p-1 flex-1 aspect-square flex items-center justify-center"; // Removed w-9 h-9, added flex-1 aspect-square
                  if (char === '') {
                    buttonClass = "text-sm font-bold p-1 bg-kasavu-gold-200 hover:bg-kasavu-gold-300 text-kasavu-gold-900 w-18 h-9 flex items-center justify-center";
                  } else if (kootaksharangal.includes(char)) {
                    buttonClass += " bg-kasavu-gold-200 hover:bg-kasavu-gold-300 text-kasavu-gold-900";
                  }
                  return (
                    <Button key={char} onClick={() => onKeyPress(char)} variant="outline" className={buttonClass}>
                      {char === '' ? 'Space' : char}
                    </Button>
                  );
                })}
              </div>
            );
          }
        })}
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