'use client';

import LearnLayout from '@/components/LearnLayout';

// Import data from learning modules
import { vowels } from '@/app/learn/vowels/page'; // Assuming export of vowels array
import { consonants } from '@/app/learn/consonants/page'; // Assuming export of consonants array
import { chillaksharangal } from '@/app/learn/chillaksharangal/page'; // Assuming export of chillaksharangal array
import { kootaksharamData } from '@/lib/kootaksharam-data';
import { numbers } from '@/app/learn/numbers/page'; // Assuming export of numbers array
import { festivals, seasons, cities, districts, malayalamDays, malayalamMonths } from '@/app/learn/common-words/page';

const ReviewItem = ({ letter, word, meaning, transliteration, combination, number }) => (
  <div className="flex items-center justify-between p-3 border-b border-gray-200 last:border-b-0">
    <div className="flex-1">
      {letter && <p className="text-2xl font-bold text-kerala-green-800">{letter}</p>}
      {number && <p className="text-2xl font-bold text-kerala-green-800">{number}</p>}
      {combination && <p className="text-sm text-gray-500">{combination}</p>}
    </div>
    <div className="flex-1 text-right">
      <p className="text-xl text-kerala-green-700">{word}</p>
      <p className="text-sm text-gray-600">({transliteration})</p>
      {meaning && <p className="text-sm text-gray-500">{meaning}</p>}
    </div>
  </div>
);

export default function AllReviewPage() {
  return (
    <LearnLayout title="All Letters & Words Review">
      <div className="space-y-8">
        {/* Vowels */}
        <div>
          <h2 className="text-3xl font-bold text-marigold-600 mb-4">Swaraksharangal (Vowels)</h2>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            {vowels.map((item, index) => (
              <ReviewItem key={index} letter={item.vowel} word={item.word} meaning={item.meaning} transliteration={item.transliteration} />
            ))}
          </div>
        </div>

        {/* Consonants */}
        <div>
          <h2 className="text-3xl font-bold text-marigold-600 mb-4">Vyanjanaaksharangal (Consonants)</h2>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            {consonants.map((item, index) => (
              <ReviewItem key={index} letter={item.consonant} word={item.word} meaning={item.meaning} transliteration={item.transliteration} />
            ))}
          </div>
        </div>

        {/* Chillaksharangal */}
        <div>
          <h2 className="text-3xl font-bold text-marigold-600 mb-4">Chillaksharangal (Pure Consonants)</h2>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            {chillaksharangal.map((item, index) => (
              <ReviewItem key={index} letter={item.letter} word={item.word} meaning={item.meaning} transliteration={item.transliteration} />
            ))}
          </div>
        </div>

        {/* Kootaksharangal */}
        <div>
          <h2 className="text-3xl font-bold text-marigold-600 mb-4">Kootaksharangal (Conjuncts)</h2>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            {kootaksharamData.map((item, index) => (
              <ReviewItem key={index} letter={item.conjunct} combination={item.combination} word={item.word} meaning={item.meaning} transliteration={item.transliteration} />
            ))}
          </div>
        </div>

        {/* Numbers */}
        <div>
          <h2 className="text-3xl font-bold text-marigold-600 mb-4">Numbers (1-10)</h2>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            {numbers.map((item, index) => (
              <ReviewItem key={index} number={item.number} word={item.word} transliteration={item.transliteration} />
            ))}
          </div>
        </div>

        {/* Common Words */}
        <div>
          <h2 className="text-3xl font-bold text-marigold-600 mb-4">Common Words</h2>
          <h3 className="text-2xl font-semibold text-kerala-green-700 mb-2">Festivals</h3>
          <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
            {festivals.map((item, index) => (
              <ReviewItem key={index} letter={item.malayalam} word={item.malayalam} transliteration={item.transliteration} />
            ))}
          </div>
          <h3 className="text-2xl font-semibold text-kerala-green-700 mb-2">Seasons</h3>
          <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
            {seasons.map((item, index) => (
              <ReviewItem key={index} letter={item.malayalam} word={item.malayalam} meaning={item.meaning} transliteration={item.transliteration} />
            ))}
          </div>
          <h3 className="text-2xl font-semibold text-kerala-green-700 mb-2">Cities</h3>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            {cities.map((item, index) => (
              <ReviewItem key={index} letter={item.malayalam} word={item.malayalam} transliteration={item.transliteration} />
            ))}
          </div>
        </div>

        {/* Districts */}
        <div>
          <h3 className="text-2xl font-semibold text-kerala-green-700 mb-2">Districts</h3>
          <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
            {districts.map((item, index) => (
              <ReviewItem key={index} letter={item.malayalam} word={item.malayalam} transliteration={item.transliteration} />
            ))}
          </div>
        </div>

        {/* Days */}
        <div>
          <h3 className="text-2xl font-semibold text-kerala-green-700 mb-2">Days</h3>
          <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
            {malayalamDays.map((item, index) => (
              <ReviewItem key={index} letter={item.malayalam} word={item.malayalam} meaning={item.meaning} transliteration={item.transliteration} />
            ))}
          </div>
        </div>

        {/* Months */}
        <div>
          <h3 className="text-2xl font-semibold text-kerala-green-700 mb-2">Months</h3>
          <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
            {malayalamMonths.map((item, index) => (
              <ReviewItem key={index} letter={item.malayalam} word={item.malayalam} meaning={item.meaning} transliteration={item.transliteration} />
            ))}
          </div>
        </div>

      </div>
    </LearnLayout>
  );
}
