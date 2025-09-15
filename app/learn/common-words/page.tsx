'use client';

import LearnLayout from '@/components/LearnLayout';
import { Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProgress } from '@/context/ProgressContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export const festivals = [
    { malayalam: 'ഓണം', transliteration: 'Onam', audioSrc: '/audio/malayalam/common-words/onam.mp3' },
    { malayalam: 'വിഷു', transliteration: 'Vishu', audioSrc: '/audio/malayalam/common-words/vishu.mp3' },
    { malayalam: 'ക്രിസ്തുമസ്', transliteration: 'Christmas', audioSrc: '/audio/malayalam/common-words/christmas.mp3' },
    { malayalam: 'റംസാൻ', transliteration: 'Ramzan', audioSrc: '/audio/malayalam/common-words/ramzan.mp3' },
    { malayalam: 'ദീപാവലി', transliteration: 'Deepavali', audioSrc: '/audio/malayalam/common-words/deepavali.mp3' },
];

export const seasons = [
    { malayalam: 'വേനൽക്കാലം', transliteration: 'venalkkalam', meaning: 'Summer', audioSrc: '/audio/malayalam/common-words/summer.mp3' },
    { malayalam: 'മഴക്കാലം', transliteration: 'mazhakkalam', meaning: 'Monsoon Season', audioSrc: '/audio/malayalam/common-words/monsoon.mp3' },
    { malayalam: 'മഞ്ഞുകാലം', transliteration: 'manjukalam', meaning: 'Winter', audioSrc: '/audio/malayalam/common-words/winter.mp3' },
];

export const cities = [
    { malayalam: 'തിരുവനന്തപുരം', transliteration: 'Thiruvananthapuram', audioSrc: '/audio/malayalam/common-words/thiruvananthapuram.mp3' },
    { malayalam: 'കൊച്ചി', transliteration: 'Kochi', audioSrc: '/audio/malayalam/common-words/kochi.mp3' },
    { malayalam: 'കോഴിക്കോട്', transliteration: 'Kozhikode', audioSrc: '/audio/malayalam/common-words/kozhikode.mp3' },
    { malayalam: 'തൃശ്ശൂർ', transliteration: 'Thrissur', audioSrc: '/audio/malayalam/common-words/thrissur.mp3' },
    { malayalam: 'കണ്ണൂർ', transliteration: 'Kannur', audioSrc: '/audio/malayalam/common-words/kannur.mp3' },
];

export const districts = [
    { malayalam: 'കാസർകോട്', transliteration: 'Kasaragod', audioSrc: '/audio/malayalam/districts/kasaragod.mp3' },
    { malayalam: 'കണ്ണൂർ', transliteration: 'Kannur', audioSrc: '/audio/malayalam/districts/kannur.mp3' },
    { malayalam: 'വയനാട്', transliteration: 'Wayanad', audioSrc: '/audio/malayalam/districts/wayanad.mp3' },
    { malayalam: 'കോഴിക്കോട്', transliteration: 'Kozhikode', audioSrc: '/audio/malayalam/districts/kozhikode.mp3' },
    { malayalam: 'മലപ്പുറം', transliteration: 'Malappuram', audioSrc: '/audio/malayalam/districts/malappuram.mp3' },
    { malayalam: 'പാലക്കാട്', transliteration: 'Palakkad', audioSrc: '/audio/malayalam/districts/palakkad.mp3' },
    { malayalam: 'തൃശൂർ', transliteration: 'Thrissur', audioSrc: '/audio/malayalam/districts/thrissur.mp3' },
    { malayalam: 'എറണാകുളം', transliteration: 'Ernakulam', audioSrc: '/audio/malayalam/districts/ernakulam.mp3' },
    { malayalam: 'ഇടുക്കി', transliteration: 'Idukki', audioSrc: '/audio/malayalam/districts/idukki.mp3' },
    { malayalam: 'കോട്ടയം', transliteration: 'Kottayam', audioSrc: '/audio/malayalam/districts/kottayam.mp3' },
    { malayalam: 'ആലപ്പുഴ', transliteration: 'Alappuzha', audioSrc: '/audio/malayalam/districts/alappuzha.mp3' },
    { malayalam: 'പത്തനംതിട്ട', transliteration: 'Pathanamthitta', audioSrc: '/audio/malayalam/districts/pathanamthitta.mp3' },
    { malayalam: 'കൊല്ലം', transliteration: 'Kollam', audioSrc: '/audio/malayalam/districts/kollam.mp3' },
    { malayalam: 'തിരുവനന്തപുരം', transliteration: 'Thiruvananthapuram', audioSrc: '/audio/malayalam/districts/thiruvananthapuram.mp3' },
];

export const malayalamDays = [
    { malayalam: 'ഞായർ', transliteration: 'Njayar', meaning: 'Sunday', audioSrc: '/audio/malayalam/days/sunday.mp3' },
    { malayalam: 'തിങ്കൾ', transliteration: 'Thinkal', meaning: 'Monday', audioSrc: '/audio/malayalam/days/monday.mp3' },
    { malayalam: 'ചൊവ്വ', transliteration: 'Chovva', meaning: 'Tuesday', audioSrc: '/audio/malayalam/days/tuesday.mp3' },
    { malayalam: 'ബുധൻ', transliteration: 'Budhan', meaning: 'Wednesday', audioSrc: '/audio/malayalam/days/wednesday.mp3' },
    { malayalam: 'വ്യാഴം', transliteration: 'Vyazham', meaning: 'Thursday', audioSrc: '/audio/malayalam/days/thursday.mp3' },
    { malayalam: 'വെള്ളി', transliteration: 'Velli', meaning: 'Friday', audioSrc: '/audio/malayalam/days/friday.mp3' },
    { malayalam: 'ശനി', transliteration: 'Shani', meaning: 'Saturday', audioSrc: '/audio/malayalam/days/saturday.mp3' },
];

export const malayalamMonths = [
    { malayalam: 'ചിങ്ങം', transliteration: 'Chingam', meaning: 'August 17 to September 16', audioSrc: '/audio/malayalam/months/chingam.mp3' },
    { malayalam: 'കന്നി', transliteration: 'Kanni', meaning: 'September 17 to October 17', audioSrc: '/audio/malayalam/months/kanni.mp3' },
    { malayalam: 'തുലാം', transliteration: 'Thulam', meaning: 'October 18 to November 16', audioSrc: '/audio/malayalam/months/thulam.mp3' },
    { malayalam: 'വൃശ്ചികം', transliteration: 'Vrischikam', meaning: 'November 17 to December 16', audioSrc: '/audio/malayalam/months/vrischikam.mp3' },
    { malayalam: 'ധനു', transliteration: 'Dhanu', meaning: 'December 17 to January 14', audioSrc: '/audio/malayalam/months/dhanu.mp3' },
    { malayalam: 'മകരം', transliteration: 'Makaram', meaning: 'January 15 to February 12', audioSrc: '/audio/malayalam/months/makaram.mp3' },
    { malayalam: 'കുംഭം', transliteration: 'Kumbham', meaning: 'February 13 to March 14', audioSrc: '/audio/malayalam/months/kumbham.mp3' },
    { malayalam: 'മീനം', transliteration: 'Meenam', meaning: 'March 15 to April 13', audioSrc: '/audio/malayalam/months/meenam.mp3' },
    { malayalam: 'മേടം', transliteration: 'Medam', meaning: 'April 14 to May 14', audioSrc: '/audio/malayalam/months/medam.mp3' },
    { malayalam: 'ഇടവം', transliteration: 'Edavam', meaning: 'May 15 to June 15', audioSrc: '/audio/malayalam/months/edavam.mp3' },
    { malayalam: 'മിഥുനം', transliteration: 'Mithunam', meaning: 'June 16 to July 16', audioSrc: '/audio/malayalam/months/mithunam.mp3' },
    { malayalam: 'കർക്കിടകം', transliteration: 'Karkidakam', meaning: 'July 17 to August 16', audioSrc: '/audio/malayalam/months/karkidakam.mp3' },
];

const MODULE_ID = 'common-words';

const sections = [
  { title: 'Festivals', data: festivals },
  { title: 'Seasons', data: seasons },
  { title: 'Cities', data: cities },
  { title: 'Districts', data: districts },
  { title: 'Days', data: malayalamDays },
  { title: 'Months', data: malayalamMonths },
];

export default function CommonWordsPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isSessionCompleted, setIsSessionCompleted] = useState(false);
  const { updateModuleProgress, userProgress } = useProgress();
  const router = useRouter();

  const WordCard = ({ item }) => {
    const playAudio = () => {
      if (item.audioSrc) {
        const audio = new Audio(item.audioSrc);
        audio.play().catch(e => console.error("Error playing audio:", e));
      }
    };
  
    return (
      <div className="relative bg-marigold-100 py-4 px-4 rounded-lg flex items-center">
        <div className="flex-grow pr-4 overflow-hidden">
          <p className="text-xl font-bold text-kerala-green-800 text-left break-words">{item.malayalam}</p>
          <p className="text-lg text-gray-600 text-left">{item.transliteration}</p>
          {item.meaning && <p className="text-lg text-gray-500 mt-1 text-left">({item.meaning})</p>}
        </div>
        {item.audioSrc && (
          <Button variant="ghost" size="icon" className="absolute right-4 text-kerala-green-600 hover:bg-marigold-200" onClick={playAudio}>
            <Volume2 className="h-5 w-5" />
          </Button>
        )}
      </div>
    );
  };

  useEffect(() => {
    if (userProgress) {
      const moduleProgress = userProgress.modules.find(m => m.moduleId === MODULE_ID);
      if (moduleProgress && moduleProgress.status === 'completed') {
        setIsSessionCompleted(true);
      }
    }
  }, [userProgress]);

  const goToNext = () => {
    if (currentStep < sections.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsFinished(true);
    }
  };

  const goToPrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentSection = sections[currentStep];

  return (
    <LearnLayout title="Common Words">
      <div>
        <h2 className="text-2xl font-bold text-center mb-4">{currentSection.title}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {currentSection.data.map((item) => <WordCard key={item.malayalam} item={item} />)}
        </div>
        {currentSection.title === 'Months' && (
          <p className="text-sm text-gray-500 mt-4 italic">
              These dates are. Since the Malayalam calendar is based on solar calculations and tied to the sidereal zodiac, the exact start and end dates shift slightly each year (usually by a day).
          </p>
        )}
      </div>

      <div className="mt-8 flex justify-between items-center">
        <Button onClick={goToPrevious} disabled={currentStep === 0} className="bg-kerala-green-600 hover:bg-kerala-green-700 text-white">
          Previous
        </Button>

        <div className="flex space-x-2"> {/* Use a flex container for middle buttons */}
          {isFinished && !isSessionCompleted && (
              <Button onClick={() => { updateModuleProgress(MODULE_ID, 'learn', 'completed', 100); setIsSessionCompleted(true); }} className="bg-green-500 hover:bg-green-600 text-white">
                Mark as Completed
              </Button>
          )}

          {isSessionCompleted && (
              <Button onClick={() => { updateModuleProgress(MODULE_ID, 'learn', 'not-started'); setIsSessionCompleted(false); setIsFinished(false); setCurrentStep(0);}} variant="outline" className="bg-kerala-green-600 hover:bg-kerala-green-700 text-white">
                Restart Module
              </Button>
          )}

          <Button onClick={() => router.push('/learn')} className="bg-marigold-500 hover:bg-marigold-600 text-white">
            Back to Learn Dashboard
          </Button>
        </div>

        {currentStep < sections.length - 1 ? (
          <Button onClick={goToNext} className="bg-kerala-green-600 hover:bg-kerala-green-700 text-white">
            Next
          </Button>
        ) : (
          !isFinished && ( // Only show Finish if not already finished
            <Button onClick={goToNext} className="bg-green-500 hover:bg-green-600 text-white">
              Finish
            </Button>
          )
        )}
      </div>
    </LearnLayout>
  );
}
