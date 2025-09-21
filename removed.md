# Removed Code Log

This file tracks code that has been removed or refactored during the development process for later review and implementation.

## Data Exports from Page Components

The following data constants were moved from their respective page components into a centralized `lib/data.ts` file to resolve Next.js build errors.

### From `app/learn/vowels/page.tsx`

```javascript
export const vowels = [
  { vowel: 'അ', word: 'അമ്മ', meaning: 'Mother', transliteration: 'amma', audioSrc: '/audio/malayalam/vowels/അ.wav', gifSrc: '/writing/vowels/അ.gif' },
  { vowel: 'ആ', word: 'ആന', meaning: 'Elephant', transliteration: 'aana', audioSrc: '/audio/malayalam/vowels/ആ.wav', gifSrc: '/writing/vowels/ആ.gif' },
  { vowel: 'ഇ', word: 'ഇല', meaning: 'Leaf', transliteration: 'ila', audioSrc: '/audio/malayalam/vowels/ഇ.wav', gifSrc: '/writing/vowels/ഇ.gif' },
  { vowel: 'ഈ', word: 'ഈച്ച', meaning: 'Housefly', transliteration: 'eecha', audioSrc: '/audio/malayalam/vowels/ഈ.wav', gifSrc: '/writing/vowels/ഈ.gif' },
  { vowel: 'ഉ', word: 'ഉറക്കം', meaning: 'Sleep', transliteration: 'urakkam', audioSrc: '/audio/malayalam/vowels/ഉ.wav', gifSrc: '/writing/vowels/ഉ.gif' },
  { vowel: 'ഊ', word: 'ഊഞ്ഞാൽ', meaning: 'Swing', transliteration: 'oonjaal', audioSrc: '/audio/malayalam/vowels/ഊ.wav', gifSrc: '/writing/vowels/ഊ.gif' },
  { vowel: 'ഋ', word: 'ഋഷി', meaning: 'Sage', transliteration: 'rishi', audioSrc: '/audio/malayalam/vowels/ഋ.wav', gifSrc: '/writing/vowels/ഋ.gif' },
  { vowel: 'എ', word: 'എലി', meaning: 'Rat', transliteration: 'eli', audioSrc: '/audio/malayalam/vowels/e.mp3' },
  { vowel: 'ഏ', word: 'ഏണി', meaning: 'Ladder', transliteration: 'Eni', audioSrc: '/audio/malayalam/vowels/E.mp3' },
  { vowel: 'ഐ', word: 'ഐരാവതം', meaning: 'Airavatham', transliteration: 'airaavatham', audioSrc: '/audio/malayalam/vowels/ai.mp3' },
  { vowel: 'ഒ', word: 'ഒട്ടകം', meaning: 'Camel', transliteration: 'ottakam', audioSrc: '/audio/malayalam/vowels/o.mp3' },
  { vowel: 'ഓ', word: 'ഓല', meaning: 'Palm leaf', transliteration: 'Ola', audioSrc: '/audio/malayalam/vowels/O.mp3' },
  { vowel: 'ഔ', word: 'ഔഷധം', meaning: 'Medicine', transliteration: 'oushadham', audioSrc: '/audio/malayalam/vowels/au.mp3' },
  { vowel: 'അം', word: 'അംബുജം', meaning: 'Lotus', transliteration: 'ambujam', audioSrc: '/audio/malayalam/vowels/am.mp3' },
  { vowel: 'അഃ', word: 'ദുഃഖം', meaning: 'Sadness', transliteration: 'duhkham', audioSrc: '/audio/malayalam/vowels/ah.mp3' },
];

const moreVowelWords = {
  'അ': [
    { malayalam: 'അച്ഛൻ', meaning: 'Father', audioSrc: '/audio/malayalam/vowels/more/achchan.mp3' },
    { malayalam: 'അടുക്കള', meaning: 'Kitchen', audioSrc: '/audio/malayalam/vowels/more/adukkala.mp3' },
    { malayalam: 'അരി', meaning: 'Rice', audioSrc: '/audio/malayalam/vowels/more/ari.mp3' },
  ],
  // ... (rest of the data)
};
```

### From `app/learn/consonants/page.tsx`

```javascript
export const consonants = [
    { consonant: 'ക', word: 'കപ്പൽ', meaning: 'Ship', transliteration: 'kappal', audioSrc: '/audio/malayalam/consonants/ka.mp3' },
    // ... (rest of the data)
];
```

### From `app/learn/numbers/page.tsx`

```javascript
export const numbers = [
    { number: '1', word: 'ഒന്ന്', transliteration: 'onnu', audioSrc: '/audio/malayalam/numbers/1.mp3', malayalamNumeral: '൧' },
    // ... (rest of the data)
];
```

### From `app/learn/common-words/page.tsx`

```javascript
export const festivals = [
    { malayalam: 'ഓണം', transliteration: 'Onam', audioSrc: '/audio/malayalam/common-words/onam.mp3' },
    // ... (rest of the data)
];

export const seasons = [
    { malayalam: 'വേനൽക്കാലം', transliteration: 'venalkkalam', meaning: 'Summer', audioSrc: '/audio/malayalam/common-words/summer.mp3' },
    // ... (rest of the data)
];

export const cities = [
    { malayalam: 'തിരുവനന്തപുരം', transliteration: 'Thiruvananthapuram', audioSrc: '/audio/malayalam/common-words/thiruvananthapuram.mp3' },
    // ... (rest of the data)
];

export const districts = [
    { malayalam: 'കാസർകോട്', transliteration: 'Kasaragod', audioSrc: '/audio/malayalam/districts/kasaragod.mp3' },
    // ... (rest of the data)
];

export const malayalamDays = [
    { malayalam: 'ഞായർ', transliteration: 'Njayar', meaning: 'Sunday', audioSrc: '/audio/malayalam/days/sunday.mp3' },
    // ... (rest of the data)
];

export const malayalamMonths = [
    { malayalam: 'ചിങ്ങം', transliteration: 'Chingam', meaning: 'August 17 to September 16', audioSrc: '/audio/malayalam/months/chingam.mp3' },
    // ... (rest of the data)
];
```
